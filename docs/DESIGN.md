# Design — the mascot holds the site in its arms

## The concept

Idea provided by Geremy, with this sketch as reference:

![Sketch of the concept: the site is a box held by the mascot, whose snout, paws, and
feet poke out past the edges](design/mascot-hug-sketch.png)

All site content lives inside a box. The studio mascot (see `public/images/logo.png`) is
**behind** this box, hugging it tight. We don't draw the full animal — only the extremities
that stick out past the rectangle are visible:

- the snout/head, tilted, poking out at the top;
- the two paws (hands), gripping the left and right edges;
- the two feet, pointing out below the bottom edge.

The rest of the body is implicitly hidden behind the content box.

## How it's implemented

Component: [`app/components/MascotFrame.js`](../app/components/MascotFrame.js) + its CSS
[`app/components/MascotFrame.module.css`](../app/components/MascotFrame.module.css).

Used once, in [`app/layout.js`](../app/layout.js), to wrap the entire site (`{children}`) —
so the frame is present on every page, not just the homepage.

**No image/SVG for the paws/snout/feet** — they are `<span>` elements styled with just
`border-radius` (pure CSS), to stay very easy to tweak while the art direction isn't locked
in. Concretely:

1. `.box` is a rectangle with a thick black border (`--mascot-color`): this border
   represents the arms/body outline.
2. Each limb (`.snout`, `.pawLeft`, `.pawRight`, `.footLeft`, `.footRight`) is a blob
   positioned **centered on the border line** — so half inside the box, half outside.
3. `.content` is an opaque layer covering exactly the inside of the box, sitting above the
   blobs (higher `z-index`). It hides the "inner" half of each blob → only the part that
   sticks out remains visible, exactly as in the sketch.

None of these shapes have illustrated detail (no fur, no line art) — they are placeholders
that establish the concept and layout. See the next section for evolving them into real
artwork.

## How to tweak

Everything is controlled via **CSS custom properties** defined at the top of `.box` in
`MascotFrame.module.css` — no need to touch the JSX for a common adjustment:

| Variable | Purpose |
| --- | --- |
| `--mascot-color` | Color of arms/paws/snout/border |
| `--mascot-content-bg` | Background of the content area (hides the inner half of limbs) |
| `--mascot-border-width` / `--mascot-border-radius` | Border thickness and roundness |
| `--mascot-frame-margin` | Margin around the box (space where limbs can poke out) |
| `--mascot-snout-offset-x` / `-width` / `-height` / `-rotation` | Snout position, size, angle |
| `--mascot-paw-size` / `--mascot-paw-left-offset-y` / `--mascot-paw-right-offset-y` | Paw size, vertical position of each |
| `--mascot-foot-width` / `-height` / `--mascot-foot-left-x` / `--mascot-foot-right-x` | Foot size, horizontal position of each |

A `@media (max-width: 640px)` block at the bottom of the file redefines these same variables
to proportionally scale down the frame on mobile — same logic, no separate rules to maintain.

### Moving to real illustrated artwork

When the mascot art direction is ready (real drawn paws/snout, textures, etc.): replace the
`background: var(--mascot-color)` rule for each `.limb` with an image (`background-image: url(...)` or an inline `<svg>` replacing the `<span>` in `MascotFrame.js`). The positioning
logic (centered on the border, half-hidden by `.content`) stays valid as-is — only the
visual rendering of the blob changes.

## Choices already made

- The frame is **not** dark-mode-adapted for now: mascot color and content background are
  fixed (`#111111` / `#fafaf7`), regardless of system theme. The page background (`body`,
  outside the frame) does follow the existing dark theme (`app/globals.css`). Decision made
  to keep the mascot consistent with the logo (always black on light background) rather
  than adding complexity before the real brand palette is set. Revisit once real content +
  color palette arrive.
- The logo (`public/images/logo.png`) also serves as the favicon (`app/layout.js`,
  `metadata.icons.icon`).
