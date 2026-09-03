# MossGames — site web

Site web du studio de jeu vidéo **MossGames**, servi sur [mossgames.fr](https://mossgames.fr).

> Ce projet est piloté en grande partie par des agents IA (Claude Code). La doc dans `docs/`
> est tenue à jour à chaque session pour qu'un agent (ou un humain) puisse reprendre le travail
> sans contexte perdu. Merci de la maintenir en la lisant/écrivant à chaque changement notable.

## Stack

- [Next.js](https://nextjs.org) (App Router, **JavaScript**, pas TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- Déployé sur [Vercel](https://vercel.com), branché sur ce repo GitHub (`Moss-Games/Website`),
  domaine de production `mossgames.fr`

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Le repo GitHub est lié à Vercel : tout push sur `main` déclenche un déploiement en
production sur mossgames.fr. Il n'y a pas d'étape manuelle de déploiement à faire —
`git push` suffit. Voir [docs/DECISIONS.md](docs/DECISIONS.md) pour le contexte de ce choix.

## Documentation du projet

- [docs/ONBOARDING.md](docs/ONBOARDING.md) — **à lire en premier** si tu reprends ce projet
  sur une nouvelle machine ou avec un nouvel agent (accès GitHub/Vercel nécessaires, etc.)
- [docs/STATUS.md](docs/STATUS.md) — état actuel du site, ce qui est fait, ce qui reste à faire
- [docs/DECISIONS.md](docs/DECISIONS.md) — journal des décisions techniques et pourquoi
- [docs/DESIGN.md](docs/DESIGN.md) — concept visuel du mascotte qui tient le site dans ses
  bras (`MascotFrame`), et comment l'ajuster
