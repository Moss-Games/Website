import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import {
  parseSteamAppId,
  fetchSteamAppDetails,
  mapSteamDataToGameFields,
  libraryHeroUrl,
} from "@/lib/steam";

// Called from the Studio's "Fetch from Steam" document action
// (sanity/actions/fetchFromSteamAction.js). Only proxies Steam's own public
// data and patches one already-existing "game" document — see
// docs/DECISIONS.md for the accepted-risk note on why this route has no
// auth of its own.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetching header + library hero + every screenshot concurrently (see
// Promise.all below) is exactly the kind of burst that trips Steam's CDN
// rate limiting — a single transient failure used to just silently drop
// that one image with no retry. 3 attempts with backoff absorbs that
// without slowing down the common case where nothing fails.
async function downloadImage(url, attempt = 1) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    if (attempt < 3) {
      await sleep(attempt * 500);
      return downloadImage(url, attempt + 1);
    }
    console.error(`Steam import: image download errored after 3 attempts`, url, error);
    return null;
  }
  if (!response.ok) {
    if (attempt < 3) {
      await sleep(attempt * 500);
      return downloadImage(url, attempt + 1);
    }
    console.error(`Steam import: image download failed (${response.status}) after 3 attempts`, url);
    return null;
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadImage(url, filename) {
  const buffer = await downloadImage(url);
  if (!buffer) return null;
  const asset = await writeClient.assets.upload("image", buffer, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// `fields.description` (from steamDescriptionToBlocks) carries image blocks
// shaped as `{ _type: "image", _key, steamImageUrl }` — a placeholder, since
// that parser has no write-token access to actually upload anything. This
// resolves each one to a real Sanity asset, keeping the block's own `_key`
// so it stays in place among the surrounding text blocks. A block whose
// image fails to download (rare, see downloadImage's retry) is dropped
// rather than left pointing at a URL Sanity can't render.
async function resolveDescriptionImages(description) {
  if (!description) return null;
  const uploaded = await Promise.all(
    description.map((block, index) =>
      block._type === "image" ? uploadImage(block.steamImageUrl, `description-${index}.jpg`) : null
    )
  );
  return description
    .map((block, index) => (block._type === "image" ? (uploaded[index] ? { ...uploaded[index], _key: block._key } : null) : block))
    .filter(Boolean);
}

export async function POST(request) {
  const { documentId, steamUrl } = await request.json().catch(() => ({}));

  if (typeof documentId !== "string" || typeof steamUrl !== "string") {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const appId = parseSteamAppId(steamUrl);
  if (!appId) {
    return NextResponse.json({ ok: false, error: "invalid_steam_url" }, { status: 400 });
  }

  try {
    const existing = await writeClient.fetch(`*[_id == $id][0]{_type}`, { id: documentId });
    if (!existing || existing._type !== "game") {
      return NextResponse.json({ ok: false, error: "not_a_game_document" }, { status: 400 });
    }

    const data = await fetchSteamAppDetails(appId);
    const { fields: allFields, images } = mapSteamDataToGameFields(data);
    // `allFields.description`'s image blocks are still just steamImageUrl
    // placeholders at this point (see steamDescriptionToBlocks) — pulled out
    // here so the raw, unresolved version never leaks into `patch` below.
    const { description: rawDescription, ...fields } = allFields;

    const [headerImage, libraryHero, screenshots, description] = await Promise.all([
      images.header ? uploadImage(images.header, "header.jpg") : null,
      uploadImage(libraryHeroUrl(appId), "library-hero.jpg"), // silently null on 404
      Promise.all(
        images.screenshots.map(async (url, index) => {
          const image = await uploadImage(url, `screenshot-${index}.jpg`);
          return image ? { ...image, _key: `screenshot-${index}` } : null;
        })
      ),
      resolveDescriptionImages(rawDescription),
    ]);

    // Most games (especially demos) never get a dedicated Library Assets set
    // uploaded in Steamworks, so libraryHeroUrl() 404s more often than not —
    // fall back to the header image (an actual curated promo asset) rather
    // than leaving libraryHeroImage unset, which fell through to a plain
    // screenshot instead.
    const libraryHeroImage = libraryHero || headerImage;

    const patch = {
      ...fields,
      storeUrl: steamUrl,
      ...(description && description.length > 0 ? { description } : {}),
      ...(headerImage ? { headerImage } : {}),
      ...(libraryHeroImage ? { libraryHeroImage } : {}),
      ...(screenshots.some(Boolean) ? { screenshots: screenshots.filter(Boolean) } : {}),
    };

    await writeClient.patch(documentId).set(patch).commit();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Steam import failed", error);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
