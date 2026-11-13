# NRD-6 - CI workflow with the required `verify` job

## Why

[NRD-6](https://nuriaromerodev.atlassian.net/browse/NRD-6) (M0, epic NRD-1). The repository has no CI (`.github/` does not exist on `develop`), so regressions reach `develop` unchecked and the team-harness auto-merge stays blocked until the required check `verify` exists (`.claude/harness.json`: `ci.workflowFile: ci.yml`, `ci.requiredChecks: ["verify"]`, `ci.mainHealthWorkflow: ci.yml`).

Blocked by [NRD-7](https://nuriaromerodev.atlassian.net/browse/NRD-7): `pnpm-lock.yaml` is listed in `.gitignore:25`; it must stay tracked for `pnpm install --frozen-lockfile`.

## What changes

- New `.github/workflows/ci.yml`: workflow `CI`, one job `verify` (install with the frozen lockfile, `node --test tests/*.test.js`, `pnpm build`).
- New `tests/ci-workflow.test.js` that pins the workflow contract.
- ADR [0011](../adr/0011-ci-verify-workflow.md) records the CI convention.

## Out of scope

- Branch protection / required status check in GitHub settings (repository setting: the user does it).
- Running `check:seo-*:dist` in CI (follow-up candidate once NRD-8 has normalised the scripts and they are known green).
- Deploy steps, Netlify integration, secrets, caching beyond the pnpm store, `.nvmrc` or `packageManager` (both are read by Netlify and would change the production build image).
- Lint/format checks (`commands.lint` and `commands.formatCheck` are `null`).

## Requirements and scenarios

### Requirement: CI runs on pull requests and pushes

The repository SHALL run the `CI` workflow on every pull request targeting `develop` and on every push to `develop` and `main`.

#### Scenario: PR to develop

- WHEN a pull request targeting `develop` is opened or updated
- THEN the `verify` check runs on the PR head

#### Scenario: push to develop or main

- WHEN a commit is pushed to `develop` or `main` (merge, scheduled promotion)
- THEN the `verify` job runs on that commit

### Requirement: verify job checks tests and build

The `verify` job MUST run on `ubuntu-latest` and execute, in order: checkout, pnpm setup, Node setup, `pnpm install --frozen-lockfile`, `node --test tests/*.test.js`, `pnpm build` (which runs `astro check && astro build`).

#### Scenario: green PR

- WHEN all unit tests pass and the build succeeds
- THEN the `verify` check is green

#### Scenario: failing test

- WHEN any `tests/*.test.js` case fails
- THEN the `verify` check is red and later steps do not run

#### Scenario: lockfile drift

- WHEN `package.json` and `pnpm-lock.yaml` disagree
- THEN `pnpm install --frozen-lockfile` fails and `verify` is red

### Requirement: no secrets and no deploy

The workflow MUST NOT reference `secrets.*`, deploy, or call paid services; the token permission SHALL be `contents: read`. The build MUST pass without Google Places variables (`getGoogleReviews()` returns `null` when `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACE_ID` are unset, `src/lib/google-reviews.ts:61-69`).

#### Scenario: build without secrets

- WHEN `verify` runs with no repository secrets configured
- THEN `pnpm build` succeeds and the home renders without the reviews section

### Requirement: required check is reported, not configured

Making `verify` a required status check SHALL be reported to the user; no agent changes branch protection.

#### Scenario: story closes

- WHEN the story is done
- THEN the final report tells the user to add `verify` as a required check on `develop` (and `main`)

## Files (layer `app`)

All paths belong to the single layer `app`. Note: `.github/workflows/**` is listed in `infra.ownedPaths` and in `repo.qaExemptPaths`, not in `layers.app.paths`; the harness has only one layer, so the subtask is labelled `app`.

| Action | Path                        | Notes                                                                                               |
| ------ | --------------------------- | --------------------------------------------------------------------------------------------------- |
| create | `tests/ci-workflow.test.js` | node:test, reads the YAML as text (pattern of `tests/google-calendar-reserva.test.js` `readSource`) |
| create | `.github/workflows/ci.yml`  | exact content below                                                                                 |

## Interfaces

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [develop]
  push:
    branches: [develop, main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: verify
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: node --test tests/*.test.js
      - run: pnpm build
```

Decisions behind the versions:

- **pnpm 11**: `pnpm-workspace.yaml` uses `allowBuilds: { esbuild: true, sharp: true }` (pnpm 11 syntax, commit `c07b6fb`). With pnpm 10 or older the key is ignored, `sharp`'s install script is skipped and `astro build` fails on image optimisation. Lockfile is `lockfileVersion: '9.0'` (local pnpm 11.1.2).
- **Node 24**: the version the project is developed and built with locally (v24.22.0); pnpm 11 requires a modern Node; Node 20 is end of life. Pinned only in the workflow, not in `.nvmrc`, to leave Netlify's production build image untouched (see Risks).
- **`pnpm/action-setup` before `setup-node`** so `cache: pnpm` finds the binary.
- Status check name: job id and `name` are both `verify`, so GitHub reports the check as `verify` (what `ci.requiredChecks` expects).

## Data

None. No schema, storage, settings or env vars. No secrets.

## Test plan (TDD order)

1. `tests/ci-workflow.test.js` (RED: file missing):
   - `.github/workflows/ci.yml` exists.
   - `on:` has `pull_request` with `branches: [develop]` and `push` with `develop` and `main`.
   - job `verify:` with `name: verify` and `runs-on: ubuntu-latest`.
   - steps appear in order: `actions/checkout@v4`, `pnpm/action-setup@v4` + `version: 11`, `actions/setup-node@v4` + `node-version: 24` + `cache: pnpm`, `pnpm install --frozen-lockfile`, `node --test tests/*.test.js`, `pnpm build` (assert by `indexOf` ordering).
   - `permissions:` / `contents: read`.
   - no `secrets.`, `netlify`, `deploy` (case-insensitive).
2. Create `ci.yml` (GREEN). Run `node --test tests/*.test.js` and `pnpm build` locally.

Note: no YAML parser dependency (a new dependency is radical); text assertions are enough for a file this small.

## Real-browser / e2e checks

No browser checks. QA verifies on GitHub:

- The story PR shows the `verify` check, green, with the six steps.
- Red proof: a throwaway draft PR from a branch off the story branch that adds `test('ci red proof', () => assert.fail())`; `verify` goes red at the test step; close the PR and delete the branch; link both runs in the story.
- After merge, the push run on `develop` is green.

## Risks

- **Node version vs Netlify**: Netlify's Node version is a site setting the agents cannot see (no `netlify.toml`, no `.nvmrc`). If Netlify builds with another major, CI and production can diverge. Reported to the user: confirm the Netlify Node version (24 recommended) or ask for a follow-up story that adds `.nvmrc` deliberately (it changes the production build, so it is the user's call).
- **pnpm 11 frozen install on CI**: if the lockfile was produced with settings CI does not reproduce, `--frozen-lockfile` fails. Mitigation: the developer runs `pnpm install --frozen-lockfile` in a clean clone before opening the PR (also an NRD-7 criterion).
- **Required check not enabled** until the user changes branch protection: auto-merge must keep treating a missing required check as blocking.
- Action major versions (`@v4`) float within the major; acceptable for a public-actions-only, read-only workflow.

## ADRs

- Relies on 0001 (static output, no deploy from CI), 0006 (node:test, TDD), 0009 (branch flow, deploys only from `main` via Netlify).
- New: [0011 - CI `verify` workflow on GitHub Actions](../adr/0011-ci-verify-workflow.md). The ADR index lives in `docs/adr/README.md`, added by PR #1 (`chore/NRD-31-team-harness-setup`), which is not on `develop` yet: add the 0011 row to the index when both are merged.

## UI spec

No user-facing UI change. The story adds only `.github/workflows/ci.yml` and `tests/ci-workflow.test.js`; no file under `src/`, `public/`, `tailwind.config.mjs` or `astro.config.mjs` changes, so there are no screens, states, copy, tokens, responsive or interaction rules to specify (checklist items 1-8: n/a).

Must stay visually unchanged: every page of the built site, including the home. The scenario "build without secrets" (home rendered without the reviews section) describes only the CI build environment, where Google Places variables are unset; it is not a design change, and the production home on Netlify keeps showing the reviews section exactly as today. No UI file may be touched to make CI pass; if the build fails on CI for a UI reason, that is a separate bug, not part of this story.

## Tasks

- [x] 1.1 [NRD-35 app] Add `.github/workflows/ci.yml` with the `verify` job; tests: `tests/ci-workflow.test.js` first (RED on missing file), then the workflow (GREEN), full suite and `pnpm build` locally.
