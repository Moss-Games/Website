import { getLocale, getTranslator } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { CONTACT_EMAIL } from "@/lib/contact";
import LegalDocument, { MailLink } from "../components/LegalDocument";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  return pageMetadata({
    path: "/legal",
    locale,
    title: t("meta.legalTitle"),
    description: t("meta.legalDescription"),
  });
}

// Legal notice required by French law (LCEN, art. 6 III) for any public
// website: who publishes it, who hosts it. Kept here rather than in
// lib/i18n/translations.js because it's long-form, page-specific copy.
const content = {
  en: {
    updated: "Last updated: September 25, 2026",
    sections: [
      {
        heading: "Publisher",
        paragraphs: [
          "This website (www.mossgames.fr) is published by Moss Games, an independent video game development team based in Toulouse, France, made up of Camille Guerraz, Geremy Cambus and Tom Merville.",
          <>
            Contact: <MailLink email={CONTACT_EMAIL} />
          </>,
          "Publication director: Geremy Cambus.",
        ],
      },
      {
        heading: "Hosting",
        paragraphs: [
          "The website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com).",
          "Website content (news, game pages, images) is managed with Sanity (Sanity AS, Oslo, Norway, sanity.io).",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All content on this website (texts, images, logos, the mascot, trailers, screenshots and game assets) is the property of Moss Games unless stated otherwise, and is protected by intellectual property law. Any reproduction or reuse without prior written permission is prohibited.",
          "Press and content creators are welcome to use screenshots and trailers to cover our games. Get in touch if you need other material.",
          "The \"Super Corn\" font is by Ali Hamidi (freeware). Steam and the Steam logo are trademarks of Valve Corporation. Discord and Instagram are trademarks of their respective owners.",
        ],
      },
      {
        heading: "Personal data",
        paragraphs: [
          "How this website handles personal data (newsletter, cookies, analytics) is described in our privacy policy.",
        ],
      },
    ],
  },
  fr: {
    updated: "Dernière mise à jour : 25 septembre 2026",
    sections: [
      {
        heading: "Éditeur",
        paragraphs: [
          "Ce site (www.mossgames.fr) est édité par Moss Games, équipe indépendante de développement de jeux vidéo basée à Toulouse (France), composée de Camille Guerraz, Geremy Cambus et Tom Merville.",
          <>
            Contact : <MailLink email={CONTACT_EMAIL} />
          </>,
          "Directeur de la publication : Geremy Cambus.",
        ],
      },
      {
        heading: "Hébergement",
        paragraphs: [
          "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).",
          "Le contenu du site (actualités, pages des jeux, images) est géré avec Sanity (Sanity AS, Oslo, Norvège, sanity.io).",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          "Sauf mention contraire, l'ensemble des contenus de ce site (textes, images, logos, mascotte, bandes-annonces, captures d'écran et éléments des jeux) est la propriété de Moss Games et protégé par le droit de la propriété intellectuelle. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.",
          "La presse et les créateurs de contenu peuvent librement utiliser les captures d'écran et bandes-annonces pour parler de nos jeux. Contactez-nous pour tout autre besoin.",
          "La police « Super Corn » est une création d'Ali Hamidi (freeware). Steam et le logo Steam sont des marques de Valve Corporation. Discord et Instagram sont des marques de leurs propriétaires respectifs.",
        ],
      },
      {
        heading: "Données personnelles",
        paragraphs: [
          "Le traitement des données personnelles sur ce site (newsletter, cookies, statistiques) est décrit dans notre politique de confidentialité.",
        ],
      },
    ],
  },
};

export default async function LegalPage() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const { updated, sections } = content[locale] || content.en;

  return <LegalDocument title={t("legalPage.title")} updated={updated} sections={sections} />;
}
