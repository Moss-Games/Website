import { client } from "@/sanity/lib/client";
import { imageUrl, urlForImage } from "@/sanity/lib/image";

// Games moved from public/games/<Name>/*.txt file folders into Sanity's
// "game" document type (see sanity/schemaTypes/gameType.js) — same CMS
// already used for news. See docs/GAMES.md and docs/DECISIONS.md for why.
// Excludes drafts: the Sanity client uses a token that can see them (see
// sanity/lib/client.js), and an in-progress draft with no slug yet would
// otherwise crash generateStaticParams (a null slug.current serializes as
// an object, which Next.js's static params validation rejects).
const GAMES_QUERY = `*[_type == "game" && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  "updatedAt": _updatedAt,
  title,
  tagline,
  description,
  storeUrl,
  price,
  releaseDate,
  genres,
  platforms,
  languages,
  features,
  systemRequirements,
  headerImage,
  libraryHeroImage,
  "trailerUrl": trailer.asset->url,
  trailerYoutubeUrl,
  trailerPoster,
  screenshots,
  order,
  showOnHomepage,
  badge
}`;

const GAME_QUERY = `*[_type == "game" && !(_id in path("drafts.**")) && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  tagline,
  description,
  storeUrl,
  price,
  releaseDate,
  genres,
  platforms,
  languages,
  features,
  systemRequirements,
  headerImage,
  libraryHeroImage,
  "trailerUrl": trailer.asset->url,
  trailerYoutubeUrl,
  trailerPoster,
  screenshots,
  order,
  showOnHomepage,
  badge
}`;

// Accepts watch/share/short/embed URL shapes and returns the youtube-nocookie
// embed URL, or null if the string isn't a recognizable YouTube URL.
function youtubeEmbedUrl(url) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");
  let videoId = null;
  if (host === "youtu.be") {
    videoId = parsed.pathname.slice(1);
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") videoId = parsed.searchParams.get("v");
    else if (parsed.pathname.startsWith("/embed/")) videoId = parsed.pathname.slice("/embed/".length);
    else if (parsed.pathname.startsWith("/shorts/")) videoId = parsed.pathname.slice("/shorts/".length);
  }
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

function storeLabel(url) {
  if (!url) return null;
  if (url.includes("steampowered.com")) return "View on Steam";
  if (url.includes("itch.io")) return "View on itch.io";
  return "View on store page";
}

// Full-resolution, untouched original of a Sanity image, served as a file
// download (Sanity's `dl` parameter), for the press kit (app/(site)/press).
// The asset ref ends with the original format, e.g. "image-abc-1600x900-jpg".
function downloadUrl(source, filename) {
  if (!source?.asset?._ref) return null;
  const extension = source.asset._ref.split("-").pop();
  return urlForImage(source).forceDownload(`${filename}.${extension}`).url();
}

function mapGame(doc) {
  // The homepage card's image (GameCard.js) — Steam's own header_image, not
  // a separate "cover" concept (dropped, see docs/DECISIONS.md 2026-09-06).
  const header = doc.headerImage ? imageUrl(doc.headerImage, { width: 1600 }) : null;
  const libraryHero = doc.libraryHeroImage
    ? imageUrl(doc.libraryHeroImage, { width: 1600 })
    : null;
  const screenshots = (doc.screenshots || []).map((shot) => imageUrl(shot, { width: 1600 }));
  // Per-image alt text from Sanity (sanity/schemaTypes/altField.js), same
  // order as `screenshots`; "" means none set, and the renderers fall back
  // to their own generic alt.
  const screenshotAlts = (doc.screenshots || []).map((shot) => shot.alt || "");
  // Same preference order as the old file-based heroImage: library hero
  // (1920x620, made for this) > a screenshot (high-res but not a banner) >
  // the store header (low-res, last resort).
  const heroImage = libraryHero || screenshots[0] || header;
  const heroAlt = libraryHero
    ? doc.libraryHeroImage.alt
    : screenshots[0]
      ? screenshotAlts[0]
      : doc.headerImage?.alt;

  return {
    slug: doc.slug,
    updatedAt: doc.updatedAt || null,
    title: doc.title || "",
    tagline: doc.tagline || "",
    description: doc.description && doc.description.length > 0 ? doc.description : null,
    storeUrl: doc.storeUrl || null,
    storeLabel: storeLabel(doc.storeUrl),
    price: doc.price || null,
    releaseDate: doc.releaseDate || null,
    genres: doc.genres || [],
    platforms: doc.platforms || [],
    languages: doc.languages || [],
    features: doc.features || [],
    systemRequirements: doc.systemRequirements || null,
    order: doc.order ?? Number.MAX_SAFE_INTEGER,
    header,
    headerAlt: doc.headerImage?.alt || "",
    heroImage,
    heroAlt: heroAlt || "",
    trailer: doc.trailerUrl || null,
    trailerYoutubeUrl: doc.trailerUrl ? null : youtubeEmbedUrl(doc.trailerYoutubeUrl),
    trailerPoster: doc.trailerPoster ? imageUrl(doc.trailerPoster, { width: 800 }) : null,
    screenshots,
    screenshotAlts,
    showOnHomepage: Boolean(doc.showOnHomepage),
    trailerYoutubeLink: doc.trailerUrl ? null : doc.trailerYoutubeUrl || null,
    press: {
      header: downloadUrl(doc.headerImage, `${doc.slug}-header`),
      libraryHero: downloadUrl(doc.libraryHeroImage, `${doc.slug}-banner`),
      screenshots: (doc.screenshots || []).map((shot, index) =>
        downloadUrl(shot, `${doc.slug}-screenshot-${index + 1}`)
      ),
      trailer: doc.trailerUrl ? `${doc.trailerUrl}?dl=${doc.slug}-trailer.mp4` : null,
    },
    badges: (doc.badge || "").split(",").map((badge) => badge.trim()).filter(Boolean),
  };
}

export async function getGames() {
  const docs = await client.fetch(GAMES_QUERY, {}, { next: { revalidate: 30 } });
  return docs
    .map(mapGame)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export async function getGame(slug) {
  const doc = await client.fetch(GAME_QUERY, { slug }, { next: { revalidate: 30 } });
  return doc ? mapGame(doc) : null;
}
