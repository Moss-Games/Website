import Image from "next/image";
import Link from "next/link";
import styles from "./NotFoundContent.module.css";

// Shared by app/(site)/not-found.js (thrown notFound() calls, e.g. a broken
// /projects/<slug> or /news/<slug> link — renders inside the site's own layout)
// and app/global-not-found.js (genuinely unmatched URLs, e.g. a typo — that
// file bypasses the (site) layout entirely, see its own comment for why).
export default function NotFoundContent() {
  return (
    <div className={styles.page}>
      <Image
        className={styles.mascot}
        src="/images/mascot-head.png"
        alt=""
        width={200}
        height={235}
        priority
      />
      <p className={styles.eyebrow}>404</p>
      <h1 className={styles.title}>Lost in the moss</h1>
      <p className={styles.text}>
        This page must have wandered off. Let&apos;s get you back on track.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primary}>
          ← Back to home
        </Link>
        <Link href="/projects" className={styles.secondary}>
          Browse projects
        </Link>
        <Link href="/news" className={styles.secondary}>
          Read the news
        </Link>
      </div>
    </div>
  );
}
