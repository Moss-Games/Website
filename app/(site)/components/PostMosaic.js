"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { isGifUrl } from "@/lib/isGifUrl";
import Lightbox from "./Lightbox";
import styles from "./PostMosaic.module.css";

// A post body's inline "mosaic" block (sanity/schemaTypes/postType.js) —
// an adaptive 1-4 image grid (see page.module.css's .count1-4 for the
// per-count layout), each cell clickable to open the same full-screen
// Lightbox (app/(site)/components/Lightbox.js) ScreenshotGallery uses.
// `images` is pre-resolved to plain {src, alt} by
// app/(site)/news/[slug]/page.js.
export default function PostMosaic({ images, caption }) {
  const [openIndex, setOpenIndex] = useState(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current + 1) % images.length));
  }, [images.length]);

  return (
    <figure className={styles.wrap}>
      <div className={`${styles.grid} ${styles[`count${images.length}`]}`}>
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={styles.cell}
            onClick={() => setOpenIndex(index)}
            aria-label={`Enlarge image ${index + 1}`}
          >
            <Image
              src={image.src}
              unoptimized={isGifUrl(image.src)}
              alt={image.alt || `Mosaic image ${index + 1}`}
              fill
              sizes="(min-width: 42rem) 21rem, 50vw"
            />
          </button>
        ))}
      </div>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}

      <Lightbox
        images={images.map((image) => image.src)}
        openIndex={openIndex}
        onClose={close}
        onPrev={showPrev}
        onNext={showNext}
        altPrefix="Mosaic image"
      />
    </figure>
  );
}
