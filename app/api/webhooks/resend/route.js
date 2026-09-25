import { Resend } from "resend";
import { removeNewsletterSignupByEmail } from "@/lib/newsletter";
import { forwardReceivedEmail } from "@/lib/emails/forward";

export async function POST(request) {
  const payload = await request.text();
  const resend = new Resend(process.env.RESEND_API_KEY);

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: request.headers,
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
    });
  } catch {
    return new Response("invalid signature", { status: 401 });
  }

  // contact.deleted fires as a result of the contacts.remove() call below too,
  // but removing an already-removed contact/row is a safe no-op either way.
  if (event.type === "contact.updated" && event.data.unsubscribed) {
    await removeNewsletterSignupByEmail(event.data.email);
    await resend.contacts.remove({ email: event.data.email });
  } else if (event.type === "contact.deleted") {
    await removeNewsletterSignupByEmail(event.data.email);
  } else if (event.type === "email.received") {
    // Throwing makes this a 500, so Resend retries the webhook later.
    await forwardReceivedEmail(resend, event.data.email_id);
  }

  return new Response(null, { status: 200 });
}
