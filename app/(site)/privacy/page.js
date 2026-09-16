import { getLocale, getTranslator } from "@/lib/i18n/server";

export const metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPage() {
  const t = getTranslator(await getLocale());

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center font-sans sm:px-5">
      <h1 className="font-display text-4xl tracking-tight text-zinc-900">
        {t("privacyPage.title")}
      </h1>
      <p className="mt-3 max-w-md text-lg text-zinc-600">{t("privacyPage.body")}</p>
    </div>
  );
}
