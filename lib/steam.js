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

const DESCRIPTION_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
};

function decodeDescriptionEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1] === "x" || entity[1] === "X";
      const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return DESCRIPTION_ENTITIES[entity] ?? match;
  });
}

const DESCRIPTION_BLOCK_TAGS = new Set(["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"]);
const DESCRIPTION_HEADING_STYLE = { h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h4", h6: "h4" };

// Steam's `about_the_game`/`detailed_description` HTML is a small, known
// subset (Valve's own "bb_*" classes — confirmed by sampling real store
// pages, e.g. CS2 and Vampire Survivors, during this feature's design): p/
// div/h1-h6 paragraphs, ul/ol/li lists, br line breaks, b/strong/i/em/a
// inline formatting, and img (sometimes bare, sometimes wrapped in a
// <span class="bb_img_ctn">). This walks that subset into Portable Text
// blocks matching sanity/schemaTypes/gameType.js's `description` field —
// image blocks come out with a `steamImageUrl` marker instead of a real
// Sanity asset ref, since downloading/uploading needs the write client
// (app/api/sanity/import-steam/route.js resolves those after calling this).
// Unknown tags (span, table, hr, ...) are dropped but their inner content
// is kept, so unrecognized markup degrades to plain text instead of being
// lost.
export function steamDescriptionToBlocks(html) {
  if (!html) return [];

  let keyCounter = 0;
  const nextKey = (prefix) => `${prefix}-${keyCounter++}`;

  const blocks = [];
  const listStack = []; // { tag: "ul" | "ol" }
  const markStack = []; // active decorators, e.g. ["strong", "em"]
  const linkKeyStack = []; // active markDef _key values, one per open <a>
  let block = null;

  function startBlock(style = "normal") {
    const top = listStack[listStack.length - 1];
    block = {
      _type: "block",
      _key: nextKey("block"),
      style,
      markDefs: [],
      children: [],
      ...(top ? { listItem: top.tag === "ol" ? "number" : "bullet", level: listStack.length } : {}),
    };
  }

  function flushBlock() {
    if (block && block.children.some((child) => child.text.trim() !== "")) {
      blocks.push(block);
    }
    block = null;
  }

  function appendText(text) {
    if (!text) return;
    if (!block) startBlock();
    block.children.push({
      _type: "span",
      _key: nextKey("span"),
      text,
      marks: [...markStack, ...linkKeyStack.filter(Boolean)],
    });
  }

  function addImage(src) {
    if (!src) return;
    flushBlock();
    blocks.push({ _type: "image", _key: nextKey("image"), steamImageUrl: src });
  }

  function toggleMark(mark, isClosing) {
    if (!isClosing) {
      markStack.push(mark);
      return;
    }
    const index = markStack.lastIndexOf(mark);
    if (index !== -1) markStack.splice(index, 1);
  }

  for (const part of html.split(/(<[^>]+>)/g)) {
    if (!part) continue;

    if (part[0] !== "<") {
      appendText(decodeDescriptionEntities(part));
      continue;
    }

    const tagMatch = part.match(/^<\/?\s*([a-zA-Z0-9]+)/);
    if (!tagMatch) continue;
    const tag = tagMatch[1].toLowerCase();
    const isClosing = part[1] === "/";

    if (tag === "br" || tag === "hr") {
      flushBlock();
    } else if (tag === "img") {
      addImage(part.match(/\bsrc=["']([^"']+)["']/)?.[1]);
    } else if (tag === "ul" || tag === "ol") {
      flushBlock();
      if (!isClosing) listStack.push({ tag });
      else listStack.pop();
    } else if (tag === "li") {
      flushBlock();
      if (!isClosing) startBlock();
    } else if (DESCRIPTION_BLOCK_TAGS.has(tag)) {
      flushBlock();
      if (!isClosing) startBlock(DESCRIPTION_HEADING_STYLE[tag] || "normal");
    } else if (tag === "strong" || tag === "b") {
      toggleMark("strong", isClosing);
    } else if (tag === "em" || tag === "i") {
      toggleMark("em", isClosing);
    } else if (tag === "a") {
      if (!isClosing) {
        const href = part.match(/\bhref=["']([^"']+)["']/)?.[1];
        if (href) {
          if (!block) startBlock();
          const key = nextKey("link");
          block.markDefs.push({ _type: "link", _key: key, href });
          linkKeyStack.push(key);
        } else {
          linkKeyStack.push(null);
        }
      } else {
        linkKeyStack.pop();
      }
    }
    // Other tags (span, table, br's siblings, etc.) are dropped, keeping
    // their inner text/children.
  }
  flushBlock();

  return blocks;
}

// Maps the raw appdetails payload to this site's game fields, plus the list
// of remote image URLs to download/upload. `header` is also what the
// homepage card displays (GameCard.js) — no separate "cover" concept; see
// docs/GAMES.md for why (no capsule image size matching the card's ratio is
// available without a token, and appdetails doesn't return one anyway).
export function mapSteamDataToGameFields(data) {
  // `about_the_game` is Steam's own "About This Game" section — cleaner
  // than `detailed_description`, which often repeats it plus extra
  // marketing/legal boilerplate up top. Falls back to the latter for the
  // rare listing that only sets one of the two.
  const description = steamDescriptionToBlocks(data.about_the_game || data.detailed_description);

  return {
    fields: {
      title: data.name || null,
      tagline: data.short_description || null,
      description: description.length > 0 ? description : null,
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
