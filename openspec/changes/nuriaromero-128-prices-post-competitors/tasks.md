# Tasks

Dependencies: G1a (NRD-113), G4 (NRD-112), step 0 (NRD-119) done. Blocked by NRD-127 (reuses `tests/helpers/post-sections.js`, regenerates the same baseline file): merge `develop` into this branch after NRD-127 merges and before task 1.2. Ships in the same promotion as NRD-127. No price figure may be added or changed (S-2026-11-13-1 open).

## 1. Evidence and guide content

- [x] 1.1 [NRD-290 app] Read the SERP of `cuanto cuesta una pagina web en sevilla` (1 DataForSEO call), measure main-content words of up to 5 ranking price guides and price lists, build the subtopic table and gap list, take the Lighthouse baseline of the post before editing; record in `keyword-clusters-2026-11.md` and the CWV record; tests: none (docs)
- [x] 1.2 [NRD-291 app] Rewrite the description, intro and failing section leads, add qualitative gap sections only from the 1.1 list, point to the published price on `/diseno-web-sevilla/` without a figure, set `updatedDate`, update the row's `descriptionSignal`, regenerate the post baseline; tests: new `tests/price-post-intent.test.js` first (RED, with the number-set guard), then the post; `pnpm build && node scripts/check-seo-18.mjs --write` and `pnpm check:seo:dist` green; Lighthouse after recorded

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`), after NRD-127's change.
