import Link from "next/link";
import styles from "./Footer.module.css";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>© {YEAR} MossGames. All rights reserved.</p>

      <nav className={styles.legal} aria-label="Legal">
        <Link href="/legal">Legal Notice</Link>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <Link href="/privacy">Privacy Policy</Link>
      </nav>
    </footer>
  );
}
