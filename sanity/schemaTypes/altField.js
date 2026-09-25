import { defineField } from "sanity";

// Shared "Alt text" sub-field for every image in the schema, so each one
// gets a real description on the site (Google Images, screen readers)
// instead of a generic fallback like the game's title or "screenshot 3".
// Optional on purpose: the site falls back to its old alt when it's empty.
export const altField = defineField({
  name: "alt",
  type: "string",
  title: "Alt text",
  description:
    "Short description of what the image shows (e.g. \"The rock rolling down a snowy slope\"). Important for SEO and accessibility.",
});
