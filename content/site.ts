// Site-wide copy and links. Components read from here; never hard-code this text.

export type SocialKey = "linkedin" | "instagram" | "github";

/** A run of hero text: plain words, a line break, or a link (brand links take the brand's color token). */
export type Inline =
  | string
  | { br: true }
  | {
      text: string;
      href: string;
      brand?: "hale" | "honors";
      external?: boolean;
    };

const portrait = {
  // TODO(PJ): replace with a higher-res portrait (≥ 640px square) — this 321px copy came out of the prototype and looks soft on retina screens.
  src: "/images/portrait.jpg",
  width: 321,
  height: 321,
};

export const site = {
  name: "Pierre James Beigh",
  domain: "pierrejames.design",
  description:
    "Pierre James Beigh is a human-centered designer, experiential marketer, and community builder in Chicago.",
  // TODO(PJ): confirm the address (PLAN §15 Q2) — needs Cloudflare Email Routing if kept.
  email: "hello@pierrejames.design",
  colophon: "DESIGNED & BUILT BY PJ IN CHICAGO · © 2026",
  // TODO(PJ): real profile URLs — the prototype only has the bare domains.
  socials: [
    {
      key: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/pierre-james",
    },
    { key: "instagram", label: "Instagram", url: "https://www.instagram.com/" },
    { key: "github", label: "GitHub", url: "https://github.com/" },
  ] satisfies { key: SocialKey; label: string; url: string }[],
  // TODO(PJ): add public/resume.pdf — held back because the current PDF lists a phone number and the repo is public.
  resume: "/resume.pdf",

  hero: {
    portrait: {
      ...portrait,
      alt: "Pierre James Beigh in an argyle sweater vest, seated in front of a blue painted backdrop",
    },
    intro: [
      [
        "I am a human-centered designer,",
        { br: true },
        "experiential marketer, and community builder.",
      ],
      [
        "Currently I lead product design at ",
        { text: "Hale", href: "/work/hale", brand: "hale" },
        ",",
        { br: true },
        "and I build community for ",
        {
          text: "Honors Fund.",
          href: "https://honorsfund.com/",
          brand: "honors",
          external: true,
        },
      ],
    ] satisfies Inline[][],
  },

  about: {
    statement: "Empathy is my superpower.",
    paragraphs: [
      "I am a firm believer that every human has an innate drive to create. “Die Empty” means continuously striving to express yourself.",
      "In myself, I fuel this drive every day by pursuing opportunities to create an impact on others. In my experience, I’ve found that this success often stems from building a strong foundation of empathy.",
    ],
    portrait: { ...portrait, alt: "Portrait of PJ" },
  },

  contact: {
    statement: "I love meeting new people. Say hello.",
    copyLabel: "Copy my email",
    copiedLabel: "Copied to clipboard",
  },
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
