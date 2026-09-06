import styles from "./GameTeaserCard.module.css";

// A content-free placeholder for the in-production project that isn't
// ready to reveal yet — sits next to GameCard on the homepage so the site
// reads as "two things happening" without inventing a real /games/[slug]
// page (or store link) before there's anything to show. Once real assets
// exist, give it a public/games/<Name>/ folder like any other game instead
// of editing this component. See docs/DECISIONS.md (2026-09-06).
export default function GameTeaserCard() {
  return (
    <a
      className={styles.card}
      href="https://www.instagram.com/mossgamesfr/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.badge}>Coming soon</span>
      <p className={styles.title}>A new project</p>
      <p className={styles.tagline}>
        We&apos;re working on something new. More to come very soon.
      </p>
      <span className={styles.cta}>
        Follow the announcement <span className={styles.arrow}>→</span>
      </span>
    </a>
  );
}
