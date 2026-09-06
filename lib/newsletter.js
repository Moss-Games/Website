import { neon } from "@neondatabase/serverless";

let sql;
let tableReady;

function getSql() {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

function ensureTable() {
  if (!tableReady) {
    tableReady = getSql()`
      CREATE TABLE IF NOT EXISTS newsletter_signups (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  }
  return tableReady;
}

// Returns "created", or "duplicate" if the email is already signed up.
export async function addNewsletterSignup(email) {
  await ensureTable();
  const rows = await getSql()`
    INSERT INTO newsletter_signups (email)
    VALUES (${email})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  return rows.length > 0 ? "created" : "duplicate";
}
