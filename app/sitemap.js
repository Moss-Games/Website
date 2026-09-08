import { getGames } from "@/lib/games";
import { getNewsPosts } from "@/lib/news";

const BASE_URL = "https://mossgames.fr";

export default async function sitemap() {
  const [games, posts] = await Promise.all([getGames(), getNewsPosts()]);

  const staticRoutes = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/news`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/legal`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const gameRoutes = games.map((game) => ({
    url: `${BASE_URL}/projects/${game.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...gameRoutes, ...postRoutes];
}
