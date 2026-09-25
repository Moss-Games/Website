import Link from "next/link";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import styles from "./Footer.module.css";

export default async function Footer() {
  const t = getTranslator(await getLocale());
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>{t("footer.rights", { year })}</p>

      <nav className={styles.legal} aria-label={t("footer.legalAria")}>
        <Link href="/legal">{t("footer.legalNotice")}</Link>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <Link href="/privacy">{t("footer.privacyPolicy")}</Link>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <Link href="/press">{t("footer.pressKit")}</Link>
      </nav>
    </footer>
  );
}
