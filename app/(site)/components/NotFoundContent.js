import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import ButtonDrift from "./ButtonDrift";
import styles from "./NotFoundContent.module.css";

// Shared by app/(site)/not-found.js (thrown notFound() calls, e.g. a broken
// /projects/<slug> or /news/<slug> link; renders inside the site's own layout)
// and app/global-not-found.js (genuinely unmatched URLs, e.g. a typo: that
// file bypasses the (site) layout entirely, see its own comment for why).
// Reads the locale cookie directly (rather than via LocaleProvider) since
// both callers are Server Components and this one doesn't need client state.
export default async function NotFoundContent() {
  const t = getTranslator(await getLocale());

  return (
    <div className={styles.page}>
      <Image
        className={styles.mascot}
        src="/images/logo.png"
        alt=""
        width={288}
        height={288}
        priority
      />
      <p className={styles.eyebrow}>404</p>
      <h1 className={styles.title}>{t("notFound.title")}</h1>
      <p className={styles.text}>{t("notFound.text")}</p>
      <div className={styles.actions}>
        <ButtonDrift>
          <Link href="/" className={styles.primary}>
            {t("notFound.backToHome")}
          </Link>
        </ButtonDrift>
        <Link href="/projects" className={styles.secondary}>
          {t("notFound.browseProjects")}
        </Link>
        <Link href="/news" className={styles.secondary}>
          {t("notFound.readTheNews")}
        </Link>
      </div>
    </div>
  );
}
