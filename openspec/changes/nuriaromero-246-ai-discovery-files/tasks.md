# Tasks

Order: 1.1 blocks 1.2, 1.2 blocks 1.3, 1.3 blocks 1.4 (NRD-280 -> NRD-281 -> NRD-282 -> NRD-283).

## 1. AI discovery files

- [x] 1.1 [NRD-280 app] Move `homeFaqs`/`contactFaqs` to `src/data/page-faqs.ts`, the robots policy to `src/data/crawler-policy.ts` (used by `astro.config.mjs`) and `SERVICE_AREA` to `src/data/site.ts`, with byte-identical build output; tests: data-move assertions in `tests/ai-discovery.test.js` first (RED), then the move, repoint the FAQ readers in `tests/home-template.test.js` and `tests/contact-template.test.js`, full suite, `pnpm build` and `pnpm check:seo:dist` green
- [x] 1.2 [NRD-281 app] Add `src/lib/ai-discovery.ts` (`faqPages`, `buildAiFaq`, `buildAiSummary`, `buildAiTxt`) and the shared `faqAnswerText` in `src/lib/schema.ts`; tests: builder assertions in `tests/ai-discovery.test.js` first (RED: FAQ parity with `faqSchema`, prices equal `pricing.from`, no `priceFrom` for `/seo-para-ia/`, ai.txt rules equal `CRAWLER_POLICY`, no build date), then implementation, `pnpm astro check` green
- [ ] 1.3 [NRD-282 app] Add the prerendered endpoints `src/pages/.well-known/ai.txt.ts`, `src/pages/ai/summary.json.ts`, `src/pages/ai/faq.json.ts` and exclude `/ai/` and `/.well-known/` from the sitemap; tests: endpoint source and sitemap-filter tests plus a dist-gated existence/parse test in `tests/ai-discovery.test.js` first (RED), then endpoints, `pnpm build` and `pnpm check:seo:dist` green
- [ ] 1.4 [NRD-283 app] Add `scripts/lib/ai-discovery-contract.mjs`, `scripts/check-seo-24.mjs` and its `package.json` scripts (appended to `check:seo:dist`); tests: `tests/ai-discovery-contract.test.js` fixtures first (RED: FAQ drift both ways, answer and order drift, price drift, ai.txt vs robots drift, missing links, sitemap listing), then the contract and script, `tests/package-scripts.test.js`, `pnpm build && pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the checks in design.md "Real-browser / e2e checks"; the production `Content-Type` check runs after the scheduled promotion to `main`.
- Archive the change at dev-done (`/team-harness:dev`).
