# Project status

Last updated: 2026-09-25

A snapshot of what the site is today. The day-by-day history (and why each
choice was made) lives in `docs/DECISIONS.md` and the git log; this file is
only meant to answer "where are we?".

## What's live on mossgames.fr

### Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage: studio intro, featured news post, game carousel (games with "Show on homepage" checked, auto-advances every 5s), newsletter signup, Discord + Instagram cards, recent news, footer |
| `/projects` | Every game, always (no homepage filter). `/games` and `/games/:slug` permanently redirect here (`next.config.mjs`) |
| `/projects/[slug]` | Game page: hero banner, description (rich text with inline images), trailer (Sanity .mp4 or YouTube fallback), screenshots + lightbox, live Steam widget, facts sidebar, JSON-LD |
| `/news`, `/news/[slug]` | News list and posts (rich text, image carousel/mosaic blocks, optional related post/game card, JSON-LD) |
| `/news/rss.xml` | RSS feed, per language |
| `/about` | Team bios, contact email, link to the press kit |
| `/press` | Press kit: fact sheet, studio blurb, team roles, logo, and per game key art/screenshots/trailer as full-resolution downloads (straight from Sanity, `?dl=`) |
| `/legal`, `/privacy` | Legal notice (LCEN) and GDPR privacy policy |
| `/studio` | Sanity Studio (content editing) |

The whole public site sits inside `MascotFrame` (the anteater mascot holding
the page, see `docs/DESIGN.md`).

### Content (Sanity)

- Games and news posts are edited in Sanity (`/studio`), not in the repo.
  Schemas: `sanity/schemaTypes/`. A "Fetch from Steam" action fills a game from
  its Steam store URL (everything except the trailer). See `docs/GAMES.md` and
  `docs/NEWS.md`.
- Published games as of today: Digitum, Gwaver, Bloup!, Tea Time, Don't Gather
  Moss!, ¡Aceituna!, Oscillia : The Shattered Planet Demo, and one titled
  **"New Project"** (probably a placeholder to fill in or unpublish).
- 4 published news posts.

### Languages (EN/FR)

- EN/FR toggle in the page; the choice is stored in the `moss_locale` cookie.
- `?lang=fr` on any URL forces French (`proxy.js`), which is what gives each
  page a crawlable French URL; hreflang/canonical tags come from
  `lib/i18n/metadata.js`, and the sitemap lists both versions.
- UI strings: `lib/i18n/translations.js`. French versions of Sanity content
  (game/post text): `lib/i18n/content.js`, hand-maintained.

### Backend and services

- **Newsletter**: signups stored in Neon Postgres (`lib/newsletter.js`), welcome
  email via a Resend template + automation, unsubscribe link
  (`app/api/newsletter/`).
- **Mail on @mossgames.fr**: received by Resend (domain MX), forwarded to the
  team Gmail by the `email.received` webhook (`app/api/webhooks/resend/`,
  `lib/emails/forward.js`).
- **Analytics**: Vercel Web Analytics.
- **SEO**: per-page metadata and OG images, sitemap, robots, RSS, JSON-LD,
  Google Search Console verified.

### Security and CI

- **Security headers** on every page except `/studio` (`next.config.mjs`):
  Content-Security-Policy (no nonces, so `'unsafe-inline'` scripts are allowed
  and pages stay static-friendly), `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. HSTS is left to
  Vercel, which already sends it. **Adding a new external origin** (a new
  embed, image CDN, script...) means adding it to the CSP there, otherwise the
  browser blocks it.
- **GitHub Actions CI** (`.github/workflows/ci.yml`): `npm run lint` and
  `npm run build` on every push to `main` and every pull request. Needs no
  secrets (the Sanity dataset is publicly readable).

## Known gaps / ideas not done yet

- The logo in the press kit is the 288x288 `public/images/logo.png`; a
  high-resolution (or SVG) version would be better for press.
- The press kit has no single "download everything" zip; each file is its own
  download.
- The newsletter is not sent automatically when a news post is published.
- No per-project devlog: news posts can link to a game (`relatedLink`), but a
  game page doesn't list the posts about it.
- No moss decoration on the frame (procedural attempts were reverted, see
  `docs/DECISIONS.md`; illustrated art is the suggested next try).
- `README.md` still describes `docs/GAMES.md` as the `public/games/<Name>/`
  file contract; games have been in Sanity since 2026-09-06.

## Pitfall already encountered: flex + children in `position: absolute`

In `MascotFrame.module.css`, `.box` is a flex child of `<body>` (`flex flex-col`)
but all its own children (`.content`, the `.limb` elements) are `position: absolute`,
so there's no "in-flow" content to give it a natural width. Observed behavior when testing
in a browser: without explicit `width` on `.box`, the box collapses to near-zero width.
Fixed by using `width: 100vw` with `overflow-x: hidden` on the body to prevent scrollbars.
Keep this in mind if `.box` is ever restructured.

## Local development

```bash
# Install Node.js via nvm (if not already installed)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm install 22

# Install project dependencies
npm install

# Start dev server (needs .env.local: Sanity, Neon and Resend keys)
npm run dev
# → http://localhost:3000
```

## Git push authentication

GitHub CLI (`gh`) is used for authentication on this machine:
- Installed from GitHub releases binary (no sudo needed).
- Authenticated as `GeremC` via `gh auth login`.
- Git credentials configured via `gh auth setup-git`.

## Notes

- **Vercel project: `mossgames-website`** (renamed from `ldpdoc` on 2026-09-06, see
  `docs/DECISIONS.md` from 2026-09-03 "Initial deployment incident" for the history).
  It carries the `mossgames.fr` / `www.mossgames.fr` domain and is connected to the
  `Moss-Games/Website` repo (`main` branch) via the Vercel GitHub App: every push to
  `main` deploys to production.
- Vercel Project ID: `prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H` (scope `geremy-cambus-projects`).
