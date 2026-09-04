# Decision log

Each entry: date, decision, why. Goal: a new agent (or human) can understand
the reasoning without having to ask the user again.

## 2026-09-03 — Stack choice: Next.js (JS, not TypeScript)

Decided with the user (direct question, 3 options proposed: Next.js / Vite+React /
static). Next.js chosen for:
- better native integration with Vercel (where the mossgames.fr domain is already connected);
- built-in routing/pages/SEO/image optimization, useful for a multi-page studio site;
- remains pure JS (App Router in `.js`), no TypeScript — explicit user request ("surtout js").

Alternative ruled out: static HTML/CSS/JS site — simpler but less tooling for a site
that will grow (page per game, press, etc.).

## 2026-09-03 — Real content deferred

The user will provide the studio content (games, bio, logo, brand guidelines, contacts)
in a separate follow-up message. For this session: only prepare the technical skeleton
(git repo + Next.js + Vercel link), no invented/detailed placeholder content to avoid
having to undo fake content. The homepage is just a simple message "the site is coming
soon", not the default Next.js/Vercel demo template (which would have been deployed as-is
on mossgames.fr otherwise).

## 2026-09-03 — Direct push to `main`

The user confirmed they want agents to push directly to `main` on the `Moss-Games/Website`
repo, without a manual review step before each push. Every push to `main` triggers a Vercel
production deployment on mossgames.fr (existing GitHub integration, confirmed by user — the
repo was empty before this project).

Implication for future agents: no need to ask for confirmation before a
`git push origin main` on this repo, except for unusual actions (force-push, reset, etc. —
those remain subject to general security rules, never force-push without asking).

## 2026-09-03 — Initial deployment incident: obsolete Root Directory on Vercel project

The very first push did trigger a Vercel deployment, but it **failed**:
`The specified Root Directory "dist" does not exist.` The Vercel project that carries
`mossgames.fr` is called **`ldpdoc`** (project id `prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H`,
scope `geremy-cambus-projects`) — a name inherited from an earlier use of the project to
host the VitePress docs of another repo (`Moss-Games/LesDeuxPelos`, "Les Deux Pelos").
The Git repo connected to the project had already been changed to `Moss-Games/Website`
(by the user, before this session), but two project settings still carried the old config:
- `rootDirectory` = `"dist"` (VitePress build path) → broke every Next.js build
- `framework` = unset

Fixed via the Vercel API (`vercel api /v9/projects/<id> -X PATCH`, after
`vercel login` + `vercel link --project <id>` done by the user):
- `rootDirectory` reset to `null`
- `framework` set to `"nextjs"`

Then `vercel redeploy <deploymentId> --target production` to force a new build with the
correct settings → success, aliased on `www.mossgames.fr`, verified via curl.

**Important for the future**: as long as the old VitePress LDP doc content no longer exists
on this Vercel project, there's no conflict. But the project name (`ldpdoc`) and its
history remain misleading — if a future agent sees a build error mentioning `dist`,
VitePress, or content that doesn't match the Website repo, it's likely a leftover from
this history. Check the Project Settings on vercel.com (Build & Development Settings)
when in doubt rather than starting from scratch.

## 2026-09-04 — All content translated to English

The user requested the entire site be in English. Translated:
- `app/page.js` placeholder text.
- `app/layout.js` metadata (title/description) and `lang` attribute `fr` → `en`.
- All `.md` docs (`README.md`, `docs/STATUS.md`, `docs/DESIGN.md`,
  `docs/DECISIONS.md`, `docs/ONBOARDING.md`).

Why: the site is public-facing on mossgames.fr and the user wants it in English.

## 2026-09-04 — Favicon switched to the baby logo

Previously the favicon fell back to the default Next.js/Vercel icon in some browsers.
Change:
- Added `public/favicon.png` (copy of `public/images/logo.png`).
- `app/layout.js` `metadata.icons.icon` now lists `/images/logo.png` and
  `/favicon.png` explicitly.

Why: ensures the MossGames logo shows in the browser tab across all browsers, not the
Vercel/Next.js default.

## 2026-09-04 — MascotFrame responsiveness fix (huge white side margins)

The user reported enormous white margins left and right of the mascot box in the browser.

