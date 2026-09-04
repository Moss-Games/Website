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
