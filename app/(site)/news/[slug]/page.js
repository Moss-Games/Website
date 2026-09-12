import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getNewsPost, firstSentence } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { isGifUrl } from "@/lib/isGifUrl";
import GameCard from "../../components/GameCard";
import PostCarousel from "../../components/PostCarousel";
import PostMosaic from "../../components/PostMosaic";
import styles from "./page.module.css";

// Sanity encodes an image asset's intrinsic size in its ref, e.g.
// "image-abc123-1600x900-jpg" — pulled out here so next/image gets a real
// width/height (and correct aspect ratio) without a network round-trip.
function imageDimensions(source) {
  const ref = source?.asset?._ref || "";
  const match = ref.match(/-(\d+)x(\d+)-/);
  if (!match) return { width: 1200, height: 675 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

// Shared by the carousel/mosaic components below — resolves a raw array of
// Sanity images (each optionally carrying its own `alt`) to the plain
// {src, width, height, alt} shape they render from.
function resolveImages(images, width) {
  return (images || [])
    .map((image) => {
      const src = imageUrl(image, { width });
      if (!src) return null;
      return { ...imageDimensions(image), src, alt: image.alt || "" };
    })
    .filter(Boolean);
}

// Renders `image`/`carousel`/`mosaic` blocks dropped inline into a post's
// Portable Text body (see the `body` field in sanity/schemaTypes/postType.js)
// — plain text blocks render fine with PortableText's defaults, but these
// non-text block types need an explicit component or they're silently
// skipped.
const bodyComponents = {
  types: {
    image: ({ value }) => {
      const src = imageUrl(value, { width: 1200 });
      if (!src) return null;
      const { width, height } = imageDimensions(value);
      return (
        <figure className={styles.bodyImageWrap}>
          <Image
            className={styles.bodyImage}
            src={src}
            unoptimized={isGifUrl(src)}
            alt={value.alt || ""}
            width={width}
            height={height}
            sizes="(min-width: 42rem) 42rem, 100vw"
          />
          {value.caption && <figcaption className={styles.bodyImageCaption}>{value.caption}</figcaption>}
        </figure>
      );
    },
    carousel: ({ value }) => {
      const images = resolveImages(value.images, 1200);
      if (images.length === 0) return null;
      return <PostCarousel images={images} caption={value.caption} />;
    },
    mosaic: ({ value }) => {
      const images = resolveImages(value.images, 800);
      if (images.length === 0) return null;
      return <PostMosaic images={images} caption={value.caption} />;
    },
  },
};

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

  // No height param (unlike the old fixed-crop fetch) — the hero's own
  // aspect-ratio + object-fit:cover below does the cropping, same as the
  // game page's headerImage (app/(site)/projects/[slug]/page.js).
  const coverSrc = post.cover ? imageUrl(post.cover, { width: 1600 }) : null;
  const related = relatedCardProps(post.relatedLink);

  return (
    <article className={styles.page}>
      {coverSrc && (
        <div className={styles.coverWrap}>
          <Image
            className={styles.cover}
            src={coverSrc}
            unoptimized={isGifUrl(coverSrc)}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
      )}

      <div className={`${styles.body} ${related ? styles.bodyWide : ""}`}>
        <Link href="/news" className={styles.back}>
          ← News
        </Link>

        {/* Single column below 60rem; a row with the related card pinned
            to the right (sticky) past that — same responsive pattern as
            the game page's .layout/.sidebar. */}
        <div className={styles.layout}>
          <div className={styles.main}>
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
                <PortableText value={post.body} components={bodyComponents} />
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
      </div>
    </article>
  );
}
