import { contentTranslations } from "./content";

function splitBadges(value) {
  return (value || "")
    .split(",")
    .map((badge) => badge.trim())
    .filter(Boolean);
}

// Strips lib/i18n/content.js's lite markup ("## ", "> ", **bold**, *italic*)
// down to plain text (used to build a French excerpt from a translated
// body without needing a separately hand-written one).
export function stripLiteMarkup(text) {
  return text
    .replace(/^##\s+/, "")
    .replace(/^>\s+/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .trim();
}

export function getGameTranslation(slug) {
  return contentTranslations.fr.games[slug] || null;
}

export function getPostTranslation(slug) {
  return contentTranslations.fr.posts[slug] || null;
}

// Overlays a game's title/tagline/badges/features/systemRequirements with
// their French translation when `locale` is "fr" and one exists in
// lib/i18n/content.js (safe to pass the result anywhere the plain `game`
// object from lib/games.js was used before). The rich `description` field
// isn't merged here (it needs TranslatedRichText, not a plain string swap;
// call getGameTranslation() directly for that).
export function translateGame(game, locale) {
  if (locale !== "fr") return game;
  const entry = getGameTranslation(game.slug);
  if (!entry) return game;
  return {
    ...game,
    title: entry.title || game.title,
    tagline: entry.tagline || game.tagline,
    badges: entry.badge ? splitBadges(entry.badge) : game.badges,
    features: entry.features || game.features,
    systemRequirements: entry.systemRequirements || game.systemRequirements,
  };
}

// Same idea for a news post's list-view fields (used anywhere a post's
// title/excerpt shows without its full body: NewsSection, FeaturedNews, the
// /news list, a "related post" card).
export function translatePostSummary(post, locale) {
  if (locale !== "fr") return { title: post.title, excerpt: post.excerpt };
  const entry = getPostTranslation(post.slug);
  if (!entry) return { title: post.title, excerpt: post.excerpt };

  const title = entry.title || post.title;
  let excerpt = post.excerpt;
  if (entry.body) {
    const joined = entry.body
      .filter((item) => typeof item === "string")
      .map(stripLiteMarkup)
      .join(" ")
      .trim();
    if (joined) excerpt = joined;
  }
  return { title, excerpt };
}
