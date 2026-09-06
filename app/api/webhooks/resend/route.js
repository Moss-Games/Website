import { Resend } from "resend";
import { removeNewsletterSignupByEmail } from "@/lib/newsletter";

export async function POST(request) {
  const payload = await request.text();

  let event;
  try {
    event = new Resend(process.env.RESEND_API_KEY).webhooks.verify({
      payload,
      headers: request.headers,
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
    });
  } catch {
    return new Response("invalid signature", { status: 401 });
  }

  const isUnsubscribe =
    (event.type === "contact.updated" && event.data.unsubscribed) ||
    event.type === "contact.deleted";

  if (isUnsubscribe) {
    await removeNewsletterSignupByEmail(event.data.email);
  }

  return new Response(null, { status: 200 });
}
