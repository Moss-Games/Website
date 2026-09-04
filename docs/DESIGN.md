# Design — the mascot holds the site in its arms

## The concept

Idea provided by Geremy, with this sketch as reference:

![Sketch of the concept: the site is a box held by the mascot, whose snout, paws, and
feet poke out past the edges](design/mascot-hug-sketch.png)

All site content lives inside a box. The studio mascot — an **anteater** (see
`public/images/logo.png`; its long nose is a defining feature, not a neck or floppy ear,
despite how it reads at a glance) — is **behind** this box, hugging it tight. We don't draw
the full animal — only the extremities that stick out past the rectangle are visible:

- the head, tilted, poking out at the top, its long nose **dipping down onto the page**,
  masking part of it — it's meant to visibly hold/cover the content, not just peek from
  behind it. The head is cropped on its own lower-left (roughly where a neck would attach,
  on the side away from the nose) so that cut edge sits behind the border, not the nose;
- the two hands, gripping the left and right edges, also reaching **onto** the page;
- the two feet, pointing out below the bottom edge (still behind the page, just poking out).

The rest of the body is implicitly hidden behind the content box.

## How it's implemented

Component: [`app/components/MascotFrame.js`](../app/components/MascotFrame.js) + its CSS
[`app/components/MascotFrame.module.css`](../app/components/MascotFrame.module.css).

Used once, in [`app/layout.js`](../app/layout.js), to wrap the entire site (`{children}`) —
so the frame is present on every page, not just the homepage.

**The head and hands are real illustrated artwork**, not generic blobs:
`public/images/mascot-head.png`, `mascot-hand-left.png`, `mascot-hand-right.png`. These are
AI-generated (Gemini) from a prompt built around `public/images/logo.png` as the style
reference — see "Generating the head/hand artwork with AI" below for the prompt and the
extraction process. There's no build step that regenerates these; if the source logo or the
desired look changes, re-run that process by hand. The feet are still plain `<span>`
elements styled with `border-radius` (pure CSS) — no illustrated art for them yet.

1. `.box` is a rectangle with a thick black border (`--mascot-color`): this border
   represents the arms/body outline.
2. `.head`, `.handLeft`, `.handRight` are positioned **centered on the border line**, same
   as the feet, but unlike the feet they sit **above** `.content` in z-index — so most of
   each one overlaps onto the visible page instead of being hidden behind it.
3. `.footLeft` / `.footRight` are still centered on the border with the feet sitting
   **below** `.content` (higher z-index on content), same mechanism as before: `.content`
   hides their inner half, so only the outward-poking half is visible.

The feet remain undetailed placeholders. See the next section for evolving them into real
artwork the same way the head/hands were done.

## How to tweak

Everything is controlled via **CSS custom properties** defined at the top of `.box` in
`MascotFrame.module.css` — no need to touch the JSX for a common adjustment:

| Variable | Purpose |
| --- | --- |
| `--mascot-color` | Color of the border/feet, and the tint baked into the head/hand crops |
| `--mascot-content-bg` | Background of the content area (hides the feet's inner half) |
| `--mascot-border-width` / `--mascot-border-radius` | Border thickness and roundness |
| `--mascot-frame-margin` | Margin around the box (space where limbs can poke out) |
| `--mascot-head-offset-x` / `-width` / `-height` / `-rotation` | Head position, size, angle |
| `--mascot-head-overlap` | How far the head dips down onto the page (translateY) |
| `--mascot-hand-width` / `-height` | Hand size (shared by both) |
| `--mascot-hand-left-offset-y` / `-right-offset-y` | Vertical position of each hand |
| `--mascot-hand-left-reach` / `-right-reach` | How far each hand reaches onto the page (translateX) |
| `--mascot-foot-width` / `-height` / `--mascot-foot-left-x` / `--mascot-foot-right-x` | Foot size, horizontal position of each |

A `@media (max-width: 640px)` block at the bottom of the file redefines these same variables
to proportionally scale down the frame on mobile — same logic, no separate rules to maintain.

### Moving to real illustrated artwork

Done for the head and hands — see "How it's implemented" above. The feet are still a plain
CSS blob (`background: var(--mascot-color)` + `border-radius`); to give them the same
treatment, mask+crop the logo's leg/foot region the same way and swap that rule for a
`background-image: url(...)`. The positioning logic (centered on the border) stays valid as
-is — only the visual rendering changes. Whether a foot should also overlap `.content` (like
the head/hands now do) or stay tucked behind it (current behavior) is a design call to make
when that art is ready.

## Moss on the frame (tried and removed)

Procedurally-generated moss decoration (SVG circle-fusion "goo" blobs) was
tried on the frame's corners and edges over several rounds on 2026-09-04, then
removed the same day — it never landed on a look the user was happy with
across multiple attempts (round clumps overlapping the content, then
contained-but-round, then a wavy arc, then a thicker arc that still read as
visually "broken" next to a nearby separate piece). Full history — including
why each attempt didn't work and what to maybe try differently next time (real
illustrated art instead of procedural circles) — is in `docs/DECISIONS.md`.
There is currently no moss on the site.

