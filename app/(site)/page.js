import Link from "next/link";
import { getGames } from "@/lib/games";
import { getDiscordInvite } from "@/lib/discord";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { translateGame } from "@/lib/i18n/content-utils";
import GameCard from "./components/GameCard";
import DiscordCard from "./components/DiscordCard";
import InstagramCard from "./components/InstagramCard";
import FeaturedNews from "./components/FeaturedNews";
import NewsSection from "./components/NewsSection";
import Newsletter from "./components/Newsletter";
import Reveal from "./components/Reveal";
import Footer from "./components/Footer";
import ButtonDrift from "./components/ButtonDrift";
import styles from "./page.module.css";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  return pageMetadata({ path: "/", locale, title: undefined, description: t("meta.siteDescription") });
}

export default async function Home() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const games = (await getGames()).filter((game) => game.showOnHomepage).map((game) => translateGame(game, locale));
  const discord = await getDiscordInvite();

  return (
    <div className="flex flex-1 flex-col items-center gap-16 px-6 py-16 text-center font-sans sm:px-5 sm:py-12">
      <p className="max-w-xl text-lg leading-relaxed text-zinc-600">{t("home.intro")}</p>

      <Reveal className="flex w-full justify-center">
        <FeaturedNews />
      </Reveal>

      <Reveal className="flex flex-col items-center gap-8">
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} ctaLabel={t("common.discover")} />
          ))}
        </div>
        <ButtonDrift>
          <Link href="/projects" className={styles.seeAllButton}>
            {t("common.seeAllProjects")} <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </ButtonDrift>
      </Reveal>

      <Reveal className="flex w-full justify-center">
        <Newsletter />
      </Reveal>

      <Reveal className="flex flex-col items-center gap-4">
        <h2 className="font-display text-2xl text-zinc-900">{t("home.findUsOnline")}</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <DiscordCard discord={discord} />
          <InstagramCard />
        </div>
      </Reveal>

      <Reveal className="flex w-full justify-center">
        <NewsSection />
      </Reveal>

      <Reveal className="mt-auto w-full">
        <Footer />
      </Reveal>
    </div>
  );
}
