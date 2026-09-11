import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
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
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "cover", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
              description: "Important for SEO and accessibility.",
            }),
            defineField({ name: "caption", type: "string", title: "Caption (optional)" }),
          ],
        },
      ],
      description: "Drag & drop images anywhere in the text via the + button on a new line.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured on homepage",
      initialValue: false,
      description:
        "Shows this post as the featured story above the games grid on the homepage. If none (or several) are marked, the most recent post wins.",
    }),
    defineField({
      name: "relatedLink",
      type: "reference",
      title: "Related link",
      to: [{ type: "post" }, { type: "game" }],
      description:
        "Optional — link to another news post or a game/project. Shown as a card on this post's page (sidebar on desktop, bottom of the page on mobile).",
    }),
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "cover" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date && new Date(date).toLocaleDateString(),
      media,
    }),
  },
});
