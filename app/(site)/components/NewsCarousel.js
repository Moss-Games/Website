"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./FeaturedNews.module.css";

const AUTOPLAY_MS = 6000;

// FeaturedNews's slider: one news card visible at a time, arrows + dots +
// swipe to move between them, auto-advancing (paused on hover and mid-swipe).
// Same translated-track mechanics as PostCarousel.js (see its header comment),
// but each slide is a whole clickable card with its title/date burned onto
// the cover. `slides` is pre-resolved to plain {slug, title, dateLabel,
// coverSrc, coverAlt} by FeaturedNews.js.
export default function NewsCarousel({ slides, prevLabel, nextLabel, goToLabel }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const count = slides.length;

  const showPrev = useCallback(() => setIndex((current) => (current - 1 + count) % count), [count]);
  const showNext = useCallback(() => setIndex((current) => (current + 1) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(showNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused, showNext]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (event) => {
    setPaused(false);
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) showPrev();
    else showNext();
  };

  const active = slides[index];

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Mobile-only copy of the active slide's date, above the card rather
          than overlaid on it (see FeaturedNews.module.css's .dateMobile). */}
      {active.dateLabel && <p className={styles.dateMobile}>{active.dateLabel}</p>}

      <div className={styles.viewport} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className={styles.track}
          style={{ width: `${count * 100}%`, transform: `translateX(-${index * (100 / count)}%)` }}
        >
          {slides.map((slide, i) => (
            <Link
              key={slide.slug}
              href={`/news/${slide.slug}`}
              className={styles.card}
              style={{ width: `${100 / count}%` }}
              // Off-screen slides stay out of the tab order and the
              // accessibility tree; only the visible one is a real link.
              inert={i !== index}
            >
              {slide.coverSrc ? (
                <Image
                  className={styles.cover}
                  src={slide.coverSrc}
                  unoptimized={isGifUrl(slide.coverSrc)}
                  alt={slide.coverAlt}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                />
              ) : null}
              <div className={styles.text}>
                {slide.dateLabel && <p className={styles.date}>{slide.dateLabel}</p>}
                <h2 className={styles.title}>{slide.title}</h2>
              </div>
            </Link>
          ))}
        </div>

        {count > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={showPrev} aria-label={prevLabel}>
              ‹
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={showNext} aria-label={nextLabel}>
              ›
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`${goToLabel} ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
