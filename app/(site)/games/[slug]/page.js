import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getGame, getGames } from "@/lib/games";
import { parseSteamAppId, fetchSteamLiveStats } from "@/lib/steam";
import { isGifUrl } from "@/lib/isGifUrl";
import SteamWidget from "../../components/SteamWidget";
import Reveal from "../../components/Reveal";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return {};
  const title = `${game.title} — MossGames`;
  const description = game.tagline || undefined;
  return {
    title,
    description,
    // The route's own opengraph-image.js supplies the image.
    openGraph: { title, description, siteName: "MossGames", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Tag clouds (platforms/languages/genres) get a slight alternating tilt —
// a "scattered stickers" look, straightened out on hover — rather than a
// dry comma-joined list. See docs/DESIGN.md for the site's general "shake
// +grow on hover" motif (GameCard.module.css's cardHoverIn is the original).
function TagList({ label, items }) {
  if (!items.length) return null;
  return (
    <div className={styles.tagGroup}>
      <span className={styles.tagLabel}>{label}</span>
      <div className={styles.tagList}>
        {items.map((item, index) => (
          <span
            key={item}
            className={styles.tag}
            style={{ "--tilt": `${(index % 2 === 0 ? -1 : 1) * 2}deg` }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  // Live price/reviews only apply to Steam listings — appId comes from the
  // same storeUrl the page's store button already links to, no separate
  // field (see sanity/schemaTypes/gameType.js for why that split was undone).
  const steamAppId = game.storeUrl ? parseSteamAppId(game.storeUrl) : null;
  const steamStats = steamAppId ? await fetchSteamLiveStats(steamAppId) : null;

  return (
    <article className={styles.page}>
      {game.heroImage && (
        <div className={styles.headerWrap}>
          <Image
            className={styles.header}
            src={game.heroImage}
            unoptimized={isGifUrl(game.heroImage)}
            alt={game.title}
            fill
            priority
            sizes="100vw"
          />
        </div>
      )}

      <div className={styles.body}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>

        <h1 className={styles.title}>{game.title}</h1>
        {game.tagline && <p className={styles.tagline}>{game.tagline}</p>}

        {/* Below ~60rem this just stacks in source order (sidebar bits
            first, so the CTA stays above the fold on mobile); past that,
            .layout switches to a row and .sidebar's `order` moves it to
            the right — see page.module.css. */}
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            {game.storeUrl && (
              <a
                className={`${styles.storeButton} ${steamAppId ? styles.steamButton : ""}`}
                href={game.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {steamAppId && (
                  <svg className={styles.steamIcon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"
                    />
                  </svg>
                )}
                {steamAppId ? "View on Steam" : game.storeLabel}
              </a>
            )}

            {steamStats && <SteamWidget stats={steamStats} />}

            {(game.releaseDate || (game.price && !steamAppId)) && (
              <dl className={styles.metaGrid}>
                {game.releaseDate && (
                  <div>
                    <dt>Release date</dt>
                    <dd>{game.releaseDate}</dd>
                  </div>
                )}
                {game.price && !steamAppId && (
                  <div>
                    <dt>Price</dt>
                    <dd>{game.price}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className={styles.tagGroups}>
              {/* Steam's own store page already shows platform support —
                  redundant here, and this site can't keep it in sync with
                  Steam anyway. */}
              {!steamAppId && <TagList label="Platforms" items={game.platforms} />}
              <TagList label="Genres" items={game.genres} />
              <TagList label="Languages" items={game.languages} />
            </div>
          </div>

          <div className={styles.main}>
            {game.trailer && (
              <Reveal>
                <video
                  className={styles.trailer}
                  controls
                  poster={game.trailerPoster || undefined}
                  src={game.trailer}
                />
              </Reveal>
            )}

            {game.description && (
              <Reveal>
                <div className={styles.description}>
                  <PortableText value={game.description} />
                </div>
              </Reveal>
            )}

            {game.features.length > 0 && (
              <Reveal>
                <section>
                  <h2 className={styles.sectionTitle}>Features</h2>
                  <ul className={styles.featureList}>
                    {game.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {game.screenshots.length > 0 && (
              <Reveal>
                <section>
                  <h2 className={styles.sectionTitle}>Screenshots</h2>
                  <div className={styles.screenshotGrid}>
                    {game.screenshots.map((src) => (
                      <div key={src} className={styles.screenshot}>
                        <Image
                          src={src}
                          unoptimized={isGifUrl(src)}
                          alt={`${game.title} screenshot`}
                          fill
                          sizes="(min-width: 60rem) 33vw, 45vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {game.systemRequirements && (
              <Reveal>
                <section>
                  <h2 className={styles.sectionTitle}>System requirements</h2>
                  <pre className={styles.systemRequirements}>
                    {game.systemRequirements}
                  </pre>
                </section>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
