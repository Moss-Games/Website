# Games — Sanity Studio, with optional Steam auto-fill

## The idea

Games are content-managed through **Sanity** (same CMS as `/news`, see `docs/NEWS.md`)
instead of `public/games/<Name>/*.txt` file folders. Adding, editing, or hiding a game
happens entirely at **`/studio`** — no code change, no git commit, no redeploy. This
replaced the 2026-09-04 file-based convention (see `docs/DECISIONS.md`) once the studio had
more than one game and the per-file editing got tedious — see `docs/DECISIONS.md`'s
2026-09-06 migration entry for the full reasoning and what was verified about Steam's API.

For a game that's on Steam, paste its store URL into the **Store URL** field (a
`store.steampowered.com/app/<id>/...` link) and click **Fetch from Steam** — title,
tagline, description (rich text, images included), price, release date, genres,
platforms, languages, and images (header/library hero/screenshots) all auto-fill from
Steam's public `appdetails` API, as an editable draft you can still tweak before
publishing. For a game that isn't on Steam (itch.io, or an unannounced project), just fill
every field by hand — it's the same document type either way, there's no separate "is this
a Steam game" field to remember to set: the button shows up automatically whenever **Store
URL** looks like a Steam link.

**Description** is Portable Text, same as news post bodies (`docs/NEWS.md`) — editors can
drop images anywhere in it via the `+` button on a new line in Studio, with alt text and an
optional caption. "Fetch from Steam" fills it from Steam's own "About This Game" HTML
(`about_the_game`, falling back to `detailed_description`), converting Steam's own markup
(paragraphs, headings, lists, bold/italic, links, and inline images) into the same block
shape — see `lib/steam.js`'s `steamDescriptionToBlocks`.

**The trailer video always stays a manual step**, even for a Steam game: Steam's API only
exposes streaming manifests (DASH/HLS), never a direct `.mp4` — confirmed by testing it live
during this migration. Pull it with `ffmpeg -i "<hls_manifest_url>" -c copy trailer.mp4`
(the manifest URL is `movies[0].hls_h264` from a fresh `appdetails` call — its token is
short-lived, so don't reuse an old URL) and drag the resulting file into the **Trailer**
field in Studio. **Don't re-encode after the `-c copy` pull** — Digitum's original trailer
(2026-09-04) was re-encoded down to 1280px/CRF 23 after the copy step and that re-encode
silently dropped the audio track entirely (no `-map`/audio codec given), which went unnoticed
until a user report months later; see `docs/DECISIONS.md`'s 2026-09-06 entry for the fix and
verify any trailer with `ffprobe -show_streams` before trusting it has sound.

On Steam listings, the game page also shows a **live price/review widget**
(`app/(site)/components/SteamWidget.js`, data from `lib/steam.js`'s `fetchSteamLiveStats`) —
current price/discount and Valve's review score, fetched fresh (hourly revalidate) rather
than frozen at whatever "Fetch from Steam" last saved. This needs no Studio action; it just
follows `storeUrl` whenever it's a Steam link. The **Platforms** tag is hidden on the game
page for Steam listings specifically (Steam's own store page already shows it, and there's
no way to keep this site's copy in sync) — still shown for non-Steam games, where it's the
only source for that fact.

## Adding a game

1. Go to `/studio`, log in (same account as for news posts).
2. Click **Game** in the sidebar, then **+**.
3. **On Steam**: paste the Steam store URL into **Store URL**, save as a draft, click
   **Fetch from Steam** in the action menu, wait for it to finish, review the filled-in
   fields (the raw Steam genre list may need trimming — e.g. "Free To Play" isn't really a
   genre), add the trailer manually if there is one, then **Publish**.
   **Not on Steam**: fill in title/tagline/description/store URL/images etc. by hand, then
   **Publish**.
4. The game appears on `/` within ~30 seconds (same `revalidate` window as news), unless
   **Unlisted** is checked.

Toggling **Unlisted** hides a game from the homepage row while keeping its own
`/games/<slug>` page live — replaces the old `unlisted.txt` flag-file trick.

An unannounced project (no store link, no images yet) is just a `game` document like any
other — fill in title/tagline and leave the rest empty, its `/games/<slug>` page will simply
render sparsely until there's more to show. Set **Badge** (free text — "Coming Soon",
"Coming Q1 2026", "Demo available", anything) to show a small pill on its homepage card;
leave it empty for no badge. Replaces the old hardcoded `GameTeaserCard.js` placeholder.

## Code

- `sanity/schemaTypes/gameType.js` — the `game` document's fields (title, slug, tagline,
  description, storeUrl, price, releaseDate, genres/platforms/languages/features,
  systemRequirements, headerImage/libraryHeroImage/trailerPoster/screenshots, trailer,
  order, unlisted, badge). No separate "cover" field — `headerImage` doubles as the
  homepage card's image. Also no separate "steamUrl" field (tried, undone same day — see
  `docs/DECISIONS.md`): `storeUrl` alone drives both the store button and the Steam
  auto-fill action. `badge` is a free-text field, manually filled in — no boolean/date
  pair, deliberately kept as simple as possible.
