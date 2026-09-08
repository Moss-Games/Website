import Image from "next/image";
import Link from "next/link";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./GameCard.module.css";

// One listed game (see lib/games.js), rendered as a small self-contained
// card — cover, title, tagline, and an explicit CTA line — rather than the
// old full-bleed single-slide carousel (see docs/DECISIONS.md, 2026-09-06:
// the old design read as an oversized image, not a clickable button). A
// game with no headerImage yet (e.g. an unannounced project) skips the
// image area entirely rather than showing an empty placeholder box — just
// title/tagline/badge/CTA, same idea as the old GameTeaserCard's text-only
// layout (see docs/DECISIONS.md).
//
// `large` is used on the /games page, where cards render bigger than the
// homepage carousel's — same component/markup, just a size modifier class
// (see GameCard.module.css) so both stay visually the same family of card.
export default function GameCard({ game, large = false }) {
  return (
    <Link
      href={`/projects/${game.slug}`}
      className={`${styles.card} ${large ? styles.cardLarge : ""}`}
    >
      {game.header && (
        <div className={styles.coverWrap}>
          <Image
            className={styles.cover}
            src={game.header}
            unoptimized={isGifUrl(game.header)}
            alt={game.title}
            fill
            sizes={large ? "(min-width: 768px) 28rem, 90vw" : "(min-width: 768px) 20rem, 90vw"}
          />
          {game.badges.length > 0 && (
            <div className={styles.badgeGroup}>
              {game.badges.map((badge) => (
                <span key={badge} className={styles.badge}>{badge}</span>
              ))}
            </div>
          )}
        </div>
      )}
      <div className={styles.body}>
        {!game.header && game.badges.length > 0 && (
          <div className={styles.badgeGroupInline}>
            {game.badges.map((badge) => (
              <span key={badge} className={styles.badgeInline}>{badge}</span>
            ))}
          </div>
        )}
        <h3 className={`${styles.title} ${large ? styles.titleLarge : ""}`}>
          {game.title}
        </h3>
        {game.tagline && (
          <p className={`${styles.tagline} ${large ? styles.taglineLarge : ""}`}>
            {game.tagline}
          </p>
        )}
        <span className={styles.cta}>
          Discover {game.title} <span className={styles.arrow}>→</span>
        </span>
      </div>
    </Link>
  );
}
