import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import MascotFrame from "./components/MascotFrame";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display font for the "MOSS"/"GAMES" wordmark flanking the mascot's head.
// Super Corn by Ali Hamidi (fontspace.com/super-corn-font-f102376) — freeware,
// free for personal and commercial use. Self-hosted in app/fonts/.
const superCorn = localFont({
  src: "./fonts/SuperCorn.ttf",
  variable: "--font-super-corn",
  display: "swap",
});

const SITE_URL = "https://www.mossgames.fr";
const SITE_DESCRIPTION =
  "MossGames (Moss Games) is a small indie video game studio based in Toulouse, France, crafting story-driven games and immersive environments.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MossGames",
    template: "%s | MossGames",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "MossGames",
    "Moss Games",
    "moss games",
    "MossGames studio",
    "Moss Games studio",
    "MossGames.fr",
    "MossGames Toulouse",
    "Moss Games Toulouse",
    "Toulouse video game studio",
    "French indie game studio",
    "indie game developers France",
  ],
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  openGraph: {
    siteName: "MossGames",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Organization + WebSite structured data: tells Google the "MossGames" /
// "Moss Games" name variants refer to this studio, and gives it a square
// logo to show next to search results / in the knowledge panel. Sitelinks
// (News, All Projects, About) are otherwise fully automatic on Google's
// side — this just gives it the clearest signal we can about site identity.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "MossGames",
      alternateName: ["Moss Games", "MossGames Studio", "Moss Games Studio"],
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      description: SITE_DESCRIPTION,
      sameAs: ["https://www.instagram.com/mossgamesfr/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "MossGames",
      alternateName: ["Moss Games"],
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${superCorn.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full w-full flex flex-col">
        <script
          type="application/ld+json"
          // Static, hardcoded object above — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MascotFrame>{children}</MascotFrame>
        <Analytics />
      </body>
    </html>
  );
}