- `sanity/actions/fetchFromSteamAction.js` — the Studio "Fetch from Steam" button, shown
  only on `game` documents whose `storeUrl` contains `steampowered.com`. Registered in
  `sanity.config.js`'s `document.actions`.
- `app/api/sanity/import-steam/route.js` — does the actual work: parses the Steam app id,
  calls `store.steampowered.com/api/appdetails`, downloads the resulting image URLs
  (including every image embedded in the description body), uploads them as Sanity assets
  via a **write**-scoped client (`sanity/lib/writeClient.js`, `SANITY_API_WRITE_TOKEN` —
  server-only, never sent to the Studio's browser bundle), and patches the target document.
  `resolveDescriptionImages` swaps the description's placeholder `steamImageUrl` blocks
  (from `steamDescriptionToBlocks`) for real uploaded assets before the patch is written,
  dropping any block whose image failed to download. Accepted tradeoff: this route has no
  auth of its own beyond checking the target document is actually a `game` — it only
  proxies public Steam data and `/studio` itself is unlisted/login-gated, so the blast
  radius of someone hitting it directly is low. See `docs/DECISIONS.md`.
- `lib/steam.js` — the Steam response → field mapping (`parseSteamAppId`,
  `fetchSteamAppDetails`, `mapSteamDataToGameFields`), used by the API route above.
  `steamDescriptionToBlocks(html)` walks Steam's own "About This Game" HTML (a small known
  subset of tags — paragraphs, headings, lists, bold/italic, links, inline images) into
  Portable Text blocks matching the `description` field's shape; image blocks come out as
  `{ _type: "image", steamImageUrl }` placeholders since this function has no write-token
  access to actually upload anything — the route above resolves those. Also
  `fetchSteamLiveStats(appId)` — separate from the import-time functions above, called on
  every game page render (not just the one-off import), so unlike `fetchSteamAppDetails` it
  never throws: any failure just yields `null` price/review fields.
- `app/(site)/components/SteamWidget.js` (+ `.module.css`) — renders `fetchSteamLiveStats`'s
  output (price/discount, review score) on the game page. Renders nothing if both are `null`.
- `lib/games.js` — `getGames()`/`getGame(slug)`, GROQ queries against Sanity (same pattern
  as `lib/news.js`), expanding image/file fields to plain URLs via `sanity/lib/image.js` so
  nothing downstream (`GameCard.js`, `games/[slug]/page.js`) needs to know about Sanity.
  `heroImage` (the per-game page's own banner) keeps its old preference order: library
  hero > first screenshot > header. The homepage card (`GameCard.js`) just uses
  `headerImage` directly.
- `app/(site)/components/GameCard.js` — the homepage card. Renders `game.badge` as a small
  pill overlaid on the cover image's top-left corner when set. The old hardcoded
  `GameTeaserCard.js` (a static, non-Sanity-backed placeholder for an unannounced project)
  was deleted the same day `badge` was added — an unannounced project is now just a sparse
  `game` document instead of a one-off component.
- `app/(site)/games/[slug]/page.js` + `page.module.css` — the per-game page. `description`
  renders via `@portabletext/react`'s `<PortableText>` (same as news post bodies) — the old
  markdown-subset renderer (`lib/markdown.js`, `MarkdownText.js`) was deleted. Two-column
  past `60rem` (sidebar — store button/SteamWidget/meta/tags — pinned right via `sticky`;
  trailer/description/features/screenshots on the left), single stacked column below that
  (sidebar first, so the store button stays above the fold on mobile) — see
  `docs/DECISIONS.md`'s 2026-09-06 entry.
- `scripts/migrate-games-to-sanity.mjs` — the one-off script that moved the original
  Digitum/Gwaver file-based data into Sanity. Not part of the app; kept for reference in
  case a similar bulk-import is ever needed again.

## Sanity project details

Same project as news — see `docs/NEWS.md`'s "Sanity project details" section (project id,
dataset, env vars, where to manage the project).
