# Onboarding — picking up this project on a different machine / with a different agent

This file exists so that an agent (or Geremy) on a different machine can pick up the work
without having to re-ask for context. Read first, then see
[STATUS.md](STATUS.md) (where things stand) and [DECISIONS.md](DECISIONS.md) (why choices
were made, including pitfalls already encountered).

## The project in one sentence

Showcase website for the **MossGames** video game studio, built with Next.js (JavaScript),
deployed on Vercel, served at **mossgames.fr**.

## Required access on a new machine

### 1. GitHub — repo `Moss-Games/Website`

- Remote: `git@github.com:Moss-Games/Website.git` (SSH — no HTTPS/token configured).
- You need an SSH key registered on a GitHub account with push access on the
  `Moss-Games` organization. On the first machine, the account used is `GeremC`.
- Quick test: `ssh -T git@github.com` should respond with the authenticated account name.
- Working branch: `main` only for now, no feature branches. Agents can push directly to
  `main` (explicit user agreement, see DECISIONS.md 2026-09-03 "Direct push to main").

### 2. Vercel — project `ldpdoc`

- CLI: `vercel` (installed via npm, `npm i -g vercel` if missing).
- Auth: `vercel login` (device flow — gives a URL + code to validate in a browser,
  no API key needed). Verify with `vercel whoami`.
- Link the local folder to the correct project (⚠️ do NOT let `vercel link` create a new
  project — you must target the existing one):
  ```bash
  vercel link --yes --project=prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H
  ```
- The project is called **`ldpdoc`** in the Vercel dashboard (scope
  `geremy-cambus-projects`) — a misleading name inherited from an earlier use (VitePress
  docs for another repo, `Moss-Games/LesDeuxPelos`). This IS the project that carries
  the `mossgames.fr` / `www.mossgames.fr` domain and is connected to the
  `Moss-Games/Website` repo (`main` branch) via the Vercel GitHub App integration.
  Don't be fooled by the name — see DECISIONS.md 2026-09-03 "Initial deployment incident"
  for details on the pitfall already encountered (obsolete Root Directory that broke the
  build).
- Deployment: automatic on every push to `main` (no need for `vercel deploy` manually),
  via Vercel's GitHub integration.

## Getting started locally

```bash
git clone git@github.com:Moss-Games/Website.git
cd Website
npm install
npm run dev
```

## Where the docs are

- [../README.md](../README.md) — stack, basic commands
- [STATUS.md](STATUS.md) — current status, expected next step
- [DECISIONS.md](DECISIONS.md) — decision and incident log, with rationale

## Convention for agents picking up this project

- **Push after (nearly) every exchange** — explicit user request
  (2026-09-03): don't accumulate multiple prompts of work without pushing to `main`.
  The user wants to be able to pull the project state from another machine at any time,
  so local state must not stay far ahead of GitHub.
- At each notable change (new technical decision, content added, pitfall/incident
  encountered, Vercel/GitHub config change): update STATUS.md and/or DECISIONS.md in the
  same commit as the corresponding code change. The goal is that no important information
  stays only in an agent's conversation history — everything that matters must end up in
  these `.md` files.
