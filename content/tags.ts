// Tag labels and chip colors, and status dot colors (PLAN §5.4). Colors come from the prototype.
// These are content data, so they live here rather than in styles/tokens.css.

export const TAGS = {
  startups: { label: "Startups", bg: "#2b3b30", fg: "#8fd19e" },
  "ux-design": { label: "UX Design", bg: "#263a4f", fg: "#8cc2ff" },
  "community-building": {
    label: "Community Building",
    bg: "#4a3326",
    fg: "#f0a76b",
  },
  "experience-marketing": {
    label: "Experience Marketing",
    bg: "#3a2f4f",
    fg: "#c3a6ff",
  },
  marketing: { label: "Marketing", bg: "#47402a", fg: "#e8cf7a" },
  "social-design": { label: "Social Design", bg: "#4a2a3d", fg: "#f5a3cf" },
  "ethics-in-business": {
    label: "Ethics in Business",
    bg: "#4a2a2a",
    fg: "#ff9b9b",
  },
  music: { label: "Music", bg: "#2f2f2f", fg: "#c9c9c9" },
} as const;

export type TagKey = keyof typeof TAGS;
export const TAG_KEYS = Object.keys(TAGS) as [TagKey, ...TagKey[]];

export const PROJECT_TYPES = [
  "Product",
  "Venture",
  "Concept",
  "Brand",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const STATUS_DOT = {
  Ongoing: "#8fd19e",
  Shipped: "#8cc2ff",
  Concept: "#c3a6ff",
  Wrapped: "#8f8f8f",
} as const;

export type ProjectStatus = keyof typeof STATUS_DOT;
export const STATUSES = Object.keys(STATUS_DOT) as [
  ProjectStatus,
  ...ProjectStatus[],
];
