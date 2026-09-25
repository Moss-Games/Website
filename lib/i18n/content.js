// Hand-written French translations of Sanity content (games + news posts).
// Sanity itself stays English-only (see lib/i18n/translations.js's header
// comment). This file is the French copy that layers on top of it when the
// visitor picks FR, and it's on you to keep it in sync by hand whenever a
// game or post changes in Sanity.
//
// Keyed by the document's slug. Every field is optional: omit one (or the
// whole entry) to fall back to the English Sanity value.
//
// A game's `description` / a post's `body` mirrors the shape of the
// matching Sanity Portable Text field, but simplified for hand-editing (see
// app/(site)/components/TranslatedRichText.js, which renders it):
//   - each paragraph is a plain string
//   - "## " at the start makes it a heading, "> " a blockquote
//   - **bold** and *italic* work inline
//   - `{ media: true }` stands in for the next image/carousel/mosaic block
//     from the English original, in the order it appears there (so you
//     never need to re-list images/captions here, just mark where one goes)
//   - drop a paragraph entirely if it was just blank spacing in the CMS
//
// `badge` is the same comma-separated format as Sanity's own `badge` field
// (e.g. "Coming Soon, Demo available").
export const contentTranslations = {
  fr: {
    games: {
      bloup: {
        tagline:
          "Bloup est un jeu de rythme où vous contrôlez une petite créature à la souris. Maintenez <Clic gauche> pour aller plus vite. Faites éclater les bulles quand elles deviennent vertes pour libérer la mélodie des esprits !",
        badge: "Réalisé en 48h",
        description: ["Réalisé pendant la Global Game Jam 2025. Thème : Bubble"],
      },
      "tea-time": {
        tagline: "Réalisé en 48h, MJM Toulouse Movie Jam 2026",
        badge: "Court métrage, Réalisé en 48h",
        description: [
          "Personnage / Rig : Julien BENEZECH",
          "Environnement : Tom MERVILLE",
          "Tech / Shader : Geremy CAMBUS",
        ],
      },
      "don-t-gather-moss": {
        tagline:
          "L'origine de Digitum ! Préparez-vous à l'épreuve ultime d'habileté et de destin, dans un jeu où chaque mouvement compte.",
        badge: "Réalisé en 48h",
        description: [
          "Dans Don't Gather Moss!, vous devenez bien plus qu'un simple rocher : vous êtes le dernier espoir de l'humanité.",
          "Alors que vous dévalez une montagne périlleuse, esquivez la mousse qui menace de ralentir votre élan et découvrez la vérité derrière un proverbe oublié depuis longtemps.",
          "*Parviendrez-vous à maîtriser la descente et à assurer l'avenir de l'humanité* ? Ou *succomberez-vous à la mousse rampante, condamnant la planète à un destin inattendu* ?",
          "**Le destin du monde est entre vos mains**.",
          "Développé pour la *Mini Jam*, avec le défi d'un thème \"terre\" et une règle stricte de \"pas de vert\", notre jeu illustre notre créativité et notre passion alors que nous faisons nos premiers pas dans le monde du jeu indépendant.",
          "...?",
          "Geremy Cambus : Tech Artist, programmeur, artiste cinématique.",
          "Julien Saenz : Sound design, comédien voix.",
          "Tom Merville : Modélisation, texturing, éclairage, level design.",
        ],
      },
      aceituna: {
        tagline:
          "Ce court métrage a été réalisé en 48h, sur le thème imposé \"Faites-moi rêver\". Nous avons tout fait nous-mêmes, y compris l'audio. Réalisé dans le cadre d'une \"Movie Jam\".",
        badge: "Court métrage, Réalisé en 48h",
      },
      gwaver: {
        tagline: "Traquez la fusion de trous noirs depuis votre petit bureau poussiéreux.",
        badge: "Réalisé en 48h",
        description: [
          "Vous commencez votre journée. Encore une fois, dans votre bon vieux bureau situé dans les recoins les moins fréquentés du bâtiment, vous retrouvez le summum de la technologie actuelle : un ordinateur *super-frame* directement relié au cosmos. Au travail !",
          "Maintenez la stabilité de votre fidèle petit satellite (il s'appelle LISA !), et si vous êtes suffisamment habile et chanceux, vous obtiendrez peut-être une lecture claire vous permettant d'identifier la nature de la monstrueuse fusion de trous noirs qu'il vient d'observer.",
          "> Ce travail s'appuie sur la thèse en cours d'Adrien Cogez, qui porte sur la détection d'événements de fusion massifs (trous noirs ou naines blanches proches) à l'aide d'un trio de satellites séparés de millions de kilomètres, surveillant leurs perturbations respectives au nanomètre près.",
          "Réalisé pour la ScientificGameJam (SGJ) 2026 à Toulouse.",
        ],
      },
      digitum: {
        tagline:
          "Un vieux magicien qui s'ennuie glisse son doigt dans un minuscule portail (et vous en tombez !). Dans cette aventure arcade endiablée, filez à travers des niveaux tordus, maîtrisez la physique et peaufinez vos parcours pour battre le chrono… et vos amis au classement.",
        badge: "Création originale",
        description: [
          "**Plongez dans une aventure magique comme aucune autre !**",
          "Vous êtes-vous déjà demandé ce que ça ferait d'être un rocher, une olive, ou une petite sphère parfaitement roulante ? Avez-vous déjà rêvé de dévaler une pente à toute allure, juste pour aller plus vite que vos amis et remporter la victoire ? Ne cherchez plus, **bienvenue dans Digitum !**",
          "Ici, vous incarnez un vieux magicien usé, qui pousse des objets à travers des portails de la taille d'un doigt simplement parce que… eh bien, vous vous ennuyez et que vous le pouvez.",
          "En tant que joueur, vous contrôlez l'un de ces curieux petits objets, le guidant de portail en portail dans un jeu sans fin de physique fantaisiste et de chaos amusant, en essayant d'améliorer votre temps pour terminer chaque niveau !",
          "**L'objectif du jeu est de terminer chaque niveau le plus rapidement possible tout en évitant les obstacles qui ajoutent du temps à votre chronomètre.**",
          "Pour avancer, vous donnez une impulsion à l'objet que vous contrôlez. Une barre de charge affichée sous l'objet indique la force de l'impulsion. Si la barre passe au rouge, un boost supplémentaire se déclenche, vous faisant aller encore plus vite.",
          "Le jeu propose un mode multijoueur avec un classement en temps réel affichant les scores de vos amis et des meilleurs joueurs.",
          "De nombreux succès peuvent être débloqués en relevant des défis (dont certains sont cachés) et permettent d'obtenir de nouveaux skins pour votre objet.",
        ],
        features: [
          "Mode solo",
          "Multijoueur avec classements en temps réel",
          "13 succès Steam",
          "Support Steam Cloud",
          "Partage familial activé",
          "Personnalisation du personnage/skins via des défis",
        ],
        systemRequirements:
          "Minimum :\nSystème d'exploitation : Windows 10/11 64 bits\nProcesseur : Intel Core i3\nMémoire vive : 8 Go\nCarte graphique : Nvidia GTX 1060 / Radeon RX 580\nDirectX : Version 11\nStockage : 2 Go\n\nRecommandée :\nSystème d'exploitation : Windows 10/11 64 bits\nProcesseur : Intel Core i5\nMémoire vive : 8 Go\nCarte graphique : Nvidia GTX 2060 / Radeon RX 7600\nDirectX : Version 11\nStockage : 2 Go",
      },
      "unannounced-project": {
        title: "Nouveau projet",
        tagline: "Nouveau projet bientôt annoncé, tenez-vous prêts !",
        badge: "Bientôt disponible",
      },
      "the-shattered-planet-demo": {
        tagline:
          "Dans ce jeu de tir/Metroidvania en 2.5D, explorez les différentes réalités d'un univers rétro de science-fiction. Combattez, améliorez votre équipement et recrutez des alliés pour percer le mystère de la planète Oscillia.",
        badge: "Co-créé",
        description: [
          "Coincé entre plusieurs réalités, Arlo doit trouver un moyen de se libérer de l'emprise de la planète Oscillia.",
          "Pour cela, il devra traverser des versions alternatives de l'histoire, se battre pour échapper au contrôle d'entités supérieures, relier des événements clés liés à chaque espèce, et finalement s'échapper.",
          "## Ce monde est instable et les réalités s'entremêlent !",
          "Dans ce Metroidvania rétro de science-fiction, explorez une planète en perpétuel changement, façonnée par des réalités fracturées et des forces opposées. Oscillia n'est plus un monde unique, mais plusieurs versions de la même planète, chacune altérée par différents événements, victoires ou échecs des forces en présence.",
          "En tant que joueur, vous pouvez basculer entre les réalités, ce qui change le monde en temps réel : les combats sont modifiés, les ennemis évoluent, des chemins s'ouvrent ou s'effondrent, des objets bloqués deviennent accessibles... Manipulez la réalité à votre avantage !",
          "## Un univers de science-fiction original",
          "La planète Oscillia a autrefois été le théâtre d'expériences génétiques aussi immorales qu'aléatoires. Les Verraks, une espèce native, ont été dénaturés pour servir un projet plus vaste.",
          "Après leur rébellion, certains clans Verraks se sont approprié une partie du savoir de leurs anciens oppresseurs. Ils peuvent créer des guerriers capables de défendre férocement leur territoire, au prix de quelques dommages collatéraux.",
          "C'est ce savoir que convoitent aujourd'hui les Vorrhyns, une espèce colonialiste et suprémaciste, dans leur quête toujours plus grande de ressources et de pouvoir. Malgré leur supériorité technologique évidente, leur plan ne se déroule pas comme prévu : une force mystérieuse semble toujours à l'œuvre sur Oscillia.",
          "## Un gameplay évolutif",
          "Récoltez des matériaux, acquérez des technologies indigènes et fabriquez un équipement toujours plus puissant selon vos préférences. Recrutez des alliés qui vous aideront à rester en vie en vous accordant divers bonus au cours de vos explorations.",
          "Combattez avec des armes inspirées des univers steampunk et de science-fiction, que vous maniez grâce à un système de tir à double manette (compatible clavier/souris). Gérez votre positionnement en fonction de la portée, de la puissance et du style de tir de votre arme. Surveillez vos chargeurs pour ne pas vous retrouver temporairement vulnérable en plein combat.",
          "Débloquez de nouvelles mécaniques de déplacement et découvrez de nouvelles façons de jouer selon l'équipement de votre personnage.",
          "Et n'oubliez pas, si les choses tournent mal, une autre réalité est sûrement accessible !",
        ],
      },
    },
    posts: {
      // Title kept as-is: "Scientific Game Jam 2026" is the event's official
      // name.
      "scientific-game-jam-2026": {
        body: [
          "Ce week-end, nous avons eu le grand privilège de participer (et de remporter le prix du jury) à la Scientific Game Jam 2026, organisée par le CNES et Toulouse Game Dev à la Cité de l'espace, à Toulouse.",
          { media: true },
          "Le thème consistait à transformer la thèse d'un scientifique en jeu vidéo en 48 heures. Nous avons choisi de travailler sur la thèse d'Adrien Cogez sur les ondes gravitationnelles, en nous associant à Gabriel Bédat pour lui donner vie.",
          "Le jeu, baptisé GWaver, a pris forme au fil de nombreux échanges avec Adrien, en essayant de transformer sa thèse complexe en quelque chose de ludique et pédagogique.",
          { media: true },
          "Beaucoup de rires et une ambiance incroyable sur place, un immense merci aux organisateurs pour leur travail acharné sur cet événement !",
          { media: true },
          "C'est aussi la première jam que nous remportons en équipe, et nous sommes vraiment fiers de ce que nous avons réussi à accomplir en si peu de temps. N'hésitez pas à y jeter un œil !",
        ],
      },
      // Title kept as-is: already French in Sanity.
      "salon-du-jeu-video-toulousain": {
        body: [
          "Hier, le salon du jeu vidéo « Salon du Jeu Vidéo Toulousain », organisé par Toulouse Game Dev, s'est tenu à la Médiathèque José Cabanis.\nNous avons eu l'immense plaisir d'y participer en tant qu'exposants, à l'occasion de la sortie de la démo du nouveau jeu vidéo sur lequel nous travaillons, \"Oscillia: The Shattered Planet\".",
          { media: true },
          "Cela fait maintenant neuf mois que nous travaillons sur ce jeu, sous Unreal Engine, et nous avions hâte de partager ce projet avec une partie de notre communauté !",
          { media: true },
          "L'événement était vraiment intense, mais il reflète parfaitement ce qu'est le monde du jeu vidéo : une communauté accueillante pleine de personnes formidables, des projets faits avec cœur, et une ambiance qui redonne espoir en ces temps difficiles.",
          { media: true },
          "C'était exceptionnel, et un immense merci à TGD pour l'organisation de cet événement, ainsi qu'à toutes les personnes qui ont testé notre jeu.",
          "À bientôt !",
        ],
      },
      "moss-games-a-annecy": {
        title: "Moss Games à Annecy !",
        body: ["Nous sommes allés au festival d'Annecy !", { media: true }],
      },
      "digitum-released": {
        title: "DIGITUM EST SORTI !",
        body: [
          "Digitum est enfin sorti !",
          "Vous pouvez désormais plonger dans une descente endiablée et défier vos amis !",
          "Gratuitement sur Steam !",
        ],
      },
    },
  },
};
