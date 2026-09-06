import { defineField, defineType } from "sanity";

// Replaces the old public/games/<Name>/*.txt file-per-field convention (see
// docs/GAMES.md, docs/DECISIONS.md 2026-09-06). `steamUrl` is what the
// "Fetch from Steam" document action (sanity/actions/fetchFromSteamAction.js)
// looks for — it's separate from `storeUrl` because an itch.io/manual game
// has a store link but no Steam app to auto-fill from.
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
    defineField({
      name: "steamUrl",
      type: "url",
      title: "Steam URL",
      description:
        "Paste a store.steampowered.com/app/<id>/... link and use the \"Fetch from Steam\" action below to auto-fill the fields on this page (except the trailer — Steam doesn't expose a direct video file, so that stays a manual upload). Leave empty for a game that isn't on Steam and fill everything below by hand.",
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "storeUrl",
      type: "url",
      title: "Store URL",
      description: "Steam, itch.io, or any storefront link — shown as the page's store button.",
    }),
    defineField({ name: "price", type: "string", description: "e.g. \"Free to Play\" or \"$9.99\"" }),
    defineField({ name: "releaseDate", type: "string", description: "Free text, e.g. \"19 Aug, 2025\"" }),
    defineField({ name: "genres", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "platforms", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "languages", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "systemRequirements", type: "text" }),
    defineField({ name: "cover", type: "image", options: { hotspot: true }, description: "Homepage card image (616:353-ish, cropped)." }),
    defineField({ name: "headerImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "libraryHeroImage",
      type: "image",
      options: { hotspot: true },
      title: "Library hero image",
      description: "Wide banner (Steam's own library_hero.jpg is 1920x620) — preferred for the game page's own hero over the header image.",
    }),
    defineField({ name: "trailer", type: "file", options: { accept: "video/mp4" }, description: "Always manual — see steamUrl's description." }),
    defineField({ name: "trailerPoster", type: "image", options: { hotspot: true } }),
    defineField({ name: "screenshots", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "order", type: "number", description: "Homepage card position, ascending." }),
    defineField({
      name: "unlisted",
      type: "boolean",
      initialValue: false,
      description: "Hide from the homepage while keeping its /games/<slug> page live.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "cover" },
  },
});
