# pierrejames.design — Master Build Plan

> **Status:** DRAFT v0.2 · Oct 7, 2026 (prototype revisions in §18) · Owner: Pierre James Beigh ("PJ")
> **Purpose of this doc:** single source of truth for _what_ we're building and _how_. Written for two readers: PJ (a designer, non-engineer) and AI coding agents (Claude Code). Decisions marked **[LOCKED]** are settled; **[PROPOSED]** are recommendations awaiting PJ's call; **[OPEN]** are unresolved (see §16).

---

## 0. Instructions for AI agents reading this doc

- Read this whole file before writing code. Re-read §4 (screens) and §6 (content model) before touching any page.
- **Do not invent design decisions.** If something isn't specified, implement the simplest neutral version, leave a `// TODO(PJ):` comment, and list it in your summary.
- Never add a dependency without stating why in the PR/commit message. Default answer is "no new dependency."
- All content lives in `src/content/`. Never hard-code project copy inside components.
- All colors, spacing, radii, type sizes come from `src/styles/tokens.css`. No raw hex values in components.
- Every interactive feature must work with keyboard only and degrade gracefully with JavaScript disabled (links still navigate to real pages).
- After each phase, update §17 (Decisions log) with anything decided during the build.

---

## 1. Project summary

**What:** A custom-coded personal portfolio replacing PJ's current Notion page (which `pierrejames.design` currently redirects to).

**The concept in one line:** _Charlie Deets' calm, menu-button navigation wrapped around Notion's page-and-database behaviors_ — a portfolio that feels like a polished, personal Notion workspace, not a template.

**Primary audience:** hiring managers and design leads for **product design roles (SF)**. Secondary: founders/clients, creative peers.

**What success looks like**

- A hiring manager understands who PJ is and opens a case study within 10 seconds of landing.
- Case studies read like Notion pages (properties, callouts, toggles, galleries) but look more refined than Notion.
- The site is fast (Lighthouse 95+), works great on a phone, and PJ can add a new project by copying a folder and editing text.
- Personality shows (photography, music, the game) without distracting from the work.

**Constraints [LOCKED]**

- Hosted on **Cloudflare**, custom domain **pierrejames.design** (DNS already in Cloudflare).
- Code lives in a **GitHub repo PJ owns**.
- **No CMS.** Content is hard-coded as files in the repo.
- Built primarily with **Claude Code** ("vibe coded"); PJ directs and reviews.

---

## 2. Inspiration & design principles

### 2.1 From Charlie Deets (charliedeets.com) — take the _navigation and restraint_

