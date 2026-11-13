# 0006. Testing with node:test and TDD

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

The site has little runtime logic; most regressions are copy, data, markup structure or SEO signals. A test runner dependency would add weight for little gain, and there is no browser test harness.

## Decision

- Unit tests use Node's built-in `node:test` and `node:assert/strict`, in `tests/*.test.js` (ES modules), run with `node --test tests/*.test.js`. No Jest/Vitest.
- Tests assert on source files (`src/data`, pages, components, read with `readFile`) and on pure client logic exported for injection (for example `createConsentController({ storage, gtag, appendScript, measurementId })`).
- Assertions on the rendered site live in `scripts/check-seo-*.mjs` against `dist/` (ADR 0005).
- TDD: a behavior change starts with a failing test, then the change. The pre-commit gate is the unit suite; pre-ship adds `pnpm build` (typecheck + build).
- What only a real browser shows (mobile menu, consent banner, form states, 375 px layout, focus) is checked manually by QA, not unit tested.

## Consequences

- No test dependency to maintain; tests are fast (about 60 ms for 63 tests at adoption).
- Source-text assertions are brittle to refactors; prefer asserting on exported data or pure functions when the code allows it.
- Client scripts that hold logic should export a factory with injected browser APIs so they can be tested in Node.

## Evidence

- `tests/*.test.js` (12 files at adoption, for example `tests/seo-meta-titles.test.js`, `tests/analytics-consent.test.js`).
- `src/scripts/analytics-consent.js` (`createConsentController` with injected dependencies).
- `.claude/harness.json` `commands.unitTest`, `commands.preCommit`, `commands.preShip`, `process.tdd: true`; `CLAUDE.md` ("Los cambios de comportamiento van con su test en `tests/`").
