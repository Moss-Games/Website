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

export const metadata = {
  title: "MossGames",
  description: "MossGames video game studio.",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${superCorn.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full w-full flex flex-col">
        <MascotFrame>{children}</MascotFrame>
      </body>
    </html>
  );
}
