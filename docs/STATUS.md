# Project status

Last updated: 2026-09-04

## Where we are

- Next.js (App Router) structure in place, with Tailwind CSS v4 configured.
- Single page (`app/page.js`): placeholder "MossGames — the site is coming soon".
- **Logo integrated** (`public/images/logo.png`) and used as favicon (also copied to
  `public/favicon.png` for broader browser compatibility).
- **"Mascot holding the site in its arms" visual concept implemented**:
  `app/components/MascotFrame.js` wraps the entire site (wired in `app/layout.js`).
- **All content translated to English** (2026-09-04):
  - `app/page.js`: "The site is coming soon."
  - `app/layout.js`: `lang="en"`, English metadata description
  - All documentation (`README.md`, `docs/STATUS.md`, `docs/DESIGN.md`,
    `docs/DECISIONS.md`, `docs/ONBOARDING.md`) translated from French to English.
- **MascotFrame responsive fix** (2026-09-04):
  - `.box` now uses `width: 100vw` to stretch edge-to-edge on all screens.
  - `max-width: 72rem` applied only via `@media (min-width: 641px)` for centering
    on large monitors.
  - `overflow-x: hidden` on `<html>` and `<body>` to prevent horizontal scrollbar.
  - `box-sizing: border-box` to prevent border from adding to the width.
- Still no other real content (game descriptions, studio bio, full brand guidelines,
  contact info, social links) — see `docs/DECISIONS.md` from 2026-09-03.
- Git repo pushed to `main` on `Moss-Games/Website` (GitHub), linked to Vercel
  → **confirmed live** on mossgames.fr.

## Pitfall already encountered: flex + children in `position: absolute`

In `MascotFrame.module.css`, `.box` is a flex child of `<body>` (`flex flex-col`)
but all its own children (`.content`, the `.limb` elements) are `position: absolute` —
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

# Start dev server
npm run dev
# → http://localhost:3000
```

## Git push authentication

GitHub CLI (`gh`) is used for authentication on this machine:
- Installed from GitHub releases binary (no sudo needed).
- Authenticated as `GeremC` via `gh auth login`.
- Git credentials configured via `gh auth setup-git`.

## Notes

- The `Moss-Games/Website` repo on GitHub was empty before the initial commit.
- **Vercel project: `ldpdoc`** (historical name — see `docs/DECISIONS.md` from 2026-09-03
  "Initial deployment incident"). This IS the project that carries the
  `mossgames.fr` / `www.mossgames.fr` domain, already connected to the
  `Moss-Games/Website` repo (`main` branch) via the Vercel GitHub App.
- Vercel Project ID: `prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H` (scope `geremy-cambus-projects`).
