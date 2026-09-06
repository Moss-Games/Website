"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./GameCarousel.module.css";

const SWIPE_THRESHOLD_PX = 40;

// Renders whatever games/lib/games.js found under public/games/ — the
// carousel itself doesn't know how many there are or how they're ordered,
// it just pages through the list it's given. Navigation is a CSS transform
// on `.slider` (see GameCarousel.module.css for why `.track` isn't a native
// scroll container), driven by the prev/next buttons or a touch swipe.
export default function GameCarousel({ games }) {
  const [index, setIndex] = useState(0);
  const touchStartXRef = useRef(null);

  const atStart = index <= 0;
  const atEnd = index >= games.length - 1;

  function goTo(nextIndex) {
    setIndex(Math.max(0, Math.min(nextIndex, games.length - 1)));
  }

  function handleTouchStart(event) {
    touchStartXRef.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX == null) return;

    const deltaX = event.changedTouches[0].clientX - startX;
    if (deltaX > SWIPE_THRESHOLD_PX) goTo(index - 1);
    else if (deltaX < -SWIPE_THRESHOLD_PX) goTo(index + 1);
  }

  if (games.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div
        className={styles.track}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className={styles.card}
            >
              {game.cover ? (
                <img
                  className={styles.cover}
                  src={game.cover}
                  alt={game.title}
                />
              ) : (
                <div className={styles.cover} />
              )}
            </Link>
          ))}
        </div>
      </div>
      {games.length > 1 && (
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(index - 1)}
            disabled={atStart}
            aria-label="Previous game"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(index + 1)}
            disabled={atEnd}
            aria-label="Next game"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
