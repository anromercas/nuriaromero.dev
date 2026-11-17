# Tasks

Dependencies: none upstream. This change blocks NRD-25 (links, intent registry, `llms.txt`), which blocks NRD-26 (`check-seo-21`).

## 1. Service JSON-LD without an own offer (contract)

- [x] 1.1 [NRD-249 app] `ownOffer?: boolean` in `ServicePageData`, `serviceSchema` with optional `price` (offers spread last only when present), `ServiceLayout` passes no price when `ownOffer === false`, `pricingTier()` exported from `src/data/services.ts` with `tierFrom` delegating; tests: schema/type/layout source assertions and `tierFrom(seoLocal, "Local Pro")` runtime assertion in `tests/seo-para-ia.test.js` first; verify suite, `pnpm build`, `check-seo-02` and `check-seo-16` green (other pages unchanged)

## 2. The page

- [x] 2.1 [NRD-250 app] Page drawings `src/components/seo-ia/AiAnswerMock.astro` and `SeoIaTileArt.astro` (coherencia, respuestas, schema, rastreadores, llms, senales) per the UI spec; tests: illustration assertions in `tests/seo-para-ia.test.js` first; verify suite and `pnpm build` green
- [ ] 2.2 [NRD-251 app] `seoParaIa` entry (fixed copy of design.md, `ownOffer: false`, price from `LOCAL_PRO_TIER`), listed after `seoLocal` in `services` and `focusServices`, and `src/pages/seo-para-ia.astro` on the template in section-map order (editorial hero with `AiAnswerMock`, proof strip, six tiles, process with the only home link in the byline, "Esta web aplica lo que te propongo", Local Pro plan, FAQ slot, related, closing and NAP); tests: placement, ownership terms, structure, single price source, home link, crawler map, promise regex, digit whitelist first, plus `tests/not-found-page.test.js` seven slugs; verify suite, `pnpm build`, `pnpm check:seo:dist` green
- [ ] 2.3 [NRD-252 app] Six sourced FAQ items (design.md list and sources), copy within 780-815 words (trimming order in design.md), `/seo-para-ia/` entry `words: [750, 850]` in `scripts/lib/template-pages.mjs`, and the superseded-lines note in `odd/tasks/seo-para-ia-geo-page.md`; tests: observe `check:seo-17:dist` RED, FAQ assertions first; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 17; report the measured word count in the PR

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
