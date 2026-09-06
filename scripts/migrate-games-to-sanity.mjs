// One-off migration: reads the old public/games/<Name>/*.txt file-per-field
// folders (docs/GAMES.md's old contract) and creates matching Sanity "game"
// documents (sanity/schemaTypes/gameType.js), uploading local assets.
//
// Not part of the app — run once by hand:
//   node --env-file=.env.local scripts/migrate-games-to-sanity.mjs
//
// Safe to re-run per game: it skips any game whose slug already has a
// document in the dataset.
import fs from "fs";
import path from "path";
import { createClient } from "next-sanity";

const GAMES_DIR = path.join(process.cwd(), "public", "games");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

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

function readScreenshots(dir) {
  const screenshotsDir = path.join(dir, "screenshots");
  if (!fs.existsSync(screenshotsDir)) return [];
  return fs
    .readdirSync(screenshotsDir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort()
    .map((file) => path.join(screenshotsDir, file));
}

// The old description.md format was deliberately minimal: paragraphs +
// **bold** only (see the now-deleted lib/markdown.js). Converts that same
// subset to Sanity portable text blocks.
function markdownToPortableText(markdown) {
  if (!markdown) return [];
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph) => ({
    _type: "block",
    _key: crypto.randomUUID(),
    style: "normal",
    markDefs: [],
    children: paragraph
      .split(/(\*\*[^*]+\*\*)/g)
      .filter(Boolean)
      .map((part) => {
        const isBold = part.startsWith("**") && part.endsWith("**");
        return {
          _type: "span",
          _key: crypto.randomUUID(),
          text: isBold ? part.slice(2, -2) : part,
          marks: isBold ? ["strong"] : [],
        };
      }),
  }));
}

async function uploadImage(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function uploadFile(filePath, contentType) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const asset = await client.assets.upload("file", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType,
  });
  return { _type: "file", asset: { _type: "reference", _ref: asset._id } };
}

async function migrateGame(folderName) {
  const dir = path.join(GAMES_DIR, folderName);
  const slug = folderName.toLowerCase();

  const existing = await client.fetch(`*[_type == "game" && slug.current == $slug][0]._id`, {
    slug,
  });
  if (existing) {
    console.log(`skip ${slug} — already exists (${existing})`);
    return;
  }

  const orderRaw = readFileIfExists(path.join(dir, "order.txt"));
  const order =
    orderRaw && !Number.isNaN(parseInt(orderRaw, 10)) ? parseInt(orderRaw, 10) : undefined;

  const headerFile = findAsset(dir, "header", ["jpg", "png", "webp"]);
  const libraryHeroFile = findAsset(dir, "library-hero", ["jpg", "png", "webp"]);
  const trailerPosterFile = findAsset(dir, "trailer-poster", ["jpg", "png"]);
  const trailerPath = path.join(dir, "trailer.mp4");
  const hasTrailer = fs.existsSync(trailerPath);
  const screenshotPaths = readScreenshots(dir);

  // headerImage also serves as the homepage card's image (GameCard.js) — no
  // separate "cover" field/upload, see docs/DECISIONS.md 2026-09-06.
  const [headerImage, libraryHeroImage, trailerPoster, trailer, screenshots] =
    await Promise.all([
      uploadImage(headerFile && path.join(dir, headerFile)),
      uploadImage(libraryHeroFile && path.join(dir, libraryHeroFile)),
      uploadImage(trailerPosterFile && path.join(dir, trailerPosterFile)),
      hasTrailer ? uploadFile(trailerPath, "video/mp4") : null,
      // Array-of-object fields need a _key per item (Sanity requirement) —
      // single image fields like headerImage above don't.
      Promise.all(
        screenshotPaths.map(async (p) => {
          const image = await uploadImage(p);
          return image ? { ...image, _key: crypto.randomUUID() } : null;
        })
      ),
    ]);

  const doc = {
    _type: "game",
    title: readFileIfExists(path.join(dir, "title.txt")) || folderName,
    slug: { _type: "slug", current: slug },
    tagline: readFileIfExists(path.join(dir, "tagline.txt")) || undefined,
    description: markdownToPortableText(readFileIfExists(path.join(dir, "description.md"))),
    storeUrl: readFileIfExists(path.join(dir, "store-url.txt")) || undefined,
    price: readFileIfExists(path.join(dir, "price.txt")) || undefined,
    releaseDate: readFileIfExists(path.join(dir, "release-date.txt")) || undefined,
    genres: readLines(path.join(dir, "genres.txt")),
    platforms: readLines(path.join(dir, "platforms.txt")),
    languages: readLines(path.join(dir, "languages.txt")),
    features: readLines(path.join(dir, "features.txt")),
    systemRequirements: readFileIfExists(path.join(dir, "system-requirements.txt")) || undefined,
    order,
    unlisted: fs.existsSync(path.join(dir, "unlisted.txt")),
    ...(headerImage ? { headerImage } : {}),
    ...(libraryHeroImage ? { libraryHeroImage } : {}),
    ...(trailerPoster ? { trailerPoster } : {}),
    ...(trailer ? { trailer } : {}),
    ...(screenshots.some(Boolean) ? { screenshots: screenshots.filter(Boolean) } : {}),
  };

  const created = await client.create(doc);
  console.log(`created ${slug} — ${created._id}`);
}

async function main() {
  const folders = fs
    .readdirSync(GAMES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const folder of folders) {
    await migrateGame(folder);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
