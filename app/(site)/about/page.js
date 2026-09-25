import Link from "next/link";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { CONTACT_EMAIL } from "@/lib/contact";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  return pageMetadata({ path: "/about", locale, title: t("meta.aboutTitle"), description: t("meta.aboutDescription") });
}

// Names stay as-is in every locale (proper nouns); only bioKey is translated
// (see lib/i18n/translations.js's aboutPage.bios).
const team = [
  { name: "Camille Guerraz", bioKey: "aboutPage.bios.camille" },
  { name: "Geremy Cambus", bioKey: "aboutPage.bios.geremy" },
  { name: "Tom Merville", bioKey: "aboutPage.bios.tom" },
];

export default async function AboutPage() {
  const t = getTranslator(await getLocale());

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-6 py-16 text-center font-sans sm:px-5 sm:py-12">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-display text-4xl tracking-tight text-zinc-900">
          {t("aboutPage.title")}
        </h1>
        <p className="max-w-md text-lg text-zinc-600">{t("aboutPage.intro")}</p>
        <p className="text-base text-zinc-600">
          {t("aboutPage.contact")}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="text-base text-zinc-600">
          {t("aboutPage.press")}{" "}
          <Link
            href="/press"
            className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
          >
            {t("pressPage.title").toLowerCase()}
          </Link>
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-10 text-left sm:grid-cols-3 sm:gap-8">
        {team.map((member) => (
          <div key={member.name} className="flex flex-col gap-2">
            <h2 className="font-display text-xl text-zinc-900">
              {member.name}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              {t(member.bioKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