Root cause: `.box` used `width: 100%` + `max-width: 72rem` + `margin: auto`. `width: 100%`
resolves to the parent's content width, but combined with `max-width` and `box-sizing`
defaults the box ended up being capped/centered with large gaps, and the `auto` margins
suppressed flex-stretch.

Fix:
- `width: 100vw` so the frame always spans the full viewport.
- `box-sizing: border-box` so the border doesn't inflate the total width.
- `overflow-x: hidden` on `<html>` and `<body>` to prevent a horizontal scrollbar.

Why: full-bleed is the desired look on phones/most laptops, while large monitors get a
capped, centered frame that doesn't stretch absurdly wide.

### Follow-up same day: side margins had disappeared entirely

The `width: 100vw; margin: var(--mascot-frame-margin) 0` fix above zeroed out the
left/right margin, so the box's border sat flush against the viewport edges. The paw
limbs (`.pawLeft`/`.pawRight`), which are positioned to poke out past the border, had no
room to render and got clipped by the new `overflow-x: hidden`.

Fix: `width: calc(100vw - (var(--mascot-frame-margin) * 2))` with
`margin: var(--mascot-frame-margin)` on all four sides (same variable already used for
top/bottom), so the frame keeps a small, consistent gutter on every edge — enough for
the paws to stay visible — without reintroducing the old large centered-gutter look.

## 2026-09-04 — Head/hands now real logo crops, overlapping the page

The user asked for the mascot's head and hands to look like they're actually holding the
site: cropped from the real logo artwork (not generic CSS blobs) and overlapping *onto*
the visible page content, not just poking out past the border. The head in particular
needed to dip down over the top and mask part of the page.

Implementation:
- Wrote a one-off Pillow script (not checked in, not a build step) that masks
  `public/images/logo.png` down to its white character silhouette, recolors that
  silhouette to `--mascot-color` (`#111111`) on a transparent background, then crops the
  head region and one hand region (the other hand is a horizontal mirror of the first,
  since the source art is symmetric). Output: `public/images/mascot-head.png`,
  `mascot-hand-left.png`, `mascot-hand-right.png`.
- `.snout`/`.pawLeft`/`.pawRight` renamed to `.head`/`.handLeft`/`.handRight` in
  `MascotFrame.js` and `MascotFrame.module.css`; they now use these crops as
  `background-image` instead of a flat `background-color` + `border-radius` blob.
- Their `z-index` is now *above* `.content` (was below, like the feet) so most of each
  shape renders on top of the page instead of being hidden by it — this is what makes
  them read as gripping/masking the content rather than just resting behind it.
- `.footLeft`/`.footRight` are untouched (still plain CSS blobs, still below `.content`)
  — out of scope for this request.

Why: matches the "mascot literally holds the page in its arms" concept more literally
than the original placeholder blobs did. See docs/DESIGN.md for the full mechanism and
the CSS custom properties that control size/position/overlap.

Caveat: the crop script isn't committed or wired into any build step. If the source logo
(`public/images/logo.png`) ever changes, the three `mascot-*.png` crops need to be
regenerated by hand with a similar script.

### Follow-up same day: head crop was showing shoulders/body, not just the head

The first `mascot-head.png` crop went too far down (to catch the character's dangling
floppy ear) and pulled in the shoulders/upper torso with it, so the top of the frame read
as a whole upper body poking out, not a head. The user only wanted the head visible there.

Fix: re-cropped tighter — `y: 34–71px` in the source logo, right before the shoulder/arm
silhouette flares out — keeping just the round head and its two ear nubs, dropping the
dangling floppy ear entirely (it's spatially separated from the head by the shoulder line,
so there was no way to keep it without also keeping the shoulder). This changed the crop's
aspect ratio from portrait (~0.77) to a short wide shape (~2.6), so `--mascot-head-width`/
`--mascot-head-height` were resized accordingly.

Known limitation: the source logo is a flat silhouette with no facial detail, so a plain
crop of it reads as a fairly abstract rounded shape with two bumps rather than a clearly
readable "head" once it's small on screen. Flagged to the user as a case where a purpose-
made illustration (hand-drawn or AI-generated from the logo) would read better than a
crop of the existing badge art.

