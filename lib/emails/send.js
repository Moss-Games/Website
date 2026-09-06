import { Resend } from "resend";

let resend;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

// Doesn't send the email directly: creates/upserts the subscriber as a
// Resend Contact and fires a "newsletter.signup" event. A Resend Automation
// (trigger on that event -> the "Newsletter welcome email" Template) does
// the actual sending — content and delivery are entirely managed in the
// Resend dashboard, unsubscribing included.
export async function triggerWelcomeEmail(email) {
  const { error: contactError } = await getResend().contacts.create({
    email,
    unsubscribed: false,
  });
  if (contactError) throw new Error(contactError.message ?? "resend_contact_failed");

  const { error: eventError } = await getResend().events.send({
    event: "newsletter.signup",
    email,
  });
  if (eventError) throw new Error(eventError.message ?? "resend_event_failed");
}
