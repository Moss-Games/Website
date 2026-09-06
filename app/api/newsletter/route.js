import { NextResponse } from "next/server";
import { addNewsletterSignup } from "@/lib/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const result = await addNewsletterSignup(email.trim().toLowerCase());
    return NextResponse.json({ status: result });
  } catch (error) {
    console.error("newsletter signup failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
