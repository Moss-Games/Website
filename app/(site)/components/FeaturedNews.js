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

  return (
    <div className={styles.wrap}>
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
          {featured.publishedAt && (
            <p className={styles.date}>
              {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
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
