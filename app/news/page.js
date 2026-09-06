import { getNewsPosts } from "@/lib/news";
import MarkdownText from "@/app/components/MarkdownText";
import styles from "./page.module.css";

export const metadata = {
  title: "News — MossGames",
};

export default function NewsPage() {
  const posts = getNewsPosts();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>News</h1>

      {posts.length === 0 ? (
        <p className={styles.empty}>No news yet — check back soon.</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.post}>
              {post.cover && (
                <img className={styles.cover} src={post.cover} alt="" />
              )}
              {post.date && <p className={styles.date}>{post.date}</p>}
              <h2 className={styles.postTitle}>{post.title}</h2>
              {post.body && (
                <div className={styles.postBody}>
                  <MarkdownText content={post.body} />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
