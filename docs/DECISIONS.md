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
