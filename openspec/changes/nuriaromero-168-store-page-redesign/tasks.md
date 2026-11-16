# Tasks

Prerequisite: NRD-195 (`nuriaromero-195-store-offer-pricing`) merged into `develop`; rebase this branch on it before task 1.1.

## 1. Contract: store options as plans and shared plan layout

- [x] 1.1 [NRD-201 app] `bestFor`, `tradeOff`, `panel` and `storeTiers` (includes `[panel]`, note = recurring cost, no string transforms) in `src/data/store-offer.ts`, and the additive one-plan rule (`max-width: 36rem`, left-aligned) and three-plan rules (one column up to 1023 px, three columns from 1024 px) in `src/components/seo-local/SeoLocalPlans.astro` (style only); tests: data and CSS assertions plus the `SeoLocalPlans` markup fixture in `tests/tienda-online-template.test.js` first; verify suite (NRD-195 tests unchanged), `pnpm build`, `pnpm check:seo:dist` green incl. check-seo-16
- [x] 1.2 [NRD-202 app] Page components `StoreMock.astro`, `StoreTileArt.astro` (catalogo, pago, variantes, envios, panel, seo) and `StoreScope.astro` in `src/components/tienda-online/`; tests: illustration and scope assertions in `tests/tienda-online-template.test.js` first; verify suite and `pnpm build` green

## 2. Page on the template

- [ ] 2.1 [NRD-203 app] Recompose `src/pages/tienda-online-sevilla.astro` on `ServiceLayout variant="template"` in reference order, shorten `tiendaOnline` (hero title/accent, subtitle, benefits keyword, six benefits, four steps, cta), swap the intent content signal, delete `StoreOffer.astro`; tests: structure assertions first; verify suite (incl. NRD-195 and `tienda-online-retarget` tests unchanged), `pnpm build`, `pnpm check:seo:dist` (02, 07, 16) green
- [ ] 2.2 [NRD-204 app] Five sourced FAQ items (price and platform questions kept from NRD-195, no lead time), copy within 900-1,100 words and the `/tienda-online-sevilla/` entry in `scripts/lib/template-pages.mjs`; tests: observe `check:seo-17:dist` RED, FAQ assertions first; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 17

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
