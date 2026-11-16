# Tasks

## 1. Store offer source, page and mentions

- [x] 1.1 [NRD-198 app] Single source `src/data/store-offer.ts` (exact values in design.md) and `tiendaOnline` reading it: pricing, benefit 1, process step 1, the five FAQ answers, the reworded platform question, secondary link label; tests: `tests/store-offer.test.js` source, single-literal and copy-guard assertions, the price FAQ assertion of `tests/tienda-online-retarget.test.js` and the one-Offer-499 assertion in `scripts/check-seo-02.mjs` first (RED); verify suite, `pnpm build`, `pnpm check:seo:dist` green
- [x] 1.2 [NRD-199 app] Pricing block on `/tienda-online-sevilla/`: `src/components/tienda-online/StoreOffer.astro` (props only) in the page `pricing` slot with the three options, both lists, the `/automatizaciones/` link and the final-price note, plus the one-sentence rewrite of the "¿Ya vendes por Instagram o WhatsApp...?" block (no "plataforma de terceros" claim; exact text in design.md); tests: page/component source assertions (incl. the page source no longer matches `/no dependes de una plataforma/`) and dist `<main>` assertions in `tests/store-offer.test.js` and `scripts/check-seo-02.mjs` first; verify suite, `pnpm build`, `pnpm check:seo:dist` green
- [x] 1.3 [NRD-200 app] Store mentions on `/diseno-web-sevilla/` (full-website tier note, no "panel") and `/web-para-comercios-sevilla/` (pricing note, price FAQ paragraph 2) from `STORE_FROM`, and the `public/llms.txt` store line; tests: `tests/single-price-source.test.js` runtime-import refactor plus the store line test, llms assertion in `tests/tienda-online-retarget.test.js`, mention assertions and the ten-"panel" guard in `tests/store-offer.test.js` first; verify suite (incl. `tests/diseno-web-template.test.js`), `pnpm build`, `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- NRD-168 (blocked by this story) recomposes the page and replaces `StoreOffer.astro`.
- Archive the change at dev-done (`/team-harness:dev`).
