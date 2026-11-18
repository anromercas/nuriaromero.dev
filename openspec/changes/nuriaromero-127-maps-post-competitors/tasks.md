# Tasks

Dependencies: G1a (NRD-113), G4 (NRD-112) and step 0 (NRD-119) done. Blocks NRD-128 (shared `tests/helpers/post-sections.js` and `tests/fixtures/blog-posts.baseline.json`); both ship in the same promotion.

## 1. Evidence and guide content

- [x] 1.1 [NRD-288 app] Read the SERP of `como aparecer en google maps` (1 DataForSEO call), measure main-content words of up to 5 ranking guides, build the subtopic table and gap list, take the Lighthouse baseline of the post before editing; record in `keyword-clusters-2026-11.md` and the CWV record; tests: none (docs)
- [ ] 1.2 [NRD-289 app] Rewrite the description and the failing section leads, add the body link to `/seo-local-sevilla/`, add gap sections only from the 1.1 list, set `updatedDate`, regenerate the post baseline; tests: new `tests/helpers/post-sections.js` and `tests/maps-post-intent.test.js` first (RED), then the post; `pnpm build && node scripts/check-seo-18.mjs --write` and `pnpm check:seo:dist` green; Lighthouse after recorded

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`), before NRD-128's change.
