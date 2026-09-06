import { client } from "@/sanity/lib/client";

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  "slug": slug.current,
  title,
  publishedAt,
  cover,
  body
}`;

export async function getNewsPosts() {
  return client.fetch(POSTS_QUERY, {}, { next: { revalidate: 30 } });
}
