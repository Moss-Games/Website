const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy for the public site (not /studio: Sanity Studio
// loads from and connects to many *.sanity.io origins and manages its own
// security). No nonces: they'd force every page to render dynamically, so
// inline scripts stay allowed via 'unsafe-inline' (Next.js's documented
// "without nonces" setup). What each external origin is for:
// - cdn.sanity.io: GIFs served unoptimized, trailer .mp4 files, press kit
//   downloads (everything else goes through /_next/image, i.e. 'self')
// - cdn.discordapp.com / *.steamstatic.com: Discord server icon, Steam art
// - www.youtube-nocookie.com: YouTube trailer embed (lib/games.js)
// - vercel.live: the Vercel toolbar on preview deployments
// - va.vercel-scripts.com: Vercel Analytics' script in development
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://vercel.live${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://cdn.sanity.io https://cdn.discordapp.com https://*.steamstatic.com https://vercel.live https://vercel.com;
  media-src 'self' https://cdn.sanity.io;
  font-src 'self' https://vercel.live https://assets.vercel.com;
  connect-src 'self' https://vercel.live wss://ws-us3.pusher.com${isDev ? " https://va.vercel-scripts.com" : ""};
  frame-src https://www.youtube-nocookie.com https://vercel.live;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader.replace(/\s{2,}/g, " ").trim() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/((?!studio).*)", headers: securityHeaders }];
  },
  // Same-origin path to this project's Sanity CDN assets, for the press kit
  // zip (PressKitDownload.js fetches every file from here): Sanity's CDN
  // only allows cross-origin reads from https://www.mossgames.fr, so
  // fetching it directly would fail on localhost and preview deployments.
  // An external rewrite is proxied by Vercel itself (no function, so no
  // 4.5 MB response limit for the trailers).
  async rewrites() {
    const base = `https://cdn.sanity.io/%s/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
    return [
      { source: "/press-assets/images/:path*", destination: `${base.replace("%s", "images")}/:path*` },
      { source: "/press-assets/files/:path*", destination: `${base.replace("%s", "files")}/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/icons/**" },
    ],
  },
  // Lets app/global-not-found.js catch genuinely unmatched URLs — needed
  // because this app has two root layouts (app/(site)/layout.js and
  // app/studio/layout.js), so there's no single layout Next.js could compose
  // a default 404 from. See docs/DESIGN.md.
  experimental: {
    globalNotFound: true,
  },
  // /games moved to /projects (site now also covers films, not just games —
  // see docs/DECISIONS.md); keeps already-shared links (Steam page, socials)
  // working.
  async redirects() {
    return [
      { source: "/games", destination: "/projects", permanent: true },
      { source: "/games/:slug", destination: "/projects/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
