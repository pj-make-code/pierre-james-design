I'm building my portfolio site, pierrejames.design. I'm a product designer, not an engineer, so explain things plainly and give me exact commands when I need to run something.

Read these first, fully:

1. docs/PLAN.md: the implementation plan and source of truth
2. CLAUDE.md: working rules
3. docs/reference/pierrejames-prototype.html: the design prototype. Skim the data and logic near the bottom of the file. It's the visual and behavioral spec, not code to copy.

Then do **Phase 0 only** (PLAN §13):

- Start in plan mode. Show me your step-by-step plan for Phase 0 and wait for my OK before changing files.
- Check the current official docs for Next.js and the OpenNext Cloudflare adapter (@opennextjs/cloudflare) and use the current recommended setup. Tell me if anything differs from my plan.
- Scaffold Next.js (App Router, TypeScript strict, ESLint, Prettier) in this folder without overwriting docs/ or CLAUDE.md.
- Set up OpenNext + Wrangler so the site runs on Cloudflare Workers. Add npm scripts for dev, preview, and deploy, and fill in the Commands section of CLAUDE.md.
- Make a simple placeholder home page that says "pierrejames.design — coming soon" on the #202020 background.
- Walk me through logging into Cloudflare with Wrangler and deploying to a workers.dev URL so I can open it on my phone.
- Initialize git with a sensible .gitignore and make the first commit. If I haven't created a GitHub repo yet, tell me exactly how, and how to connect it to Cloudflare so pushes auto-deploy.
- Confirm whether Next.js intercepting + parallel routes (needed for the peek modal, PLAN §5.2) and next/image work under OpenNext on Cloudflare. Tell me what you found and what you'll do in Phase 4.

When Phase 0 is done, stop and give me:

- the live URL
- what you set up, in plain language
- anything I need to do by hand
- the questions from PLAN §15 you need answered before Phase 1