- Home is a calm hero: rounded-square portrait left, name + 2–3 sentence bio right. Key words in the bio are brighter and **link out** (to essays, companies, case studies); the rest of the sentence is dimmed gray.
- **Floating "Menu" pill, bottom-left, fixed.** Clicking it expands a rounded popover from the same corner: `Home` / divider / `Work · Timeline · Photos · Writing · Links` / divider / `Close`. Current page is white; others are gray.
- Section pages can have a **segmented tab bar, top-center** (Photos: `Feed · Albums · Recipes · Cameras`) for sub-pages.
- Dark background (~#161616), one sans typeface, almost no chrome. Portrait swaps between dark and light variants per theme.

### 2.2 From Notion — take the _behaviors_, not the chrome

Keep: databases with properties, gallery/table views, filter chips, **peek** (open a page in a window over the current one) with an **expand to full page** button, page anatomy (cover → icon → title → properties → blocks), callouts, toggles, columns, captions, the right-edge mini table-of-contents.
Drop: purple header bars with emoji, link-underline blue, Notion UI noise ("Get Notion free", sort/filter icons on the home page).

### 2.3 Principles

1. **Work first, personality second.** Personality is a reward for scrolling, not a gate.
2. **Every click is a real URL.** Peek windows, tabs, and filters are reflected in the address bar so anything can be shared or bookmarked.
3. **Notion-familiar, not Notion-cloned.** Users should feel "oh, like Notion" — then notice it's nicer.
4. **Quiet UI, loud content.** Chrome is gray; photos and project covers carry the color.

---

## 3. Information architecture

### 3.1 Routes

| Route              | Page                                                                | MVP?                         |
| ------------------ | ------------------------------------------------------------------- | ---------------------------- |
| `/`                | Home scroll (hero → work → about → photos → contact → game)         | ✅                           |
| `/work/`           | Projects database (gallery + table views, filters)                  | ✅ (simple)                  |
| `/work/[slug]/`    | Project page (full-page) — also loads inside the peek window        | ✅                           |
| `/photos/`         | Photography w/ top tab bar: `Feed · Rolls · Film Stocks · Concerts` | Phase 2                      |
| `/photos/[album]/` | Album / roll                                                        | Phase 2                      |
| `/about/`          | Long-form about (four C's, toolkit, music, press, creations)        | Phase 2 (MVP = home section) |
| `/links/`          | Contact + socials + resume                                          | Phase 2 (MVP = home section) |
| `/resume.pdf`      | Static PDF                                                          | ✅                           |
| `/404`             | Custom not-found (could hold the game)                              | Phase 2                      |

### 3.2 Menu contents [PROPOSED]

```
Home
──────────
Work
About
Photos
Contact
──────────
Close
```

- On **`/`**, Work/About/Photos/Contact smooth-scroll to sections (`/#about`), and the menu highlights the section currently in view (scroll-spy).
- On **other pages**, items navigate to their route (or `/#section` until that route exists).
- **[OPEN Q1]** Do About/Contact ever become their own pages, or stay home-only?

---

## 4. MVP screens (spec)

MVP = **Screen A: Home scroll** + **Screen B: Project page** (full + peek) + a minimal `/work/` database.

### Screen A — Home scroll

**Global:** fixed Menu pill (§5.1). Dark theme. Content column max ~1100px, centered.

**A1. Hero** (≥ ~80vh)

- Layout mirrors Charlie: portrait (rounded square, ~320–520px) left; text right. Stacks vertically on mobile (photo on top).
- Name: "Pierre James" (+ "…but my friends call me PJ" as small aside — **[OPEN Q8]**).
- Bio (draft, PJ to rewrite): _"I design products with a focus on [research], [clarity], and [community]. I'm Head of Design at [Hale]. Previously I led marketing at [Top Tier Lessons] and founded [Jamtown]."_ — bracketed words are bright + linked; the rest is dim.
- Small meta line: "Based in Chicago" · availability status (e.g., "Open to product design roles in SF") **[OPEN Q9]**.
- Social text links: LinkedIn · Instagram · Email.
- Optional: Currently/Previously ledger _below_ the bio as a compact two-column list (current Notion content).

**A2. Selected Work**

- Section label (small, gray, e.g. `Work`) + optional one-line intro.
- **3 featured projects** = `projects` where `featured: true`, sorted by `order`.
- Gallery cards: cover image (16:10), icon + title, 1-line summary, up to 3 tag chips.
- Card click → **opens peek** (§5.2). Cmd/Ctrl-click → new tab at `/work/[slug]/`.
- Footer link: `View all work →` (`/work/`) showing count ("All 6 projects").

**A3. About**

- Short bio (2 paragraphs) + photo.
- **Four C's** as a designed set piece (4-up grid; each C = word + one-line definition). Not chips.
- Toolkit chips (Figma, Notion, …) — consider merging into the game (§5.4).
- "7 songs" Spotify embed — **lazy-loaded** behind a click-to-load facade (Spotify iframes are heavy).
- Recent press as 1–2 Notion-style bookmark cards.

**A4. Photography (preview)**

- Epigraph: _"visual storytelling — what do you see?"_
- 6–9 photo grid (masonry or justified rows), each with film-stock caption in mono (e.g. `PORTRA 400`).
- Click → lightbox (arrow keys, swipe, Esc). Footer link: `See all photos →` (Phase 2 page; until then link to lightbox of all).

**A5. Contact**

- Big line: _"I love meeting new people. I reply to almost every email — say hello."_
- Primary: email (click-to-copy + mailto). Secondary: Book a call (Cal.com), LinkedIn, Instagram, Resume (PDF).
- Optional: "Send me your 7 songs" / anonymous feedback link (Tally form) **[OPEN Q12]**.

**A6. Game + footer**

- **Breakout** (brick breaker) canvas, ~400–500px tall, starts on click/tap "Play".
- Footer colophon: "Designed & built by PJ in Chicago · © 2026".

### Screen B — Project page

Same component renders in two shells:

- **Full page** at `/work/[slug]/` (direct visits, shares, SEO).
- **Peek window** over the current page (from cards).

**Anatomy (Notion page model)**

1. **Cover** image (full width, ~30vh, optional).
2. **Icon** (emoji or small logo) overlapping the cover edge.
3. **Title** (large).
4. **Properties block** — two-column rows: `Role` · `Timeline` · `Team` · `Type/Tags` (colored chips) · `Links` (website, press) · `Status`.
5. **TL;DR callout** — 2–3 sentence summary + 3 key outcome stats.
6. **Body** (MDX) using the block library (§5.3): Challenge / Solution columns, images with captions, galleries, toggles for deep-dives, quotes, stat grids, press bookmarks.
7. **Right-edge mini TOC** (Notion's line markers; hover reveals headings) on desktop full-page only.
8. **Next / previous project** links at the bottom.

**Suggested case-study narrative** (for PJ's writing, not enforced by code): Context → Problem → My role → Research → Key insights → Design decisions (with rejected alternatives) → Outcome/metrics → What I'd do differently.

### Screen C — `/work/` database (MVP-lite)

- Title "Work" + count.
- **View switcher:** `Gallery` | `Table` (Notion-style tabs).
- **Filter chips:** by tag (multi-select), by role/type. "Reset" clears. State lives in the URL: `/work/?tag=ux-design&view=table`.
- **Sort:** newest / oldest.
- Table view columns: icon+title, role, year, tags, status.
- Rows/cards open peek; same behavior as home.

---

## 5. Component & interaction specs

### 5.1 Menu (Charlie-style)

> **Revised 2026-10-07 → see §18.1.** Button moves to the top-left, keeps the word "Menu" set in italic Libre Baskerville, and the panel drops down from it.

- `<button>` pill fixed `left: 24px; bottom: 24px` (safe-area aware on iOS). Label "Menu".
- Opens a popover anchored to the same corner, animating from the pill (scale + fade, 180ms, ease-out). Pill morphs into panel (stretch goal: View Transitions / FLIP).
- Items as listed in §3.2; active item = primary text color, others = secondary gray. Dividers are 1px hairlines.
- Close via `Close` item, Esc, click outside, or selecting an item.
- A11y: `aria-expanded`, `aria-controls`, focus moves to first item on open and returns to the pill on close; focus trapped while open.
- Keyboard shortcut `M` toggles (ignored when typing in inputs). **[PROPOSED]**
- Hidden during the game being played? **[OPEN Q14]**

### 5.2 Peek window (Notion "center peek")

**Behavior**

1. Cards are real links: `<a href="/work/jamtown/">`. Without JS, they just navigate.
2. With JS, a plain click is intercepted: open a `<dialog>` (centered, ~min(900px, 92vw) × 90vh, rounded, scrollable, backdrop dimmed), fetch `/work/jamtown/`, extract the `[data-page-content]` element, inject it.
3. `history.pushState` to `/work/jamtown/` so the URL is shareable; browser **Back closes the peek**.
4. Peek header toolbar: `⤢ Open as full page` · `🔗 Copy link` · `✕ Close`. Optional ↑/↓ to move to prev/next project inside the peek.
5. "Open as full page" navigates to the URL (use the View Transitions API so the window grows into the page where supported).
6. Esc / backdrop click / ✕ closes and restores the previous URL and scroll position.
7. On mobile (<640px) the peek becomes a full-screen sheet sliding up from the bottom.

- Prefetch the project HTML on card hover/focus for an instant feel.
- **[OPEN Q4]** Center peek vs. side peek (Notion has both).

### 5.3 Block library (MDX components for case studies)

`<Callout icon="💡">`, `<Toggle title="">`, `<Columns>` / `<Column>`, `<Figure src caption>`, `<Gallery>`, `<Stats>` (big number + label grid), `<Quote>`, `<Bookmark url>` (press card), `<Divider>`, `<Video>` (self-hosted or YouTube facade), `<BeforeAfter>` (stretch). Each styled to feel like Notion's block but refined.

### 5.4 Game — Breakout / brick breaker

> **Superseded 2026-10-07 → the game is now Toolkit Invaders, a Space Invaders–style shooter. See §18.5.** The notes below are kept for history.

- HTML `<canvas>`, vanilla TypeScript, `requestAnimationFrame`. No game library.
- **Concept [PROPOSED]:** the bricks _are_ PJ's toolkit chips (Figma, Notion, Photoshop…) or the project tag colors — "break my toolkit." Breaking all bricks reveals a message: "Nice. Now let's build something → [email]".
- Starts only on explicit "Play" (no scroll hijack). Controls: mouse/trackpad, ← →, touch drag on mobile. Space = pause.
- Only initializes when scrolled into view (IntersectionObserver); pauses when off-screen or tab hidden.
- `prefers-reduced-motion`: show static brick wall + play button (user can still opt in).
- Optional: local high score (localStorage), lives counter, sound off by default.

### 5.5 Lightbox (photos)

Native `<dialog>`, arrow keys + swipe, caption with film stock + camera, preloads neighbors. ~80 lines, no library.

---

## 6. Content model ("the database")

Projects are a typed collection — this is what makes Notion-style filtering possible without a CMS. Each project is a folder:

```
src/content/projects/jamtown/
├── index.mdx        # properties (frontmatter) + body
├── cover.jpg
└── images/…
```

**Schema** (Astro content collection, validated with Zod — a build fails if a field is missing or mistyped):

```ts
// src/content.config.ts
const projects = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      icon: z.string().optional(), // emoji or path
      cover: image(),
      summary: z.string().max(140), // card one-liner
      role: z.array(z.string()), // e.g. ["Founder", "Designer"]
      tags: z.array(z.enum(TAGS)), // see tags.ts for labels + colors
      type: z.enum(["Product", "Venture", "Concept", "Brand"]),
      start: z.coerce.date(),
      end: z.coerce.date().optional(), // absent = ongoing
      team: z.array(z.string()).optional(),
      links: z
        .array(z.object({ label: z.string(), url: z.string().url() }))
        .optional(),
      stats: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .optional(),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      status: z.enum(["published", "draft"]).default("published"),
    }),
});
```

`src/content/tags.ts` maps tag → label + color token (mirrors Notion's colored chips): Startups, UX Design, Community Building, Experience Marketing, Marketing, Social Design, Ethics in Business, Music.

Other collections: `photos` (file, caption, filmStock, camera, album, date, featured), `press` (title, outlet, url, image), plus `src/content/site.ts` for hero bio, four C's, toolkit, contact links.

**Notion migration tip:** Notion can export the Featured Projects database as **CSV + Markdown files** — that maps almost 1:1 onto this schema. Claude Code can convert the export into project folders. Export images from Notion (its hosted image URLs expire).

---

## 7. Tech stack [PROPOSED]

| Layer            | Choice                                                                                                                    | Why                                                                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | **Astro** (latest)                                                                                                        | Built for content sites: outputs plain static HTML (fast), first-class Markdown/MDX + typed content collections (our "database"), image optimization built in, and you only ship JS for the interactive bits ("islands"). Deploys to Cloudflare as static files — no server. |
| Language         | **TypeScript**                                                                                                            | Catches mistakes; Claude Code is very fluent in it. Matches PJ's Hale stack.                                                                                                                                                                                                 |
| Content          | **MDX** files in `src/content/`                                                                                           | Markdown that can use components like `<Callout>`. Easy for PJ to edit.                                                                                                                                                                                                      |
| Styling          | **Plain CSS + CSS custom properties** (`tokens.css`), Astro scoped styles                                                 | Tokens map 1:1 to Figma variables; no framework to learn. (Tailwind is an acceptable alternative — **[OPEN Q16]**.)                                                                                                                                                          |
| Interactivity    | Vanilla TS for menu, peek, lightbox, game. **Optional Preact** island for the `/work/` database if filtering logic grows. | Smallest possible JS.                                                                                                                                                                                                                                                        |
| Images           | Astro `<Image>`/`<Picture>` → AVIF/WebP, responsive `srcset`, lazy-loaded                                                 | Photography-heavy site must stay fast.                                                                                                                                                                                                                                       |
| Fonts            | Self-hosted via Fontsource (no Google Fonts request)                                                                      | Speed + privacy.                                                                                                                                                                                                                                                             |
| Hosting          | **Cloudflare** (Workers static assets or Pages), connected to GitHub                                                      | Free, global CDN, domain already there, auto-deploy on push, preview URL for every branch.                                                                                                                                                                                   |
| Analytics        | Cloudflare Web Analytics (free, cookie-less)                                                                              | No cookie banner needed.                                                                                                                                                                                                                                                     |
| Forms (optional) | Tally embed                                                                                                               | No backend.                                                                                                                                                                                                                                                                  |

**Why not Next.js?** It works, and PJ knows it from Hale — but on Cloudflare it needs an adapter (OpenNext) and it's built for apps, not content. Astro gives the same component model with less to break. **[OPEN Q15]**

---

## 8. Repo structure

```
pierrejames-site/
├── CLAUDE.md                  # short: "read docs/PLAN.md first" + conventions
├── docs/PLAN.md               # this file
├── astro.config.mjs
├── package.json
├── public/
│   ├── resume.pdf
│   ├── favicon.svg
│   └── og/                    # social share images
└── src/
    ├── content.config.ts      # collection schemas (§6)
    ├── content/
    │   ├── projects/<slug>/index.mdx (+ images)
    │   ├── photos/…
    │   ├── press/…
    │   ├── site.ts            # hero, four C's, toolkit, links
    │   └── tags.ts
    ├── styles/
    │   ├── tokens.css         # ALL design tokens
    │   ├── base.css           # reset, typography
    │   └── blocks.css         # Notion-style block styles
    ├── components/
    │   ├── Menu.astro
    │   ├── Peek.astro (+ peek.ts)
    │   ├── ProjectCard.astro
    │   ├── PropertyList.astro
    │   ├── TagChip.astro
    │   ├── Lightbox.astro (+ lightbox.ts)
    │   ├── Breakout.astro (+ breakout.ts)
    │   ├── WorkDatabase.astro (+ database.ts)
    │   └── blocks/ Callout, Toggle, Columns, Figure, Gallery, Stats, Quote, Bookmark…
    ├── layouts/
    │   ├── BaseLayout.astro   # <head>, meta/OG, Menu, theme
    │   └── ProjectLayout.astro
    └── pages/
        ├── index.astro
        ├── work/index.astro
        ├── work/[slug].astro
        └── 404.astro
```

---

## 9. Design tokens (starting point — PJ to own)

```css
:root {
  /* color — dark default */
  --bg: #161616; /* Charlie ~#161616, Notion ~#191919 */
  --surface: #1f1f1f; /* cards, peek window */
  --surface-raised: #262626; /* menu popover */
  --border: rgba(255, 255, 255, 0.08);
  --text: #ededed;
  --text-muted: #8f8f8f; /* the "dim" bio words */
  --accent: #9d7bff; /* PJ purple — from Notion header bars, refined */
  /* Notion-style tag colors (bg / text) */
  --tag-green-bg: #2b3b30;
  --tag-green: #8fd19e;
  --tag-orange-bg: #4a3326;
  --tag-orange: #f0a76b;
  --tag-purple-bg: #3a2f4f;
  --tag-purple: #c3a6ff;
  --tag-blue-bg: #263a4f;
  --tag-blue: #8cc2ff;
  --tag-red-bg: #4a2a2a;
  --tag-red: #ff9b9b;
  --tag-yellow-bg: #47402a;
  --tag-yellow: #e8cf7a;
  /* type */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: var(--font-sans); /* [OPEN Q7] serif? */
  --font-mono:
    "JetBrains Mono", ui-monospace, monospace; /* film-stock captions — SUPERSEDED by Departure Mono, see §18.3 */
  --step--1: 0.875rem;
  --step-0: 1rem;
  --step-1: 1.25rem;
  --step-2: 1.75rem;
  --step-3: 2.5rem;
  --step-4: 3.5rem;
  /* space, radius, motion */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 24px;
  --radius-pill: 999px;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 150ms;
  --dur-med: 250ms;
}
```

> **Revised 2026-10-07:** `--bg` is now `#202020`, the font is Libre Baskerville and the accent font is Departure Mono. See §18.2–18.3 for the updated token values.

Light theme **[OPEN Q6]**: same tokens redefined under `[data-theme="light"]` and `prefers-color-scheme`.

---

## 10. Quality bar

- **Accessibility:** WCAG AA contrast (check `--text-muted` on `--bg`), visible focus rings, alt text on every image (film photos get descriptive alt + caption), keyboard-complete menu/peek/lightbox/game, `prefers-reduced-motion` respected.
- **Performance:** Lighthouse ≥95 all categories on mobile. Hero image preloaded; everything below fold lazy. JS on home < 30KB gzipped (excluding Spotify, which loads on click).
- **SEO/sharing:** per-page `<title>`, description, Open Graph image (auto-generated per project or hand-made), canonical URLs, `sitemap.xml`, `robots.txt`.
- **Responsive:** 360px phone → ultrawide. Test on PJ's real phone via the Cloudflare preview URL.
- **Browsers:** latest Safari, Chrome, Firefox; iOS Safari is the priority mobile target.

---

## 11. Hosting & deployment

1. Create GitHub repo `pierrejames-site` (private or public **[OPEN Q17]**).
2. In Cloudflare dashboard → Workers & Pages → create from GitHub repo. Build command `npm run build`, output dir `dist`.
3. Every push to `main` → production deploy. Every other branch → its own preview URL (great for reviewing on phone).
4. Attach custom domain `pierrejames.design` (+ `www` redirect). Remove the current redirect-to-Notion rule at the same moment.
5. Enable Cloudflare Web Analytics.

**Do step 1–3 on day one** with a "hello world" page, so deployment is proven before design work.

---

## 12. Build workflow (for PJ, non-technical)

**One-time setup (≈30–60 min, Claude Code can walk you through it):** install Node.js (LTS), Git, a code editor (VS Code or Cursor), GitHub account, Claude Code. Clone the repo.

**Daily loop:**

1. Open the project folder in terminal → run `claude`.
2. Tell Claude Code what to build, referencing this doc ("Implement §5.1 Menu").
3. Run `npm run dev` → open `localhost:4321` → the page updates live as files change.
4. Review in the browser. Give feedback like a design crit: screenshots + specifics.
5. When happy: ask Claude Code to commit and push. Cloudflare deploys automatically in ~1 min.

**Adding a project later:** duplicate a project folder, rename, swap images, edit the text at the top (properties) and the body. Push. Done.

**Tips:** work in small slices (one component per session); keep a git branch per feature; when something breaks, ask Claude Code to "revert to the last commit" — nothing is ever lost.

---

## 13. Phases & acceptance criteria

| Phase               | Scope                                                                                     | Done when…                                                               |
| ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **P0 Setup**        | Repo, Astro scaffold, tokens file, Cloudflare deploy of hello-world on a preview URL      | URL loads on phone                                                       |
| **P1 Shell**        | BaseLayout, tokens, typography, Menu (§5.1)                                               | Menu opens/closes by mouse, keyboard, Esc; looks right at 360px + 1440px |
| **P2 Home scroll**  | A1–A5 with real content for hero; placeholder elsewhere                                   | All sections render; menu scroll-spy works                               |
| **P3 Project page** | Content schema, 1 real project (Jamtown?) migrated, full page + block library basics      | `/work/jamtown/` reads like a refined Notion page                        |
| **P4 Peek**         | Peek window + expand + URL/back behavior                                                  | Card → peek → expand → back works; share link opens full page            |
| **P5 Work DB**      | `/work/` gallery/table + tag filters in URL                                               | Filter + reload keeps state                                              |
| **P6 Game**         | Breakout                                                                                  | Playable on desktop + phone, no scroll hijack                            |
| **P7 Launch**       | All featured projects migrated, photos, a11y + Lighthouse pass, OG images, domain cutover | pierrejames.design serves the new site                                   |
| **Later**           | `/photos/` with tab bar, `/about/`, `/links/`, light mode, timeline, writing              | —                                                                        |

**Fastest-path prototype (if shipping fast matters):** P0 → P1 → P2 → P3 is a believable, shareable site. Peek, database, and game are enhancements on top.

---

## 14. Out of scope (for now)

CMS, blog/writing, comments, auth, server code, e-commerce (poster shop lives elsewhere), i18n.

---

## 15. Content inventory (from current Notion page)

- **Identity:** "Hey, I'm Pierre James… but my friends call me PJ." Chicago.
- **Positioning (current):** "human-centered designer, experiential marketer, and community builder." → needs a product-design-forward rewrite.
- **Currently:** Hale (Head of Design / co-founder) · HonorsFund (scouting/ops) · Jamtown (founder). **Previously:** OTHER (Experience Design) · Top Tier Lessons (CMO) · Pie (Creator Fund).
- **Featured projects (5):** Jamtown · Top Tier Lessons · Public Transit Redesign (Team Transit / MTD) · Terms & Conditions Redesign · The Greenhouse. **Missing:** Hale (strongest product-design story).
- **About:** four C's (Creativity, Connection, Curiosity, Commitment), bio on creating + empathy, My Creations (Graphic Design, Short Films, Resources, Notion Templates), Recent Press (Smile Politely on Jamtown), 7-song Spotify playlist.
- **Toolkit:** Figma, Notion, Photoshop, HubSpot, Meta Business Suite, Premiere Pro, MySQL, Excel, After Effects, Monday, Miro, Lightroom.
- **Photography:** 35mm (Portra 400, CineStill 800T, Kodak ColorPlus 400, Ilford HP5 pushed to 800, Kentmere 400) + concert photography.
- **Contact:** Email, LinkedIn, Cal.com, Instagram, resume, anonymous feedback.

**Assets needed from PJ:** hi-res portrait(s) (dark + light variants?), project covers + case-study images, photo selects with film stock/camera, resume PDF, final URLs (LinkedIn, IG, Cal.com, Spotify), rewritten bio.

---

## 16. Open questions

See the conversation thread; answered items move to §17.

Q1 About/Contact as pages or home-only · Q4 center vs side peek · Q6 light mode in MVP · Q7 serif display face? · Q8 keep "friends call me PJ" · Q9 availability line · Q12 feedback/7-songs form · Q14 menu during game · Q15 Astro vs Next.js · Q16 plain CSS vs Tailwind · Q17 public vs private repo · plus content questions (which projects, Hale case study, NDA).

---

## 17. Decisions log

| Date       | Decision                                                                                                                                        | By  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 2026-10-06 | Host on Cloudflare at pierrejames.design, own repo, no CMS                                                                                      | PJ  |
| 2026-10-06 | MVP = home scroll + project page                                                                                                                | PJ  |
| 2026-10-07 | Typeface: Libre Baskerville; name, "Menu" and page titles in italic; background #202020                                                         | PJ  |
| 2026-10-07 | Keep the word "Menu" (italic), button top-left                                                                                                  | PJ  |
| 2026-10-07 | Section-header convention: title left, "More" right, 1px white underline; "More" opens the section's full page                                  | PJ  |
| 2026-10-07 | Home trimmed: one-line bio, Featured Work, About Me, Photography (+ Contact, game); cut content moves to /about/                                | PJ  |
| 2026-10-07 | /about/ and /photos/ become real pages in MVP (resolves Q1 for About)                                                                           | PJ  |
| 2026-10-07 | Icons: Phosphor Icons (LinkedIn, Instagram, GitHub)                                                                                             | PJ  |
| 2026-10-07 | Accent font: Departure Mono                                                                                                                     | PJ  |
| 2026-10-07 | Game: Space Invaders–style shooter replaces Breakout                                                                                            | PJ  |
| 2026-10-07 | Hero: 36px name, 16px bio, Hale link #F04146, Honors Fund link #00FFE1, icon-only socials                                                       | PJ  |
| 2026-10-11 | Game: windowless, no start button, ship follows mouse x, click in area to start; classic 1-bit art with original sprites; toolkit theme dropped | PJ  |

---

## 18. Design revisions from the prototype (Oct 7, 2026)

These changes came out of reviewing the interactive prototype in the Design canvas (_pierrejames.design — Prototype_). **Where §18 conflicts with an earlier section, §18 wins.** Agents: implement these, not the superseded specs.

### 18.1 Layout & navigation

- **Menu:** a fixed button at the top-left (`left: 32px; top: 32px`, safe-area aware). It is a 1px white outline, ~10px radius, with the word **"Menu"** in _italic_ Libre Baskerville (~21px). The panel drops down from the button's top-left corner. Items, a11y and close behavior are unchanged from §5.1. On `/` the items scroll to sections; on other pages they open that section's page.
- **Home is simpler.** In order:
  1. **Hero:** portrait, the name _Pierre James Beigh_ in italic, and a one-line bio: "I design products with a focus on functionality over form." No socials, ledger or availability line in the hero.
  2. **Featured Work:** the 3 project cards. Their descriptions stay.
  3. **About Me:** "Empathy is my superpower." plus 2 short paragraphs and a photo.
  4. **Photography:** 6-photo preview.
  5. **Contact**, then the **game**, then the footer.
- **Section-header convention (all section headers):**
  - The title sits on the left in Libre Baskerville (~22px, white).
  - The word **"More"** sits on the right (~15px) and is a link to that section's full page, with an accessible name such as "More work".
  - A **1px solid white rule** runs under the row.
  - Sections with no page (Contact, the game) omit "More".
  - Build it as a component: `SectionHeader.astro` with props `title`, `index`, `moreHref?`.
- **Full pages that "More" leads to:**
  - `/work/`: the database from Screen C.
  - `/about/`: the long form, holding the content cut from home (Four C's, Experience, Toolkit, Seven Songs, Press). **In MVP now.**
  - `/photos/`: tab bar `Feed · Film Stocks · Concerts`, where Film Stocks groups photos by stock. **Moved into MVP.**
- Page titles (`Work`, `About Me`, `Photography`, project titles) are set in italic.

- **Hero (revised by PJ, Oct 7):** see the bullets below. Fixed `width` values from canvas editing are not part of the spec; use `max-width` so it stays fluid.
  - **Type sizes:** the name is 36px italic; bio and body lines are 16px / 1.6.
  - **Copy:** "I am a human-centered designer, experiential marketer, and community builder." followed by "Currently I lead product design at **Hale**, and I build community for **Honors Fund**."
  - **Company links use each company's brand color** (no underline; underline on hover):
    - Hale `#F04146`, opening the Hale peek.
    - Honors Fund `#00FFE1`, an external link.
  - **Social row:** LinkedIn / Instagram / GitHub as icon-only Phosphor icons (24px, `#8f8f8f`, 44×44 hit area, `aria-label` each) under the bio.
  - **[OPEN] Contrast:** `#F04146` on `#202020` is 4.31:1, just under WCAG AA (4.5:1) for 16px text. `#F2484D` passes at 4.51:1 and is visually identical. `#00FFE1` passes (12.7:1).

### 18.2 Typography & color

- **Main typeface: Libre Baskerville** (Regular 400, Italic 400, Bold 700). Self-host via Fontsource (`@fontsource/libre-baskerville`).
- **Inter stays only for "object" UI:** project cards, tag chips, `/work/` controls and table, property values. These read as Notion-like objects against the serif page.
- Background `#202020`. Text `#ffffff` for headings and `#ededed` for body. Section rules are 1px `#ffffff`.
- Token updates (replace in `tokens.css`):

```css
--bg: #202020;
--surface: #191919; /* cards */
--surface-raised: #262626; /* menu panel */
--text: #ededed;
--text-strong: #ffffff;
--rule: #ffffff; /* section-header underline */
--font-serif: "Libre Baskerville", Georgia, serif;
--font-display: var(--font-serif);
--font-ui: "Inter", system-ui, sans-serif;
--font-accent: "Departure Mono", ui-monospace, monospace;
```

### 18.3 Accent font: Departure Mono

- Source: https://github.com/rektdeckard/departure-mono/releases/tag/v1.500. Use `DepartureMono-Regular.woff2`, self-hosted in `public/fonts/`, under SIL OFL 1.1 (ship the LICENSE file alongside it).
- It is a pixel font: **use it only at 11px or 22px (multiples of 11)**, with `letter-spacing: 0`, and keep it UPPERCASE for labels. Never use it for body text.
- **Where it's used (prototype):**
  1. Section index numbers in each home header: `01 Featured Work`, `02 About Me`, `03 Photography`, `04 Contact`, (the game no longer has a header).
  2. Film-stock captions under photos (`PORTRA 400`), and the Film Stocks group headings on `/photos/` at 22px.
  3. Project page property labels (`ROLE`, `TIMELINE`, `TEAM`, `TYPE`, `TAGS`, `LINKS`, `STATUS`) and the `TL;DR` label.
  4. Placeholder labels on images and covers, and the Year column in the `/work/` table.
  5. All game UI: HUD (`LIVES 3 · 12/12 LEFT`), START / PAUSED / GAME OVER / RETRY, and the invader labels drawn on the canvas.
  6. Footer colophon (`DESIGNED & BUILT BY PJ IN CHICAGO · © 2026`) and `BACK TO TOP ↑`.
- Other places it could go later:
  - A live Chicago clock in the footer.
  - Project years and dates on cards.
  - The fake URL indicator.
  - 404 page.

### 18.4 Icons: Phosphor Icons

- Source: https://github.com/phosphor-icons/homepage (package `@phosphor-icons/core`, MIT license).
- Use the **Regular** weight, inlined as SVG with `fill="currentColor"`, 20px. Icons used: `linkedin-logo`, `instagram-logo`, `github-logo`.
- **Where they appear:**
  - The Contact row: icon plus label, with a 46px tall hit area.
  - The footer: icon-only links, each with an `aria-label` and a 44×44 hit area.
- Phosphor is the default for any future UI icons (arrows, link, close…), replacing the ad-hoc inline SVGs.
- For Astro, import the SVGs from `@phosphor-icons/core/assets/regular/*.svg` (MIT; copy only the icons used). **No icon font.**
- Placeholder URLs still to fill: LinkedIn, Instagram, GitHub.

### 18.5 Game: arcade shooter, windowless (revised Oct 11 — replaces Toolkit Invaders and §5.4)

- **Windowless:** no box, border, background panel or section header. The canvas sits directly on the page background between Contact and the footer (~520px tall, full content width), followed by one quiet Departure Mono hint line: `MOUSE MOVES · CLICK FIRES · P PAUSES`.
- **No start button.**
  - **Before play (attract mode):** the ship already follows the mouse's x position. The pointer is tracked across the whole page, so the ship tracks you as you scroll past. The formation marches in place, and `CLICK TO PLAY` blinks.
  - **The game starts only when the user clicks or taps inside the game area** (or presses Space/Enter while it has focus). During play the cursor hides over the canvas; the ship is the cursor.
- **Art style:** traditional 1-bit arcade look:
  - white chunky pixels (3px per pixel, 2px on phones) on the page background
  - two-frame march animation and stepped movement that speeds up as the formation thins
  - destructible pixel shields, zigzag bombs, pixel explosions
  - HUD in Departure Mono (`SCORE 0000 · HI 0000 · LIVES 3`)
- **Sprites are original designs** (the "eye" 10 pts, "visor" 20 pts, "diamond" 30 pts) and the player ship is an original delta-wing fighter. **Do not copy the original arcade sprites, ship or name/logo** (Taito copyright/trademark).
- **The toolkit theme is removed.** No labels on the invaders and no "build something" end message.
- **Rules:**
  - 5×11 formation (5×7 on phones).
  - One player shot on screen at a time, classic style.
  - Bombs come from the lowest invader in a random column, up to 3 at once.
  - The player has 3 lives, with a blink of invulnerability after each hit.
  - Clearing a wave starts the next one, lower and faster.
  - Game over when lives run out or the formation reaches the ship's row. Click to play again.
  - The session high score is kept in memory only.
- **Controls:** pointer x (default), ← →, or touch-drag to move. Click, tap, Space or Enter to fire. P or Esc pauses.
- **Behavior:**
  - Pauses when scrolled out of view or when the tab is hidden; the render loop stops while off-screen.
  - `touch-action: none` only while playing, so the page still scrolls through the game area before play.
  - `prefers-reduced-motion`: the attract march is off and the formation is static until the user clicks.
- Repo: `Invaders.astro` / `invaders.ts` (§8), with sprite data in `invaders.sprites.ts`.

### 18.6 Still open after this round

- **"More" ×3:** keep the identical visible label, or use clearer labels ("All work →", "Full story →", "All photos →")?
- **Assets:** hi-res portrait (the prototype uses a crop from the mockup), real photos with film stock and camera, and project covers.
- **Copy:** Four C's one-line definitions (placeholders on `/about/`), case-study bodies for all projects except Hale, and the contact email (prototype uses `hello@pierrejames.design`).
