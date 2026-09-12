"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./Lightbox.module.css";

// Fullscreen image viewer — shared by ScreenshotGallery (game page) and
// PostMosaic (news post body's mosaic block), which each own their own grid
// markup and open/index state, but want identical overlay/keyboard/swipe
// behavior once an image is opened. `images` is a plain array of src
// strings; `altPrefix` becomes "<altPrefix> N" for each slide's alt text.
export default function Lightbox({ images, openIndex, onClose, onPrev, onNext, altPrefix }) {
  const touchStartX = useRef(null);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") onPrev();
      else if (event.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKeyDown);

    // Lock background scroll while the lightbox is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, onClose, onPrev, onNext]);

  if (openIndex === null) return null;

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    // Ignore small drags/taps — only treat a real swipe as navigation.
    if (Math.abs(delta) < 40) return;
    if (delta > 0) onPrev();
    else onNext();
  };

  const src = images[openIndex];

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={altPrefix}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
        ×
      </button>

      {images.length > 1 && (
        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={onPrev} aria-label="Previous image">
          ‹
        </button>
      )}

      <div className={styles.imageWrap} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Image
          key={src}
          src={src}
          unoptimized={isGifUrl(src)}
          alt={`${altPrefix} ${openIndex + 1}`}
          fill
          sizes="90vw"
          className={styles.fullImage}
          priority
        />
      </div>

      {images.length > 1 && (
        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={onNext} aria-label="Next image">
          ›
        </button>
      )}

      {images.length > 1 && (
        <p className={styles.counter}>
          {openIndex + 1} / {images.length}
        </p>
      )}
    </div>,
    document.body
  );
}
