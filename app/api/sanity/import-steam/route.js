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
    const { fields, images } = mapSteamDataToGameFields(data);

    const [headerImage, libraryHero, screenshots] = await Promise.all([
      images.header ? uploadImage(images.header, "header.jpg") : null,
      uploadImage(libraryHeroUrl(appId), "library-hero.jpg"), // silently null on 404
      Promise.all(
        images.screenshots.map(async (url, index) => {
          const image = await uploadImage(url, `screenshot-${index}.jpg`);
          return image ? { ...image, _key: `screenshot-${index}` } : null;
        })
      ),
    ]);

    // Most games (especially demos) never get a dedicated Library Assets set
    // uploaded in Steamworks, so libraryHeroUrl() 404s more often than not —
    // fall back to the store page's own wide backdrop image, which is a much
    // closer match to a banner than the next fallback (a plain screenshot).
    const libraryHeroImage =
      libraryHero || (images.background ? await uploadImage(images.background, "library-hero.jpg") : null);

    const patch = {
      ...fields,
      storeUrl: steamUrl,
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
