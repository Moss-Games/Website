// Supported UI languages for the site's chrome (nav, buttons, form labels,
// etc.). Sanity content (game/news copy) stays English-only regardless of
// this toggle — see lib/i18n/translations.js's header comment.
export const LOCALES = ["en", "fr"];
export const DEFAULT_LOCALE = "en";

// Cookie the visitor's choice is stored in (no URL prefix / separate routes —
// this is a client-side chrome preference, not a localized-SEO setup).
export const LOCALE_COOKIE = "moss_locale";

export function isLocale(value) {
  return LOCALES.includes(value);
}
