# Tasks

Sprint order: before NRD-222 (blog post layout); no code dependency between them, both reach `develop` together.

## 1. Blog index on the template

- [x] 1.1 [NRD-224 app] Recompose `src/pages/blog/index.astro` on `Layout` + `.template-ground` (breadcrumbs, short hero with an H1 starting with "Blog", posts as ink rows with date, `h3` link title and description from the `blog` collection, closing) and add the `/blog/` entry (`words: [150, 350]`, no Service) in `scripts/lib/template-pages.mjs`; tests: `tests/blog-index-template.test.js` first and `check:seo-17:dist` RED; verify suite (incl. `trailing-slash-links`, `keyword-ownership`), `pnpm build`, `pnpm check:seo:dist` green incl. 02, 06, 07 and 17

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
