import { client } from "@/sanity/lib/client";

// Excludes drafts: the Sanity client uses a token that can see them (see
// sanity/lib/client.js), and an in-progress draft with no slug yet would
// otherwise crash generateStaticParams the same way lib/games.js's comment
// describes.
const POSTS_LIST_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc){
  "slug": slug.current,
  title,
  publishedAt,
  cover,
  "excerpt": pt::text(body)
}`;

const POST_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && slug.current == $slug][0]{
  title,
  publishedAt,
  cover,
  body,
  "excerpt": pt::text(body),
  relatedLink->{
    _type,
    title,
    "slug": slug.current,
    cover,
    headerImage,
    tagline,
    "excerpt": pt::text(body)
  }
}`;

export async function getNewsPosts() {
  return client.fetch(POSTS_LIST_QUERY, {}, { next: { revalidate: 30 } });
}

export async function getNewsPost(slug) {
  return client.fetch(POST_QUERY, { slug }, { next: { revalidate: 30 } });
}

// First sentence of a post's body, for the list preview — falls back to a
// length-based cutoff for text with no sentence-ending punctuation.
export function firstSentence(text, maxLen = 180) {
  if (!text) return "";
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  if (match) return match[0].trim();
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen).trim()}…` : trimmed;
}
