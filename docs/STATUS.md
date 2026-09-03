# État du projet

Dernière mise à jour : 2026-09-03

## Où on en est

Le repo vient d'être initialisé. C'est un squelette Next.js minimal, sans contenu réel :

- Structure Next.js (App Router) en place, avec Tailwind CSS v4 configuré.
- Une seule page (`app/page.js`) : placeholder "MossGames — le site arrive bientôt".
- Aucun contenu réel (textes, jeux, logo, images, couleurs de marque, liens sociaux,
  contact) n'a encore été intégré — voir `docs/DECISIONS.md` du 2026-09-03.
- Repo git initialisé et poussé sur `main` de `Moss-Games/Website` (GitHub), lié à Vercel
  → devrait être live sur mossgames.fr avec la page placeholder.

## Prochaine étape attendue

L'utilisateur (Geremy) doit fournir dans un prochain message le contenu réel du studio :
nom/description des jeux, bio du studio, logo, charte graphique (couleurs/polices),
infos de contact, liens réseaux sociaux, structure de pages souhaitée (accueil, jeux,
à propos, contact, presse/news ?).

Une fois ce contenu reçu :
1. Mettre à jour ce fichier avec le nouvel état.
2. Construire les vraies pages (probablement `app/games`, `app/about`, `app/contact` ou
   équivalent selon la structure demandée).
3. Ajouter le logo/assets dans `public/`.
4. Ajuster la charte graphique Tailwind (`app/globals.css` / config) aux couleurs de la marque.
5. Commit + push sur `main` (déploiement auto Vercel confirmé par l'utilisateur, voir décisions).

## Points d'attention

- Le repo `Moss-Games/Website` sur GitHub était vide avant ce commit initial.
- L'auth GitHub se fait via SSH (clé déjà configurée sur la machine, testée OK avec le
  compte GitHub `GeremC`).
- Le CLI `vercel` est installé localement mais n'est pas connecté (`vercel whoami` échoue,
  token invalide) — le déploiement passe uniquement par l'intégration GitHub → Vercel
  existante, pas besoin du CLI pour l'instant.
