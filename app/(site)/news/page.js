import Image from "next/image";
import Link from "next/link";
import { getNewsPosts, firstSentence } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { translatePostSummary } from "@/lib/i18n/content-utils";
import styles from "./page.module.css";

export const metadata = {
  title: "News",
  description:
    "The latest updates, devlogs, and announcements from Moss Games.",
};

export default async function NewsPage() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";
  const posts = await getNewsPosts();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t("newsPage.title")}</h1>

      {posts.length === 0 ? (
        <p className={styles.empty}>{t("newsPage.empty")}</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => {
            const coverSrc = post.cover
              ? imageUrl(post.cover, { width: 800, height: 450 })
              : null;
            const { title, excerpt } = translatePostSummary(post, locale);
            return (
              <Link key={post.slug} href={`/news/${post.slug}`} className={styles.post}>
                <div className={styles.coverWrap}>
                  {coverSrc && (
                    <Image
                      className={styles.cover}
                      src={coverSrc}
                      unoptimized={isGifUrl(coverSrc)}
                      alt={post.cover.alt || ""}
                      fill
                      sizes="(min-width: 40rem) 26rem, 100vw"
                    />
                  )}
                </div>
                <div className={styles.body}>
                  {post.publishedAt && (
                    <p className={styles.date}>
                      {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <h2 className={styles.postTitle}>{title}</h2>
                  {excerpt && <p className={styles.excerpt}>{firstSentence(excerpt)}</p>}
                  <span className={styles.readMore}>
                    {t("common.readMore")} <span className={styles.arrow}>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
