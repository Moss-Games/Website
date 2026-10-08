import Link from "next/link";
import { getNewsPosts, splitFeaturedNews } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { translatePostSummary } from "@/lib/i18n/content-utils";
import ButtonDrift from "./ButtonDrift";
import NewsCarousel from "./NewsCarousel";
import styles from "./FeaturedNews.module.css";

// The homepage's lead element: a full-width news carousel at the very top,
// above the games grid.
// Up to CAROUSEL_SIZE stories: the editorially-picked one first (lib/news.js's
// splitFeaturedNews, set in Sanity via the post's "Featured on homepage"
// checkbox), then the most recent others. Each slide is a cropped cover with
// the title/date burned directly onto it (a black text outline, see
// FeaturedNews.module.css's .date/.title, keeps them readable without
// darkening the photo itself). Renders nothing when there's no news yet
// (NewsSection's own box covers that empty state further down).
const CAROUSEL_SIZE = 4;

export default async function FeaturedNews() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const posts = await getNewsPosts();
  const { featured, recent } = splitFeaturedNews(posts, CAROUSEL_SIZE - 1);
  if (!featured) return null;

  const slides = [featured, ...recent].map((post) => ({
    slug: post.slug,
    title: translatePostSummary(post, locale).title,
    coverSrc: post.cover ? imageUrl(post.cover, { width: 2000, height: 800 }) : null,
    coverAlt: post.cover?.alt || "",
    dateLabel: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
  }));

  return (
    <div className={styles.frame}>
      <div className={styles.wrap}>
        <NewsCarousel
          slides={slides}
          prevLabel={t("common.previousNews")}
          nextLabel={t("common.nextNews")}
          goToLabel={t("common.goToNews")}
        />

        <ButtonDrift>
          <Link href="/news" className={styles.seeAllButton}>
            {t("common.seeAllNews")} <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </ButtonDrift>
      </div>
    </div>
  );
}
