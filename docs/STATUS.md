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
  - `.box` now uses `width: calc(100vw - (var(--mascot-frame-margin) * 2))` with an equal
    margin on all four sides, so the frame spans edge-to-edge with a small consistent
    gutter (enough for the head/hands to stay visible) instead of huge centered gaps.
  - `overflow-x: hidden` on `<html>` and `<body>` to prevent horizontal scrollbar.
  - `box-sizing: border-box` to prevent border from adding to the width.
- **Mascot head/hands overlap the page, gripping/masking it** (2026-09-04):
  `.head`/`.handLeft`/`.handRight` render *above* `.content`, so they visibly grip/mask
  part of the page instead of just poking out past the border. Feet stay a background
  layer (below `.content`, only the outward half visible) but are now real logo art too,
  not CSS blobs — see below.
- **Mascot head/hands are now Gemini-illustrated artwork**, not plain logo crops
  (2026-09-04): `public/images/mascot-head.png`, `mascot-hand-left.png`,
  `mascot-hand-right.png`, generated from a prompt built around `public/images/logo.png`
  as the style reference (prompt + extraction process in `docs/DESIGN.md`). White fill with
  a black outline baked into the art itself (no CSS drop-shadow trick needed anymore).
  Hands are sized/mirrored so fingers (not the wrist) are the part overlapping the page.
  Sized up 1.3x from the initial integration per user feedback.
  Full history of the iterations (plain crop → first Gemini attempt → current) in
  `docs/DECISIONS.md`.
- **The mascot is an anteater — its long nose is a feature, kept at full length**
  (2026-09-04): earlier same-day passes mistook the nose for a neck/floppy-ear stub and
  progressively cropped it short; corrected. What actually gets cropped is the round
  head's own base on the side away from the nose (roughly where a neck would attach),
  matched exactly to a reference image the user provided; that cut edge has its own
  black outline stroke added (matching the rest of the shape) so it doesn't disappear
  against the white page. Details: `docs/DESIGN.md`, `docs/DECISIONS.md`.
- **Feet are now real logo crops** (2026-09-04): `public/images/mascot-foot-left.png`,
  `mascot-foot-right.png`, extracted from `public/images/logo.png` the same way as the
  head/hands. Still a background layer (below `.content`, verified via computed
  `z-index`/bounding-box, not just visual inspection), just real art instead of a CSS
  blob, and poking out further below the border than before.
- **Head's cut edge is a clean straight line, aligned with the border** (2026-09-04):
  replaced the earlier hand-scribble-traced cut with a geometric one (see
  `docs/DECISIONS.md`), and retuned `--mascot-head-overlap` (`-43%`) and
  `--mascot-frame-margin` (`4.5rem` desktop / `3rem` mobile, was `2.5rem`/`1.25rem`) so
  the cut lines up with the top border without the head's ears getting clipped by the
  viewport. Hands moved higher too (`--mascot-hand-*-offset-y: 35%`, were `38%`/`46%`).
- **Inverted color palette: black site background, white mascot + white held page**
  (2026-09-04): `--background`/`--foreground` in `app/globals.css` are `#0d0d0d`/
  `#fafaf7`; the mascot (border/feet/head/hands) uses `--foreground`, while `.content`
  (the page a visitor actually reads) is its own explicit `#ffffff`, independent of
  `--background`. Details: `docs/DESIGN.md`, `docs/DECISIONS.md`.
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