The user tried generating replacement head/hand art with Gemini (fed the logo as a style
reference). First attempt (saved to `~/Downloads`, not part of this repo): usable
silhouette style, but the hands were cropped right at the knuckles (no wrist) with a hard
straight-line cut at the wrist, and the shapes touched the edges of the image canvas
(no transparent padding) — not directly usable as-is. Prompt needs to explicitly ask for
wrist stubs with a smooth/rounded taper (not a straight guillotine cut) and padding around
every shape. See docs/DESIGN.md for the current prompt draft addressing this — it hasn't
been re-run yet, so `public/images/mascot-*.png` are still the plain crops described above,
not Gemini output.

The user also dropped a cleaner digital retracing of the original hand-drawn concept
sketch in `~/Pictures/Untitled.png` (outside the repo) confirming the target composition:
head top-center, hands roughly a quarter of the way down each side, feet bottom-center —
consistent with the current `--mascot-*-offset` values, no repositioning needed from it.

## 2026-09-04 — Inverted palette: black site background, white/off-white mascot

The user asked for the site's background to be black and the mascot character white.
Clarified in a follow-up: the *outer* page background (`<body>`, the margin around the
frame) is black, but the *held page itself* (`.content`, inside the frame — what a visitor
actually reads) stays white. Only the mascot (border, head, hands, feet) is the
off-white/light color.

Changes:
- `app/globals.css`: `--background` → `#0d0d0d` (near-black), `--foreground` → `#fafaf7`
  (off-white). These are read by both `body` and `MascotFrame.module.css` (CSS custom
  properties aren't scoped by CSS Modules), so the whole site now shares one palette
  instead of duplicating hex values. Removed the old "no dark-mode variant" comment since
  the site now commits to a single fixed dark theme by design, not as a gap to fill later.
- `MascotFrame.module.css`: `--mascot-color` now reads `var(--foreground)` (border/feet/
  head/hands). `--mascot-content-bg` is its own explicit `#ffffff` — deliberately *not*
  tied to `--background`, since the held page is supposed to be the opposite tone from the
  site background, not match it.
- `public/images/mascot-head.png` / `mascot-hand-left.png` / `mascot-hand-right.png`
  regenerated (same crop regions as above) with the silhouette recolored to `#fafaf7`
  instead of black.

Side effect caught during review: with the head/hands now off-white and `.content` now
white, the parts of the head/hands that overlap the page (see the "real logo crops"
decision above) were nearly invisible — off-white on white is barely distinguishable, and
the whole point of that overlap is for it to read as the mascot masking part of the page.
First fix was a single soft `drop-shadow` — worked, but read as a blurry shadow rather than
a deliberate design element.

Follow-up: the user confirmed the intended look is "white with a small black outline," so
the soft shadow was replaced with `--mascot-outline` on `.box` — eight stacked
zero-blur `drop-shadow()`s (1px in each of the 8 compass directions) applied via
`filter: var(--mascot-outline)` on `.head`/`.handLeft`/`.handRight`. This fakes a crisp
~1px solid black stroke around the transparent PNG's silhouette (a single `drop-shadow`
can't produce a stroke — it only offsets+blurs the whole alpha shape once, so stacking
several 1px offsets in different directions is the standard CSS trick to approximate an
outline). This is still a CSS-side patch, not a real outline baked into the art — see the
updated Gemini prompt below, which now explicitly asks for "a crisp solid black outline
stroke (2–3px)" instead of a soft dark edge, so future art can drop this filter entirely.

