# Journal des décisions

Chaque entrée : date, décision, pourquoi. But : qu'un nouvel agent (ou humain) comprenne
le raisonnement sans avoir à redemander à l'utilisateur.

## 2026-09-03 — Choix de la stack : Next.js (JS, pas TypeScript)

Décidé avec l'utilisateur (question directe, 3 choix proposés : Next.js / Vite+React /
statique). Next.js retenu pour :
- meilleure intégration native avec Vercel (où le domaine mossgames.fr est déjà branché) ;
- routing/pages/SEO/optimisation d'images intégrés, utile pour un site multi-pages de studio ;
- reste du JS pur (App Router en `.js`), pas de TypeScript — demande explicite de l'utilisateur
  ("surtout js").

Alternative écartée : site statique HTML/CSS/JS — plus simple mais moins d'outillage pour
un site qui va grandir (page par jeu, presse, etc.).

## 2026-09-03 — Contenu réel reporté

L'utilisateur fournira le contenu du studio (jeux, bio, logo, charte graphique, contacts)
dans un message ultérieur séparé. Pour cette session : uniquement préparer le squelette
technique (repo git + Next.js + lien Vercel), pas de contenu inventé/placeholder détaillé
pour éviter d'avoir à défaire du faux contenu. La page d'accueil est un simple message
"le site arrive bientôt", pas le template de démo Next.js/Vercel par défaut (qui aurait été
mis en ligne tel quel sur mossgames.fr sinon).

## 2026-09-03 — Push direct sur `main`

L'utilisateur a confirmé vouloir que les agents pushent directement sur `main` du repo
`Moss-Games/Website`, sans étape de validation manuelle avant chaque push. Chaque push sur
`main` déclenche un déploiement Vercel en production sur mossgames.fr (intégration GitHub
existante, confirmée par l'utilisateur — le repo était vide avant ce projet).

Implication pour les agents futurs : pas besoin de demander confirmation avant un
`git push origin main` sur ce repo, sauf action inhabituelle (force-push, reset, etc. —
ça reste soumis aux règles de sécurité générales, jamais de force-push sans demander).

## 2026-09-03 — Incident déploiement initial : Root Directory obsolète sur le projet Vercel

Le tout premier push a bien déclenché un déploiement Vercel, mais il a **échoué** :
`The specified Root Directory "dist" does not exist.` Le projet Vercel qui porte
`mossgames.fr` s'appelle **`ldpdoc`** (project id `prj_2qPvUUb9hUfoFSPqxTc6kIZukT3H`,
scope `geremy-cambus-projects`) — un nom hérité d'un ancien usage du projet pour héberger
la doc VitePress d'un autre repo (`Moss-Games/LesDeuxPelos`, "Les Deux Pelos"). Le repo
Git connecté au projet avait déjà été changé pour `Moss-Games/Website` (par l'utilisateur,
avant cette session), mais deux réglages du projet trainaient encore de l'ancienne config :
- `rootDirectory` = `"dist"` (chemin de build VitePress) → cassait tout build Next.js
- `framework` = non défini

Correction faite via l'API Vercel (`vercel api /v9/projects/<id> -X PATCH`, après
`vercel login` + `vercel link --project <id>` faits par l'utilisateur) :
- `rootDirectory` remis à `null`
- `framework` mis à `"nextjs"`

Puis `vercel redeploy <deploymentId> --target production` pour forcer un nouveau build
avec les bons réglages → succès, aliasé sur `www.mossgames.fr`, vérifié en curl.

**Point important pour la suite** : tant que le contenu réel de la doc VitePress LDP
n'existe plus sur ce projet Vercel, il n'y a plus de conflit. Mais le nom du projet
(`ldpdoc`) et son historique restent trompeurs — si un futur agent voit une erreur de
build mentionnant `dist`, VitePress, ou un contenu qui ne correspond pas au repo Website,
c'est probablement un résidu de cet historique. Vérifier les Project Settings sur
vercel.com (Build & Development Settings) en cas de doute plutôt que de repartir de zéro.
