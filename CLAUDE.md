# CLAUDE.md — pierrejames.design

Before doing anything, read `docs/PLAN.md` (the source of truth). The visual and behavioral spec is `docs/reference/pierrejames-prototype.html`.

## Working with PJ

- PJ is a product designer, not an engineer. Explain choices in plain language, briefly. Give exact commands when he needs to run something.
- Work one phase at a time (PLAN §13). At the end of each phase, stop and summarize: what changed, how to view it, open TODOs, and what's next.
- Ask before adding any dependency not listed in PLAN §6.

## Conventions

- Next.js App Router + TypeScript (strict). Server Components by default; add `'use client'` only where interaction needs it.
- Content lives in `content/`, never hard-coded in components.
- Colors, type, spacing, radii, and motion come only from `styles/tokens.css`. No raw hex values in components.
- Keyboard support, `prefers-reduced-motion`, and no-JS link fallbacks are required for every interactive piece.
- Match the prototype's look; do not copy its architecture (template interpreter, inline styles, single class).
- Verify current library versions and setup in official docs before installing; note any differences from the plan.
- Leave `// TODO(PJ): …` for anything unspecified and list these in your summary.
- One git branch per phase; commit with clear messages.

Next.js 16 changed APIs since most training data. Read `AGENTS.md` and the bundled docs in `node_modules/next/dist/docs/` before writing Next.js code.

## Commands

- Dev server (fast, hot reload): `npm run dev` → http://localhost:3000
- Preview on the real Cloudflare Workers runtime: `npm run preview` → http://localhost:8787
- Deploy to production (workers.dev now, pierrejames.design after Phase 8): `npm run deploy`
- Upload a non-live preview version: `npm run upload`
- Checks: `npm run lint` · `npm run typecheck` · `npm run format:check` (fix with `npm run format`)
- After editing `wrangler.jsonc`: `npm run cf-typegen`
- Add a project: copy a folder in `content/projects/`, rename it (folder name = `slug`), edit its `index.mdx`. The index regenerates on `npm run dev`/`build` (or `npm run content`). Blocks available in MDX: `Callout`, `Toggle`, `Columns`/`Column`, `Figure`, `Quote`, `Stats`, `Bookmark`, `Video`.
- Raw assets (resume, photo selects) go in `_inbox/` (gitignored) until they're placed in `public/` or `content/`.
