# Design — le mascotte tient le site dans ses bras

## Le concept

Idée donnée par Geremy, avec ce croquis comme référence :

![Croquis du concept : le site est une boîte tenue par le mascotte, dont le museau, les
pattes et les pieds dépassent des bords](design/mascot-hug-sketch.png)

Tout le contenu du site vit dans une boîte. Le mascotte du studio (voir
`public/images/logo.png`) est **derrière** cette boîte, en train de la serrer dans ses
bras. On ne dessine pas l'animal en entier : seules les extrémités qui dépassent du
rectangle sont visibles —

- le museau/tête, penché, qui dépasse en haut ;
- les deux pattes (mains), qui agrippent les bords gauche et droit ;
- les deux pieds, qui pointent sous le bord bas.

Le reste du corps est implicitement caché derrière la boîte de contenu.

## Comment c'est implémenté

Composant : [`app/components/MascotFrame.js`](../app/components/MascotFrame.js) + son CSS
[`app/components/MascotFrame.module.css`](../app/components/MascotFrame.module.css).

Utilisé une seule fois, dans [`app/layout.js`](../app/layout.js), pour envelopper tout le
site (`{children}`) — donc le cadre est présent sur toutes les pages, pas juste l'accueil.

**Pas d'image/SVG pour les pattes/museau/pieds** — ce sont des `<span>` avec juste du
`border-radius` (CSS pur), pour rester très simples à ajuster tant que la direction
artistique n'est pas figée. Concrètement :

1. `.box` est un rectangle avec une bordure noire épaisse (`--mascot-color`) : cette
   bordure représente les bras/le contour du corps.
2. Chaque extrémité (`.snout`, `.pawLeft`, `.pawRight`, `.footLeft`, `.footRight`) est un
   blob positionné **centré sur la ligne de la bordure** — donc à moitié à l'intérieur de
   la boîte, à moitié à l'extérieur.
3. `.content` est une couche opaque qui recouvre exactement l'intérieur de la boîte et qui
   est au-dessus des blobs (`z-index` plus élevé). Elle cache la moitié "intérieure" de
   chaque blob → il ne reste visible que la partie qui dépasse, exactement comme sur le
   croquis.

Aucune de ces formes n'a de détail illustré (pas de fourrure, pas de trait à la main) —
ce sont des placeholders qui posent le concept et la mise en page. Voir la section
suivante pour les faire évoluer vers du vrai artwork.

## Comment modifier

Tout se règle avec des **custom properties CSS** définies en haut de `.box` dans
`MascotFrame.module.css` — pas besoin de toucher au JSX pour un réglage courant :

| Variable | Rôle |
| --- | --- |
| `--mascot-color` | Couleur des bras/pattes/museau/bordure |
| `--mascot-content-bg` | Fond de la zone de contenu (cache la moitié interne des membres) |
| `--mascot-border-width` / `--mascot-border-radius` | Épaisseur et arrondi du cadre |
| `--mascot-frame-margin` | Marge autour de la boîte (espace où les membres peuvent dépasser) |
| `--mascot-snout-offset-x` / `-width` / `-height` / `-rotation` | Position, taille, angle du museau |
| `--mascot-paw-size` / `--mascot-paw-left-offset-y` / `--mascot-paw-right-offset-y` | Taille des pattes, position verticale de chacune |
| `--mascot-foot-width` / `-height` / `--mascot-foot-left-x` / `--mascot-foot-right-x` | Taille des pieds, position horizontale de chacun |

Un bloc `@media (max-width: 640px)` en bas du fichier redéfinit ces mêmes variables pour
réduire proportionnellement le cadre sur mobile — même logique, pas de règles séparées à
maintenir.

### Passer à du vrai artwork illustré

Quand la direction artistique du mascotte sera prête (vraies pattes/museau dessinés,
texture, etc.) : remplacer, pour chaque `.limb`, la règle `background: var(--mascot-color)`
par une image (`background-image: url(...)` ou un `<svg>` inline à la place du `<span>`
dans `MascotFrame.js`). La logique de positionnement (centré sur la bordure, caché à
moitié par `.content`) reste valable telle quelle — seul le rendu visuel du blob change.

## Choix déjà faits

- Le cadre n'est **pas** adapté au thème sombre pour l'instant : couleur du mascotte et
  fond du contenu sont fixes (`#111111` / `#fafaf7`), quel que soit le thème système. Le
  fond de la page (`body`, en dehors du cadre) suit lui le thème sombre existant
  (`app/globals.css`). Choix pris pour garder le mascotte cohérent avec le logo (toujours
  noir sur fond clair) plutôt que de le complexifier avant d'avoir la vraie charte
  graphique. À revoir quand le contenu réel + palette de couleurs arrivera.
- Le logo (`public/images/logo.png`) sert aussi de favicon (`app/layout.js`,
  `metadata.icons.icon`).
