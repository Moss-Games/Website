import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getNewsPost } from "@/lib/news";
import { urlForImage } from "@/sanity/lib/image";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return {};
  return { title: `${post.title} — MossGames` };
}

export default async function NewsPostPage({ params }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  return (
    <article className={styles.page}>
      <Link href="/news" className={styles.back}>
        ← News
      </Link>

      {post.cover && (
        <img
          className={styles.cover}
          src={urlForImage(post.cover).width(1200).url()}
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
      <h1 className={styles.postTitle}>{post.title}</h1>
      {post.body && (
        <div className={styles.postBody}>
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  );
}
