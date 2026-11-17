# Tasks

Order: NRD-245 blocks this story; 1.1 blocks 1.2 (NRD-276 blocks NRD-277). Task 1.2 is measured on a branch that includes NRD-245's home answers (merge `develop` first).

## 1. City-name cap on the home

- [x] 1.1 [NRD-276 app] Add `termOccurrences` to `scripts/lib/page-contract.mjs`, the optional `termCaps` field to `scripts/lib/template-pages.mjs` (no cap yet) and its assertion to `scripts/check-seo-17.mjs`; tests: `termOccurrences` fixtures in `tests/page-contract.test.js` first (RED), then full suite, `pnpm build` and `pnpm check:seo:dist` green
- [x] 1.2 [NRD-277 app] Register `termCaps: { sevilla: 14 }` for `/`, rewrite E2-E10 per design.md in `src/pages/index.astro`, `src/data/internal-links.ts` (`/` source only) and `src/components/Projects.astro`, update the `portraitAlt` literal in `tests/home-template.test.js:333`; tests: `check-seo-17` RED after registering the cap (22 or more), then GREEN at 13-14; full suite (keyword-ownership, home-template, seo-intents-copy-sync not relaxed), `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md (home at 375 and 1280 px, `/portfolio/` cards).
- Archive the change at dev-done (`/team-harness:dev`), after NRD-245's change.
