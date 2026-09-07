import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getNewsPost } from "@/lib/news";
import { urlForImage } from "@/sanity/lib/image";

const superCornData = await readFile(
  join(process.cwd(), "app/(site)/fonts/SuperCorn.ttf")
);

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  const background = post?.cover ? urlForImage(post.cover).width(1200).height(630).url() : null;

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
          <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 2 }}>
            MossGames News
          </div>
          <div style={{ display: "flex", fontFamily: "Super Corn", fontSize: 64, color: "#fafaf7", marginTop: 10 }}>
            {post?.title || "MossGames"}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Super Corn", data: superCornData, style: "normal" }] }
  );
}
