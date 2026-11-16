# Tasks

## 1. Word budget without the live review quote

- [x] 1.1 [NRD-213 app] `data-word-budget="exclude"` on the `RealProof` quote figure, `withoutWordBudgetExcluded` and `mainWordCount` in `scripts/lib/page-contract.mjs`, header comment in `scripts/lib/template-pages.mjs`; tests: marked vs unmarked equal count, outside text counted, nesting and quoting cases in `tests/page-contract.test.js` and the marker assertion in `tests/template-components.test.js` first; verify suite, `pnpm build`, `pnpm check:seo:dist` green with ranges and copy unchanged

## Workflow follow-up

- QA confirms no visual change on `/seo-local-sevilla/` and `/`.
- Archive the change at dev-done (`/team-harness:dev`).
