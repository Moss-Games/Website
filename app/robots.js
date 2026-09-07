const BASE_URL = "https://mossgames.fr";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