`app/page.js` text was already dark (`text-zinc-900` / `text-zinc-600` via Tailwind, not
inherited from `body`'s color), so it needed no change to stay readable on the now-white
`.content` background.

## 2026-09-04 — Head/hand artwork replaced with Gemini illustrations

Followed the prompt drafted in the previous entries. Full process (prompt text, the
JPEG/checkerboard extraction gotcha, why the middle/bottom sprites map to right/left hand)
is documented in docs/DESIGN.md's "Generating the head/hand artwork with AI" section —
this entry only covers the review fixes applied after first integrating that output.

Two bugs found once the new art was in place, both fixed same day:

1. **Hands were backwards.** The Gemini sprite sheet had one hand with fingers-right/
   wrist-left and another with fingers-left/wrist-right. Naively assigning "middle sprite →
   left hand, bottom sprite → right hand" (the visual reading order) put the *wrist* on the
   side that overlaps `.content` and the *fingers* out in the black margin — backwards from
   how a hand gripping the page should look (fingers reaching onto the page, wrist coming
   from behind/outside). Worked out the correct mapping from the `.handLeft`/`.handRight`
   CSS transforms (which part of each element's box ends up inside vs. outside the border)
   and swapped which file is `mascot-hand-left.png` vs `mascot-hand-right.png` accordingly
   — no CSS changes needed, just the two files' contents.
2. **The neck hung too far down.** The generated head included a long tapering
   neck/body-connector stroke (visually similar to the logo's floppy ear) that dangled deep
   into `.content` — the user wanted only the head visible, with the neck effectively
   "hidden by the frame." Fixed by cropping `mascot-head.png` itself (Pillow, using the same
   row-width-scan technique as the earlier plain-crop iteration) at the point where the
   round head's natural curve stops and the isolated neck stroke begins — leaving a
   near-complete round head silhouette with only a small stub of the neck line remaining,
   short enough to read as "tucked behind the border" rather than a dangling body part.

Also **scaled the head/hands up 1.3x** per the user's request (feet untouched) —
`--mascot-head-width`/`-height` and `--mascot-hand-width`/`-height` (desktop and the
`@media (max-width: 640px)` block) increased proportionally, recomputed for the new crop's
aspect ratio (~1.11, close to square, now that the long neck is gone — previously ~0.86).

### Follow-up same day: the neck-crop above cut into the muzzle, not just the neck

The row-width scan showed a sharp jump in the shape's left edge between two sample rows and
that was read as "the round head closes here, only the neck continues below" — but the cut
line picked from that (before re-verifying against the actual pixels) landed 2-4px *before*
the muzzle's curve actually finished closing, not after. Visually this left the muzzle with
a flat, open edge instead of its natural closed curve — the user immediately spotted it
("tu as coupé le museau"), since the round head is the shape that has to read cleanly; the
neck is the part that's supposed to disappear.

Fixed by re-extracting the head from the original Gemini sprite sheet (rather than
re-cropping the already-cropped file, which was compounding coordinate/padding offsets and
making it harder to reason about exactly where each cut landed) and re-scanning row widths
at 2px resolution right around the suspected closure point to find the true jump — from
width 321 at one row to 156 two rows later, meaning the muzzle's own curve fully closes in
that 2px gap. Cut a few pixels *after* that point (not before), which keeps the muzzle's
closing curve completely intact and leaves only a very short, clean neck stub. Lesson: when
cutting a traced/generated silhouette at a shape boundary, confirm the exact row where the
width jump happens (and cut just past it) rather than approximating from a coarser scan.

## 2026-09-04 — Correction: the long dangling shape is the nose, not a neck to shorten

Everything above about "cropping the neck" was based on a misreading. The character in
`public/images/logo.png` is an **anteater** (tamanoir) — the long tapering shape drooping
from the head is its **nose**, a defining feature, not a neck/floppy-ear stub to trim away.
The user had been iterating separately with Gemini (chat exported to a PDF, reviewed for
context) trying to get better head/hand art; Gemini kept misunderstanding the same way this
project's earlier sessions did, alternately drawing the head with no nose at all or an
overly short one, and the user eventually gave up on that thread ("Gemini est perdu") and
asked to fix it here directly using the assets already on hand instead.

Fix: re-extracted `mascot-head.png` from the original Gemini sprite sheet
(`~/Downloads/Gemini_Generated_Image_2vd5cx2vd5cx2vd5.jpeg`) keeping the **full-length
nose intact** — no cropping at the nose/head junction at all. This is very close to the
very first (pre-"neck fix") integration from earlier today; the intervening crop attempts
were solving the wrong problem.

### What "hide the neck" actually means: a reference crop, not a length trim

The user then provided the real target as an image (`~/Pictures/refcrop.png`): the
full-nose head above, with a red scribble marking a region on the **round head's own
bottom-left** — not the nose at all — as "this part should be cut away, it's hidden behind
the frame." In other words: the head's own base (where a neck/body would attach, on the
side away from the nose) is what needs to disappear; the nose stays completely intact
because it's the part meant to dip onto the page.

Applied that exact crop, mapped from the reference image onto the actual asset:

- Detected the red scribble by color (`r>150, g<100, b<100`), then closed the scribbled
  zigzag into a solid region: dilate (`MaxFilter`) until the strokes merge into one blob,
  then flood-fill from the canvas border to fill in any small enclosed gaps that dilation
  alone didn't close (rather than eroding back down, which reintroduced gaps — filling is
  more robust for a rough hand-drawn scribble than a dilate/erode "closing").
- Aligned `refcrop.png`'s coordinate space to the actual asset's by comparing the bounding
  box of near-black outline pixels in both images — they matched almost exactly in size
  (~590×694 vs ~588×694), just offset by a constant `(46, 112)` translation (the reference
  image had extra padding added around it before being annotated). No scaling needed.
- Cut (set alpha to 0) every pixel in `mascot-head.png` whose translated coordinate fell
  inside the filled red region, then re-trimmed to the new content bounding box.

Result: the round head now has a clean, deliberate **open edge** (no closing outline
stroke) on its lower-left, while the rest of the circle and the entire nose are untouched.
`--mascot-head-overlap` was changed from `-15%` to `-35%` so that open edge lands right at
the box's border line — from a normal viewing distance it reads as the head emerging from
behind the frame, not as a broken/incomplete shape. If `--mascot-head-width`/`-height` or
the border/margin sizing changes later, re-check that this open edge still lines up with
the border rather than floating visibly in the margin or content.

### Hands: reverted to the Gemini art, a custom scalloped-paw redraw was a step backward

Independently, mid-fix, an attempt was made to replace the Gemini hand art with a hand-
drawn (PIL primitives: capsule + overlapping circles) scalloped paw, reasoning that the
user's separate Gemini chat had called the hands "too human." The user clarified: keep the
Gemini hands as they were (`mascot-hand-left.png`/`mascot-hand-right.png` from
`~/Downloads/Gemini_Generated_Image_2vd5cx2vd5cx2vd5.jpeg`, the wrist+fingers art already
integrated earlier) — the "too human" feedback was about a *different, later* Gemini
attempt the user was exploring separately, not a rejection of what's already on the site.
Re-extracted the original two hand crops (same left/right mapping as before — see the
"hands were backwards" decision above) to undo the scalloped-paw detour.

## 2026-09-04 — Head cut edge needs its own outline; feet are now real art too

Two more fixes the same day, after the reference-crop fix above:

**The cut edge had no outline, and read as invisible against the white page.** The reasoning
at the time was "this edge should be hidden behind the frame, so it doesn't need a stroke" —
but wherever that edge actually sits over the white `.content` (not pure black margin), a
white-fill shape with no black stroke against a white page is just invisible, which is what
the user hit ("carré blanc sur blanc, on voit rien"). Fixed by drawing a new black outline
band (~6px, matching the existing stroke width elsewhere) along the cut boundary itself —
computed as: dilate the (translated) cut-region mask by the stroke width, intersect that
with what remains of the head after cutting, and paint that intersection black. This adds a
stroke exactly where the cut exposed a raw edge, without touching the outline anywhere else
on the shape. The line follows the original hand-scribbled reference exactly, so it's a bit
wobbly rather than perfectly smooth — acceptable for now, matches the hand-drawn feel of
the other assets.

**Feet are now real logo crops**, not CSS blobs — same masking technique as the head/hands
(extract the white leg silhouette from `public/images/logo.png`, upscale with a blur pass
before thresholding to smooth the small source's jagged edges, add the same outline
treatment). `public/images/mascot-foot-left.png` / `mascot-foot-right.png`, referenced by
`.footLeft`/`.footRight` in place of the old `border-radius` blob + `background-color`.
They stay a background layer (z-index below `.content`, unchanged mechanic — only the
outward half is visible) per the user's request; only the artwork changed. Also lowered how
far they poke out (`--mascot-foot-drop` from the old hardcoded `-60%` to `-40%`) so more of
each foot is visible below the border, per "descends un peu les pieds... dépasser sous le
cadre."

### Follow-up: outline thickness was wildly inconsistent between assets

Comparing screenshots, the head's outline looked much thicker than the hands', and the
feet's was barely visible at all. Root cause: each asset's outline was some fixed pixel
width *in its own source image*, but the assets are displayed at very different CSS sizes
(head ~125px wide, hands ~96px, feet ~55-58px) — the same source-pixel outline becomes a
very different on-screen thickness depending on how much the browser scales that image
down. The feet in particular were extracted from a tiny region of the 288px logo and
upscaled, so their outline (a few px in a ~450px source) shrank to under half a pixel once
displayed at ~56px — effectively invisible.

Fixed by re-deriving every outline from a **target on-screen thickness** instead of a fixed
source-pixel width: took the hands' current look as the reference (~1.6px on screen at
their ~96px display width), then for the head and both feet, computed
`native_outline_px = target_screen_px * native_image_width / css_display_width` and
re-stroked each shape at that thickness — erode the shape's alpha mask by that many pixels,
the eroded-away band becomes the new outline (black), the rest stays fill color. This
replaces whatever outline thickness the source art happened to have with one sized
correctly for how large the element actually renders, and doubles as a clean way to
guarantee the head's cut-edge outline (added in the fix above) matches the rest of its own
outline exactly, since the whole shape gets re-stroked in one pass.

