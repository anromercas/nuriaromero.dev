# Tasks

Dependencies: NRD-24 (`/seo-para-ia/`, merged in `develop`); publish with or after it. Independent of NRD-26 (PR #103). Task 1.1 blocks 1.2 (NRD-257 blocks NRD-258).

## 1. Navigation data and components

- [ ] 1.1 [NRD-257 app] Create `src/data/navigation.ts` (`serviceMenuGroups`, `serviceMenuLinks`, `sectorLinks`, signatures in design.md) and the pointer comment above `services` in `src/data/services.ts`; tests: `tests/site-navigation.test.js` data tests 1-6 first (RED), then the full suite and `pnpm astro check` green
- [ ] 1.2 [NRD-258 app] Render the grouped "Servicios" menu (desktop dropdown and mobile accordion, non-link `<p>` headings labelling their lists, active state from `serviceMenuLinks`) in `src/components/Header.astro`, the "Servicios" and "Por sector" columns in `src/components/Footer.astro`, and read `sectorLinks` in `scripts/check-capilar-local.mjs`; tests: source tests 7-11 in `tests/site-navigation.test.js` first (RED), then the full suite, `pnpm build`, `pnpm check:seo:dist` and `pnpm check:capilar-local` green

## Workflow follow-up

- QA runs the real-browser checks in design.md (desktop hover and keyboard, mobile 375 px, footer, active state).
- Archive the change at dev-done (`/team-harness:dev`).
