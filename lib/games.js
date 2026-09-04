import fs from "fs";
import path from "path";

// Every subfolder of public/games/ is one carousel entry, discovered
// automatically — adding a game means adding a folder with these files,
// no code change required. See docs/DESIGN.md for the file naming contract.
const GAMES_DIR = path.join(process.cwd(), "public", "games");

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return null;
  }
}

function readLines(filePath) {
  const content = readFileIfExists(filePath);
  if (!content) return [];
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function findAsset(dir, baseName, extensions) {
  for (const ext of extensions) {
    if (fs.existsSync(path.join(dir, `${baseName}.${ext}`))) {
      return `${baseName}.${ext}`;
    }
  }
  return null;
}

function storeLabel(url) {
  if (!url) return null;
  if (url.includes("steampowered.com")) return "View on Steam";
  if (url.includes("itch.io")) return "View on itch.io";
  return "View on store page";
}

function readScreenshots(dir, folderName) {
  const screenshotsDir = path.join(dir, "screenshots");
  if (!fs.existsSync(screenshotsDir)) return [];
  return fs
    .readdirSync(screenshotsDir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort()
    .map((file) => `/games/${folderName}/screenshots/${file}`);
}

function loadGame(folderName) {
  const dir = path.join(GAMES_DIR, folderName);
  const slug = folderName.toLowerCase();

  const orderRaw = readFileIfExists(path.join(dir, "order.txt"));
  const order = orderRaw && !Number.isNaN(parseInt(orderRaw, 10))
    ? parseInt(orderRaw, 10)
    : Number.MAX_SAFE_INTEGER;

  const coverFile = findAsset(dir, "cover", ["jpg", "png", "webp"]);
  const headerFile = findAsset(dir, "header", ["jpg", "png", "webp"]);
  const libraryHeroFile = findAsset(dir, "library-hero", ["jpg", "png", "webp"]);
  const trailerPosterFile = findAsset(dir, "trailer-poster", ["jpg", "png"]);
  const hasTrailer = fs.existsSync(path.join(dir, "trailer.mp4"));
  const screenshots = readScreenshots(dir, folderName);
  // Preference order for the game page's hero banner: Steam's "library hero"
  // (1920x620, wide, made for exactly this kind of banner use) > a screenshot
  // (1920x1080, high-res but not designed as a banner) > the store page's own
  // "header" image (only 460x215 — visibly blurry once stretched full-width,
  // last resort for a game with nothing better yet).
  const headerPath = headerFile ? `/games/${folderName}/${headerFile}` : null;
  const libraryHeroPath = libraryHeroFile
    ? `/games/${folderName}/${libraryHeroFile}`
    : null;
  const heroImage = libraryHeroPath || screenshots[0] || headerPath;

  return {
    slug,
    folder: folderName,
    title: readFileIfExists(path.join(dir, "title.txt")) || folderName,
    tagline: readFileIfExists(path.join(dir, "tagline.txt")) || "",
    description: readFileIfExists(path.join(dir, "description.md")) || "",
    storeUrl: readFileIfExists(path.join(dir, "store-url.txt")),
    storeLabel: storeLabel(readFileIfExists(path.join(dir, "store-url.txt"))),
    price: readFileIfExists(path.join(dir, "price.txt")),
    releaseDate: readFileIfExists(path.join(dir, "release-date.txt")),
    genres: readLines(path.join(dir, "genres.txt")),
    platforms: readLines(path.join(dir, "platforms.txt")),
    languages: readLines(path.join(dir, "languages.txt")),
    features: readLines(path.join(dir, "features.txt")),
    systemRequirements: readFileIfExists(path.join(dir, "system-requirements.txt")),
    order,
    cover: coverFile ? `/games/${folderName}/${coverFile}` : null,
    header: headerPath,
    heroImage,
    trailer: hasTrailer ? `/games/${folderName}/trailer.mp4` : null,
    trailerPoster: trailerPosterFile ? `/games/${folderName}/${trailerPosterFile}` : null,
    screenshots,
  };
}

export function getGames() {
  if (!fs.existsSync(GAMES_DIR)) return [];

  const folders = fs
    .readdirSync(GAMES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return folders
    .map(loadGame)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getGame(slug) {
  return getGames().find((game) => game.slug === slug) || null;
}
