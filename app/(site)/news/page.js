import Link from "next/link";
import { getNewsPosts, firstSentence } from "@/lib/news";
import { urlForImage } from "@/sanity/lib/image";
import styles from "./page.module.css";

export const metadata = {
  title: "News — MossGames",
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
          {posts.map((post) => (
            <Link key={post.slug} href={`/news/${post.slug}`} className={styles.post}>
              {post.cover && (
                <img
                  className={styles.cover}
                  src={urlForImage(post.cover).width(800).height(450).url()}
                  alt=""
                />
              )}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
