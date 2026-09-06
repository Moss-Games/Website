// Steam's public, unauthenticated storefront API — see docs/GAMES.md and
// docs/DECISIONS.md for what was verified about its shape (in particular:
// `movies[]` only exposes streaming manifests, never a direct .mp4, so the
// trailer can never be auto-filled from here).
const APPDETAILS_URL = "https://store.steampowered.com/api/appdetails";

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
      screenshots: (data.screenshots || []).map((shot) => shot.path_full),
    },
  };
}

// Steam's library_hero.jpg is one of the few assets reachable by a
// predictable, non-tokened URL (confirmed via curl during design) — most
// other assets 404 without the tokened URL from appdetails.
export function libraryHeroUrl(appId) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero.jpg`;
}
