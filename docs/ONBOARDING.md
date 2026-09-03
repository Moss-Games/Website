# Onboarding — reprendre ce projet sur une autre machine / avec un autre agent

Ce fichier existe pour qu'un agent (ou Geremy) sur une machine différente puisse reprendre
le travail sans avoir à redemander le contexte. À lire en premier, puis voir
[STATUS.md](STATUS.md) (où on en est) et [DECISIONS.md](DECISIONS.md) (pourquoi les choix
ont été faits, y compris les pièges déjà rencontrés).

## Le projet en une phrase

Site vitrine du studio de jeu vidéo **MossGames**, en Next.js (JavaScript), déployé sur
Vercel, servi sur **mossgames.fr**.

## Accès nécessaires sur une nouvelle machine

### 1. GitHub — repo `Moss-Games/Website`

- Remote : `git@github.com:Moss-Games/Website.git` (SSH — pas d'HTTPS/token configuré).
- Il faut une clé SSH enregistrée sur un compte GitHub ayant les droits push sur
  l'organisation `Moss-Games`. Sur la première machine, le compte utilisé est `GeremC`.
- Test rapide : `ssh -T git@github.com` doit répondre avec le nom du compte authentifié.
- Branche de travail : `main` uniquement pour l'instant, pas de branches de feature. Les
  agents peuvent pousser directement sur `main` (accord explicite de l'utilisateur, voir
  DECISIONS.md 2026-09-03 "Push direct sur main").

### 2. Vercel — projet `ldpdoc`

- CLI : `vercel` (installé via npm, `npm i -g vercel` si absent).
- Auth : `vercel login` (device flow — donne une URL + code à valider dans un navigateur,
  pas besoin d'API key). Vérifier avec `vercel whoami`.
- Lier le dossier local au bon projet (⚠️ ne PAS laisser `vercel link` créer un nouveau
  projet — il faut cibler l'existant) :
  ```bash
  vercel link --yes --project=prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H
  ```
- Le projet s'appelle **`ldpdoc`** dans le dashboard Vercel (scope
  `geremy-cambus-projects`) — nom trompeur hérité d'un ancien usage (doc VitePress d'un
  autre repo, `Moss-Games/LesDeuxPelos`). C'est bien lui qui porte le domaine
  `mossgames.fr` / `www.mossgames.fr` et qui est connecté au repo `Moss-Games/Website`
  (branche `main`) côté intégration GitHub. Ne pas se laisser dérouter par le nom — voir
  DECISIONS.md 2026-09-03 "Incident déploiement initial" pour le détail du piège déjà
  rencontré (Root Directory obsolète qui cassait le build).
- Déploiement : automatique à chaque push sur `main` (pas besoin de `vercel deploy` à la
  main), via l'intégration GitHub de Vercel.

## Démarrer en local

```bash
git clone git@github.com:Moss-Games/Website.git
cd Website
npm install
npm run dev
```

## Où sont les docs

- [../README.md](../README.md) — stack, commandes de base
- [STATUS.md](STATUS.md) — état actuel, prochaine étape attendue
- [DECISIONS.md](DECISIONS.md) — journal des décisions et incidents, avec le pourquoi

## Convention pour les agents qui reprennent ce projet

- **Push après (quasiment) chaque échange** — demande explicite de l'utilisateur
  (2026-09-03) : ne pas accumuler plusieurs prompts de travail sans pousser sur `main`.
  L'utilisateur veut pouvoir récupérer l'état du projet depuis une autre machine à tout
  moment, donc l'état local ne doit pas rester longtemps en avance sur GitHub.
- À chaque changement notable (nouvelle décision technique, contenu ajouté, incident/piège
  rencontré, changement de config Vercel/GitHub) : mettre à jour STATUS.md et/ou
  DECISIONS.md dans le même commit que le changement de code correspondant. Le but est
  qu'aucune information importante ne reste uniquement dans l'historique de conversation
  d'un agent — tout ce qui compte doit finir dans ces `.md`.
