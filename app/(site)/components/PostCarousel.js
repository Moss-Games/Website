"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./PostCarousel.module.css";

// A post body's inline "carousel" block (sanity/schemaTypes/postType.js) —
// unlike ScreenshotGallery's click-to-fullscreen lightbox, this renders
// directly in the article flow: one image visible at a time, arrows + dots
// + swipe to move between them. `images` is pre-resolved to plain
// {src, width, height, alt} by app/(site)/news/[slug]/page.js.
export default function PostCarousel({ images, caption }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const showPrev = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);
  const showNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length);
  }, [images.length]);

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

  const current = images[index];

  return (
    <figure className={styles.wrap}>
      <div className={styles.viewport} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Image
          key={current.src}
          className={styles.image}
          src={current.src}
          unoptimized={isGifUrl(current.src)}
          alt={current.alt || ""}
          width={current.width}
          height={current.height}
          sizes="(min-width: 42rem) 42rem, 100vw"
        />
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
