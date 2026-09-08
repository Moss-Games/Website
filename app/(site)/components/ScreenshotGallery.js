"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./ScreenshotGallery.module.css";

// Thumbnail grid (same markup/sizing the game page used inline before) plus
// a full-screen lightbox opened by clicking one. Needs to be a client
// component for the open/close state, keyboard nav, and touch swipe below.
export default function ScreenshotGallery({ screenshots, title }) {
  const [openIndex, setOpenIndex] = useState(null);
  const touchStartX = useRef(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current - 1 + screenshots.length) % screenshots.length));
  }, [screenshots.length]);
  const showNext = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current + 1) % screenshots.length));
  }, [screenshots.length]);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") showPrev();
      else if (event.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKeyDown);

    // Lock background scroll while the lightbox is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, showPrev, showNext]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    // Ignore small drags/taps — only treat a real swipe as navigation.
    if (Math.abs(delta) < 40) return;
    if (delta > 0) showPrev();
    else showNext();
  };

  return (
    <>
      <div className={styles.grid}>
        {screenshots.map((src, index) => (
          <button
            key={src}
            type="button"
            className={styles.thumb}
            onClick={() => setOpenIndex(index)}
          >
            <Image
              src={src}
              unoptimized={isGifUrl(src)}
              alt={`${title} screenshot ${index + 1}`}
              fill
              sizes="(min-width: 60rem) 33vw, 45vw"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && createPortal(
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshots`}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            ×
          </button>

          {screenshots.length > 1 && (
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={showPrev}
              aria-label="Previous screenshot"
            >
              ‹
            </button>
          )}

          <div className={styles.imageWrap} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Image
              key={screenshots[openIndex]}
              src={screenshots[openIndex]}
              unoptimized={isGifUrl(screenshots[openIndex])}
              alt={`${title} screenshot ${openIndex + 1}`}
              fill
              sizes="90vw"
              className={styles.fullImage}
              priority
            />
          </div>

          {screenshots.length > 1 && (
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={showNext}
              aria-label="Next screenshot"
            >
              ›
            </button>
          )}

          {screenshots.length > 1 && (
            <p className={styles.counter}>
              {openIndex + 1} / {screenshots.length}
            </p>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
