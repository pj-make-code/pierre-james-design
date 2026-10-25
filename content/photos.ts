// Photo list, copied verbatim from the prototype. Real files arrive later: add
// `src` per photo and the tile shows the image instead of its placeholder tone.

export type Photo = {
  src?: string;
  alt: string;
  stock: string;
  camera: string;
  /** CSS aspect-ratio, e.g. "4 / 5". */
  ratio: string;
  /** Placeholder color until `src` exists. */
  tone: string;
  concert: boolean;
  /** Shown in the home page's Photography preview (first six in the prototype). */
  featuredOnHome: boolean;
};

// TODO(PJ): real photos, alt text, and cameras (PLAN §15 Q6).
export const photos: Photo[] = [
  {
    stock: "PORTRA 400",
    camera: "[CAMERA]",
    ratio: "4 / 5",
    tone: "#2e2721",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: true,
  },
  {
    stock: "CINESTILL 800T",
    camera: "[CAMERA]",
    ratio: "3 / 2",
    tone: "#1d2431",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: true,
  },
  {
    stock: "KODAK COLORPLUS 400",
    camera: "[CAMERA]",
    ratio: "4 / 5",
    tone: "#302a1d",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: true,
  },
  {
    stock: "ILFORD HP5 @ 800",
    camera: "[CAMERA]",
    ratio: "1 / 1",
    tone: "#282828",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: true,
  },
  {
    stock: "CINESTILL 800T",
    camera: "[CAMERA]",
    ratio: "4 / 5",
    tone: "#2b1d27",
    alt: "[Describe the photo]",
    concert: true,
    featuredOnHome: true,
  },
  {
    stock: "KENTMERE 400",
    camera: "[CAMERA]",
    ratio: "3 / 2",
    tone: "#252525",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: true,
  },
  {
    stock: "PORTRA 400",
    camera: "[CAMERA]",
    ratio: "3 / 2",
    tone: "#2f2520",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: false,
  },
  {
    stock: "ILFORD HP5 @ 800",
    camera: "[CAMERA]",
    ratio: "4 / 5",
    tone: "#1c1c1c",
    alt: "[Describe the photo]",
    concert: true,
    featuredOnHome: false,
  },
  {
    stock: "KODAK COLORPLUS 400",
    camera: "[CAMERA]",
    ratio: "1 / 1",
    tone: "#2c2820",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: false,
  },
  {
    stock: "CINESTILL 800T",
    camera: "[CAMERA]",
    ratio: "3 / 2",
    tone: "#221a2b",
    alt: "[Describe the photo]",
    concert: true,
    featuredOnHome: false,
  },
  {
    stock: "KENTMERE 400",
    camera: "[CAMERA]",
    ratio: "4 / 5",
    tone: "#2a2a2a",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: false,
  },
  {
    stock: "PORTRA 400",
    camera: "[CAMERA]",
    ratio: "1 / 1",
    tone: "#33291f",
    alt: "[Describe the photo]",
    concert: false,
    featuredOnHome: false,
  },
];
