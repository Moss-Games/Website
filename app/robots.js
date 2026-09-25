import { SITE_URL as BASE_URL } from "@/lib/i18n/metadata";

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
