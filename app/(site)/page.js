import Link from "next/link";
import { getGames } from "@/lib/games";
import { getDiscordInvite } from "@/lib/discord";
import GameCard from "./components/GameCard";
import DiscordCard from "./components/DiscordCard";
import InstagramCard from "./components/InstagramCard";
import LatestNewsCard from "./components/LatestNewsCard";
import Newsletter from "./components/Newsletter";
import Reveal from "./components/Reveal";
import Footer from "./components/Footer";
import styles from "./page.module.css";

export const metadata = {
  description:
    "MossGames (Moss Games) is a small indie video game studio based in Toulouse, France, crafting story-driven games and immersive environments.",
};

export default async function Home() {
  const games = (await getGames()).filter((game) => game.showOnHomepage);
  const discord = await getDiscordInvite();

  return (
    <div className="flex flex-1 flex-col items-center gap-16 px-6 py-16 text-center font-sans">
      <p className="max-w-xl text-lg leading-relaxed text-zinc-600">
        We are a small team of game developers based in Toulouse, France.
        Passionate about creating environments and stories, we met during our
        3D studies and decided to gather our different skills and to bring
        our ideas to life.
      </p>

      <Reveal className="flex flex-col items-center gap-8">
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
        <Link href="/projects" className={styles.seeAllButton}>
          See All Projects <span className={styles.arrow} aria-hidden="true">→</span>
        </Link>
      </Reveal>

      <Reveal className="flex w-full flex-wrap items-stretch justify-center gap-6">
        <LatestNewsCard />
        <Newsletter />
      </Reveal>

      <Reveal className="flex flex-col items-center gap-4">
        <h2 className="font-display text-2xl text-zinc-900">
          Find us online
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <DiscordCard discord={discord} />
          <InstagramCard />
        </div>
      </Reveal>

      <Reveal className="mt-auto w-full">
        <Footer />
      </Reveal>
    </div>
  );
}
