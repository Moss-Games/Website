export default function manifest() {
  return {
    name: "MossGames",
    short_name: "MossGames",
    description:
      "MossGames is a small video game studio based in Toulouse, France.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#0d0d0d",
    icons: [
      { src: "/images/logo.png", sizes: "288x288", type: "image/png" },
      { src: "/favicon.png", sizes: "any", type: "image/png" },
    ],
  };
}
