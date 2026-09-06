import Link from "next/link";
import styles from "./GameCard.module.css";

// One listed game (see lib/games.js), rendered as a small self-contained
// card — cover, title, tagline, and an explicit CTA line — rather than the
// old full-bleed single-slide carousel (see docs/DECISIONS.md, 2026-09-06:
// the old design read as an oversized image, not a clickable button).
export default function GameCard({ game }) {
  return (
    <Link href={`/games/${game.slug}`} className={styles.card}>
      {game.header ? (
        <img className={styles.cover} src={game.header} alt={game.title} />
      ) : (
        <div className={styles.cover} />
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{game.title}</h3>
        {game.tagline && <p className={styles.tagline}>{game.tagline}</p>}
        <span className={styles.cta}>
          Discover {game.title} <span className={styles.arrow}>→</span>
        </span>
      </div>
    </Link>
  );
}