If `--mascot-head-width` or the foot width custom properties change significantly later,
these on-screen outline thicknesses will drift again and may be worth recomputing the same
way (there's no build step that keeps them in sync automatically).

## 2026-09-04 — Head cut redone as a clean straight line; alignment fixed

Two more rounds of feedback on the head cut:

**The cut line looked wobbly/jagged**, and its left edge didn't read as "organic" where it
met the nose. Both traced back to the same cause: the cut boundary was the raw, hand-
scribbled red-mask shape from `refcrop.png`, followed pixel-for-pixel — inherently uneven,
since it's a mouse scribble. Replaced with a **geometrically clean cut**: the nose's left
edge is actually drawn as a visible line *inside* the head's fill (not just the outer
silhouette boundary) — traced it by scanning each row for a black run with fill on both
sides (an "internal" stroke, as opposed to the outer boundary which has transparency on one
side). That internal line starts at a sharp corner around `(335, 300)` in the source
sprite — the point where the muzzle's round curve gives way to the nose's straight taper.
The new cut is: a **perfectly straight horizontal line** from the muzzle's outer left edge
over to that corner, then follow the nose's own (already smooth, hand-drawn) left edge for
everything below — so the "organic" part is literally the original artist's line, not a
scribble trace. The old red-mask cut is still unioned in underneath (below/left of the new
line) to clean up a stray bit of the muzzle's own chin/jaw curve that would otherwise be
left floating disconnected once the area around it was cut away. Re-ran the same uniform
outline pass (see the entry above) afterward so the new straight edge matches the rest of
the shape's stroke weight.

