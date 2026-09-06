import { removeNewsletterSignupByToken } from "@/lib/newsletter";

function htmlPage(message) {
  return `
<!doctype html>
<html lang="en">
  <body style="margin:0; padding:64px 16px; background:#fafafa; font-family:Arial, Helvetica, sans-serif; text-align:center; color:#18181b;">
    <p style="font-size:16px;">${message}</p>
  </body>
</html>
`.trim();
}

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return new Response(htmlPage("Invalid unsubscribe link."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const email = await removeNewsletterSignupByToken(token);

  const message = email
    ? `You've been unsubscribed from the MossGames newsletter. Sorry to see you go!`
    : `This unsubscribe link is invalid or has already been used.`;

  return new Response(htmlPage(message), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
