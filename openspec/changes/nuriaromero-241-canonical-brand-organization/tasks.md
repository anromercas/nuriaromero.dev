# Tasks

Order: 1.1 blocks 1.2, 1.2 blocks 1.3 (NRD-262 blocks NRD-263, NRD-263 blocks NRD-264): they share `tests/site-identity.test.js` and `scripts/check-seo-11.mjs`.

## 1. Canonical brand and complete Organization nodes

- [ ] 1.1 [NRD-262 app] Add `src/lib/seo-title.ts` (`brandedTitle`), render `<title>` through it in `src/components/seo/SEO.astro`, rewrite the title prop of `index.astro`, `sobre-mi.astro`, `aviso-legal.astro`, `privacidad.astro`, `cookies.astro` (strings in design.md), add the title-suffix and `og:site_name` assertions to `scripts/check-seo-11.mjs`, measure the page-owned part in `scripts/check-seo-15.mjs`, regenerate `tests/fixtures/blog-posts.baseline.json` (only `title` values change); tests: `tests/site-identity.test.js` title tests first (RED) and `check-seo-11` RED on the current `dist/`, then full suite, `pnpm build` and `pnpm check:seo:dist` green with `tests/seo-meta-titles.test.js` unchanged
- [ ] 1.2 [NRD-263 app] Switch `src/lib/schema.ts` to relative `.ts` imports, add `name`/`url` to `reviewsSchema`, make `scripts/check-seo-11.mjs` check every Organization-typed node; tests: `reviewsSchema(fixture)` and `localBusinessSchema()` tests in `tests/site-identity.test.js` first (RED), then full suite, `pnpm astro check`, `pnpm build` and `pnpm check:seo:dist` green
- [ ] 1.3 [NRD-264 app] Remove the logo link `aria-label` and set the image `alt="Nuria Romero, nuriaromero.dev"` in `src/components/Header.astro` (lines 51-62 only) and reword `public/llms.txt` line 3; tests: logo-name and llms.txt tests in `tests/site-identity.test.js` first (RED), then full suite and `pnpm build` green

## Workflow follow-up

- QA runs the real-browser checks in design.md (logo accessible name on desktop and 375 px, branded tab titles).
- Archive the change at dev-done (`/team-harness:dev`).
