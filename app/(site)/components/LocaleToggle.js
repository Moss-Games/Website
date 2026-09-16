"use client";

import { useLocale } from "./LocaleProvider";
import styles from "./LocaleToggle.module.css";

const OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

// Lives inside MascotFrame's white `.content` area (top-right corner) —
// deliberately not in the black margin band with the News/About Us nav
// links, per the site's design brief.
export default function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className={styles.toggle} role="group" aria-label={t("localeToggle.label")}>
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          className={`${styles.option} ${locale === option.code ? styles.active : ""}`}
          onClick={() => setLocale(option.code)}
          aria-pressed={locale === option.code}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
