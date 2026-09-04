import { getGames } from "@/lib/games";
import { getDiscordInvite } from "@/lib/discord";
import GameCarousel from "./components/GameCarousel";
import DiscordCard from "./components/DiscordCard";

export default async function Home() {
  const games = getGames();
  const discord = await getDiscordInvite();

  return (
    <div className="flex flex-1 flex-col items-center gap-16 px-6 py-16 text-center font-sans">
      <GameCarousel games={games} />

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-zinc-900">
          Join our Discord
        </h2>
        <DiscordCard discord={discord} />
      </section>
    </div>
  );
}
