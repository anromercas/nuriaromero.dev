# Tasks

Dependencies: blocked by NRD-24 (page, `seoParaIa`, menu entry on `develop`; cut or rebase this branch after it merges). Blocks NRD-26 (`check-seo-21` asserts the `llms.txt` entry).

## 1. Links, registry and llms.txt

- [x] 1.1 [NRD-253 app] Link rows of design.md in `src/data/internal-links.ts` (ADR 0013 rows 8-11 verbatim, plan rows for the other pairs, no `/` row on the page), `intentMatrix` row, `keywordOwners` `posicionamiento en ia` and `seo para ia`, `serviceRoutes` and two `reciprocalLinks` pairs in `src/data/seo-intents.ts`, and `seo.rankTracking` in `.claude/harness.json` (only that key; `.claude/` guard in design.md); tests: `tests/seo-para-ia-links.test.js` rows/anchor rules/registry first, then the pinned tests (keyword-ownership, adr-0013-link-rows, ia-template, home-template, rank-tracking-keywords); verify suite, `pnpm build`, `pnpm check:seo:dist` green (06, 07, 17; word counts in the PR)
- [x] 1.2 [NRD-254 app] `public/llms.txt` entry under "## Servicios" (label "SEO para IA", Local Pro price as published, "Sin garantía de mención ni de posición"); tests: `llms.txt` assertions in `tests/seo-para-ia-links.test.js` first; verify suite (incl. `single-price-source`), `pnpm build`, `pnpm check:seo:dist` (09) green

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`), after NRD-24's change is archived.
