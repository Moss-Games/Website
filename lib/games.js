import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

// Games moved from public/games/<Name>/*.txt file folders into Sanity's
// "game" document type (see sanity/schemaTypes/gameType.js) — same CMS
// already used for news. See docs/GAMES.md and docs/DECISIONS.md for why.
const GAMES_QUERY = `*[_type == "game"]{
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
  trailerPoster,
  screenshots,
  order,
  unlisted
}`;

const GAME_QUERY = `*[_type == "game" && slug.current == $slug][0]{
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
  trailerPoster,
  screenshots,
  order,
  unlisted
}`;

function storeLabel(url) {
  if (!url) return null;
  if (url.includes("steampowered.com")) return "View on Steam";
  if (url.includes("itch.io")) return "View on itch.io";
  return "View on store page";
}

function mapGame(doc) {
  // The homepage card's image (GameCard.js) — Steam's own header_image, not
  // a separate "cover" concept (dropped, see docs/DECISIONS.md 2026-09-06).
  const header = doc.headerImage ? urlForImage(doc.headerImage).width(1600).url() : null;
  const libraryHero = doc.libraryHeroImage
    ? urlForImage(doc.libraryHeroImage).width(1600).url()
    : null;
  const screenshots = (doc.screenshots || []).map((shot) =>
    urlForImage(shot).width(1600).url()
  );
  // Same preference order as the old file-based heroImage: library hero
  // (1920x620, made for this) > a screenshot (high-res but not a banner) >
  // the store header (low-res, last resort).
  const heroImage = libraryHero || screenshots[0] || header;

  return {
    slug: doc.slug,
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
    heroImage,
    trailer: doc.trailerUrl || null,
    trailerPoster: doc.trailerPoster ? urlForImage(doc.trailerPoster).width(800).url() : null,
    screenshots,
    unlisted: Boolean(doc.unlisted),
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
