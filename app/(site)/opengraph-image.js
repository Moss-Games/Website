import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The default social-share card for every route that doesn't provide its
// own opengraph-image.js (games/[slug] and news/[slug] override this with
// content-specific art). Reads local assets once at module scope — see
// Next.js's opengraph-image docs, "Using Node.js runtime with local assets".
const logoData = await readFile(join(process.cwd(), "public/images/logo.png"));
const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;
const superCornData = await readFile(
  join(process.cwd(), "app/(site)/fonts/SuperCorn.ttf")
);

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#0d0d0d",
        }}
      >
        <img src={logoSrc} alt="" width={220} height={220} />
        <div style={{ display: "flex", fontFamily: "Super Corn", fontSize: 96, color: "#fafaf7" }}>
          MossGames
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#a1a1aa" }}>
          Video game studio — Toulouse, France
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Super Corn", data: superCornData, style: "normal" }] }
  );
}
