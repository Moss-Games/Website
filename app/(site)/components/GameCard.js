import Link from "next/link";
import styles from "./GameCard.module.css";

// One listed game (see lib/games.js), rendered as a small self-contained
// card — cover, title, tagline, and an explicit CTA line — rather than the
// old full-bleed single-slide carousel (see docs/DECISIONS.md, 2026-09-06:
// the old design read as an oversized image, not a clickable button). A
// game with no headerImage yet (e.g. an unannounced project) skips the
// image area entirely rather than showing an empty placeholder box — just
// title/tagline/badge/CTA, same idea as the old GameTeaserCard's text-only
// layout (see docs/DECISIONS.md).
export default function GameCard({ game }) {
  return (
    <Link href={`/games/${game.slug}`} className={styles.card}>
      {game.header && (
        <div className={styles.coverWrap}>
          <img className={styles.cover} src={game.header} alt={game.title} />
          {game.badge && <span className={styles.badge}>{game.badge}</span>}
        </div>
      )}
      <div className={styles.body}>
        {!game.header && game.badge && (
          <span className={styles.badgeInline}>{game.badge}</span>
        )}
        <h3 className={styles.title}>{game.title}</h3>
        {game.tagline && <p className={styles.tagline}>{game.tagline}</p>}
        <span className={styles.cta}>
          Discover {game.title} <span className={styles.arrow}>→</span>
        </span>
      </div>
    </Link>
  );
}
