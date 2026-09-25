import Link from "next/link";
import { getGames } from "@/lib/games";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { translateGame } from "@/lib/i18n/content-utils";
import GameCard from "../components/GameCard";
import Reveal from "../components/Reveal";
import styles from "./page.module.css";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  return pageMetadata({ path: "/projects", locale, title: t("meta.projectsTitle"), description: t("meta.projectsDescription") });
}

export default async function GamesPage() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  // Unlike the homepage carousel (gated by each game's "Show on homepage
  // carousel" checkbox in Sanity), this page always lists every game
  // (deliberately no filter here).
  const games = (await getGames()).map((game) => translateGame(game, locale));

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        {t("common.back")}
      </Link>
      <h1 className={styles.title}>{t("projectsPage.title")}</h1>

      {games.length === 0 ? (
        <p className={styles.empty}>{t("projectsPage.empty")}</p>
      ) : (
        <Reveal className={styles.grid}>
          {games.map((game) => (
            <GameCard key={game.slug} game={game} large ctaLabel={t("common.discover")} />
          ))}
        </Reveal>
      )}
    </div>
  );
}
