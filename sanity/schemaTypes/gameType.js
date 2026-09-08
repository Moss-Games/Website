import { defineField, defineType } from "sanity";

// Replaces the old public/games/<Name>/*.txt file-per-field convention (see
// docs/GAMES.md, docs/DECISIONS.md 2026-09-06). A single `storeUrl` field
// serves both purposes — the page's store button link, and (when it's a
// steampowered.com URL) what the "Fetch from Steam" document action
// (sanity/actions/fetchFromSteamAction.js) auto-fills from. An earlier
// version split these into two fields (`steamUrl`/`storeUrl`); merged back
// into one after that caused real confusion — a migrated game had `storeUrl`
// set but not `steamUrl`, so the button silently never appeared. See
// docs/DECISIONS.md.
export const gameType = defineType({
  name: "game",
  title: "Game",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "storeUrl",
      type: "url",
      title: "Store URL",
      description:
        "Steam, itch.io, or any storefront link — shown as the page's store button. A store.steampowered.com/app/<id>/... link also shows a \"Fetch from Steam\" action below, to auto-fill the fields on this page (except the trailer — Steam doesn't expose a direct video file, so that stays a manual upload).",
    }),
    defineField({ name: "price", type: "string", description: "e.g. \"Free to Play\" or \"$9.99\"" }),
    defineField({ name: "releaseDate", type: "string", description: "Free text, e.g. \"19 Aug, 2025\"" }),
    defineField({ name: "genres", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "platforms", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "languages", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "systemRequirements", type: "text" }),
    defineField({
      name: "headerImage",
      type: "image",
      options: { hotspot: true },
      description: "Also the homepage card's image (GameCard.js).",
    }),
    defineField({
      name: "libraryHeroImage",
      type: "image",
      options: { hotspot: true },
      title: "Library hero image",
      description: "Wide banner (Steam's own library_hero.jpg is 1920x620) — preferred for the game page's own hero over the header image.",
    }),
    defineField({ name: "trailer", type: "file", options: { accept: "video/mp4" }, description: "Always manual — see storeUrl's description." }),
    defineField({
      name: "trailerYoutubeUrl",
      type: "url",
      title: "Trailer (YouTube URL)",
      description: "Fallback when there's no trailer file above — a YouTube link (watch, youtu.be, or embed) is played in its place. Ignored when the trailer file is set.",
    }),
    defineField({ name: "trailerPoster", type: "image", options: { hotspot: true } }),
    defineField({ name: "screenshots", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "order", type: "number", description: "Homepage card position, ascending." }),
    defineField({
      name: "showOnHomepage",
      type: "boolean",
      title: "Show on homepage carousel",
      initialValue: false,
      description:
        "When checked, this game appears in the homepage carousel. Every game always appears on the /projects page regardless of this setting.",
    }),
    defineField({
      name: "badge",
      type: "string",
      title: "Badge(s)",
      description:
        "Optional badge(s) shown on the homepage card (e.g. \"Coming Soon\", \"Coming Q1 2026\", \"Demo available\"). Separate multiple with a comma (\"Coming Soon, Demo available\") to stack one per line. Leave empty to show nothing.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "headerImage" },
  },
});
