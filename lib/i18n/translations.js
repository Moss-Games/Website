// Hand-maintained UI translations. Edit this file directly to change wording
// or add a language (also add the new locale code to lib/i18n/config.js's
// LOCALES array).
//
// This only covers the site's own chrome — nav, buttons, labels, empty
// states, the About/Legal/Privacy copy that lives in these files. Content
// that comes from Sanity (game descriptions, news posts, badges, prices...)
// is authored in English only and is never translated here — see docs on
// the Sanity Studio side.
//
// `t("some.key", { count: 3 })` looks a key up by dot-path and replaces any
// "{name}" placeholders with the matching value from the second argument.
// A key missing from a non-English locale silently falls back to English
// rather than rendering blank (see lib/i18n/utils.js).
export const translations = {
  en: {
    common: {
      discover: "Discover",
      read: "Read",
      readMore: "Read more",
      allNews: "All News",
      seeAllNews: "See All News",
      seeAllProjects: "See All Projects",
      back: "← Back",
      followUs: "Follow us",
      members: "{count} members",
      of: "of",
      reviews: "reviews",
      freeToPlay: "Free to Play",
      screenshot: "screenshot",
      previousImage: "Previous image",
      nextImage: "Next image",
      close: "Close",
      goToImage: "Go to image",
      enlargeImage: "Enlarge image",
      mosaicImage: "Mosaic image",
    },
    nav: {
      home: "Moss Games home",
      allProjects: "All Projects",
      news: "News",
      aboutUs: "About Us",
    },
    localeToggle: {
      label: "Language",
    },
    home: {
      intro:
        "We are a small team of game developers based in Toulouse, France. Passionate about creating environments and stories, we met during our 3D studies and decided to gather our different skills and to bring our ideas to life.",
      findUsOnline: "Find us online",
    },
    newsSection: {
      heading: "News",
      empty: "No news yet — check back soon.",
    },
    newsPage: {
      title: "News",
      empty: "No news yet — check back soon.",
    },
    projectsPage: {
      title: "All Projects",
      empty: "No games yet — check back soon.",
    },
    projectPage: {
      viewOnSteam: "View on Steam",
      viewOnItch: "View on itch.io",
      releaseDate: "Release date",
      price: "Price",
      platforms: "Platforms",
      genres: "Genres",
      languages: "Languages",
      features: "Features",
      screenshots: "Screenshots",
      systemRequirements: "System requirements",
    },
    newsPostPage: {
      back: "← News",
      relatedProject: "Related project",
      relatedPost: "Related post",
    },
    newsletter: {
      title: "Join the newsletter",
      subtitle: "Get updates on new games and devlogs. No spam, unsubscribe anytime.",
      thanks: "Thanks for signing up!",
      emailAriaLabel: "Email address",
      subscribe: "Subscribe",
      subscribing: "Subscribing…",
      error: "Something went wrong — please try again.",
    },
    notFound: {
      title: "Lost in the moss",
      text: "This page must have wandered off. Let's get you back on track.",
      backToHome: "← Back to home",
      browseProjects: "Browse projects",
      readTheNews: "Read the news",
    },
    footer: {
      rights: "© {year} Moss Games. All rights reserved.",
      legalAria: "Legal",
      legalNotice: "Legal Notice",
      privacyPolicy: "Privacy Policy",
    },
    legalPage: {
      title: "Legal Notice",
      body: "Legal information coming soon.",
    },
    privacyPage: {
      title: "Privacy Policy",
      body: "Privacy information coming soon.",
    },
    instagramCard: {
      handle: "Follow us",
    },
    aboutPage: {
      title: "About Us",
      intro: "We are a small team of game developers based in Toulouse, France.",
      bios: {
        camille:
          "Fine Arts degree in 2021, Sociology degree in 2023, graduated from MJM Graphic Design school in 2025, specializing in 3D Realization. She handles all the narrative side and the art direction of the projects.",
        geremy:
          "Scientific Baccalaureate in 2018, Bachelor's level in Computer Science/Mathematics in 2022, graduated from MJM Graphic Design school in 2025, specializing in 3D Realization. Currently an instructor at private schools, teaching Rigging and Tech Art courses, as well as C++/Blueprints programming. He handles all the technical and programming aspects of the projects.",
        tom: "Graduated from MJM Graphic Design school in 2025, specializing in 3D Realization, and holding a STD2A Baccalaureate (Technological Sciences of Design and Applied Arts). He oversees the musical, artistic, and visual branches of the projects.",
      },
    },
  },
  fr: {
    common: {
      discover: "Découvrir",
      read: "Lire",
      readMore: "Lire la suite",
      allNews: "Toutes les news",
      seeAllNews: "Voir toutes les news",
      seeAllProjects: "Voir tous les projets",
      back: "← Retour",
      followUs: "Suivez-nous",
      members: "{count} membres",
      of: "de",
      reviews: "avis",
      freeToPlay: "Gratuit",
      screenshot: "capture d'écran",
      previousImage: "Image précédente",
      nextImage: "Image suivante",
      close: "Fermer",
      goToImage: "Aller à l'image",
      enlargeImage: "Agrandir l'image",
      mosaicImage: "Image",
    },
    nav: {
      home: "Accueil Moss Games",
      allProjects: "Tous les projets",
      news: "Actualités",
      aboutUs: "À propos",
    },
    localeToggle: {
      label: "Langue",
    },
    home: {
      intro:
        "Nous sommes une petite équipe de développeurs de jeux vidéo basée à Toulouse, en France. Passionnés par la création d'environnements et d'histoires, nous nous sommes rencontrés pendant nos études en 3D et avons décidé de réunir nos compétences pour donner vie à nos idées.",
      findUsOnline: "Retrouvez-nous en ligne",
    },
    newsSection: {
      heading: "Actualités",
      empty: "Pas encore d'actualité — revenez bientôt.",
    },
    newsPage: {
      title: "Actualités",
      empty: "Pas encore d'actualité — revenez bientôt.",
    },
    projectsPage: {
      title: "Tous les projets",
      empty: "Pas encore de jeux — revenez bientôt.",
    },
    projectPage: {
      viewOnSteam: "Voir sur Steam",
      viewOnItch: "Voir sur itch.io",
      releaseDate: "Date de sortie",
      price: "Prix",
      platforms: "Plateformes",
      genres: "Genres",
      languages: "Langues",
      features: "Fonctionnalités",
      screenshots: "Captures d'écran",
      systemRequirements: "Configuration requise",
    },
    newsPostPage: {
      back: "← Actualités",
      relatedProject: "Projet associé",
      relatedPost: "Article associé",
    },
    newsletter: {
      title: "Rejoindre la newsletter",
      subtitle: "Recevez les actus sur les nouveaux jeux et les devlogs. Pas de spam, désabonnement à tout moment.",
      thanks: "Merci pour votre inscription !",
      emailAriaLabel: "Adresse e-mail",
      subscribe: "S'abonner",
      subscribing: "Inscription…",
      error: "Une erreur est survenue — veuillez réessayer.",
    },
    notFound: {
      title: "Perdu dans la mousse",
      text: "Cette page a dû s'égarer. Revenons sur le bon chemin.",
      backToHome: "← Retour à l'accueil",
      browseProjects: "Parcourir les projets",
      readTheNews: "Lire les actualités",
    },
    footer: {
      rights: "© {year} Moss Games. Tous droits réservés.",
      legalAria: "Mentions légales",
      legalNotice: "Mentions légales",
      privacyPolicy: "Politique de confidentialité",
    },
    legalPage: {
      title: "Mentions légales",
      body: "Informations légales à venir.",
    },
    privacyPage: {
      title: "Politique de confidentialité",
      body: "Informations de confidentialité à venir.",
    },
    instagramCard: {
      handle: "Suivez-nous",
    },
    aboutPage: {
      title: "À propos",
      intro: "Nous sommes une petite équipe de développeurs de jeux vidéo basée à Toulouse, en France.",
      bios: {
        camille:
          "Diplômée en Arts Plastiques en 2021, en Sociologie en 2023, puis diplômée de l'école MJM Graphic Design en 2025, spécialisée en Réalisation 3D. Elle s'occupe de tout le volet narratif et de la direction artistique des projets.",
        geremy:
          "Baccalauréat Scientifique en 2018, niveau Licence en Informatique/Mathématiques en 2022, puis diplômé de l'école MJM Graphic Design en 2025, spécialisé en Réalisation 3D. Actuellement formateur en écoles privées, il enseigne le Rigging et le Tech Art, ainsi que la programmation C++/Blueprints. Il s'occupe de tout le volet technique et de la programmation des projets.",
        tom: "Diplômé de l'école MJM Graphic Design en 2025, spécialisé en Réalisation 3D, et titulaire d'un Baccalauréat STD2A (Sciences et Technologies du Design et des Arts Appliqués). Il supervise les volets musical, artistique et visuel des projets.",
      },
    },
  },
};
