/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
