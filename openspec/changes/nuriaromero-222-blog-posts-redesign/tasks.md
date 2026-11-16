# Tasks

Sprint order: after NRD-221 (`/blog/`, no code dependency, both reach `develop` together) and before NRD-223 (which takes the next `check-seo-NN` after 18).

## 1. Post contract, then the template layout

- [ ] 1.1 [NRD-225 app] Freeze the post contract on the current layout: `data-post-body` on the body wrapper of `src/layouts/BlogPostLayout.astro` (no visual change), `scripts/lib/post-contract.mjs`, `scripts/check-seo-18.mjs` (`--write` mode), `package.json` scripts and chain, and `tests/fixtures/blog-posts.baseline.json` generated from the OLD layout; tests: `tests/post-contract.test.js` first (RED), then `pnpm build && node scripts/check-seo-18.mjs --write`, suite and `pnpm check:seo:dist` green
- [ ] 1.2 [NRD-226 app] Recompose `src/layouts/BlogPostLayout.astro` on the ink template (template ground, article header with the title as only H1, author and dates, ink prose under `.post-prose`, `SeoLocalRelated` with `internalLinksBySource[url]`, `SeoLocalClosing`; no `CTASection`, `InternalLinks` or `EntryContentStyles`); tests: `tests/blog-post-template.test.js` first (RED); suite, `pnpm build` and `pnpm check:seo:dist` green with `check-seo-18` passing against the unchanged baseline (never `--write` here), plus 06, 07, 08 and 09

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
