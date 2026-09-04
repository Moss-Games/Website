# MossGames — website

Website for the **MossGames** video game studio, served at [mossgames.fr](https://mossgames.fr).

> This project is largely driven by AI agents (Claude Code). The docs in `docs/`
> are kept up to date after each session so that an agent (or a human) can pick up the work
> without losing context. Please maintain them by reading/writing them at each notable change.

## Stack

- [Next.js](https://nextjs.org) (App Router, **JavaScript**, not TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- Deployed on [Vercel](https://vercel.com), connected to this GitHub repo (`Moss-Games/Website`),
  production domain `mossgames.fr`

## Getting started locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The GitHub repo is linked to Vercel: every push to `main` triggers a production deployment on
mossgames.fr. There is no manual deployment step — `git push` is enough.
See [docs/DECISIONS.md](docs/DECISIONS.md) for the rationale behind this choice.

## Project documentation

- [docs/ONBOARDING.md](docs/ONBOARDING.md) — **read first** if you're picking up this project
  on a new machine or with a new agent (GitHub/Vercel access required, etc.)
- [docs/STATUS.md](docs/STATUS.md) — current state of the site, what's done, what's left
- [docs/DECISIONS.md](docs/DECISIONS.md) — technical decision log and why
- [docs/DESIGN.md](docs/DESIGN.md) — the mascot-holding-the-site visual concept (`MascotFrame`),
  and how to tweak it
