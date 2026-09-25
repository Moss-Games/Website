import { DEFAULT_LOCALE, LOCALES } from "./config";

export const SITE_URL = "https://www.mossgames.fr";

// og:locale values per site locale.
export const OG_LOCALES = { en: "en_US", fr: "fr_FR" };

// The URL a page lives at in `locale`: English is the bare path, other
// languages add `?lang=<code>` (handled by proxy.js).
export function localizedPath(path, locale) {
  return locale === DEFAULT_LOCALE ? path : `${path}?lang=${locale}`;
}

// `alternates` for a page's metadata: a self-referencing canonical in the
// current language plus hreflang links to every language version, so Google
// indexes the English and French pages separately instead of treating one
// as a duplicate of the other.
export function localeAlternates(path, locale) {
  const languages = Object.fromEntries(LOCALES.map((code) => [code, localizedPath(path, code)]));
  return {
    canonical: localizedPath(path, locale),
    languages: { ...languages, "x-default": path },
    types: { "application/rss+xml": localizedPath("/news/rss.xml", locale) },
  };
}

// Shared openGraph/twitter blocks so every page's title/description also
// reaches link previews in the right language.
// `title` is the short page title (the root layout's template adds
// " | Moss Games" to the <title>; link previews get the full form here).
export function pageMetadata({ path, locale, title, description, type = "website" }) {
  const alternateLocale = LOCALES.filter((code) => code !== locale).map((code) => OG_LOCALES[code]);
  const fullTitle = title ? `${title} | Moss Games` : "Moss Games";
  return {
    ...(title ? { title } : {}),
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      title: fullTitle,
      description,
      url: localizedPath(path, locale),
      siteName: "Moss Games",
      type,
      locale: OG_LOCALES[locale],
      alternateLocale,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
