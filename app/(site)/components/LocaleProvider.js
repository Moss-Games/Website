"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";
import { translations } from "@/lib/i18n/translations";
import { createTranslator } from "@/lib/i18n/utils";

const LocaleContext = createContext(null);

// Client-side counterpart to lib/i18n/server.js's getLocale/getTranslator:
// needed because Client Components (MascotFrame's scroll handling, the
// toggle itself, the newsletter form...) can't call the server-only
// cookies() API those use. Seeded from the cookie the root layout already
// read server-side (`initialLocale`), so there's no first-paint flash.
export function LocaleProvider({ initialLocale, children }) {
  const [locale, setLocaleState] = useState(isLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE);
  const router = useRouter();

  const setLocale = useCallback(
    (next) => {
      if (!isLocale(next) || next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      setLocaleState(next);
      // Re-runs Server Components (pages, Footer, NewsSection, ...) with the
      // new cookie so their own getLocale()-driven text updates too.
      router.refresh();
    },
    [locale, router]
  );

  const t = useMemo(() => createTranslator(locale, translations, DEFAULT_LOCALE), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
