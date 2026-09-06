# News page — Sanity Studio

## The idea

The `/news` page is content-managed through **Sanity** (a headless CMS, provisioned via
the Vercel Marketplace) instead of files in the repo. Writing, editing, and publishing
posts happens entirely at **`/studio`** on the live site — no code change, no git commit,
no redeploy needed to add or edit a post. This replaced an earlier `public/news/`
file-per-post convention (see `docs/DECISIONS.md`, 2026-09-06 entry) once the user asked
for something closer to how the newsletter's welcome email is managed in Resend: content
lives in an external dashboard, not in this codebase.

## Writing a post

1. Go to `https://www.mossgames.fr/studio` and log in with your Sanity account (Google or
   GitHub — same account used when the integration was set up).
2. Click **Post** in the left sidebar, then the **+** button to create one.
3. Fill in the title (the URL slug auto-generates from it, editable), a publish date, an
   optional cover image, and the body (rich text — bold, headings, lists, links all work).
4. Click **Publish**. The post appears on `/news` within ~30 seconds (see `revalidate` in
   `lib/news.js`) — no deploy required.

Un-publishing (deleting the post, or unpublishing a draft) removes it from `/news` the
same way.

## Code

- `sanity.config.js` (repo root) — Studio configuration: schema, plugins, project id/dataset.
- `sanity/schemaTypes/postType.js` — the `post` document's fields (title, slug, publishedAt,
  cover, body). Add a field here to add one to the Studio form.
- `sanity/lib/client.js` — the read-only Sanity client used by the public site.
- `sanity/lib/image.js` — builds image URLs from Sanity's CDN for the cover image.
- `lib/news.js` — `getNewsPosts()`, a GROQ query for all posts, newest first.
- `app/(site)/news/page.js` + `page.module.css` — the news list page, rendering the rich
  text body via `@portabletext/react`. Empty state ("No news yet — check back soon.")
  until the first post is published.
- `app/studio/[[...tool]]/page.js` + `app/studio/layout.js` — embeds the Studio at
  `/studio`. It has its own root layout (no MascotFrame, no site CSS) via the
  `app/(site)/` vs `app/studio/` route-group split introduced alongside this — see
  `docs/DECISIONS.md`.
- Linked from the top-right nav (`app/(site)/components/MascotFrame.js`, alongside
  "About Us"). `/studio` itself is intentionally not linked from the site nav — it's for
  the team only, reachable by typing the URL.

## Sanity project details

- Project id `fk9d1x48`, dataset `production`, region/plan: free tier, provisioned via
  `vercel integration add sanity/project` under the `mossgames-website` Vercel project.
  API keys are Vercel-managed env vars (`SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`,
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`) — not stored in the repo.
- Manage the Sanity project itself (members, dataset, billing) from
  `https://www.sanity.io/manage`, or via **Open in Sanity** from the integration's page in
  the Vercel dashboard (Storage sidebar).
