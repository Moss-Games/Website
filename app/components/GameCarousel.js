"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./GameCarousel.module.css";

// Renders whatever games/lib/games.js found under public/games/ — the
// carousel itself doesn't know how many there are or how they're ordered,
// it just scrolls through the list it's given.
export default function GameCarousel({ games }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(games.length <= 1);

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  if (games.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div
        className={styles.track}
        ref={trackRef}
        onScroll={updateEdges}
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
      {games.length > 1 && (
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous game"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => scrollByCard(1)}
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
