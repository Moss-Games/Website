"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { isGifUrl } from "@/lib/isGifUrl";
import Lightbox from "./Lightbox";
import styles from "./ScreenshotGallery.module.css";

// Thumbnail grid (same markup/sizing the game page used inline before) plus
// a full-screen Lightbox (app/(site)/components/Lightbox.js) opened by
// clicking one. Needs to be a client component for the open/close state.
export default function ScreenshotGallery({ screenshots, title }) {
  const [openIndex, setOpenIndex] = useState(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current - 1 + screenshots.length) % screenshots.length));
  }, [screenshots.length]);
  const showNext = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current + 1) % screenshots.length));
  }, [screenshots.length]);

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

      <Lightbox
        images={screenshots}
        openIndex={openIndex}
        onClose={close}
        onPrev={showPrev}
        onNext={showNext}
        altPrefix={`${title} screenshot`}
      />
    </>
  );
}
