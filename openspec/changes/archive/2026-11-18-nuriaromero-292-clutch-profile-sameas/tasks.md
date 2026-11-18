# Tasks

Task 1.1 blocks task 1.2. If task 1.1 finds a name, city or phone on Clutch that differs from `SITE`, stop: comment the values read on NRD-292, label it `needs-human`, and do not start task 1.2.

## 1. Clutch citation and sameAs

- [x] 1.1 [NRD-296 app] Read `https://clutch.co/profile/nuria-romero` in the real Chrome (never curl/fetch) and record it in `docs/seo-audit/local-signals-2026-11.md` "Citas de terceros" (URL, NAP observed, date, r.clutch.co redirect = citation), updating the L6 row, the "Third-party citations" row, the section C paragraph and the checklist line; tests: none (no behavior change), `node --test tests/*.test.js` stays green
- [x] 1.2 [NRD-297 app] Append the Clutch URL to `SITE.sameAs` and to `VERIFIED_SAME_AS` in `scripts/check-seo-11.mjs`, regenerate `tests/fixtures/seo-local-sevilla.baseline.json` (diff limited to the Clutch line); tests: `tests/same-as.test.js` first (Clutch once and last, in `localBusinessSchema()` and `personSchema()`; Sortlist right before Clutch; `clutch.co` removed from the banned hosts), then `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
