import type { Metadata, Viewport } from "next";
import Menu from "@/components/menu/Menu";
import { site } from "@/content/site";
import { mono, serif, ui } from "./fonts";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

// viewport-fit=cover lets the bottom-left Menu clear the iPhone home indicator
// via env(safe-area-inset-bottom).
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${ui.variable} ${mono.variable}`}
    >
      <body>
        {children}
        {/* Lives in the root layout so it persists across navigations (PLAN §5.1). */}
        <Menu />
      </body>
    </html>
  );
}
