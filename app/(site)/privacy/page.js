import { getLocale, getTranslator } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { CONTACT_EMAIL } from "@/lib/contact";
import LegalDocument, { MailLink } from "../components/LegalDocument";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  return pageMetadata({
    path: "/privacy",
    locale,
    title: t("meta.privacyTitle"),
    description: t("meta.privacyDescription"),
  });
}

// GDPR privacy policy. Keep in sync with what the site actually does: the
// newsletter (lib/newsletter.js on Neon, lib/emails/send.js on Resend), the
// moss_locale cookie (lib/i18n/config.js), Vercel Web Analytics (root
// layout) and the youtube-nocookie trailer embed (lib/games.js).
const content = {
  en: {
    updated: "Last updated: September 25, 2026",
    sections: [
      {
        heading: "Who is responsible",
        paragraphs: [
          <>
            Moss Games (Toulouse, France) is responsible for the personal data collected on www.mossgames.fr. For any
            question or request about your data, write to <MailLink email={CONTACT_EMAIL} />.
          </>,
        ],
      },
      {
        heading: "Newsletter",
        paragraphs: [
          "If you sign up for the newsletter, we collect your email address and the date you signed up. It is used only to send you news about our games and studio, and is never sold or shared for advertising.",
          "Legal basis: your consent (GDPR art. 6.1.a). You can withdraw it at any time with the unsubscribe link included in every email, or by writing to us.",
          "Your address is kept until you unsubscribe, then deleted. It is stored in a database hosted by Neon (servers in Frankfurt, Germany) and emails are sent through Resend (Resend Inc., United States).",
        ],
      },
      {
        heading: "Contacting us",
        paragraphs: [
          "If you email us, we use your address and message only to reply, and keep them no longer than needed to follow up on your request.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "This website uses a single cookie, \"moss_locale\", which remembers the language you picked (English or French) for one year. It is strictly necessary for that feature, so it does not require consent.",
          "We use no advertising or tracking cookies.",
        ],
      },
      {
        heading: "Audience statistics",
        paragraphs: [
          "We use Vercel Web Analytics to count page views. It uses no cookies and does not identify you: visits are only counted in aggregate, and no personal data is stored.",
          "Like any web host, Vercel keeps technical logs (such as IP address and browser type) for a short time for security and to keep the site running.",
        ],
      },
      {
        heading: "Embedded content",
        paragraphs: [
          "Game pages can include YouTube trailers, loaded through YouTube's privacy-enhanced mode (youtube-nocookie.com). YouTube (Google) only receives data about you once you play a video. Links to Steam, Discord or Instagram take you to those sites, which have their own privacy policies.",
        ],
      },
      {
        heading: "Transfers outside the EU",
        paragraphs: [
          "Some of our providers (Vercel, Resend) are based in the United States. These transfers are covered by the EU-US Data Privacy Framework and/or the European Commission's standard contractual clauses.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          <>
            You have the right to access, correct and delete your data, to restrict or object to its use, and to data
            portability. To use them, write to <MailLink email={CONTACT_EMAIL} />. If you think your rights are not
            respected, you can file a complaint with the CNIL (cnil.fr), the French data protection authority.
          </>,
        ],
      },
    ],
  },
  fr: {
    updated: "Dernière mise à jour : 25 septembre 2026",
    sections: [
      {
        heading: "Responsable du traitement",
        paragraphs: [
          <>
            Moss Games (Toulouse, France) est responsable des données personnelles collectées sur www.mossgames.fr. Pour
            toute question ou demande concernant vos données, écrivez à <MailLink email={CONTACT_EMAIL} />.
          </>,
        ],
      },
      {
        heading: "Newsletter",
        paragraphs: [
          "Si vous vous inscrivez à la newsletter, nous collectons votre adresse email et la date d'inscription. Elle sert uniquement à vous envoyer des nouvelles de nos jeux et du studio, et n'est jamais vendue ni partagée à des fins publicitaires.",
          "Base légale : votre consentement (art. 6.1.a du RGPD). Vous pouvez le retirer à tout moment grâce au lien de désinscription présent dans chaque email, ou en nous écrivant.",
          "Votre adresse est conservée jusqu'à votre désinscription, puis supprimée. Elle est stockée dans une base de données hébergée par Neon (serveurs à Francfort, Allemagne) et les emails sont envoyés via Resend (Resend Inc., États-Unis).",
        ],
      },
      {
        heading: "Nous contacter",
        paragraphs: [
          "Si vous nous écrivez, votre adresse et votre message servent uniquement à vous répondre, et ne sont pas conservés plus longtemps que nécessaire au suivi de votre demande.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Ce site utilise un seul cookie, « moss_locale », qui mémorise la langue choisie (anglais ou français) pendant un an. Il est strictement nécessaire à cette fonctionnalité et ne demande donc pas de consentement.",
          "Nous n'utilisons aucun cookie publicitaire ou de suivi.",
        ],
      },
      {
        heading: "Mesure d'audience",
        paragraphs: [
          "Nous utilisons Vercel Web Analytics pour compter les pages vues. Cet outil n'utilise pas de cookie et ne vous identifie pas : les visites sont uniquement comptées de façon agrégée, sans stocker de donnée personnelle.",
          "Comme tout hébergeur, Vercel conserve des journaux techniques (adresse IP, type de navigateur...) pendant une courte durée, pour la sécurité et le bon fonctionnement du site.",
        ],
      },
      {
        heading: "Contenus intégrés",
        paragraphs: [
          "Les pages des jeux peuvent contenir des bandes-annonces YouTube, chargées en mode confidentialité renforcée (youtube-nocookie.com). YouTube (Google) ne reçoit de données vous concernant qu'au moment où vous lancez la vidéo. Les liens vers Steam, Discord ou Instagram vous emmènent sur ces sites, qui ont leur propre politique de confidentialité.",
        ],
      },
      {
        heading: "Transferts hors de l'UE",
        paragraphs: [
          "Certains de nos prestataires (Vercel, Resend) sont situés aux États-Unis. Ces transferts sont encadrés par le Data Privacy Framework UE-États-Unis et/ou les clauses contractuelles types de la Commission européenne.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          <>
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
            d&apos;opposition et de portabilité de vos données. Pour les exercer, écrivez à{" "}
            <MailLink email={CONTACT_EMAIL} />. Si vous estimez que vos droits ne sont pas respectés, vous pouvez
            adresser une réclamation à la CNIL (cnil.fr).
          </>,
        ],
      },
    ],
  },
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const { updated, sections } = content[locale] || content.en;

  return <LegalDocument title={t("privacyPage.title")} updated={updated} sections={sections} />;
}
