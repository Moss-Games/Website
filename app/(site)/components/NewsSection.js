import Image from "next/image";
import Link from "next/link";
import { getNewsPosts, splitFeaturedNews } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import ButtonDrift from "./ButtonDrift";
import styles from "./NewsSection.module.css";

// The homepage's News box: a plain list of the 3 most recent posts
// (excluding whichever one is currently featured — that one shows
// separately, above the games grid, via FeaturedNews) and an "All News"
// CTA underneath. Server Component: fetches directly, same as /news.
export default async function NewsSection() {
  const posts = await getNewsPosts();
  const { recent } = splitFeaturedNews(posts);

  return (
    <section className={styles.box}>
      <h2 className={styles.heading}>News</h2>

      {posts.length === 0 ? (
        <p className={styles.empty}>No news yet — check back soon.</p>
      ) : (
        recent.length > 0 && (
          <div className={styles.list}>
            {recent.map((post) => {
              const coverSrc = post.cover ? imageUrl(post.cover, { width: 160, height: 160 }) : null;
              return (
                <Link key={post.slug} href={`/news/${post.slug}`} className={styles.item}>
                  {coverSrc ? (
                    <Image
                      className={styles.itemCover}
                      src={coverSrc}
                      unoptimized={isGifUrl(coverSrc)}
                      alt=""
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className={styles.itemCover} />
                  )}
                  <div className={styles.itemBody}>
                    {post.publishedAt && (
                      <p className={styles.itemDate}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <p className={styles.itemTitle}>{post.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}

      <ButtonDrift>
        <Link href="/news" className={styles.seeAllButton}>
          All News <span className={styles.arrow} aria-hidden="true">→</span>
        </Link>
      </ButtonDrift>
    </section>
  );
}
