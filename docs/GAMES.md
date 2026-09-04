# Game carousel — `public/games/`

## The idea

The homepage carousel and the `/games/[slug]` pages are generated automatically
from `public/games/`. **Every subfolder is one game**, discovered by scanning
the filesystem server-side (`lib/games.js`, `fs.readdirSync`) — there is no
list of games to maintain in the code. Adding a game means adding a folder
with the files below; removing one means deleting the folder.

The folder name doubles as the game's URL slug, lowercased:
`public/games/Digitum/` → `/games/digitum`.

Deliberately **plain files, not JSON** — each piece of info is its own small
`.txt`/`.md` file with a fixed name, so a non-technical person (or a future
agent) can update one fact without touching a structured document. Missing
files are fine: every field is optional and simply doesn't render if absent
(see `lib/games.js`'s `readFileIfExists`/`readLines`).

## File contract

```
public/games/<GameName>/
├── order.txt               → integer; carousel position (ascending). Missing = sorts last.
├── title.txt                → display name (falls back to the folder name)
├── tagline.txt               → one-line hook (carousel card alt text, page subtitle)
├── description.md            → long-form description. Only **bold** + paragraph
│                              breaks are supported (see lib/markdown.js) — it's not
│                              a full Markdown renderer on purpose.
├── store-url.txt              → link to the game's store page (Steam, itch.io, ...).
│                              The button label on the game page is inferred from the
│                              domain (storeLabel() in lib/games.js) — add a case there
│                              if a new storefront shows up.
├── price.txt
├── release-date.txt
├── genres.txt                 → one value per line
├── platforms.txt               → one value per line
├── languages.txt                → one value per line
├── features.txt                  → one value per line, rendered as a bullet list
├── system-requirements.txt        → free text, rendered verbatim (<pre>)
├── cover.jpg|png|webp              → carousel tile + card image (Steam capsule ratio,
│                                    616×353, works well)
├── library-hero.jpg|png|webp        → wide, high-res banner (Steam's own "library hero"
│                                    asset is 1920×620, made for exactly this) — preferred
│                                    for the game page's own hero image over `header`
├── header.jpg|png|webp              → fallback banner if there's no library-hero or
│                                    screenshot yet. Steam's store-page header is only
│                                    460×215 — visibly blurry stretched full-width, so it's
│                                    last choice, not first (see lib/games.js's `heroImage`)
├── trailer.mp4                       → self-hosted video (see "Why self-hosted" below)
├── trailer-poster.jpg|png             → poster frame shown before the video plays
└── screenshots/
    ├── 01.jpg (or .png/.webp)
    ├── 02.jpg
    └── ...                            → any filenames, sorted alphabetically; numbered
                                        prefixes (01, 02, ...) keep the order predictable
```

## Why self-hosted, not hotlinked

Steam (and other storefronts) serve media through CDN URLs carrying a `?t=...`
cache-busting token that can change or expire. Assets are downloaded once
(`curl`) and committed into `public/games/<Name>/` instead of linking to the
storefront's CDN directly, so the site doesn't silently break if that token
rotates. Same reasoning for trailers: Steam only exposes HLS/DASH manifests
(no direct `.mp4`), so the trailer is pulled and converted once with `ffmpeg`
and re-encoded for a reasonable web file size:

A few Steam assets — `library_hero.jpg` among them — don't need a content-hash
in their URL at all, unlike the store page's own header/capsule/screenshot
links: `https://cdn.akamai.steamstatic.com/steam/apps/<appid>/library_hero.jpg`
works directly from just the app ID.

```bash
ffmpeg -i "<hls_manifest_url>" -c copy trailer-raw.mp4
ffmpeg -i trailer-raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 23 -preset slow \
  -c:a aac -b:a 128k -movflags +faststart trailer.mp4
ffmpeg -ss 00:00:05 -i trailer.mp4 -frames:v 1 -update 1 -q:v 2 trailer-poster.jpg
```

There's no build step that re-runs this automatically — if a game's source
media changes, redo the download/convert by hand.

## Known limitation: itch.io can't be scraped the same way

Steam's store pages are fetchable directly (curl/WebFetch). itch.io puts its
game pages behind a Cloudflare JS challenge that blocks both plain `curl` and
headless Chrome (`--headless=new` with a spoofed UA and a 15s virtual time
budget still gets served the "Just a moment..." interstitial, not the real
page) — confirmed 2026-09-04 trying to add `tiom311.itch.io/gwaver`. A search
engine snippet can sometimes surface a title/description, but no images. The
practical options for an itch.io game: ask the user for a real Chrome session
(the `claude-in-chrome` skill, if the user installs the extension) or have
them hand over the cover/screenshots/description directly.

## Adding the carousel/game-page code itself

- `lib/games.js` — `getGames()` (all games, sorted by `order.txt`) and
  `getGame(slug)` (one game). This is the only place that knows the file
  contract above.
- `app/components/GameCarousel.js` + `.module.css` — homepage carousel,
  client component (needs scroll/button state). Renders **only the cover
  image** per card (2026-09-04 — title/tagline were dropped from the card by
  request; they still show on the game's own page).
- `app/games/[slug]/page.js` + `page.module.css` — the per-game page.
- `app/components/MarkdownText.js` + `lib/markdown.js` — the minimal
  paragraph/bold renderer for `description.md`.

## Digitum (current flagship, `order.txt` = 1)

Source: [Steam store page](https://store.steampowered.com/app/3431490/Digitum/),
scraped 2026-09-04 (the page embeds a JSON blob with the full screenshot/trailer
list in a `data-props` attribute — more reliable than the rendered HTML
summary). All 6 screenshots, the header/capsule images, and the one trailer
were downloaded and re-encoded as described above.
