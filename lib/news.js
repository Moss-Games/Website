import { client } from "@/sanity/lib/client";

const POSTS_LIST_QUERY = `*[_type == "post"] | order(publishedAt desc){
  "slug": slug.current,
  title,
  publishedAt,
  cover,
  "excerpt": pt::text(body)
}`;

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  cover,
  body
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
