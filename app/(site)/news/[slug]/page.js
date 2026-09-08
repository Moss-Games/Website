import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getNewsPost, firstSentence } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return {};
  const title = `${post.title} | MossGames`;
  const description = firstSentence(post.excerpt) || undefined;
  return {
    title,
    description,
    // The route's own opengraph-image.js supplies the image.
    openGraph: { title, description, siteName: "MossGames", type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function NewsPostPage({ params }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  const coverSrc = post.cover ? imageUrl(post.cover, { width: 1200, height: 675 }) : null;

  return (
    <article className={styles.page}>
      <Link href="/news" className={styles.back}>
        ← News
      </Link>

      {coverSrc && (
        <div className={styles.coverWrap}>
          <Image
            className={styles.cover}
            src={coverSrc}
            unoptimized={isGifUrl(coverSrc)}
            alt=""
            fill
            priority
            sizes="(min-width: 42rem) 42rem, 100vw"
          />
        </div>
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
      <h1 className={styles.postTitle}>{post.title}</h1>
      {post.body && (
        <div className={styles.postBody}>
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  );
}
