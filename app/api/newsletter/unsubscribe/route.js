import { removeNewsletterSignupByToken } from "@/lib/newsletter";
import { getLocale, getTranslator } from "@/lib/i18n/server";

// In the visitor's site language (their moss_locale cookie, if they've
// visited the site in this browser), English otherwise.
function htmlPage(message, locale) {
  return `
<!doctype html>
<html lang="${locale}">
  <body style="margin:0; padding:64px 16px; background:#fafafa; font-family:Arial, Helvetica, sans-serif; text-align:center; color:#18181b;">
    <p style="font-size:16px;">${message}</p>
  </body>
</html>
`.trim();
}

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  const locale = await getLocale();
  const t = getTranslator(locale);

  if (!token) {
    return new Response(htmlPage(t("newsletter.unsubscribeInvalid"), locale), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const email = await removeNewsletterSignupByToken(token);

  const message = email ? t("newsletter.unsubscribed") : t("newsletter.unsubscribeInvalid");

  return new Response(htmlPage(message, locale), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
