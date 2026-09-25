import { getNewsPosts } from "@/lib/news";
import { imageUrl } from "@/sanity/lib/image";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/server";
import { translatePostSummary } from "@/lib/i18n/content-utils";
import { SITE_URL, localizedPath } from "@/lib/i18n/metadata";

// RSS 2.0 feed of the news posts, rebuilt from Sanity automatically (same
// 30s revalidation as the /news page, nothing to maintain by hand).
// `?lang=fr` gives the French feed. Read from the URL only, never the
// cookie, so a feed reader always gets the same language for the same URL.

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(text, maxLen = 400) {
  const trimmed = (text || "").replace(/\s+/g, " ").trim();
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen).trim()}…` : trimmed;
}

export async function GET(request) {
  const requested = request.nextUrl.searchParams.get("lang");
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const t = getTranslator(locale);
  const posts = await getNewsPosts();

  const items = posts
    .filter((post) => post.slug)
    .map((post) => {
      const { title, excerpt } = translatePostSummary(post, locale);
      const link = `${SITE_URL}${localizedPath(`/news/${post.slug}`, locale)}`;
      const cover = post.cover ? imageUrl(post.cover, { width: 1200 }) : null;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ""}
      <description>${escapeXml(truncate(excerpt))}</description>
      ${post._updatedAt ? `<atom:updated>${new Date(post._updatedAt).toISOString()}</atom:updated>` : ""}
      ${cover ? `<media:content url="${escapeXml(cover)}" medium="image" />` : ""}
    </item>`;
    })
    .join("\n");

  // Latest edit of any post: tells feed readers the feed changed even when
  // an existing post was edited rather than a new one added.
  const lastEdit = posts.reduce((latest, post) => {
    const time = Date.parse(post._updatedAt || post.publishedAt || "");
    return Number.isNaN(time) ? latest : Math.max(latest, time);
  }, 0);

  const selfUrl = `${SITE_URL}${localizedPath("/news/rss.xml", locale)}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(t("meta.rssTitle"))}</title>
    <link>${escapeXml(`${SITE_URL}${localizedPath("/news", locale)}`)}</link>
    <description>${escapeXml(t("meta.newsDescription"))}</description>
    <language>${locale === "fr" ? "fr-FR" : "en-US"}</language>
    ${lastEdit ? `<lastBuildDate>${new Date(lastEdit).toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/images/logo.png</url>
      <title>${escapeXml(t("meta.rssTitle"))}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
