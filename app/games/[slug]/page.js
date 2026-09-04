import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, getGames } from "@/lib/games";
import MarkdownText from "@/app/components/MarkdownText";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getGames().map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: `${game.title} — MossGames`,
    description: game.tagline || undefined,
  };
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <article className={styles.page}>
      {game.heroImage && (
        <img className={styles.header} src={game.heroImage} alt={game.title} />
      )}

      <div className={styles.body}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>

        <h1 className={styles.title}>{game.title}</h1>
        {game.tagline && <p className={styles.tagline}>{game.tagline}</p>}

        {game.storeUrl && (
          <a
            className={styles.steamButton}
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {game.storeLabel}
          </a>
        )}

        <dl className={styles.metaGrid}>
          {game.releaseDate && (
            <div>
              <dt>Release date</dt>
              <dd>{game.releaseDate}</dd>
            </div>
          )}
          {game.price && (
            <div>
              <dt>Price</dt>
              <dd>{game.price}</dd>
            </div>
          )}
          {game.platforms.length > 0 && (
            <div>
              <dt>Platforms</dt>
              <dd>{game.platforms.join(", ")}</dd>
            </div>
          )}
          {game.languages.length > 0 && (
            <div>
              <dt>Languages</dt>
              <dd>{game.languages.join(", ")}</dd>
            </div>
          )}
          {game.genres.length > 0 && (
            <div>
              <dt>Genres</dt>
              <dd>{game.genres.join(", ")}</dd>
            </div>
          )}
        </dl>

        {game.trailer && (
          <video
            className={styles.trailer}
            controls
            poster={game.trailerPoster || undefined}
            src={game.trailer}
          />
        )}

        {game.description && (
          <div className={styles.description}>
            <MarkdownText content={game.description} />
          </div>
        )}

        {game.features.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Features</h2>
            <ul className={styles.featureList}>
              {game.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {game.screenshots.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Screenshots</h2>
            <div className={styles.screenshotGrid}>
              {game.screenshots.map((src) => (
                <img key={src} src={src} alt={`${game.title} screenshot`} />
              ))}
            </div>
          </section>
        )}

        {game.systemRequirements && (
          <section>
            <h2 className={styles.sectionTitle}>System requirements</h2>
            <pre className={styles.systemRequirements}>
              {game.systemRequirements}
            </pre>
          </section>
        )}
      </div>
    </article>
  );
}
