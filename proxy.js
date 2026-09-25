import { NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";

// `?lang=fr` / `?lang=en` on any URL forces that language (and remembers it
// in the same cookie the EN/FR toggle writes). This is what gives each page
// a crawlable French URL: Googlebot never sends the cookie, so without it
// Google would only ever see the English version (see lib/i18n/metadata.js
// for the matching hreflang/canonical tags).
export function proxy(request) {
  const lang = request.nextUrl.searchParams.get("lang");
  if (!isLocale(lang)) return NextResponse.next();

  // Overrides the cookie for this request too, so the page renders in `lang`
  // right away rather than on the next visit.
  request.cookies.set(LOCALE_COOKIE, lang);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/|api/|studio).*)",
      has: [{ type: "query", key: "lang" }],
    },
  ],
};
