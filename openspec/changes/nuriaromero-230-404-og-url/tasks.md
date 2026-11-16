# Tasks

## 1. Fix

- [ ] 1.1 [NRD-230 app] Emit `og:url` in `src/components/seo/SEO.astro` only when the page is not `noindex`, and make `scripts/check-seo-19.mjs` fail if `dist/404.html` declares `og:url`; tests: `tests/not-found-page.test.js` first (RED: source guard, built 404 without `og:url`, built home with `og:url` equal to its canonical), then suite, `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
