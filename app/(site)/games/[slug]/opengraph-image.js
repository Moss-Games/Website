import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getGame } from "@/lib/games";

const superCornData = await readFile(
  join(process.cwd(), "app/(site)/fonts/SuperCorn.ttf")
);

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Game taglines can run to a full sentence or two (see GameCard.module.css's
// line-clamp for the same issue elsewhere) — too long to fit this card's
// fixed 630px height once wrapped, so trim to a single short line here.
function truncate(text, maxLen = 90) {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}…`;
}

export default async function Image({ params }) {
  const { slug } = await params;
  const game = await getGame(slug);
  const background = game?.heroImage || game?.header;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0d0d0d",
        }}
      >
        {background && (
          <img
            src={background}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 64,
            background:
              "linear-gradient(0deg, rgba(13,13,13,0.95) 15%, rgba(13,13,13,0.15) 75%)",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Super Corn", fontSize: 80, color: "#fafaf7" }}>
            {game?.title || "MossGames"}
          </div>
          {game?.tagline && (
            <div style={{ display: "flex", fontSize: 32, color: "#e4e4e7", marginTop: 14 }}>
              {truncate(game.tagline)}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Super Corn", data: superCornData, style: "normal" }] }
  );
}
