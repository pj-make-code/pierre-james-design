import { Inter, Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";

// next/font downloads these at build time and self-hosts them, so visitors never
// make a request to Google. Each exposes a CSS variable that styles/tokens.css reads.

// Body face: the page is serif-first. Italic is used for headings and the name.
export const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-face",
});

// UI face: cards, tables, chips, buttons, properties.
export const ui = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui-face",
});

// Pixel mono: section numbers, captions, labels, footer colophon. SIL OFL — see ./fonts/.
export const mono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-mono-face",
});
