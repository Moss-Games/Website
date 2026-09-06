# News page — `public/news/`

## The idea

Same convention as `public/games/` (see `docs/GAMES.md`): the `/news` page is
generated automatically from `public/news/`. **Every subfolder is one post**,
discovered by scanning the filesystem server-side (`lib/news.js`,
`fs.readdirSync`) — there's no list of posts to maintain in the code. Adding a
post means adding a folder with the files below; removing one means deleting
the folder. Plain `.txt`/`.md` files, not JSON, for the same reason as
`GAMES.md` gives: easy for a non-technical person (or a future agent) to edit
one fact at a time. Missing files are fine — every field is optional.

Posts are sorted **newest first** by `date.txt` (string-sorted, so it must be
an ISO date `YYYY-MM-DD`).

## File contract

```
public/news/<post-slug>/
├── title.txt        → post title (falls back to the folder name)
├── date.txt          → ISO date (YYYY-MM-DD), used for sort order and display
├── body.md             → post content. Only **bold** + paragraph breaks are
│                        supported (lib/markdown.js, same minimal renderer
│                        `description.md` uses for games) — not full Markdown.
└── cover.jpg|png|webp   → optional banner image at the top of the post
```

The folder name doubles as the post's identifier (lowercased), though there's
currently no per-post page — `/news` renders every post's full body inline on
one page. If posts get long or numerous enough to want their own URLs, add
`/news/[slug]/page.js` the same way `/games/[slug]` was added, reusing
`lib/news.js`'s `slug` field.

## Code

- `lib/news.js` — `getNewsPosts()`, the only place that knows the file
  contract above.
- `app/news/page.js` + `page.module.css` — the news list page. Empty state
  ("No news yet — check back soon.") until the first post folder exists.
- Linked from the top-right nav (`app/components/MascotFrame.js`, alongside
  "About Us").
