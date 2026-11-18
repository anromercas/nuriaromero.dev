# Tasks

Blocked by NRD-160: merge `develop` into this branch after NRD-160 merges and before task 1.2, and read its Sortlist row in `docs/seo-audit/local-signals-2026-11.md` (must say public, verified in a real browser). Task 1.1 blocks task 1.2.

## 1. Profile links and sameAs

- [ ] 1.1 [NRD-294 app] Add `profileUrl(network)` to `src/data/site.ts` and switch the footer (LinkedIn, GitHub) and `/contacto/` (LinkedIn) from `SITE.sameAs[n]` to it, with no change in rendered HTML; tests: new `tests/same-as.test.js` first (lookup values, missing profile throws, footer and contact sources use the lookup and no index, https and unique entries), update `tests/contact-template.test.js:165`
- [ ] 1.2 [NRD-295 app] Append the Sortlist URL to `SITE.sameAs` and to `VERIFIED_SAME_AS` in `scripts/check-seo-11.mjs`, regenerate `tests/fixtures/seo-local-sevilla.baseline.json` (diff limited to the Sortlist line); tests: `tests/same-as.test.js` first (Sortlist once and last, present in `localBusinessSchema()` and `personSchema()`, no Clutch, Crunchbase, Wikipedia or Wikidata), then `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`), after NRD-160's change.
