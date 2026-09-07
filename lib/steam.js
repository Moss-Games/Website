// Steam's public, unauthenticated storefront API — see docs/GAMES.md and
// docs/DECISIONS.md for what was verified about its shape (in particular:
// `movies[]` only exposes streaming manifests, never a direct .mp4, so the
// trailer can never be auto-filled from here).
const APPDETAILS_URL = "https://store.steampowered.com/api/appdetails";
const APPREVIEWS_URL = "https://store.steampowered.com/appreviews";

export function parseSteamAppId(steamUrl) {
  const match = String(steamUrl || "").match(/\/app\/(\d+)/);
  return match ? match[1] : null;
}

export async function fetchSteamAppDetails(appId) {
  const response = await fetch(`${APPDETAILS_URL}?appids=${appId}`);
  if (!response.ok) {
    throw new Error(`Steam appdetails request failed (${response.status})`);
  }
  const json = await response.json();
  const entry = json[appId];
  if (!entry || !entry.success) {
    throw new Error("Steam appdetails returned no data for this app id");
  }
  return entry.data;
}

// Steam's own text carries a trailing "*languages with full audio support"
// note after a <br>, and inline <strong>*</strong> markers on entries that
// have full audio support — both stripped here, leaving a plain comma list.
function parseLanguages(html) {
  if (!html) return [];
  const beforeNote = html.split(/<br\s*\/?>/i)[0];
  return beforeNote
    .replace(/<[^>]+>/g, "")
    .split(",")
    .map((entry) => entry.replace(/\*/g, "").trim())
    .filter(Boolean);
}

function parsePlatforms(platforms) {
  if (!platforms) return [];
  const list = [];
  if (platforms.windows) list.push("Windows");
  if (platforms.mac) list.push("macOS");
  if (platforms.linux) list.push("Linux");
  return list;
}

function parsePrice(data) {
  if (data.is_free) return "Free to Play";
  return data.price_overview?.final_formatted || null;
}

// Maps the raw appdetails payload to this site's game fields, plus the list
// of remote image URLs to download/upload. `header` is also what the
// homepage card displays (GameCard.js) — no separate "cover" concept; see
// docs/GAMES.md for why (no capsule image size matching the card's ratio is
// available without a token, and appdetails doesn't return one anyway).
export function mapSteamDataToGameFields(data) {
  return {
    fields: {
      title: data.name || null,
      tagline: data.short_description || null,
      price: parsePrice(data),
      releaseDate: data.release_date?.date || null,
      genres: (data.genres || []).map((genre) => genre.description),
      platforms: parsePlatforms(data.platforms),
      languages: parseLanguages(data.supported_languages),
    },
    images: {
      header: data.header_image || null,
      // Wide store-page backdrop — used as a library-hero fallback when
      // libraryHeroUrl() 404s (many games, especially demos, never get a
      // dedicated Library Assets set uploaded in Steamworks).
      background: data.background_raw || data.background || null,
      screenshots: (data.screenshots || []).map((shot) => shot.path_full),
    },
  };
}

// Live price + review data for the game page's Steam widget — unlike
// fetchSteamAppDetails (used only at one-off import time, and throws), this
// is called on every page render, so it never throws: any failure (private
// app, rate limit, network blip) just yields null fields and the widget
// renders nothing for that part. Revalidated hourly since price/review
// counts don't need to be second-fresh, and it keeps normal traffic well
// clear of Steam's unauthenticated storefront API rate limits.
export async function fetchSteamLiveStats(appId) {
  const [details, reviews] = await Promise.all([
    fetch(`${APPDETAILS_URL}?appids=${appId}`, { next: { revalidate: 3600 } })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null),
    // num_per_page=0: only query_summary, no individual review bodies needed.
    fetch(`${APPREVIEWS_URL}/${appId}?json=1&language=all&purchase_type=all&num_per_page=0`, {
      next: { revalidate: 3600 },
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null),
  ]);

  const appData = details?.[appId]?.success ? details[appId].data : null;
  const summary = reviews?.success ? reviews.query_summary : null;

  return {
    price: appData?.is_free
      ? { isFree: true }
      : appData?.price_overview
        ? {
            isFree: false,
            final: appData.price_overview.final_formatted,
            initial: appData.price_overview.initial_formatted || null,
            discountPercent: appData.price_overview.discount_percent || 0,
          }
        : null,
    reviews:
      summary && summary.total_reviews > 0
        ? {
            description: summary.review_score_desc,
            totalReviews: summary.total_reviews,
            percentPositive: Math.round(
              (summary.total_positive / summary.total_reviews) * 100
            ),
          }
        : null,
  };
}

// Steam's library_hero.jpg is one of the few assets reachable by a
// predictable, non-tokened URL (confirmed via curl during design) — most
// other assets 404 without the tokened URL from appdetails.
export function libraryHeroUrl(appId) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero.jpg`;
}
