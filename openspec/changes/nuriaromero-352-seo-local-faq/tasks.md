# Tasks

One work unit: data, its test and the regenerated `check-seo-16` baseline go in the same commit so `pnpm check:seo:dist` stays green.

## 1. Local SEO FAQ

- [ ] 1.1 [NRD-368 app] Add L5 (first entry) and L1 (after "¿Qué diferencia hay entre Local y Local Pro?", answer as a getter reading `tierFrom(seoLocal, "Local")` and `tierFrom(seoLocal, "Local Pro")`) to `seoLocal.faqs` in `src/data/services.ts`, add the L8 sentence as the second sentence of the Google Maps entry, regenerate `tests/fixtures/seo-local-sevilla.baseline.json` with `pnpm build && node scripts/check-seo-16.mjs --write`; tests: `tests/seo-local-faq.test.js` first (order and count, L5 text, L1 rendered prices, live price read, no typed price in the L1 source, serialization and `faqSchema`, L8 sentence without digits, no promises, baseline FAQPage names)

## Workflow follow-up

- QA opens `/seo-local-sevilla/` at 375 px and desktop and checks the 11 entries, the L1 lead sentence with both prices and the JSON-LD / `/ai/faq.json` parity.
- Archive the change at dev-done (`/team-harness:dev`).
