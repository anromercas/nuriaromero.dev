# ci-verify Specification

## Purpose
Defines the required `verify` CI job and the order of its steps (install, one build, the unit suite, then the SEO checks on that build) so the unit tests that read `dist/` really run in CI, with a contract test pinning that order and a CI-only guard that fails the suite when the build is missing.

## Requirements

### Requirement: Verify runs the unit tests on the build of the same job

The required `verify` job in `.github/workflows/ci.yml` SHALL run, in this order: `pnpm install --frozen-lockfile`, `pnpm build`, `node --test tests/*.test.js`, `pnpm check:seo:dist`. It SHALL build exactly once and run the unit suite exactly once, after the build, so every test case that reads `dist/` executes against that build.

#### Scenario: Build-dependent cases execute in CI

- **WHEN** `verify` runs on a pull request to `develop`
- **THEN** the `node --test tests/*.test.js` step runs after `pnpm build`, and its log shows the `dist/` cases of `tests/font-loading.test.js` and `tests/font-assets.test.js` as passed, with no case skipped for a missing `dist/`

#### Scenario: One build, SEO checks after it

- **WHEN** the steps of `verify` are listed
- **THEN** there is exactly one `pnpm build` step, exactly one `node --test` step and exactly one `pnpm check:seo:dist` step, in the order build, unit tests, SEO checks

### Requirement: The workflow contract test pins the order

`tests/ci-workflow.test.js` SHALL fail when the `verify` steps leave the order install, build, unit tests, SEO checks, when `pnpm build` or `node --test` appears more than once, or when the unit tests run before the build.

#### Scenario: Tests moved back before the build

- **WHEN** the `node --test tests/*.test.js` step is placed before `pnpm build` in `ci.yml`
- **THEN** `node --test tests/ci-workflow.test.js` fails naming the order

#### Scenario: Workflow in the required order

- **WHEN** `ci.yml` runs install, build, unit tests and SEO checks in that order, each once
- **THEN** `node --test tests/ci-workflow.test.js` passes

### Requirement: Missing build fails the suite in CI only

When the unit suite runs with the environment variable `CI` set to `true`, it SHALL fail if `dist/index.html` or `dist/_astro/` is missing. Without `CI`, that check SHALL be skipped, so `node --test tests/*.test.js` keeps passing locally without `dist/`, with the `dist/` cases skipped.

#### Scenario: CI without a build

- **WHEN** `CI=true node --test tests/*.test.js` runs in a checkout with no `dist/`
- **THEN** the run fails with a message saying `pnpm build` must run before the unit tests in CI

#### Scenario: CI with a build

- **WHEN** `CI=true node --test tests/*.test.js` runs after `pnpm build`
- **THEN** the guard passes and no case is skipped for a missing `dist/`

#### Scenario: Local run without a build

- **WHEN** `node --test tests/*.test.js` runs locally without `CI` and without `dist/`
- **THEN** the guard is skipped, the `dist/` cases are skipped and the run passes

### Requirement: Verify runs the publish approval guard on pull requests

The `verify` job SHALL check out the full history and, only on `pull_request` events, run `node scripts/check-publish-approval.mjs` before `pnpm build`, with the PR base SHA, head SHA and label names passed through step `env`. The `pull_request` trigger SHALL keep `branches: [develop]` and add the `labeled` and `unlabeled` types to the default ones, so a label change re-runs `verify`.

#### Scenario: Owner adds the label to a blocked PR

- **WHEN** `verify` failed on a PR because a post became published, and the owner adds `publish-approved`
- **THEN** a new `verify` run starts on the `labeled` event and the guard step passes

#### Scenario: Guard step pinned

- **WHEN** `ci.yml` loses the guard step, its `pull_request` condition, the full-history checkout or the `labeled` type, or puts the guard after `pnpm build`
- **THEN** `node --test tests/ci-workflow.test.js` fails

#### Scenario: Push runs skip the guard

- **WHEN** `verify` runs on a push to `develop` or `main`
- **THEN** the guard step is skipped and the other steps run as before
