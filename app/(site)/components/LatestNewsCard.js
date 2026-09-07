import Image from "next/image";
import Link from "next/link";
import { getNewsPosts, firstSentence } from "@/lib/news";
import { urlForImage } from "@/sanity/lib/image";
import styles from "./LatestNewsCard.module.css";

// Same card box as Newsletter.module.css (same width/bg/border) — sits next
// to it on the homepage as a matched pair. Server Component (no "use
// client"): fetches directly, same as the /news list page.
export default async function LatestNewsCard() {
  const posts = await getNewsPosts();
  const latest = posts[0];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Latest News</h2>
      {latest ? (
        <Link href={`/news/${latest.slug}`} className={styles.post}>
          <div className={styles.text}>
            {latest.publishedAt && (
              <p className={styles.date}>
                {new Date(latest.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            <p className={styles.postTitle}>{latest.title}</p>
            {latest.excerpt && (
              <p className={styles.excerpt}>{firstSentence(latest.excerpt, 120)}</p>
            )}
            <span className={styles.cta}>
              Read more <span className={styles.arrow}>→</span>
            </span>
          </div>
          {latest.cover ? (
            <Image
              className={styles.cover}
              src={urlForImage(latest.cover).width(160).height(160).url()}
              alt=""
              width={160}
              height={160}
            />
          ) : (
            <div className={styles.cover} />
          )}
        </Link>
      ) : (
        <p className={styles.subtitle}>No news yet — check back soon.</p>
      )}
    </div>
  );
}
