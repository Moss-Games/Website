import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "./config";
import { translations } from "./translations";
import { createTranslator } from "./utils";

// Reads the visitor's stored language preference (Server Components only —
// LocaleProvider.js is the client-side equivalent, seeded from this on the
// initial render). No cookie yet (first visit) falls back to English.
export async function getLocale() {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getTranslator(locale) {
  return createTranslator(locale, translations, DEFAULT_LOCALE);
}
