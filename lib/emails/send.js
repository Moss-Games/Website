import { Resend } from "resend";
import { buildWelcomeEmail } from "./welcome";

const SITE_URL = "https://www.mossgames.fr";

let resend;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendWelcomeEmail(email, unsubscribeToken) {
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const { subject, html } = buildWelcomeEmail({ unsubscribeUrl });

  const { error } = await getResend().emails.send({
    from: `MossGames <hello@${process.env.RESEND_EMAIL_DOMAIN}>`,
    to: [email],
    subject,
    html,
  });

  if (error) throw new Error(error.message ?? "resend_send_failed");
}