## Color palette

Deliberately a single fixed dark theme — no `prefers-color-scheme` variant:

| Token | Value | Used for |
| --- | --- | --- |
| `--background` (`app/globals.css`) | `#0d0d0d` | `<body>` — the site's outer/ambient background (outside the frame) |
| `--foreground` (`app/globals.css`) | `#fafaf7` | Body text color, and reused as `--mascot-color` |
| `--mascot-color` (`MascotFrame.module.css`) | `var(--foreground)` | Border, feet, and the head/hand artwork's fill color |
| `--mascot-content-bg` (`MascotFrame.module.css`) | `#ffffff` (own value, not tied to `--background`) | `.content` — the held page itself |

The held page (`.content`) is intentionally the *opposite* tone from the site background:
black ambient background, white page, off-white mascot gripping it. `app/page.js`'s text
uses its own dark Tailwind classes (`text-zinc-900`/`text-zinc-600`), not the inherited
body color, so it stays readable on that white background regardless of `--foreground`.

Because the mascot is off-white and overlaps a white `.content` (see "How it's implemented"
above), the overlapping parts of `.head`/`.handLeft`/`.handRight` need *some* dark edge to
stay legible — off-white on white has almost no contrast. That edge is baked directly into
the artwork itself (a black outline stroke around the white fill, from the Gemini prompt
below) rather than added in CSS — an earlier version faked the outline with eight stacked
1px `drop-shadow()`s, but that's no longer needed now that the art carries its own outline
natively (and doubling both looked noticeably thicker/chunkier — see the follow-up decision
in docs/DECISIONS.md).

- The logo (`public/images/logo.png`) also serves as the favicon (`app/layout.js`,
  `metadata.icons.icon`). It stays black-on-transparent — only the in-page mascot crops
  were recolored, not the favicon/logo file itself.

## Generating the head/hand artwork with AI

`mascot-head.png`/`mascot-hand-left.png`/`mascot-hand-right.png` are Gemini-generated,
not crops of the logo. Two earlier iterations (plain Pillow crops of the logo, then a first
Gemini attempt) are recorded in `docs/DECISIONS.md` for context on why the prompt below
looks the way it does — this section only documents the current, working process.

**1. Prompt sent to Gemini**, with `public/images/logo.png` attached as the style reference:

