import { getGames } from "@/lib/games";
import { getNewsPosts } from "@/lib/news";
import { LOCALES } from "@/lib/i18n/config";
import { SITE_URL, localizedPath } from "@/lib/i18n/metadata";

// Each page is listed once per language (English at the bare URL, French at
// `?lang=fr`, see proxy.js), every entry pointing at all its translations.
function localizedEntries(path, fields) {
  const languages = Object.fromEntries(
    LOCALES.map((code) => [code, `${SITE_URL}${localizedPath(path, code)}`])
  );
  return LOCALES.map((code) => ({
    url: languages[code],
    ...fields,
    alternates: { languages: { ...languages, "x-default": `${SITE_URL}${path}` } },
  }));
}

export default async function sitemap() {
  const [games, posts] = await Promise.all([getGames(), getNewsPosts()]);

  const staticRoutes = [
    ["/", { changeFrequency: "weekly", priority: 1 }],
    ["/projects", { changeFrequency: "weekly", priority: 0.9 }],
    ["/news", { changeFrequency: "weekly", priority: 0.7 }],
    ["/about", { changeFrequency: "monthly", priority: 0.5 }],
    ["/press", { changeFrequency: "monthly", priority: 0.4 }],
    ["/legal", { changeFrequency: "yearly", priority: 0.2 }],
    ["/privacy", { changeFrequency: "yearly", priority: 0.2 }],
  ];

  const gameRoutes = games.map((game) => [
    `/projects/${game.slug}`,
    {
      lastModified: game.updatedAt ? new Date(game.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]);

  const postRoutes = posts.map((post) => [
    `/news/${post.slug}`,
    {
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]);

  return [...staticRoutes, ...gameRoutes, ...postRoutes].flatMap(([path, fields]) =>
    localizedEntries(path, fields)
  );
}
