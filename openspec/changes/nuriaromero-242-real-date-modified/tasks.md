# Tasks

Order: 1.1 → 1.2 → 1.3 → 1.4 (NRD-265 blocks NRD-266, NRD-266 blocks NRD-267, NRD-267 blocks NRD-268). 1.2 needs `src/lib/schema.ts` with relative imports (done by NRD-241 task 1.2): merge `develop` first if NRD-241 is merged, else make the same import change.

## 1. Freshness source, JSON-LD, label and guard

- [x] 1.1 [NRD-265 app] Create `src/lib/freshness.ts` (`getLastModified`, `formatMonthYear`) and `src/data/page-freshness.ts` (`pageSources` per the design table, `getPageDateModified`); tests: `tests/freshness.test.js` (temp repos: one path, several paths, untracked, no repo, `--depth 2` clone boundary, month formatting) and the route-coverage test in `tests/page-freshness.test.js` first (RED), then full suite and `pnpm astro check` green
- [x] 1.2 [NRD-266 app] Add `webPageSchema` to `src/lib/schema.ts`, append it in `src/layouts/Layout.astro` when a date exists and the page is not `noindex`, make `scripts/check-seo-16.mjs` ignore `WebPage` entities; tests: `webPageSchema` shape and Layout source assertions in `tests/page-freshness.test.js` first (RED), then full suite, `pnpm build`, `pnpm check:seo:dist` green, and `check-seo-16` green on a build from a depth-1 clone
- [x] 1.3 [NRD-267 app] Create `src/components/PageUpdated.astro` (`data-word-budget="exclude"`, `data-page-updated`), render it in `src/layouts/ServiceLayout.astro` (both variants) and `src/pages/index.astro` as the UI spec places it, mark the two `<time>` elements of `src/layouts/BlogPostLayout.astro`; tests: component, LegalLayout and BlogPostLayout source assertions in `tests/page-freshness.test.js` first (RED), then full suite, `pnpm build` and `pnpm check:seo:dist` (word ranges in `check-seo-17` unchanged) green
- [ ] 1.4 [NRD-268 app] Create `scripts/check-seo-21.mjs` (rules in design.md Interfaces) and wire `check:seo-21`, `check:seo-21:dist` and `check:seo:dist` in `package.json`; tests: RED on a hand-edited built page (mismatched `datetime`, future `dateModified`), then GREEN on the real build and on a depth-1 build; full suite and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md (label at 375 and 1280 px, blog dates, no label on legal pages).
- Owner-account actions in design.md after the next production promotion (production dateModified check, Netlify clone depth if absent).
- Archive the change at dev-done (`/team-harness:dev`).
