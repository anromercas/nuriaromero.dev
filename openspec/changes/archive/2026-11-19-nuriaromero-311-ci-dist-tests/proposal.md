## Why

[NRD-311](https://nuriaromerodev.atlassian.net/browse/NRD-311). In the required `verify` job (`.github/workflows/ci.yml:31-32`) `node --test tests/*.test.js` runs before `pnpm build`, so every test case that needs `dist/` is skipped in CI. The regression guards of NRD-310 (`tests/font-loading.test.js:94`) and NRD-306 (`tests/font-assets.test.js:43`), plus the built-page cases of about a dozen other test files (`blog-post-template`, `software-template`, `not-found-page`, `ai-discovery`, `og-url-guard`, `store-offer`, ...), only protect on developers' machines. `tests/ci-workflow.test.js:28-48` pins the current tests -> build order.

## What Changes

- `verify` runs `pnpm build` first and then `node --test tests/*.test.js` once, on that build, followed by `pnpm check:seo:dist`. Still one build per job, one test run per job. The unit suite takes under a second, so running it after the build costs nothing; the only trade-off is that a failing unit test is reported after the build instead of before it.
- `tests/ci-workflow.test.js` pins the new order: install -> build -> unit tests -> SEO checks, exactly one `pnpm build` step and exactly one `node --test` step, and the test step after the build. It fails if the tests move back before the build.
- New `tests/ci-dist-guard.test.js`: when the suite runs in CI (`CI=true`, set by GitHub Actions), it fails if `dist/` is not built, so no `dist/` case can silently skip in CI again. Locally (no `CI`) it is skipped, and `node --test tests/*.test.js` keeps working without `dist/`.
- ADR 0011 gets an amendment recording the new step order and that `ci.yml` and `tests/ci-workflow.test.js` change in the same commit.

## Capabilities

### New Capabilities

- `ci-verify`: what the required `verify` job runs, in which order, and the guarantee that build-dependent test cases execute in CI.

### Modified Capabilities

None.

## Impact

- `.github/workflows/ci.yml` (infra-owned), `tests/ci-workflow.test.js`, new `tests/ci-dist-guard.test.js`, comment in `tests/blog-post-template.test.js:83` (app), `docs/adr/0011-ci-verify-workflow.md` (TL).
- Required check name stays `verify` (`ci.requiredChecks` unchanged); no new job, no secrets, no deploy, no dependency.
- Build-dependent cases that have never run in CI now run on the CI build (shallow clone, no optional env vars such as `GOOGLE_PLACES_API_KEY`); a case that only passed with local env would surface here (see design Risks).
- No radical change.

## Out of scope

- Splitting tests into build/no-build suites or adding a pre-build test run.
- Changing what any existing test asserts (other than `tests/ci-workflow.test.js` and the stale comment in `tests/blog-post-template.test.js`).
- Netlify build settings, Node/pnpm versions, branch protection.
