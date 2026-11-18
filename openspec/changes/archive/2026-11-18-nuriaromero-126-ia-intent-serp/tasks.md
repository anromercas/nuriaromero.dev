# Tasks

Dependencies: none open (G4 NRD-112, G5 NRD-118 and step 0 NRD-119 are done). Same sprint as NRD-127 and NRD-128; no shared source file except the two docs, where each story writes its own entry.

## 1. Evidence and intent copy

- [x] 1.1 [NRD-286 app] Re-read the SERP of `inteligencia artificial para empresas sevilla` (1 DataForSEO call), measure main-content words of the ranking service pages (at most 3 calls) and take the Lighthouse baseline before editing; record in `keyword-clusters-2026-11.md` and the CWV record; tests: none (docs)
- [x] 1.2 [NRD-287 app] Title, H1 and description work `inteligencia artificial para empresas sevilla` in `src/data/services.ts`, `intentMatrix` row follows; tests: new `tests/ia-intent.test.js` first (RED), then update the frozen strings in `tests/ia-template.test.js` and `tests/seo-meta-titles.test.js`; `pnpm build && pnpm check:seo:dist` green; Lighthouse after recorded

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
