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

// French names for the short, fixed vocabularies Sanity/Steam fill in
// English (genres, languages, Steam's review summary). A value missing here
// shows as-is, so a new genre never breaks anything, it just stays English
// until added.
const GENRES_FR = {
  Action: "Action",
  Adventure: "Aventure",
  Animation: "Animation",
  Arcade: "Arcade",
  Casual: "Casual",
  Cosy: "Cosy",
  Cozy: "Cosy",
  Fantasy: "Fantasy",
  "Free To Play": "Gratuit",
  "Free to Play": "Gratuit",
  Horror: "Horreur",
  Indie: "Indé",
  Mystery: "Mystère",
  Platformer: "Plateforme",
  Puzzle: "Puzzle",
  Racing: "Course",
  Rhythm: "Rythme",
  Rythm: "Rythme",
  RPG: "RPG",
  Shooter: "Tir",
  Simulation: "Simulation",
  Space: "Espace",
  Sports: "Sport",
  Strategy: "Stratégie",
};

const LANGUAGES_FR = {
  English: "Anglais",
  French: "Français",
  German: "Allemand",
  Italian: "Italien",
  Japanese: "Japonais",
  Korean: "Coréen",
  Portuguese: "Portugais",
  "Portuguese - Brazil": "Portugais (Brésil)",
  Russian: "Russe",
  "Simplified Chinese": "Chinois simplifié",
  "Traditional Chinese": "Chinois traditionnel",
  Spanish: "Espagnol",
  "Spanish - Spain": "Espagnol (Espagne)",
  "Spanish - Latin America": "Espagnol (Amérique latine)",
};

// Steam's review_score_desc values, with the wording Steam's own French
// store uses.
const STEAM_REVIEWS_FR = {
  "Overwhelmingly Positive": "Extrêmement positives",
  "Very Positive": "Très positives",
  Positive: "Positives",
  "Mostly Positive": "Plutôt positives",
  Mixed: "Moyennes",
  "Mostly Negative": "Plutôt négatives",
  Negative: "Négatives",
  "Very Negative": "Très négatives",
  "Overwhelmingly Negative": "Extrêmement négatives",
};

const MONTHS_FR = {
  Jan: "janv.",
  Feb: "févr.",
  Mar: "mars",
  Apr: "avr.",
  May: "mai",
  Jun: "juin",
  Jul: "juil.",
  Aug: "août",
  Sep: "sept.",
  Oct: "oct.",
  Nov: "nov.",
  Dec: "déc.",
};

// releaseDate is free text copied from Steam ("19 Aug, 2025", "Feb 23,
// 2026", "Feb, 2026", "2027"...): rewritten French-style ("19 août 2025")
// when it matches one of those shapes, otherwise left untouched.
export function translateReleaseDate(value) {
  if (!value) return value;
  const month = (name) => MONTHS_FR[name.slice(0, 3)];
  let match = value.match(/^(\d{1,2}) ([A-Za-z]+),? (\d{4})$/);
  if (match && month(match[2])) return `${match[1]} ${month(match[2])} ${match[3]}`;
  match = value.match(/^([A-Za-z]+) (\d{1,2}),? (\d{4})$/);
  if (match && month(match[1])) return `${match[2]} ${month(match[1])} ${match[3]}`;
  match = value.match(/^([A-Za-z]+),? (\d{4})$/);
  if (match && month(match[1])) return `${month(match[1])} ${match[2]}`;
  return value;
}

export function translateSteamReviews(description, locale) {
  return locale === "fr" ? STEAM_REVIEWS_FR[description] || description : description;
}

// Overlays a game's title/tagline/badges/features/systemRequirements with
// their French translation when `locale` is "fr" and one exists in
// lib/i18n/content.js, and translates genres/languages/release date/price
// from the fixed vocabularies above (safe to pass the result anywhere the
// plain `game` object from lib/games.js was used before). The rich
// `description` field isn't merged here (it needs TranslatedRichText, not a
// plain string swap; call getGameTranslation() directly for that).
export function translateGame(game, locale) {
  if (locale !== "fr") return game;
  const entry = getGameTranslation(game.slug) || {};
  return {
    ...game,
    title: entry.title || game.title,
    tagline: entry.tagline || game.tagline,
    badges: entry.badge ? splitBadges(entry.badge) : game.badges,
    features: entry.features || game.features,
    systemRequirements: entry.systemRequirements || game.systemRequirements,
    genres: game.genres.map((genre) => GENRES_FR[genre] || genre),
    languages: game.languages.map((language) => LANGUAGES_FR[language] || language),
    releaseDate: translateReleaseDate(game.releaseDate),
    price: game.price === "Free to Play" ? "Gratuit" : game.price,
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
