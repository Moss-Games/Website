// Handles genuinely unmatched URLs (e.g. a typo'd path) across the whole
// app. This site has two root layouts — app/(site)/layout.js and
// app/studio/layout.js — so Next.js can't compose a single default 404 from
// either one (see next.config.mjs's experimental.globalNotFound flag this
// file requires, and docs/DESIGN.md). Unlike app/(site)/not-found.js (which
// only catches thrown notFound() calls inside that route tree), this file
// bypasses the app's normal rendering entirely, so it re-imports the same
// fonts/styles/MascotFrame the (site) layout uses rather than inheriting
// them.
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import MascotFrame from "./(site)/components/MascotFrame";
import NotFoundContent from "./(site)/components/NotFoundContent";
import "./(site)/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const superCorn = localFont({
  src: "./(site)/fonts/SuperCorn.ttf",
  variable: "--font-super-corn",
  display: "swap",
});

export const metadata = {
  title: "Page Not Found — MossGames",
  description: "The page you're looking for doesn't exist.",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${superCorn.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full w-full flex flex-col">
        <MascotFrame>
          <NotFoundContent />
        </MascotFrame>
      </body>
    </html>
  );
}
