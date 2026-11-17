# Tasks

Order: 1.1 blocks 1.2-1.5 (NRD-271 blocks NRD-272, NRD-273, NRD-274, NRD-275); 1.2-1.5 run in order on the same branch (they all append to `scripts/lib/template-pages.mjs`). Archive after NRD-242 (both touch the `page-template` capability).

## 1. Direct-answer contract

- [ ] 1.1 [NRD-271 app] Add `answer?` to `src/components/seo-local/SectionHeading.astro` and forward it from `ReviewBento`, `SeoLocalProcess`, `SeoLocalAgencia`, `SeoLocalPlans`, `SeoLocalFaq` (lede optional), style `.tpl-answer` in `src/styles/template.css` per the UI spec, add `directAnswer` to `scripts/lib/page-contract.mjs`, the `keySections` field to `scripts/lib/template-pages.mjs` and its assertions to `scripts/check-seo-17.mjs`; tests: `directAnswer` fixtures in `tests/page-contract.test.js` and component source tests in `tests/template-components.test.js` first (RED), then full suite, `pnpm build` and `pnpm check:seo:dist` green with no visible page change

## 2. Answers per page

- [x] 2.1 [NRD-272 app] Register `keySections` and write the answers for `/` and `/seo-local-sevilla/` in `src/pages/index.astro` and `src/pages/seo-local-sevilla.astro` (trims per design.md); tests: `check-seo-17` RED after registering, the no-price-literal source test in `tests/template-components.test.js`, then full suite, `pnpm build` and `pnpm check:seo:dist` (word ranges, `check-seo-16`) green
- [x] 2.2 [NRD-273 app] Register `keySections` and write the answers for `/diseno-web-sevilla/` and `/tienda-online-sevilla/` (prices from `tierFrom` / `src/data/store-offer.ts`); tests: `check-seo-17` RED after registering, then full suite, `pnpm build` and `pnpm check:seo:dist` green
- [x] 2.3 [NRD-274 app] Register `keySections` and write the answers for `/automatizaciones/` and `/desarrollo-software-medida/` (trims to stay within 700-800 and 750-850); tests: `check-seo-17` RED after registering, then full suite, `pnpm build` and `pnpm check:seo:dist` green
- [x] 2.4 [NRD-275 app] Register `keySections` and write the answers for `/inteligencia-artificial/` and `/seo-para-ia/` (Local Pro price from `src/data`, trims to stay within 750-850); tests: `check-seo-17` RED after registering, then full suite, `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md on the eight pages (375 and 1280 px, reading order).
- Archive the change at dev-done (`/team-harness:dev`), after NRD-242's change.
