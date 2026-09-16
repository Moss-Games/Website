// Replaces "{name}" placeholders in a translation string with values from
// `vars`, e.g. interpolate("{count} members", { count: 3 }) -> "3 members".
export function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

function getPath(dict, key) {
  return key.split(".").reduce((node, part) => (node && typeof node === "object" ? node[part] : undefined), dict);
}

// Builds a `t(key, vars)` lookup function for one locale, falling back to
// `defaultLocale`'s copy of the same key (and finally the key itself) so a
// string missing from translations.js never renders as blank.
export function createTranslator(locale, translations, defaultLocale) {
  return function t(key, vars) {
    const value = getPath(translations[locale], key) ?? getPath(translations[defaultLocale], key);
    if (value === undefined) return key;
    return typeof value === "string" ? interpolate(value, vars) : value;
  };
}
