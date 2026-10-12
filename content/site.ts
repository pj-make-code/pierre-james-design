// Site-wide copy and links. Components read from here; never hard-code this text.

export type SocialKey = "linkedin" | "instagram" | "github";

export const site = {
  name: "Pierre James Beigh",
  domain: "pierrejames.design",
  // TODO(PJ): confirm the address (PLAN §15 Q2) — needs Cloudflare Email Routing if kept.
  email: "hello@pierrejames.design",
  colophon: "DESIGNED & BUILT BY PJ IN CHICAGO · © 2026",
  // TODO(PJ): real profile URLs — the prototype only has the bare domains.
  socials: [
    { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/" },
    { key: "instagram", label: "Instagram", url: "https://www.instagram.com/" },
    { key: "github", label: "GitHub", url: "https://github.com/" },
  ] satisfies { key: SocialKey; label: string; url: string }[],
} as const;

/** Home sections, in scroll order. `id` is the anchor; `page` is the long-form route, if any. */
export const homeSections = [
  {
    id: "work",
    number: "01",
    title: "Featured Work",
    menuLabel: "Work",
    page: "/work",
    moreLabel: "More work",
  },
  {
    id: "about",
    number: "02",
    title: "About Me",
    menuLabel: "About",
    page: "/about",
    moreLabel: "More about me",
  },
  {
    id: "photos",
    number: "03",
    title: "Photography",
    menuLabel: "Photos",
    page: "/photos",
    moreLabel: "More photos",
  },
  {
    id: "contact",
    number: "04",
    title: "Contact",
    menuLabel: "Contact",
    page: null,
    moreLabel: null,
  },
] as const;

export type HomeSectionId = (typeof homeSections)[number]["id"];
