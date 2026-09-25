import Image from "next/image";
import Link from "next/link";
import { getGames } from "@/lib/games";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { translateGame } from "@/lib/i18n/content-utils";
import { CONTACT_EMAIL } from "@/lib/contact";
import { DISCORD_INVITE_URL } from "@/lib/discord";
import { isGifUrl } from "@/lib/isGifUrl";
import { MailLink } from "../components/LegalDocument";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  return pageMetadata({ path: "/press", locale, title: t("meta.pressTitle"), description: t("meta.pressDescription") });
}

// Press kit (in the spirit of presskit()): a fact sheet, the studio blurb,
// and per-game key art/screenshots/trailer as full-resolution downloads.
// Every game's assets come from Sanity (lib/games.js's `press` field), so a
// new game or screenshot shows up here with no code change.
const team = [
  { name: "Camille Guerraz", roleKey: "pressPage.roles.camille" },
  { name: "Geremy Cambus", roleKey: "pressPage.roles.geremy" },
  { name: "Tom Merville", roleKey: "pressPage.roles.tom" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/mossgamesfr/" },
  { label: "Discord", href: DISCORD_INVITE_URL },
];

const linkClass = "font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600";

function Fact({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="text-sm text-zinc-900">{children}</dd>
    </div>
  );
}

// A thumbnail linking to its full-resolution download.
function DownloadImage({ src, href, alt, label, wide = false }) {
  return (
    <a
      href={href}
      download
      aria-label={`${label}: ${alt}`}
      className="group relative block overflow-hidden rounded-lg border border-zinc-200"
    >
      <Image
        src={src}
        alt={alt}
        width={wide ? 1200 : 800}
        height={wide ? 387 : 450}
        sizes={wide ? "(min-width: 64rem) 60rem, 100vw" : "(min-width: 64rem) 20rem, (min-width: 40rem) 50vw, 100vw"}
        unoptimized={isGifUrl(src)}
        className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <span className="absolute bottom-2 right-2 rounded bg-zinc-900/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        ↓ {label}
      </span>
    </a>
  );
}

function GameKit({ game, t }) {
  const facts = [
    game.releaseDate && [t("pressPage.releaseDate"), game.releaseDate],
    game.platforms.length > 0 && [t("pressPage.platforms"), game.platforms.join(", ")],
    game.price && [t("pressPage.price"), game.price],
  ].filter(Boolean);
  const art = [
    game.press.libraryHero && { src: game.heroImage, href: game.press.libraryHero, alt: game.heroAlt || game.title, label: t("pressPage.banner"), wide: true },
    game.press.header && { src: game.header, href: game.press.header, alt: game.headerAlt || game.title, label: t("pressPage.capsule") },
  ].filter(Boolean);

  return (
    <section className="flex flex-col gap-6 border-t border-zinc-200 pt-10">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl text-zinc-900">{game.title}</h3>
        {game.tagline && <p className="text-base text-zinc-600">{game.tagline}</p>}
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href={`/projects/${game.slug}`} className={linkClass}>
            {t("pressPage.viewPage")}
          </Link>
          {game.storeUrl && (
            <a href={game.storeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {t("pressPage.store")}
            </a>
          )}
          {game.press.trailer && (
            <a href={game.press.trailer} download className={linkClass}>
              {t("pressPage.downloadTrailer")}
            </a>
          )}
          {game.trailerYoutubeLink && (
            <a href={game.trailerYoutubeLink} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {t("pressPage.watchTrailer")}
            </a>
          )}
        </p>
      </div>

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <Fact key={label} label={label}>
              {value}
            </Fact>
          ))}
        </dl>
      )}

      {art.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{t("pressPage.art")}</h4>
          <div className="flex flex-col gap-4">
            {art.map((item) => (
              <DownloadImage key={item.href} {...item} />
            ))}
          </div>
        </div>
      )}

      {game.press.screenshots.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{t("pressPage.screenshots")}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {game.press.screenshots.map((href, index) => (
              <DownloadImage
                key={href}
                src={game.screenshots[index]}
                href={href}
                alt={game.screenshotAlts[index] || `${game.title} ${t("common.screenshot")} ${index + 1}`}
                label={t("pressPage.download")}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default async function PressPage() {
  const locale = await getLocale();
  const t = getTranslator(locale);
  const games = (await getGames()).map((game) => translateGame(game, locale));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-6 py-16 font-sans sm:px-5 sm:py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-4xl tracking-tight text-zinc-900">{t("pressPage.title")}</h1>
        <p className="max-w-xl text-lg text-zinc-600">{t("pressPage.intro")}</p>
      </header>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl text-zinc-900">{t("pressPage.factSheet")}</h2>
          <dl className="flex flex-col gap-4">
            <Fact label={t("pressPage.studio")}>Moss Games</Fact>
            <Fact label={t("pressPage.basedIn")}>{t("pressPage.basedInValue")}</Fact>
            <Fact label={t("pressPage.teamSize")}>{t("pressPage.teamSizeValue")}</Fact>
            <Fact label={t("pressPage.website")}>
              <a href="https://www.mossgames.fr" className={linkClass}>
                mossgames.fr
              </a>
            </Fact>
            <Fact label={t("pressPage.pressContact")}>
              <MailLink email={CONTACT_EMAIL} />
            </Fact>
            <Fact label={t("pressPage.socials")}>
              <span className="flex flex-wrap gap-x-3">
                {socials.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {social.label}
                  </a>
                ))}
              </span>
            </Fact>
          </dl>
        </section>

        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-xl text-zinc-900">{t("pressPage.about")}</h2>
            <p className="text-base leading-relaxed text-zinc-600">{t("home.intro")}</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display text-xl text-zinc-900">{t("pressPage.team")}</h2>
            <ul className="flex flex-col gap-2">
              {team.map((member) => (
                <li key={member.name} className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-900">{member.name}</span>, {t(member.roleKey)}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display text-xl text-zinc-900">{t("pressPage.logo")}</h2>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="/images/logo.png"
                download="moss-games-logo.png"
                className="rounded-lg border border-zinc-200 p-4"
              >
                <Image src="/images/logo.png" alt="Moss Games logo" width={288} height={288} className="h-24 w-auto" />
              </a>
              <a href="/images/logo.png" download="moss-games-logo.png" className={`text-sm ${linkClass}`}>
                {t("pressPage.downloadLogo")}
              </a>
            </div>
          </section>
        </div>
      </div>

      {games.length > 0 && (
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-3xl text-zinc-900">{t("pressPage.games")}</h2>
          {games.map((game) => (
            <GameKit key={game.slug} game={game} t={t} />
          ))}
        </div>
      )}

      <p className="border-t border-zinc-200 pt-8 text-center text-sm text-zinc-600">
        {t("pressPage.usage")} <MailLink email={CONTACT_EMAIL} />
      </p>
    </div>
  );
}
