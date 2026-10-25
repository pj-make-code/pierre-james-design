# pierrejames.design — Implementation Plan (v0.2, Next.js)

> **Status:** v0.2 · Oct 11, 2026 · Owner: Pierre James Beigh ("PJ")
> **Supersedes:** v0.1 (Astro). Stack changed to Next.js for app-like interactivity, a `/lab` of live prototypes and 3D, and PJ's existing familiarity with Next.js + TypeScript.
> **Design source of truth:** `docs/reference/pierrejames-prototype.html` (open it in a browser). Match its **look and behavior**. Do **not** copy its **architecture** (it's a single React class driving a custom template interpreter, with inline styles — a throwaway format).
> Markers: **[LOCKED]** decided · **[PROPOSED]** default unless PJ says otherwise · **[OPEN]** needs PJ (see §15).

---

## 0. Rules for AI agents (Claude Code)

1. Read this file fully before starting a phase. Work **one phase at a time** (§13). Stop at the end of each phase and summarize for PJ: what changed, how to see it, what's next.
2. PJ is a designer, not an engineer. Explain decisions in plain language, one or two sentences each. Never assume he knows a terminal command; give the exact command.
3. **Verify, don't assume, current versions.** Before installing Next.js, OpenNext, or any library, check its current docs and use the current stable version and current recommended setup. If the docs disagree with this plan, follow the docs and note the difference.
4. Don't add dependencies beyond §6 without saying why. Prefer platform features (CSS, `<dialog>`, IntersectionObserver) over libraries.
5. **Content never lives in components.** Project copy, photos, links, and bio text live in `content/` (§7).
6. **No raw hex values in components.** All colors, type, spacing, radii, and motion come from tokens (§8).
7. Every interactive feature must work by keyboard. It must respect `prefers-reduced-motion`. Without JavaScript it must degrade to plain links that still navigate.
8. When something isn't specified, build the simplest neutral version and leave `// TODO(PJ): …`. List every TODO in your phase summary.
9. Commit at the end of each phase with a clear message. Use a branch per phase (`phase-1-shell`, etc.) so PJ can review on a Cloudflare preview URL.
10. Update §16 (Decisions log) when something gets decided during the build.

---

## 1. What we're building

A custom-coded personal portfolio that replaces PJ's Notion page. It runs on PJ's domain (**pierrejames.design**, DNS in Cloudflare, currently redirecting to Notion) from a GitHub repo he owns, with no CMS.

**Concept:** a calm, Charlie Deets–style shell (single Menu button, minimal chrome, dark) wrapped around Notion's behaviors (page anatomy, properties, databases with filters, peek → expand). Over time it also hosts live prototypes and 3D "app-in-app" demos.

**Audience:** hiring managers and design leads for product design roles, plus founders and creative peers.

**Success:** a visitor understands who PJ is and opens a case study within 10 seconds. Case studies read like refined Notion pages. Lighthouse scores stay ≥ 90 on mobile (≥ 95 target on non-lab pages). PJ can add a project by copying a folder and editing text.

---

## 2. Design language (extracted from the prototype)

- **Mood:** dark, editorial, quiet chrome; color comes from photos, covers, and tag chips.
- **Three typefaces:**
  - **Libre Baskerville** is the _default body face_ (the page is serif-first). Headings and the name are set in italic.
  - **Inter** is for UI: cards, tables, chips, buttons, the properties block, the photo tabs. Elements with class `.ui` in the prototype use Inter.
  - **Departure Mono** (pixel mono, OFL license) is for section numbers, film-stock captions, property labels, the arcade, and the footer colophon. Self-host the woff2; the prototype embeds it as base64. Extract it, or download from the official source.
- **Section header pattern:** a mono number (`01`) in muted gray, a serif title, a 1px **white** bottom border, and a "More" link aligned right.
- **Hover language:** links underline in on hover; cards lift 2px and their cover scales to 1.03; ghost buttons get a 6% white wash.
- **Focus:** a 2px `--accent` (#9d7bff) outline offset by 3px. Text selection uses the accent at 35%.
- **Motion:** 150–250ms with `cubic-bezier(.2,.8,.2,1)`. All of it is disabled under reduced motion.

---

## 3. Information architecture

| Route                 | Screen                                                                                                | Phase |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ----- |
| `/`                   | Home scroll: Hero → 01 Featured Work → 02 About → 03 Photography → 04 Contact → Arcade → Footer       | 3     |
| `/work`               | Projects database (Gallery/Table, filters, sort; state in URL)                                        | 5     |
| `/work/[slug]`        | Project page, full. Opened from inside the site, it renders as a **peek** modal over the current page | 2, 4  |
| `/about`              | Long about: Four C's, Experience, Toolkit, Seven Songs & Press                                        | 6     |
| `/photos`             | Photography with tab bar: Feed · Film Stocks · Concerts (`?tab=`)                                     | 6     |
| `/lab`, `/lab/[slug]` | Live prototypes, 3D, experiments (each code-split)                                                    | Later |
| `/resume.pdf`         | Static file in `public/`                                                                              | 3     |
| 404                   | Custom not-found page                                                                                 | 8     |

**Menu** (§5.1) items: `Home` / divider / `Work · About · Photos · Contact` / divider / `Close`.

- **On `/`:** items smooth-scroll to sections (`#work`, `#about`, `#photos`, `#contact`). The active item follows a scroll-spy.
- **Elsewhere:** Work, About, and Photos go to their pages. Contact goes to `/#contact`.

---

## 4. Screen specs

### 4.1 Home (`/`)

Single column, `max-width: 820px`, 24px gutters. Gap between sections is `clamp(120px, 16vw, 240px)`.

- **Hero** (`#top`): ~250px top padding on desktop, min-height ~760px. A rounded portrait (16px radius, up to 320px square) sits left. Text sits right:
  - Name in italic serif at 36px.
  - Two short paragraphs. Brand names are links in brand colors (Hale `#F04146`, Honors Fund `#00FFE1`). Hale opens the Hale **peek**; Honors Fund links out.
  - Icon links for LinkedIn, Instagram, and GitHub (44px hit targets, gray that turns white on hover).
  - Below 760px it stacks vertically with 120px top padding.
- **01 Featured Work** (`#work`): a grid of cards, `auto-fit minmax(220px,1fr)`, 14px gap. Shows `featured: true` projects sorted by `order` (currently 3). "More" goes to `/work`.
  - **Card:** surface `#191919`, 1px border at 8% white, 10px radius. Then a 16:10 cover, then an icon tile (22px) + title, a muted summary, and tag chips.
  - Clicking a card opens the **peek**. Cmd/Ctrl-click opens a new tab (it's a real `<Link>`).
- **02 About Me** (`#about`): a large serif statement ("Empathy is my superpower."), two body paragraphs, and a 200px portrait on the right. "More" goes to `/about`.
- **03 Photography** (`#photos`): a 6-photo masonry grid (CSS `columns: 3 200px`, 12px gap) with mono film-stock captions. Clicking opens the **lightbox**. "More" goes to `/photos`.
- **04 Contact** (`#contact`): a large serif line ("I love meeting new people. Say hello."). Then:
  - A white pill button, **Copy my email**, which changes to "Copied to clipboard" for 1.6s.
  - Text links for LinkedIn, Instagram, GitHub, and Resume.
- **Arcade** (`#play`): see §5.5. A 520px-tall canvas plus a mono hint line.
- **Footer:** mono colophon "DESIGNED & BUILT BY PJ IN CHICAGO · © 2026" on the left; social icons and "BACK TO TOP ↑" on the right. 1px top border at 12% white.

### 4.2 Project page (`/work/[slug]`), full and peek

One `ProjectDocument` component renders in two shells.

- **Peek shell:** a centered modal, `min(900px,92vw) × min(90vh,960px)`, `#1c1c1c`, 16px radius, with a dimmed backdrop (62% black).
  - A sticky toolbar holds: `⤢ Open as full page`, `🔗 Copy link`, then on the right ↑ previous, ↓ next, and ✕ close.
  - Below 640px it becomes a bottom sheet (top: 24px, rounded top corners).
  - A side-peek variant (right panel, `min(720px,94vw)`) is kept behind a config flag; center is the default.
- **Full shell:** the page background is `#202020`. A sticky bar holds `← All work` and `Copy link`. A **right-rail TOC** is visible ≥ 1180px: short gray lines that, on hover, reveal heading labels and scroll to each H2.
- **Document anatomy:**
  1. Cover block: 200px in the peek; 30vh (240–360px) on the full page.
  2. Icon tile: 72px with a 16px radius, overlapping the cover by 36px, with a 4px ring in the background color.
  3. Title in italic serif, `clamp(2rem,4vw,2.75rem)`.
  4. **Properties** as a `<dl>` grid (`120px / 1fr`) with mono uppercase labels: Role, Timeline, Team, Type, Tags (chips), Links (↗), Status (colored dot + text). A bottom divider follows.
  5. **TL;DR callout** (`#2a2a2a`, 12px radius): mono "TL;DR" label, summary paragraph, and a stats grid.
  6. **Blocks** from MDX (§5.3).
  7. **Prev / Next** cards.
- Body column: `max-width 720px`, padded 56px (20px on mobile).

### 4.3 Work database (`/work`), max-width 1100px

- Italic title "Work" plus a count ("6", or "2 of 6" when filtered).
- **Controls bar** with a white bottom border:
  - View tabs: **Gallery | Table**, with icons.
  - Sort: **Newest | Oldest**.
- **Filters:**
  - Tags row: multi-select chips that light up in the tag's colors when on.
  - Type row: single-select among All / Product / Venture / Concept / Brand.
  - A **Reset** link appears when any filter is active.
- **Empty state:** a dashed box reading "No projects match these filters." with a Reset button.
- **Table columns:** Name (icon + title; the whole row is clickable), Role, Year (mono), Tags, Status (dot). The table scrolls horizontally on small screens.
- **URL holds state:** `?tag=ux-design,startups&type=product&view=table&sort=oldest`. Reloading restores it.
- Peek prev/next steps through the **filtered** list.

### 4.4 About (`/about`), max-width 820px

Italic "About Me" title, the statement and bio with a 260px portrait, then four sections with white-underlined headers:

- **The Four C's:** a 4-up grid of an italic word plus a one-line definition.
- **Experience:** "Currently" and "Previously" columns of name / role rows.
- **Toolkit:** chips.
- **Seven Songs & Press:** a click-to-load Spotify facade (no iframe until clicked) and a press bookmark card.

### 4.5 Photos (`/photos`), max-width 1100px

- Centered italic title, then a **pill tab bar** (Feed · Film Stocks · Concerts). The selected tab is white with dark text.
- **Feed:** all photos in masonry.
- **Film Stocks:** groups under a mono stock name and frame count.
- **Concerts:** only photos with `concert: true`.
- **Lightbox:** full-screen at `rgba(14,14,14,.96)`.
  - Shows the image, with stock · camera · `n / total` in mono below it.
  - Controls: ← → keys, swipe (40px threshold), round prev/next buttons (hidden on mobile), and Esc or ✕ to close.
  - Locks page scroll and returns focus to the photo that opened it.

---

## 5. Component & interaction specs

### 5.1 Menu

- **Position [OPEN Q1]:** the prototype puts it **top-left** (`left:32px; top:32px + safe-area`) and the popover drops down. Charlie's original is bottom-left. Build it with position as a single config value so switching is one line; default to the prototype.
- **Pill button:**
  - 46px tall with a 10px radius.
  - Background `rgba(32,32,32,.85)`, backdrop blur 8px.
  - 1px border at 85% white.
  - Label "Menu" in italic serif at 21px.
- **Popover:**
  - 220px wide, `#262626`, 12px radius, 1px border at 85% white, large shadow.
  - Animates from its corner: scale .94 → 1 plus fade, 180ms.
- **Items:** 42px tall, 18px serif. The current item is white, others `#8f8f8f`, and `aria-current="location"` marks the current one. Dividers are 1px at 12% white.
- **Behavior:**
  - Close via Esc, a click outside, choosing an item, or "Close".
  - Focus moves to the first item on open and returns to the pill on close.
  - ↑/↓ and Tab cycle through items (focus trap).
- Lives in the root layout so it persists across navigations.

### 5.2 Peek (Notion "center peek"): implementation pattern **[PROPOSED]**

Use Next.js **parallel routes + intercepting routes**:

```
app/
  layout.tsx                 → renders {children} and {modal}
  @modal/default.tsx         → returns null
  @modal/(.)work/[slug]/page.tsx  → <PeekShell><ProjectDocument/></PeekShell>
  work/[slug]/page.tsx       → <FullShell><ProjectDocument/></FullShell>
```

- Clicking `<Link href="/work/hale">` from anywhere in the site gets intercepted into the modal. The URL becomes `/work/hale`. A refresh or a shared link loads the full page.
- **Close** = `router.back()`. If there's no in-site history (the user deep-linked), navigate to `/`.
- **Prev/next** inside the peek = `router.replace('/work/<slug>')`, so it stays in the modal without stacking history.
- **"Open as full page"** must be a _hard_ navigation (`window.location.assign(url)`). A client-side push to the same URL stays intercepted.
- Use a native `<dialog>`, or a div with `role="dialog" aria-modal="true"`. Add a focus trap, Esc to close, and lock body scroll. Restore focus to the triggering card on close. Reset the scroll position to the top when the slug changes.
- Agent: confirm intercepting routes work under the OpenNext Cloudflare adapter during Phase 0/4. If they don't, fall back to a client modal driven by `?p=slug` and report it.

### 5.3 Block library (MDX components)

Each block is styled like the prototype:

- `<Callout label>`: `#2a2a2a` box, purple lightbulb tile, italic text.
- `<Toggle title>`: chevron that rotates 90°; content animates open.
- `<Columns>` / `<Column kicker title>`: bordered cards.
- `<Figure src caption>`: 16:9, 10px radius, italic caption.
- `<Quote cite>`: 1px white left rule, italic 1.25rem.
- `<Stats items>`: tiles with a large number and a small label.
- `<Bookmark title outlet url>`: press card with a thumbnail on the right.
- `<Video>`: self-hosted or a YouTube facade.
- Later: `<Prototype src>` and `<Model3D src>` (lazy, see §10).

Markdown `##` headings map to the H2 style: 1.375rem, a 1px bottom border at 50% white, and an id for the TOC.

### 5.4 Tags & status

Tags come from `content/tags.ts`, with each colour pair taken from the prototype:

| Tag                  | Background | Text    |
| -------------------- | ---------- | ------- |
| startups             | #2b3b30    | #8fd19e |
| ux-design            | #263a4f    | #8cc2ff |
| community-building   | #4a3326    | #f0a76b |
| experience-marketing | #3a2f4f    | #c3a6ff |
| marketing            | #47402a    | #e8cf7a |
| social-design        | #4a2a3d    | #f5a3cf |
| ethics-in-business   | #4a2a2a    | #ff9b9b |
| music                | #2f2f2f    | #c9c9c9 |

Status dots: Ongoing #8fd19e · Shipped #8cc2ff · Concept #c3a6ff · Wrapped #8f8f8f.

### 5.5 Arcade (bottom of home)

**This changed from v0.1.** The prototype is a **1-bit fixed-shooter arcade game** with _original_ sprites, not Breakout. Port it faithfully; the prototype's `gInit / newWave / makeShields / gTick / gDraw` logic is the spec.

- **Canvas:** full width × 520px, DPR-aware (max 2×), `imageSmoothingEnabled = false`. Pixel scale is 3, or 2 below 560px.
- **Look:** white pixels on transparent. A mono HUD at the top (`SCORE 0000 · HI 0000 · LIVES 3`) and a 1px ground line at 22% white.
- **Formation:** 5 rows × 11 columns (7 below 560px). Three alien types: the bottom two rows score 10, the middle two 20, the top row 30. Two-frame animation.
- **Movement:** the formation marches in steps that speed up as aliens die and each wave. At an edge it reverses and drops 4×scale.
- **Shields:** 4 destructible shields (3 on mobile), eroded by shots and by aliens passing through.
- **Player:** the ship follows the mouse x, or ←/→ keys, or touch drag. Click, Space, or Enter fires; only one shot is on screen at a time.
- **Enemy fire:** the lowest alien in a random column drops zig-zag bombs (max 3). Bombs and shots cancel each other out.
- **Lives:** 3. When hit, the ship explodes, then blinks invulnerable for about 2.3s.
- **Waves:** clearing a wave starts a new one that sits slightly lower. The game ends when aliens reach the ship's row.
- **States:** idle (an attract loop marches in place, with "CLICK TO PLAY" blinking), playing, paused (P or Esc), over ("GAME OVER / CLICK TO PLAY AGAIN").
- **Hygiene:**
  - Mount only when near the viewport (IntersectionObserver). Pause and stop the rAF loop when off-screen or when the tab is hidden.
  - Never hijack page scroll: the canvas uses `touch-action: pan-y` while idle and `none` only while playing.
  - Reduced motion: no attract animation and no blinking.
  - Persist the hi-score in `localStorage`, wrapped in try/catch.
- **Code shape:** a pure engine in `lib/arcade/` (no React) plus a thin `<Arcade />` client component, loaded with `next/dynamic` and `ssr: false`.
- **Legal note:** keep sprites original, as in the prototype. Don't name it or style it after a trademarked game.

### 5.6 Small things

- `useCopy()` hook: copies to the clipboard and shows a 1.6s confirmation; used by email and Copy link.
- `ScrollSpy`: an IntersectionObserver with `rootMargin: -45% 0px -50% 0px` over the home section ids.
- Spotify facade: renders the iframe only after a click.
- The prototype's fake URL pill (top-right) is a **prototype-only debug aid**. Don't ship it.

---

## 6. Tech stack **[PROPOSED]**

| Layer       | Choice                                                                            | Notes                                                                                                                                                                |
| ----------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | **Next.js**, current stable, App Router, React Server Components                  | Verify version and setup at install time                                                                                                                             |
| Language    | **TypeScript** (strict)                                                           |                                                                                                                                                                      |
| Styling     | **CSS Modules + global `tokens.css`** [OPEN Q4: or Tailwind]                      | Tokens map 1:1 to Figma variables                                                                                                                                    |
| Content     | **MDX** case studies + typed data files, validated with **Zod**                   | Use a typed MDX loader (e.g., Velite or Content Collections); agent picks the current, well-maintained option and explains why                                       |
| Fonts       | `next/font` (Inter, Libre Baskerville via Google; Departure Mono via local woff2) | Self-hosted at build, no runtime Google request                                                                                                                      |
| Icons       | `@phosphor-icons/react`                                                           | The prototype's icons are Phosphor (256 viewBox)                                                                                                                     |
| Images      | `next/image`                                                                      | Agent must confirm the image optimization approach on Cloudflare/OpenNext; fallback is pre-sized WebP/AVIF from a sharp script plus a custom loader or `unoptimized` |
| Hosting     | **Cloudflare Workers** via **`@opennextjs/cloudflare`** + Wrangler                | Domain already in Cloudflare                                                                                                                                         |
| CI/CD       | GitHub → Cloudflare (Workers Builds)                                              | Preview URL per branch                                                                                                                                               |
| Analytics   | Cloudflare Web Analytics                                                          | Cookie-less                                                                                                                                                          |
| Lint/format | ESLint (Next config) + Prettier                                                   |                                                                                                                                                                      |
| Later (lab) | React Three Fiber + drei (3D), Framer Motion only if needed                       | Code-split per lab page                                                                                                                                              |

---

## 7. Content model

```
content/
  site.ts          # name, hero copy, about copy, four C's, experience, toolkit, socials, email
  tags.ts          # tag → label + colors (§5.4); status → dot color
  photos.ts        # [{ src, alt, stock, camera, ratio, concert, featuredOnHome }]
  press.ts         # [{ title, outlet, url, image }]
  projects/
    hale/
      index.mdx    # frontmatter (below) + body using block components
      cover.jpg
      images/…
    jamtown/ … top-tier-lessons/ … the-greenhouse/ … terms-and-conditions/ … public-transit/
```

**Project frontmatter** (Zod-validated; the build fails on bad data):

```ts
{
  title: string;  slug: string;  icon: string;          // short glyph ("H", "T&C") or image path
  summary: string;                                      // ≤ 140 chars, card one-liner
  role: string[];  team?: string;
  tags: TagKey[];  type: 'Product'|'Venture'|'Concept'|'Brand';
  timeline: string;  year: string;                      // display strings for now
  sortDate: string;                                     // ISO date used for Newest/Oldest
  status: 'Ongoing'|'Shipped'|'Concept'|'Wrapped';
  cover: string;  coverTag?: TagKey;                    // coverTag sets placeholder colors until real covers exist
  links: { label: string; url: string }[];
  tldr: string;  stats: { value: string; label: string }[];
  featured: boolean;  order: number;  draft?: boolean;
}
```

**Seed content:** migrate all six projects, the photo list, toolkit, experience, and copy **verbatim from the prototype's data**. Keep every `[placeholder]` as-is; PJ fills them in. Hale's case study is the most complete and should be built first as the reference project.

---

## 8. Design tokens (`styles/tokens.css`)

```css
:root {
  /* color */
  --bg: #202020;
  --surface: #191919;
  --surface-peek: #1c1c1c;
  --surface-menu: #262626;
  --surface-callout: #2a2a2a;
  --surface-raised: #2c2c2c;
  --text: #ededed;
  --text-strong: #ffffff;
  --text-soft: #d6d6d6;
  --text-dim: #bdbdbd;
  --text-muted: #a8a8a8;
  --text-faint: #8f8f8f;
  --text-ghost: #6f6f6f;
  --line: rgba(255, 255, 255, 0.08);
  --line-mid: rgba(255, 255, 255, 0.12);
  --line-strong: #ffffff;
  --accent: #9d7bff;
  --backdrop: rgba(0, 0, 0, 0.62);
  --brand-hale: #f04146;
  --brand-honors: #00ffe1;
  /* type */
  --font-serif: "Libre Baskerville", Georgia, serif;
  --font-ui: "Inter", system-ui, sans-serif;
  --font-mono: "Departure Mono", ui-monospace, monospace;
  --fs-mono: 11px;
  --fs-sm: 13px;
  --fs-ui: 15px;
  --fs-body: 17px;
  --fs-h2: 1.375rem;
  --fs-statement: 2rem;
  --fs-h1: clamp(2.25rem, 4.5vw, 3.25rem);
  /* shape & space */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 12px;
  --r-xl: 16px;
  --r-pill: 999px;
  --col-narrow: 820px;
  --col-wide: 1100px;
  --col-doc: 720px;
  --gutter: 24px;
  /* motion */
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --t-fast: 150ms;
  --t-med: 250ms;
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

Mono text should render crisp (`-webkit-font-smoothing: none`, as in the prototype).

---

## 9. Repo structure

```
pierrejames-site/
├── CLAUDE.md                     # short rules + "read docs/PLAN.md"
├── docs/
│   ├── PLAN.md                   # this file
│   └── reference/pierrejames-prototype.html
├── app/
│   ├── layout.tsx                # fonts, tokens, <Menu/>, {children}, {modal}
│   ├── page.tsx                  # home
│   ├── @modal/default.tsx
│   ├── @modal/(.)work/[slug]/page.tsx
│   ├── work/page.tsx             # database
│   ├── work/[slug]/page.tsx      # full project page (generateStaticParams)
│   ├── about/page.tsx
│   ├── photos/page.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx
├── components/
│   ├── menu/ · peek/ · project/ (ProjectDocument, Properties, TldrCallout, Toc, PrevNext)
│   ├── blocks/ (Callout, Toggle, Columns, Figure, Quote, Stats, Bookmark, Video)
│   ├── work/ (ProjectCard, WorkDatabase, FilterChips, ViewTabs)
│   ├── photos/ (PhotoGrid, PhotoTabs, Lightbox)
│   ├── home/ (Hero, SectionHeader, ContactBlock, Footer)
│   ├── arcade/Arcade.tsx
│   └── ui/ (TagChip, StatusDot, CopyButton, Icon)
├── lib/ (content.ts loaders, arcade/engine.ts, arcade/sprites.ts, hooks/)
├── content/ (§7)
├── styles/ (tokens.css, globals.css)
├── public/ (resume.pdf, fonts/DepartureMono-Regular.woff2, favicon, og/)
├── open-next.config.ts · wrangler.jsonc   # per current OpenNext docs
└── package.json
```

---

## 10. The Lab (future, but architect for it now)

- `/lab/[slug]` pages are each fully **code-split**. Heavy libraries (Three.js / R3F) are imported only inside lab routes or with `next/dynamic` (`ssr: false`), so they never touch the home page bundle.
- Two embedding modes:
  1. **Inline React component** for prototypes built in this repo.
  2. **Sandboxed `<iframe>`** for prototypes with their own styles or deps, or hosted elsewhere.
- Any prototype that needs secrets (AI calls, APIs) uses a Route Handler on the server. Keys go in Cloudflare secrets, never in client code.
- Case studies can embed lab pieces via `<Prototype slug="…"/>` / `<Model3D src="…"/>`, lazy-loaded behind a "Load interactive demo" facade.

---

## 11. Quality bar

- **Accessibility:**
  - WCAG AA contrast. Check `#8f8f8f` on `#202020` for small text, and bump it if it fails.
  - Visible focus states; full keyboard support for the menu, peek, lightbox, filters, and arcade.
  - Alt text for every photo.
  - `aria-live` for "Copied" confirmations.
- **Performance:** home JS stays small (the arcade is lazy, Spotify is a facade). Images are responsive and lazy below the fold. Fonts use `display: swap`.
- **SEO/sharing:** per-page metadata, Open Graph images (generated per project), canonical URLs, sitemap, robots.
- **Responsive:** test at 360, 768, 1280, and 1600px, and on PJ's actual phone via the preview URL.

---

## 12. Deployment

1. **Phase 0:** deploy a hello-world to a `*.workers.dev` URL via OpenNext and confirm it works before any design work.
2. Connect the GitHub repo to Cloudflare so pushes to `main` deploy to production and other branches get preview URLs.
3. **Launch (Phase 8):** attach `pierrejames.design` (+ `www` → apex redirect) to the Worker, and **remove the existing redirect-to-Notion rule** in the same session. Then verify HTTPS, enable Web Analytics, and smoke-test every route.

---

## 13. Phases (each ≈ one Claude Code session; stop and summarize after each)

| #   | Phase                                                                                                                                                                    | Done when                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 0   | **Setup & deploy proof**: Next.js + TS scaffold, ESLint/Prettier, OpenNext + Wrangler, `docs/` in place, hello page live on workers.dev                                  | PJ opens the workers.dev URL on his phone                                       |
| 1   | **Shell**: tokens, three fonts, globals, root layout, **Menu** (§5.1), section header + footer components                                                                | Menu fully works by mouse and keyboard at 360px and 1440px                      |
| 2   | **Content + project page (full)**: content loaders + Zod schemas, all 6 projects seeded, block library, `/work/[slug]` full shell with properties, TL;DR, TOC, prev/next | `/work/hale` matches the prototype's full page                                  |
| 3   | **Home scroll**: hero, featured cards, about, photo preview (static), contact with copy, footer, scroll-spy menu behavior, resume link                                   | Home matches the prototype (except the arcade)                                  |
| 4   | **Peek**: intercepting route modal, toolbar actions, prev/next, close/back, hard-nav expand, focus/scroll handling, mobile sheet                                         | Card → peek → expand → back all behave like Notion; refresh shows the full page |
| 5   | **Work database**: gallery/table, tag and type filters, sort, empty state, URL state                                                                                     | Filters survive a reload; peek steps through the filtered list                  |
| 6   | **About + Photos + Lightbox**                                                                                                                                            | Tabs, groups, and lightbox match the prototype                                  |
| 7   | **Arcade**: port the engine and component, lazy mount, hi-score                                                                                                          | Plays smoothly on desktop and phone without hijacking scroll                    |
| 8   | **Polish & launch**: a11y pass, Lighthouse, OG images, 404, analytics, domain cutover                                                                                    | pierrejames.design serves the new site                                          |
| L   | **Lab** (post-launch)                                                                                                                                                    | First prototype or 3D piece live under `/lab`                                   |

---

## 14. Out of scope (for now)

CMS, blog/writing, comments, auth, light mode, i18n, e-commerce.

---

## 15. Open questions for PJ

1. **Menu position:** top-left (prototype) or bottom-left (Charlie)?
2. **Email** for "Copy my email": the prototype uses `hello@pierrejames.design`, which needs Email Routing set up in Cloudflare. Use that, or a personal address?
3. **The Greenhouse:** the prototype tags it Community Building; Notion had Music + UX Design. Which is right?
4. **Styling:** CSS Modules (default) or Tailwind?
5. **Repo visibility:** public or private?
6. **Real assets ready?** Portrait(s), project covers, photo selects with stock and camera, resume PDF, social URLs.

---

## 16. Decisions log

| Date       | Decision                                                            | By                 |
| ---------- | ------------------------------------------------------------------- | ------------------ |
| 2026-10-06 | Cloudflare hosting at pierrejames.design, own repo, no CMS          | PJ                 |
| 2026-10-06 | MVP = home scroll + project page                                    | PJ                 |
| 2026-10-11 | Stack: Next.js (App Router) + TypeScript on Cloudflare via OpenNext | PJ                 |
| 2026-10-11 | Prototype HTML is the visual + behavioral spec                      | PJ                 |
| 2026-10-11 | Arcade = original 1-bit fixed shooter (replaces Breakout)           | PJ (via prototype) |
| 2026-10-11 | Stay on OpenNext (`@opennextjs/cloudflare` 1.20) even though Cloudflare now recommends vinext (beta) | PJ |
| 2026-10-11 | Repo is public (Q5) | PJ |
| 2026-10-11 | Scaffold: no Tailwind (Q4 still open), Cache Components off, no `src/` | Claude (Phase 0) |
| 2026-10-11 | Pin Next.js to **16.3.8** (exact). 16.4 breaks every server-rendered page on OpenNext 1.20.10 (opennextjs-cloudflare issue #1355, fix PR #1356 unmerged). Unpin once a fixed OpenNext ships | Claude (Phase 0) |
| 2026-10-11 | Menu sits **bottom-left** (Q1); popover grows up from the same corner. Switch in `lib/config.ts` | PJ |
| 2026-10-11 | Styling: CSS Modules + `styles/tokens.css` (Q4 default; PJ didn't pick Tailwind) | Claude (Phase 1) |
| 2026-10-11 | Departure Mono (SIL OFL) self-hosted via `next/font/local` from `app/fonts/`, not `public/fonts/` — next/font hashes and serves it | Claude (Phase 1) |
| 2026-10-11 | Worker renamed `pierre-james-design` to match Workers Builds; live at pierre-james-design.beighpj.workers.dev | PJ |
| 2026-10-11 | MDX via **`@next/mdx`** (+ remark-frontmatter, remark-mdx-frontmatter), not Velite/Content Collections: those evaluate MDX with `new Function`, which Cloudflare Workers forbid, and the peek renders at request time. Frontmatter validated with Zod 4; a bad value fails the build | Claude (Phase 2) |
| 2026-10-11 | `content/projects/index.generated.ts` is written by `scripts/generate-content-index.mts` before dev/build, so adding a project = copy a folder | Claude (Phase 2) |
| 2026-10-11 | `cover` optional until real covers exist (`coverTag` colors the placeholder); `sortDate` values are placeholders preserving prototype order | Claude (Phase 2) |
| 2026-10-11 | H2 ids are slugs of the heading text (e.g. `#my-role`); TOC reads rendered H2s client-side (hidden <1180px, so no-JS loses nothing essential) | Claude (Phase 2) |
| 2026-10-11 | Intercepting + parallel routes verified on the Workers runtime (modal on click, full page on refresh, modal→modal stepping). Peek plan §5.2 stands | Claude (Phase 0) |
| 2026-10-11 | Static-assets incremental cache (no R2); Images binding deferred until real photos | Claude (Phase 0) |
| 2026-10-11 | Raw source files live in gitignored `_inbox/` (was `Content/`, which collides with `content/` on macOS) | Claude (Phase 0) |
| 2026-10-25 | Home cards and the hero's Hale link point at `/work/[slug]` (full page) until Phase 4; they're real `<Link>`s, so the peek intercepts them with no changes | Claude (Phase 3) |
| 2026-10-25 | Portrait is the 321px JPEG embedded in the prototype (`public/images/portrait.jpg`) until PJ supplies a higher-res one | Claude (Phase 3) |
| 2026-10-25 | `resume.pdf` not committed: the current PDF lists a phone number and the repo is public. The Resume link is wired to `/resume.pdf` and 404s until PJ decides | Claude (Phase 3) |
| 2026-10-25 | "Copy my email" without JavaScript falls back to a visible `mailto:` link (same `<noscript>` pattern as the Menu) | Claude (Phase 3) |
| 2026-10-25 | LinkedIn URL set to linkedin.com/in/pierre-james (from PJ's resume); Instagram and GitHub still placeholders | Claude (Phase 3) |
| 2026-10-25 | Home photo tiles are static placeholders (tone + ratio) from `content/photos.ts`; they become lightbox buttons in Phase 6 | Claude (Phase 3) |
| 2026-10-25 | Peek uses a native modal `<dialog>` (top layer above the Menu, inert page, Esc) inside `app/@modal/(.)work/layout.tsx`, so the shell stays mounted while ↑/↓ swap projects | Claude (Phase 4) |
| 2026-10-25 | Close = `router.back()` always: the peek only exists after an in-site click, and prev/next use `replace`, so one Back returns to the page underneath | Claude (Phase 4) |
| 2026-10-25 | Prev/next cards on the **full** page are plain `<a>` (full load), because any `<Link>` to a project is intercepted and would stack a peek over the full page. Inside the peek they're `<Link replace>` | Claude (Phase 4) |
| 2026-10-25 | `app/@modal/[...catchAll]` returns null so a soft navigation to any other page clears the peek | Claude (Phase 4) |
| 2026-10-25 | Side-peek variant (PLAN §4.2) not built; center peek only until PJ asks | Claude (Phase 4) |
| 2026-10-25 | `/work` is rendered on the server from the URL (dynamic route). Every control is a `<Link>` to the next URL state, so filters survive reload, the first paint is already filtered, and it all works without JavaScript | Claude (Phase 5) |
| 2026-10-25 | Filter/sort/view links use `replace`, so Back leaves `/work` instead of undoing filter clicks one by one | Claude (Phase 5) |
| 2026-10-25 | Project links from `/work` carry the filters plus an explicit `sort`; the peek uses that to step through the filtered list (home links have no query, so they keep display order). Copy link strips the query | Claude (Phase 5) |
| 2026-10-25 | Reset clears tags and type but keeps view and sort. Tag filter is OR (any selected tag), as in the prototype | Claude (Phase 5) |
