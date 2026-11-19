# Tasks

Task 1.1 blocks task 1.2.

## 1. Iteration review routine and tracking guard

- [ ] 1.1 [NRD-302 app] Add `untrackedOwners(owners, trackedRows)` to `scripts/lib/keyword-ownership.mjs` and assert every `keywordOwners` term is tracked in `seo.rankTracking.keywords` for its owner page (`.claude/harness.json` read only); tests: `tests/rank-tracking-keywords.test.js` first (unit cases matching, absent, other page; real data returns `[]`; replaces the `/seo-para-ia/`-only loop), RED on the missing export, then green
- [ ] 1.2 [NRD-303 app] Write `## Revisión de iteración` in `docs/seo-audit/measurement-seo.md` after "Cadencia y registro de cambios" (cadence, owner-page table, comparison with the NRD-17 baselines, record template, mandatory decision, control step; no KPI figures); tests: `tests/iteration-review-routine.test.js` first (section exists, names every owner URL in backticks, sources, decisions and control step), RED on the current document, then `node --test tests/*.test.js` and `pnpm build && pnpm check:seo:dist` green

## Workflow follow-up

- No real-browser checks (docs and tests only).
- Archive the change at dev-done (`/team-harness:dev`).