> Using the attached logo as the exact style reference, generate 3 separate
> transparent-background PNG illustration assets of the same mascot character, redrawn as
> a clean flat white silhouette (color `#fafaf7`) instead of black, with a crisp solid
> black outline stroke (2–3px, solid black, not blurred or low-opacity) around the entire
> silhouette edge so it stays legible on both dark and light backgrounds.
>
> 1. **Head** — a clear, front-facing head (round head, two small ears, one floppy ear
>    draping down on one side, matching the logo's proportions), cropped tightly with no
>    shoulders or body. Must read clearly as a head even at small sizes.
> 2. **Left hand** — a hand/paw at the end of a short forearm stub, including the wrist
>    (not just the fingers), with the arm end tapering into a smooth, softly rounded
>    natural edge — not a hard straight guillotine cut.
> 3. **Right hand** — mirror of the left hand, same treatment.
>
> Leave generous transparent padding on every side so no part of any shape touches the
> image's edges. Flat vector silhouette style, no gradients, no textures, no baked-in drop
> shadow (the app adds its own). Each asset as its own transparent PNG, tightly cropped
> with padding, at least 500px on the longest side.

**2. Gemini's output was a JPEG, not a transparent PNG** — it drew a checkerboard pattern
*into the image content* to represent transparency rather than producing real alpha, and
returned all 3 assets stacked in one image instead of 3 separate files. (`.jpeg` also can't
carry alpha at all, so even a straight "make transparent pixels transparent" pass wasn't an
option — the checkerboard was the only signal.) Extracting real assets needed one more step,
done with a one-off Python/Pillow script (not committed, not a build step — re-run something
similar if this ever needs redoing):

- Split the sprite sheet into 3 regions by finding horizontal gaps with no dark (outline)
  pixels between them.
- Per region, flood-filled inward from the image border across non-outline pixels only
  (an "outline" pixel = `max(r,g,b) < 140`) to identify checkerboard background —
  the black outline acts as a wall the flood fill can't cross, so it naturally stops at each
  shape's boundary without leaking into the enclosed white interior. This matters because
  the interior fill color and the checkerboard's white squares are nearly identical
  (`~(248,248,245)` vs `(255,255,255)`) — a color-threshold approach can't tell them apart
  reliably, but flood-fill-bounded-by-outline doesn't need to.
- Background pixels → alpha 0; outline pixels → opaque black; interior → opaque
  `#fafaf7`. Trimmed each result to its content bounding box with a little padding.
- Middle sprite (fingers pointing right, wrist tapering left) → `mascot-hand-left.png`;
  bottom sprite (fingers pointing left, wrist tapering right) → `mascot-hand-right.png`.
  **This is the opposite of the "obvious" reading-order mapping** — a first pass assigned
  them the other way round and it looked backwards on the page (see docs/DECISIONS.md):
  since `.handLeft` overlaps `.content` on its *right* side (`left:0`, translated inward)
  and `.handRight` overlaps on its *left* side (`left:100%`, translated inward), the part of
  the source image that should carry the *fingers* (the part meant to grip the page) is the
  side of the sprite that lands on the overlapping side of each element, not the side facing
  the frame's own edge. Get this backwards and the wrist ends up "gripping" the page while
  the fingers point off into the margin.

**3. The long tapering shape drooping from the head is the anteater's nose** — a defining
feature of the character, not a neck or floppy ear to shorten. Earlier same-day iterations
misread it as excess "body" and progressively cropped it down to a stub before this was
caught (see docs/DECISIONS.md's "Correction: the long dangling shape is the nose" entry).
`mascot-head.png` now keeps the nose at full length.

**4. What actually needed cropping**: the round head's own base, on the side *away* from
the nose — roughly where a neck/body would attach if the rest of the animal were drawn.
The user supplied the exact target as a reference image (a screenshot of the full-nose
head with the region to remove scribbled in red) rather than a verbal description, since
that had been the repeated source of confusion. The crop was derived by detecting the red
scribble, closing it into a solid region (dilate, then flood-fill from the canvas border to
patch small gaps — more robust than eroding back down for a rough hand-drawn scribble),
aligning its coordinate space to the actual asset via the black-outline bounding box in
both images, and cutting (alpha → 0) accordingly. Full technical steps in
docs/DECISIONS.md. The result is a deliberate open edge (no outline stroke) on the head's
lower-left, positioned (`--mascot-head-overlap: -35%`) to sit right at the box's border
line so it reads as tucked behind the frame rather than an incomplete shape.

**5. Sizing in CSS**: the final art's aspect ratios differ a lot from the old plain crops,
and were additionally scaled 1.3x per the user's request (feet untouched).
`--mascot-head-width`/`-height` and `--mascot-hand-width`/`-height` in
`MascotFrame.module.css` (both the desktop values and the `@media (max-width: 640px)`
block) reflect the current art's proportions (head ~0.85 aspect ratio with the full nose,
hands ~2.1) — if this art is regenerated again, these will need re-tuning to match the new
files' actual pixel dimensions.

If new art comes back from a future prompt run: replace the three files in
`public/images/` (same filenames, the CSS already points at them), watch out for the same
JPEG/checkerboard/single-sheet issue, re-derive the left/right hand mapping the way
described above rather than assuming reading order, and re-tune the width/height custom
properties.
