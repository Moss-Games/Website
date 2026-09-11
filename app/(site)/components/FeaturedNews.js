import Image from "next/image";
import Link from "next/link";
import { getNewsPosts, splitFeaturedNews } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import ButtonDrift from "./ButtonDrift";
import styles from "./FeaturedNews.module.css";

// The homepage's top-of-page highlight — the one editorially-picked story
// (lib/news.js's splitFeaturedNews, set in Sanity via the post's "Featured
// on homepage" checkbox), shown above the games grid as a single cropped
// image with the title/date burned directly onto it (a black text outline —
// see FeaturedNews.module.css's .date/.title — keeps them readable without
// darkening the photo itself) rather than a separate text block, so there's
// nothing to look at here but the picture itself. The rest of the recent posts still
// show later on the page as NewsSection's plain list; this only ever
// renders the single featured pick, or nothing at all when there's no news
// yet (NewsSection's own box covers that empty state further down).
export default async function FeaturedNews() {
  const posts = await getNewsPosts();
  const { featured } = splitFeaturedNews(posts);
  if (!featured) return null;

  const coverSrc = featured.cover ? imageUrl(featured.cover, { width: 720, height: 320 }) : null;
  const dateLabel = featured.publishedAt
    ? new Date(featured.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className={styles.wrap}>
      {/* Rendered twice, one hidden per breakpoint (see the max-width: 30rem
          rule below) rather than repositioned with pure CSS: on mobile the
          date moves out of the image overlay entirely to sit above the card
          as its own left-aligned line, since overlaying it directly on a
          cropped cover risks landing on top of whatever a cover's own
          baked-in logo/title art happens to sit near the bottom (see the
          .card comment above) — same "duplicate + toggle visibility per
          breakpoint" pattern as MascotFrame's .brandMobile. */}
      {dateLabel && <p className={styles.dateMobile}>{dateLabel}</p>}
      <Link href={`/news/${featured.slug}`} className={styles.card}>
        {coverSrc ? (
          <Image
            className={styles.cover}
            src={coverSrc}
            unoptimized={isGifUrl(coverSrc)}
            alt=""
            fill
            sizes="(min-width: 40rem) 36rem, 100vw"
            priority
          />
        ) : null}
        <div className={styles.text}>
          {dateLabel && <p className={styles.date}>{dateLabel}</p>}
          <h2 className={styles.title}>{featured.title}</h2>
        </div>
      </Link>

      <ButtonDrift>
        <Link href="/news" className={styles.seeAllButton}>
          See All News <span className={styles.arrow} aria-hidden="true">→</span>
        </Link>
      </ButtonDrift>
    </div>
  );
}
