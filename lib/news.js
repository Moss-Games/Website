import fs from "fs";
import path from "path";

// Every subfolder of public/news/ is one post, discovered automatically —
// adding a post means adding a folder with these files, no code change
// required. Same file-per-fact convention as public/games/ (see
// docs/GAMES.md / docs/NEWS.md).
const NEWS_DIR = path.join(process.cwd(), "public", "news");

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return null;
  }
}

function findAsset(dir, baseName, extensions) {
  for (const ext of extensions) {
    if (fs.existsSync(path.join(dir, `${baseName}.${ext}`))) {
      return `${baseName}.${ext}`;
    }
  }
  return null;
}

function loadPost(folderName) {
  const dir = path.join(NEWS_DIR, folderName);
  const coverFile = findAsset(dir, "cover", ["jpg", "jpeg", "png", "webp"]);

  return {
    slug: folderName.toLowerCase(),
    title: readFileIfExists(path.join(dir, "title.txt")) || folderName,
    // Expected as an ISO date (YYYY-MM-DD) so string sort == chronological sort.
    date: readFileIfExists(path.join(dir, "date.txt")) || "",
    body: readFileIfExists(path.join(dir, "body.md")) || "",
    cover: coverFile ? `/news/${folderName}/${coverFile}` : null,
  };
}

export function getNewsPosts() {
  if (!fs.existsSync(NEWS_DIR)) return [];

  const folders = fs
    .readdirSync(NEWS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return folders
    .map(loadPost)
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first
}
