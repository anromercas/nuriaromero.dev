# Tasks

Task 1.1 blocks task 1.2.

## 1. Unit tests on the CI build

- [x] 1.1 [NRD-313 infra] Move `node --test tests/*.test.js` after `pnpm build` in `.github/workflows/ci.yml` and pin the new order in `tests/ci-workflow.test.js` in the same commit (ADR 0011 amendment); tests: `tests/ci-workflow.test.js` first (new marker order, one build and one test step, test step after the build), RED on the current `ci.yml`, then reorder to GREEN
- [x] 1.2 [NRD-314 app] Add `tests/ci-dist-guard.test.js` (fails when `CI=true` and `dist/` is not built, skipped otherwise) and fix the stale comment at `tests/blog-post-template.test.js:83`; tests: `CI=true node --test tests/ci-dist-guard.test.js` without `dist/` RED, then after `pnpm build` `CI=true node --test tests/*.test.js` GREEN with `skipped 0`

## Workflow follow-up

- No real-browser checks (CI config and tests only). CI evidence: `verify` green on the PR, `node --test` log shows `skipped 0` and the font-loading / font-assets `dist/` cases passed.
- Archive the change at dev-done (`/team-harness:dev`).
