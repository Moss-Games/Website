import { NextResponse } from "next/server";
import { addNewsletterSignup } from "@/lib/newsletter";
import { sendWelcomeEmail } from "@/lib/emails/send";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const result = await addNewsletterSignup(email.trim().toLowerCase());

    if (result.status === "created") {
      // Don't fail the signup if the welcome email can't be sent — the
      // subscriber is already stored either way.
      try {
        await sendWelcomeEmail(email.trim().toLowerCase(), result.unsubscribeToken);
      } catch (error) {
        console.error("welcome email failed to send", error);
      }
    }

    return NextResponse.json({ status: result.status });
  } catch (error) {
    console.error("newsletter signup failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
