// Supported UI languages for the site's chrome (nav, buttons, form labels,
// etc.). Sanity content (game/news copy) stays English-only regardless of
// this toggle (see lib/i18n/translations.js's header comment).
export const LOCALES = ["en", "fr"];
export const DEFAULT_LOCALE = "en";

// Cookie the visitor's choice is stored in. URLs stay the same in every
// language; `?lang=fr` (proxy.js) is the only per-language URL, used so
// search engines can index the French version.
export const LOCALE_COOKIE = "moss_locale";

export function isLocale(value) {
  return LOCALES.includes(value);
}
