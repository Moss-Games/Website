import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

let sql;
let tableReady;

function getSql() {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

function ensureTable() {
  if (!tableReady) {
    tableReady = (async () => {
      const db = getSql();
      await db`
        CREATE TABLE IF NOT EXISTS newsletter_signups (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await db`ALTER TABLE newsletter_signups ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT`;
      await db`
        CREATE UNIQUE INDEX IF NOT EXISTS newsletter_signups_unsubscribe_token_idx
          ON newsletter_signups (unsubscribe_token)
          WHERE unsubscribe_token IS NOT NULL
      `;
    })();
  }
  return tableReady;
}

// Returns { status: "created", unsubscribeToken } or { status: "duplicate" }
// if the email is already signed up.
export async function addNewsletterSignup(email) {
  await ensureTable();
  const unsubscribeToken = randomBytes(24).toString("hex");
  const rows = await getSql()`
    INSERT INTO newsletter_signups (email, unsubscribe_token)
    VALUES (${email}, ${unsubscribeToken})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  return rows.length > 0 ? { status: "created", unsubscribeToken } : { status: "duplicate" };
}

// Returns the removed email, or null if the token didn't match anyone.
export async function removeNewsletterSignupByToken(token) {
  await ensureTable();
  const rows = await getSql()`
    DELETE FROM newsletter_signups
    WHERE unsubscribe_token = ${token}
    RETURNING email
  `;
  return rows[0]?.email ?? null;
}

// Used by the Resend webhook to keep this table in sync when someone
// unsubscribes via the Resend-hosted link instead of our own.
export async function removeNewsletterSignupByEmail(email) {
  await ensureTable();
  await getSql()`DELETE FROM newsletter_signups WHERE email = ${email}`;
}