**The cut didn't line up with the border.** Measured where the new cut sits as a fraction
of the image's height (`296/716 ≈ 41%`) and set `--mascot-head-overlap` to `-41%`
accordingly (was `-35%`, tuned for the old cut's different position). At that overlap the
head needs ~60px of headroom above the border to not get clipped by the viewport — more
than the existing `2.5rem` (40px) `--mascot-frame-margin` allowed, which is why the first
attempt at this rendered with the head's ears cut off at the top of the page. Increased
`--mascot-frame-margin` to `4.5rem` (desktop) / `3rem` (mobile, was `1.25rem`) to give it
room. This also incidentally gives the hands/feet a bit more breathing room on the sides
and bottom, which lines up with the earlier "let the feet drop further" request rather than
working against it.

Also moved both hands to `--mascot-hand-left-offset-y` / `-right-offset-y: 35%` (were
`38%`/`46%`) per a direct request to bring them higher and closer to each other vertically.

### Follow-up: the new cut still showed two nearly-parallel lines

The straight cut (previous entry) fixed the wobble, but introduced a different artifact: a
short stray line visible just below the main cut, near where it meets the round head's own
left edge. Cause: the fix kept the *original* muzzle boundary untouched for
`y <= Y_CUT`, then added the new straight line starting exactly at `Y_CUT` — but the
original boundary's natural curve doesn't reach the same point the straight line starts
from, so both ended up drawn, close together but not coincident.

Fixed by replacing the *entire* transition (not just adding a line on top of it): for the
band from the shape's own leftmost point down to the corner where the nose begins, classify
every pixel by which side of the straight line A→B it falls on (a proper two-point
half-plane test, not a Y-based threshold) and remove anything on the wrong side — the
original curve in that band is gone, not just occluded, so there's only one boundary left,
not two. A plain infinite-line test doesn't work for the *whole* image (points far from the
segment, like the nose tip, end up on the "wrong" side of the extended line), so this test
is only applied within the transition band; beyond the corner, the earlier internal-nose-
line threshold takes back over. The line segment is also drawn slightly past both of its
endpoints (extended ~10-15%) so it visibly overlaps whatever it's connecting to, rather than
leaving a hairline gap. Re-ran the uniform outline pass afterward, which further smoothed
what small seams remained.

