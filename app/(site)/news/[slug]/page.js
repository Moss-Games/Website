import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getNewsPost, firstSentence } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import GameCard from "../../components/GameCard";
import styles from "./page.module.css";

// Normalizes the resolved `relatedLink` (either a "post" or a "game"
// document, see sanity/schemaTypes/postType.js) into the shape GameCard
// expects, so the same card style used on home/all projects can render it —
// GameCard only ever reads slug/header/badges/title/tagline off `game`.
function relatedCardProps(related) {
  if (!related) return null;
  const isGame = related._type === "game";
  const image = isGame ? related.headerImage : related.cover;
  return {
    isGame,
    href: isGame ? `/projects/${related.slug}` : `/news/${related.slug}`,
    game: {
      slug: related.slug,
      title: related.title,
      header: image ? imageUrl(image, { width: 800 }) : null,
      tagline: isGame ? related.tagline || "" : related.excerpt ? firstSentence(related.excerpt) : "",
      badges: [],
    },
  };
}

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
  const related = relatedCardProps(post.relatedLink);

  return (
    <article className={`${styles.page} ${related ? styles.pageWide : ""}`}>
      <Link href="/news" className={styles.back}>
        ← News
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
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
        </div>

        {related && (
          <aside className={styles.related}>
            <p className={styles.relatedLabel}>{related.isGame ? "Related project" : "Related post"}</p>
            <GameCard game={related.game} href={related.href} ctaLabel={related.isGame ? "Discover" : "Read"} />
          </aside>
        )}
      </div>
    </article>
  );
}
