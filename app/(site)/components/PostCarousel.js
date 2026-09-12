"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./PostCarousel.module.css";

const AUTOPLAY_MS = 5000;

// A post body's inline "carousel" block (sanity/schemaTypes/postType.js) —
// unlike ScreenshotGallery's click-to-fullscreen lightbox, this renders
// directly in the article flow: one image visible at a time, arrows + dots
// + swipe to move between them, auto-advancing every 5s. `images` is
// pre-resolved to plain {src, width, height, alt} by
// app/(site)/news/[slug]/page.js.
//
// Slides sit side by side in a flex track that's translated horizontally
// (see .track/.slide below) rather than swapping a single <Image> on
// index change — that's what makes the transition a smooth slide instead
// of an instant cut. Every slide fills the same fixed-aspect-ratio
// viewport via object-fit:cover, so the height never jumps between slides
// of differing source aspect ratios mid-transition.
export default function PostCarousel({ images, caption }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const showPrev = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);
  const showNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length);
  }, [images.length]);

  // Paused on hover/focus (mouse) and while a touch drag is in progress —
  // otherwise the autoplay could yank the carousel forward while someone's
  // mid-swipe or reading a caption.
  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setInterval(showNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [images.length, paused, showNext]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (event) => {
    setPaused(false);
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    // Ignore small drags/taps — only treat a real swipe as navigation.
    if (Math.abs(delta) < 40) return;
    if (delta > 0) showPrev();
    else showNext();
  };

  return (
    <figure
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.viewport} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className={styles.track}
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${index * (100 / images.length)}%)`,
          }}
        >
          {images.map((image, i) => (
            <div key={image.src} className={styles.slide} style={{ width: `${100 / images.length}%` }}>
              <Image
                className={styles.image}
                src={image.src}
                unoptimized={isGifUrl(image.src)}
                alt={image.alt || ""}
                fill
                priority={i === 0}
                sizes="(min-width: 42rem) 42rem, 100vw"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={showPrev} aria-label="Previous image">
              ‹
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={showNext} aria-label="Next image">
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
