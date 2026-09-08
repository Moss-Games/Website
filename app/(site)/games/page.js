import Link from "next/link";
import { getGames } from "@/lib/games";
import GameCard from "../components/GameCard";
import Reveal from "../components/Reveal";
import styles from "./page.module.css";

export const metadata = {
  title: "Games — MossGames",
  description:
    "Every game from MossGames, a video game studio based in Toulouse, France.",
};

export default async function GamesPage() {
  // Unlike the homepage carousel (gated by each game's "Show on homepage
  // carousel" checkbox in Sanity), this page always lists every game —
  // deliberately no filter here.
  const games = await getGames();

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← Back
      </Link>
      <h1 className={styles.title}>All Projects</h1>

      {games.length === 0 ? (
        <p className={styles.empty}>No games yet — check back soon.</p>
      ) : (
        <Reveal className={styles.grid}>
          {games.map((game) => (
            <GameCard key={game.slug} game={game} large />
          ))}
        </Reveal>
      )}
    </div>
  );
}
