# Project status

Last updated: 2026-09-03

## Where we are

The repo has just been initialized. It's a minimal Next.js skeleton, with one real
content element (the logo) but not much else:

- Next.js (App Router) structure in place, with Tailwind CSS v4 configured.
- Single page (`app/page.js`): placeholder "MossGames — the site is coming soon".
- **Logo integrated** (`public/images/logo.png`) and used as favicon.
- **"Mascot holding the site in its arms" visual concept implemented**:
  `app/components/MascotFrame.js` wraps the entire site (wired in `app/layout.js`),
  using simple CSS shapes (no illustrated artwork yet) for the snout, paws, and feet
  poking out of the frame. Details + how to adjust: [docs/DESIGN.md](DESIGN.md).
- Still no other real content (game descriptions, studio bio, full brand guidelines,
  contact info, social links) — see `docs/DECISIONS.md` from 2026-09-03.
- Git repo initialized and pushed to `main` on `Moss-Games/Website` (GitHub), linked to Vercel
  → **confirmed live** on mossgames.fr with the placeholder page (verified via curl).

## Pitfall already encountered: flex + children in `position: absolute`

In `MascotFrame.module.css`, `.box` is a flex child of `<body>` (`flex flex-col`)
but all its own children (`.content`, the `.limb` elements) are `position: absolute` —
so there's no "in-flow" content to give it a natural width. Observed behavior when testing
in a browser: without explicit `width: 100%` on `.box`, the box collapses to near-zero
width (the `auto` margins disable the default flex stretch, and nothing else calculates a
width). Fixed by adding `width: 100%` — see the comment in the file. Keep this in mind if
`.box` is ever restructured.

## Expected next step

The user (Geremy) needs to provide the actual studio content in a follow-up message:
game names/descriptions, studio bio, logo, brand guidelines (colors/fonts),
contact info, social media links, desired page structure (home, games, about,
press/news, contact?).

Once this content is received:
1. Update this file with the new status.
2. Build the real pages (likely `app/games`, `app/about`, `app/contact` or
   equivalent based on the requested structure).
3. Add the logo/assets to `public/`.
4. Adjust the Tailwind brand theme (`app/globals.css` / config) to match brand colors.
5. Commit + push to `main` (auto Vercel deployment confirmed by user, see decisions).

## Notes

- The `Moss-Games/Website` repo on GitHub was empty before this initial commit.
- GitHub auth uses SSH (key already configured on the machine, tested OK with the
  GitHub account `GeremC`).
- The `vercel` CLI is installed and **connected** (account `geremc`, logged in on 2026-09-03).
  Folder linked to the Vercel project via `vercel link --project prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H`
  (`.vercel/` directory created, gitignored).
- **Vercel project: `ldpdoc`** (historical name, to be renamed one day — see
  `docs/DECISIONS.md` from 2026-09-03 "Initial deployment incident"). This IS the project
  that carries the `mossgames.fr` / `www.mossgames.fr` domain, already connected to the
  `Moss-Games/Website` repo (`main` branch) via the Vercel GitHub App — no need to reconnect.
- Vercel Project ID: `prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H` (scope `geremy-cambus-projects`).
