import Image from "next/image";
import Link from "next/link";
import { getNewsPosts, firstSentence } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./page.module.css";

export const metadata = {
  title: "News — MossGames",
  description: "The latest updates, devlogs, and announcements from MossGames.",
};

export default async function NewsPage() {
  const posts = await getNewsPosts();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>News</h1>

      {posts.length === 0 ? (
        <p className={styles.empty}>No news yet — check back soon.</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => {
            const coverSrc = post.cover
              ? imageUrl(post.cover, { width: 800, height: 450 })
              : null;
            return (
              <Link key={post.slug} href={`/news/${post.slug}`} className={styles.post}>
                <div className={styles.coverWrap}>
                  {coverSrc && (
                    <Image
                      className={styles.cover}
                      src={coverSrc}
                      unoptimized={isGifUrl(coverSrc)}
                      alt=""
                      fill
                      sizes="(min-width: 20rem) 20rem, 90vw"
                    />
                  )}
                </div>
                <div className={styles.body}>
                  {post.publishedAt && (
                    <p className={styles.date}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  {post.excerpt && <p className={styles.excerpt}>{firstSentence(post.excerpt)}</p>}
                  <span className={styles.readMore}>
                    Read more <span className={styles.arrow}>→</span>
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