### Follow-up: header/hand alignment retuned, plus a note on the feet

Nudged `--mascot-head-overlap` slightly further (to `-43%`) for a small additional lift
requested directly. Re-verified this still fits inside `--mascot-frame-margin` on both the
desktop and `@media (max-width: 640px)` values (it does, with margin to spare) — worth
re-checking any time the head's height or overlap changes again, since these two values are
coupled and nothing enforces that automatically.

On the feet being "still not in the background": re-verified concretely (via a headless
browser's computed styles, not just visual inspection) that `.footLeft`/`.footRight` render
at `z-index: 1`, `.content` at `z-index: 2`, and that each foot's bounding box straddles
`.content`'s bottom edge with the portion inside `.content`'s bounds correctly occluded —
this matches the intended "background layer, only the outward half visible" mechanic
exactly as implemented for the original placeholder blobs. No code path was found that
would put the feet above `.content`. If this still doesn't match what's visible on screen,
the cause is more likely something other than z-index (e.g. the feet's now-thicker, more
detailed outline reading as visually "foreground-weight" even while technically layered
behind the page) — flagged back to the user rather than guessed at further.

### The actual bug: a foot crossing the border visually broke the border line

Turned out there *was* a real bug, just not in `.content`'s z-index. `.box`'s border is
painted as part of the box's own background/border layer, and **a parent's own border
always paints before (behind) its positioned children** — there is no z-index value on a
child that puts it behind its own parent's border. So `.footLeft`/`.footRight`
(`z-index: 1`) always painted on top of `.box`'s border wherever a foot's shape crossed it,
covering that section of the border ring with the foot's fill — the foot looked like it
broke *through* the frame rather than emerging from behind it. Confirmed by zooming into a
screenshot at that exact crossing point: the border line visibly stopped where each foot
crossed it.

Fixed with a second element, `.frame` — a duplicate of `.box`'s border (same width, color,
radius), absolutely positioned at `inset: 0`, `pointer-events: none`, at a z-index *between*
the feet and the head/hands (`.content: 2`, `.frame: 3`, head/hands bumped from `3` to `4`
to stay above it). It's pixel-identical to the real border everywhere except where it now
also paints over the feet, patching the crossing without affecting how the head/hands cross
the border (they're still meant to overlap on top, unaffected since they're above `.frame`
too).

### Head reverted to the pre-straight-cut version

Per direct request, rolled `mascot-head.png` back to the state right after the outline-
consistency fix — full nose, the *original* reference-image cut (not the later straight-
line rework), re-run through the same uniform-outline pass. The straight-cut geometry
experiments above are left in history for context but are no longer what's deployed.

## 2026-09-04 — "MOSS" / "GAMES" wordmark added, flanking the head

The user asked for the studio name split around the mascot's head — "MOSS" in the top
margin to the left, "GAMES" to the right, both white, set in a specific font: **Super Corn**
by Ali Hamidi ([fontspace.com/super-corn-font-f102376](https://www.fontspace.com/super-corn-font-f102376)),
freeware, free for personal and commercial use. It isn't on Google Fonts, so it's
self-hosted: downloaded, saved as `app/fonts/SuperCorn.ttf`, and wired up with
`next/font/local` in `app/layout.js` (exposed as the `--font-super-corn` CSS variable,
same pattern as the existing Geist fonts).

`.brandLeft`/`.brandRight` in `MascotFrame.module.css` are plain text spans, positioned
in the top margin band (vertically centered via `top: calc(var(--mascot-frame-margin) / -2)`
+ `transform: translate(-50%, -50%)`, so they automatically stay centered in that strip
if the margin height changes), horizontally on either side of the head with enough
clearance (`--mascot-brand-left-x`/`-right-x`: `22%`/`82%` desktop, `15%`/`88%` mobile).
Not part of `.limb` (they're not a body part poking through the border), and
`pointer-events: none` + `user-select: none` since they're decorative, layered with the
rest of the frame furniture.

