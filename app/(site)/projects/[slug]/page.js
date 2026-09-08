import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getGame, getGames } from "@/lib/games";
import { parseSteamAppId, fetchSteamLiveStats } from "@/lib/steam";
import { isGifUrl } from "@/lib/isGifUrl";
import SteamWidget from "../../components/SteamWidget";
import Reveal from "../../components/Reveal";
import ScreenshotGallery from "../../components/ScreenshotGallery";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return {};
  const title = `${game.title} | MossGames`;
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
  const isItchUrl = Boolean(game.storeUrl && game.storeUrl.includes("itch.io"));

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
                className={`${styles.storeButton} ${steamAppId ? styles.steamButton : ""} ${isItchUrl ? styles.itchButton : ""}`}
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
                {isItchUrl && (
                  <svg className={styles.itchIcon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.03c0 1.303 1.22 2.45 2.325 2.45 1.33 0 2.436-1.102 2.436-2.41 0 1.308 1.07 2.41 2.4 2.41 1.328 0 2.362-1.102 2.362-2.41 0 1.308 1.137 2.41 2.466 2.41h.024c1.33 0 2.466-1.102 2.466-2.41 0 1.308 1.034 2.41 2.363 2.41 1.33 0 2.4-1.102 2.4-2.41 0 1.308 1.106 2.41 2.435 2.41C22.78 8.43 24 7.282 24 5.98V4.95c-.02-.62-2.082-2.99-3.13-3.612-3.253-.114-5.508-.134-8.87-.133-3.362 0-7.945.053-8.87.133zm6.376 6.477a2.74 2.74 0 0 1-.468.602c-.5.49-1.19.795-1.947.795a2.786 2.786 0 0 1-1.95-.795c-.182-.178-.32-.37-.446-.59-.127.222-.303.412-.486.59a2.788 2.788 0 0 1-1.95.795c-.092 0-.187-.025-.264-.052-.107 1.113-.152 2.176-.168 2.95v.005l-.006 1.167c.02 2.334-.23 7.564 1.03 8.85 1.952.454 5.545.662 9.15.663 3.605 0 7.198-.21 9.15-.664 1.26-1.284 1.01-6.514 1.03-8.848l-.006-1.167v-.004c-.016-.775-.06-1.838-.168-2.95-.077.026-.172.052-.263.052a2.788 2.788 0 0 1-1.95-.795c-.184-.178-.36-.368-.486-.59-.127.22-.265.412-.447.59a2.786 2.786 0 0 1-1.95.794c-.76 0-1.446-.303-1.948-.793a2.74 2.74 0 0 1-.468-.602 2.738 2.738 0 0 1-.463.602 2.787 2.787 0 0 1-1.95.794h-.16a2.787 2.787 0 0 1-1.95-.793 2.738 2.738 0 0 1-.464-.602zm-2.004 2.59v.002c.795.002 1.5 0 2.373.953.687-.072 1.406-.108 2.125-.107.72 0 1.438.035 2.125.107.873-.953 1.578-.95 2.372-.953.376 0 1.876 0 2.92 2.934l1.123 4.028c.832 2.995-.266 3.068-1.636 3.07-2.03-.075-3.156-1.55-3.156-3.025-1.124.184-2.436.276-3.748.277-1.312 0-2.624-.093-3.748-.277 0 1.475-1.125 2.95-3.156 3.026-1.37-.004-2.468-.077-1.636-3.072l1.122-4.027c1.045-2.934 2.545-2.934 2.92-2.934zM12 12.714c-.002.002-2.14 1.964-2.523 2.662l1.4-.056v1.22c0 .056.56.033 1.123.007.562.026 1.124.05 1.124-.008v-1.22l1.4.055C14.138 14.677 12 12.713 12 12.713z"
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

            {!game.trailer && game.trailerYoutubeUrl && (
              <Reveal>
                <iframe
                  className={`${styles.trailer} ${styles.trailerYoutube}`}
                  src={game.trailerYoutubeUrl}
                  title={`${game.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
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
                  <ScreenshotGallery screenshots={game.screenshots} title={game.title} />
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
