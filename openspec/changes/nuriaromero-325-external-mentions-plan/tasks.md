# Tasks

Documentation only: no file under `src/`, `public/`, `scripts/` or `tests/` changes. Nobody is contacted.

## 1. Mentions plan

- [x] 1.1 [NRD-334 app] Create `docs/research/NRD-325-mentions-plan.md` with the delta vs the NRD-21 baseline (every figure sourced and dated), the data-source log (developer DataForSEO calls: 0; figures reused from `docs/seo-audit/`, `.claude/state/seo/` or the optional data step, else "not available"; file force-added on its exact path) and at least 20 ranked, existence-checked targets; tests: none (docs, `skip_specs`), `node --test tests/*.test.js` stays green
- [ ] 1.2 [NRD-335 app] Complete the document with 3 tactics (effort, return as hypotheses, measurement), options that cost money for the owner, a 90-day plan starting with NRD-72, proposed follow-up stories in prose and the closed data-source log; tests: none (docs), `node --test tests/*.test.js` stays green

## Workflow follow-up

- Archive the change at dev-done (`/team-harness:dev`).
