# NRD-112 - Run the check-seo-NN build checks in CI (verify job)

## Why

[NRD-112](https://nuriaromerodev.atlassian.net/browse/NRD-112) (gap G4 of NRD-75, `docs/seo-audit/technical-follow-up.md`, epic NRD-4). The phase-5 page stories (ADR 0013) rely on `scripts/check-seo-02..15.mjs` to guard trailing slashes, internal links, intents, FAQ schema, `llms.txt`, real proof and entity data. CI runs only `node --test tests/*.test.js` and `pnpm build` (`.github/workflows/ci.yml:31-32`), so those checks protect nothing unless someone runs them by hand. This story blocks every other phase-5 story and the gap stories G1a (NRD-113), G2a+G2b (NRD-115), G3 (NRD-116), G5 (NRD-118) and G6 (NRD-117): their new rules only protect anything once `verify` runs them.

## What changes

- `package.json`: new aggregate scripts `check:seo:dist` (all 12 `check-seo-NN` scripts against the existing `dist/`, numeric order, fail fast) and `check:seo` (build, then the aggregate).
- `.github/workflows/ci.yml`: one new last step in the `verify` job, `pnpm check:seo:dist`, after `pnpm build`.
- Tests pin both: `tests/package-scripts.test.js` (the aggregate lists every check file) and `tests/ci-workflow.test.js` (the step exists, after the build).
- `CLAUDE.md` "Comandos" documents the aggregate.

## Out of scope

- `scripts/check-google-reviews.mjs` and `scripts/check-capilar-local.mjs`: not `check-seo-NN`, not in the acceptance criteria. `check-google-reviews` needs the Google Places env vars, which CI does not have (ADR 0011: no secrets).
- Changing any check's rules (G1a, G2, G3, G5, G6 are their own items).
- Branch protection, Netlify settings, Node/pnpm versions, caching of `dist/`, new jobs (ADR 0011: checks join `verify` as steps; the required list stays `["verify"]`).

## Requirements and scenarios

### Requirement: verify runs every SEO build check after the build

The `verify` job SHALL run `pnpm check:seo:dist` as a step after `pnpm build`, against the `dist/` that step produced, without rebuilding. `check:seo:dist` SHALL run every `scripts/check-seo-NN.mjs` (02, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15) in numeric order and exit non-zero on the first failing check.

#### Scenario: all checks pass

- WHEN a PR to `develop` builds and every `check-seo-NN` script exits 0
- THEN the "SEO build checks" step is green and `verify` is green

#### Scenario: one check fails

- WHEN any `check-seo-NN` script exits non-zero (including `process.exitCode = 1` in `check-seo-02.mjs`)
- THEN `pnpm check:seo:dist` exits non-zero, later checks do not run, and `verify` is red

#### Scenario: no rebuild per check

- WHEN the step runs
- THEN it calls `node scripts/check-seo-NN.mjs` directly (the `:dist` form) and never `pnpm build` again

### Requirement: the aggregate cannot drift from the check files

The unit suite MUST fail when a `scripts/check-seo-NN.mjs` file exists that `check:seo:dist` does not run, or when the aggregate runs them out of order.

#### Scenario: a new check is added without the aggregate

- WHEN a story adds `scripts/check-seo-16.mjs` and its `check:seo-16`/`:dist` scripts but not the aggregate entry
- THEN `node --test tests/package-scripts.test.js` fails (and so does `verify`)

### Requirement: the workflow contract pins the step

`tests/ci-workflow.test.js` MUST fail when the `pnpm check:seo:dist` step is removed from `verify` or placed before `pnpm build`.

#### Scenario: step removed

- WHEN the step is deleted from `ci.yml`
- THEN `node --test tests/ci-workflow.test.js` fails

### Requirement: no new dependency, same toolchain, green today

The change MUST add no dependency, keep Node 24 / pnpm 11 / `contents: read` / no secrets, and leave `verify` green on the PR head (all 12 scripts passed on 2026-11-15 against a local build, verified again read-only by the Tech Lead on 2026-11-15).

#### Scenario: PR head

- WHEN the story PR runs `verify`
- THEN all steps, including "SEO build checks", are green

### Requirement: documented command

`CLAUDE.md` "Comandos" SHALL mention `pnpm check:seo:dist` and `pnpm check:seo`.

#### Scenario: a contributor looks up how to run the checks

- WHEN they read `CLAUDE.md` "Comandos"
- THEN the line "Checks SEO" names the aggregate and says it is what CI runs

### Requirement: failure proof recorded

The story PR MUST record evidence that a failing check turns `verify` red.

#### Scenario: red proof

- WHEN QA runs the proof described under "Real-browser / e2e checks"
- THEN the PR links a red `verify` run whose failing step is "SEO build checks"

## Files

| Layer   | Action | Path                            | Notes                                                               |
| ------- | ------ | ------------------------------- | ------------------------------------------------------------------- |
| `app`   | modify | `tests/package-scripts.test.js` | new test for `check:seo:dist` and `check:seo` (task 1.1)            |
| `app`   | modify | `package.json`                  | two scripts after `seo:inventory`, before `check:seo-02` (task 1.1) |
| `app`   | modify | `CLAUDE.md`                     | "Comandos", line "Checks SEO", Spanish (task 1.1)                   |
| `infra` | modify | `.github/workflows/ci.yml`      | one step after `pnpm build` (task 1.2); `infra.ownedPaths`          |
| `app`   | modify | `tests/ci-workflow.test.js`     | marker and a placement test (task 1.3)                              |

`.github/workflows/**` is in `infra.ownedPaths`, not in any layer: task 1.2 carries the `infra` label and goes to `/team-harness:infra`. `tests/**`, `package.json` and `CLAUDE.md` are in `layers.app.paths`: tasks 1.1 and 1.3 carry `app`. The workflow and its contract test change in separate commits of the same branch (ADR 0011 asks for them to change together; the PR is the unit).

## Interfaces

`package.json` (inserted after `"seo:inventory"`; `check:capilar-local` stays last, and the existing ordering test ignores both keys because they do not start with `check:seo-`):

```json
"check:seo": "pnpm build && pnpm check:seo:dist",
"check:seo:dist": "node scripts/check-seo-02.mjs && node scripts/check-seo-05.mjs && node scripts/check-seo-06.mjs && node scripts/check-seo-07.mjs && node scripts/check-seo-08.mjs && node scripts/check-seo-09.mjs && node scripts/check-seo-10.mjs && node scripts/check-seo-11.mjs && node scripts/check-seo-12.mjs && node scripts/check-seo-13.mjs && node scripts/check-seo-14.mjs && node scripts/check-seo-15.mjs",
```

`.github/workflows/ci.yml`, new last step of `verify`:

```yaml
- run: pnpm build
- name: SEO build checks
  run: pnpm check:seo:dist
```

Decision: a literal `&&` chain rather than a runner script that discovers files. It needs no new file, keeps each check's own output and exit code, and the unit test (built on the existing `checkNumbers` discovery in `tests/package-scripts.test.js`) forces the next story that adds a check to add it here too, which is the visible, reviewable behavior we want. Future gap stories that add `check-seo-16.mjs` (G5) edit the aggregate in the same commit.

## Data

None. No schema, storage, settings, env vars or secrets.

## Test plan (TDD order)

1. Task 1.1, `tests/package-scripts.test.js` (RED: keys missing): `check:seo:dist` equals the `checkNumbers` list mapped to `node scripts/check-seo-NN.mjs` and joined with `&&`; `check:seo` equals `pnpm build && pnpm check:seo:dist`. Then `package.json` (GREEN). Then `pnpm build && pnpm check:seo:dist` locally (exit 0), and one local negative run: temporarily rename `dist/llms.txt`, confirm a non-zero exit, restore it.
2. Task 1.2, `ci.yml`: existing `tests/ci-workflow.test.js` stays green (new step after all markers).
3. Task 1.3, `tests/ci-workflow.test.js`: add the marker `'pnpm check:seo:dist'` after `'pnpm build'` and a test that `run: pnpm check:seo:dist` appears once, after `run: pnpm build`. RED proof: delete the step locally, run the test (fails), restore (passes); never commit the deletion.
4. Full suite `node --test tests/*.test.js` green after each task.

## Real-browser / e2e checks

No browser checks (no UI change). QA verifies on GitHub:

- The story PR's `verify` run shows the step "SEO build checks", green, after "pnpm build", and its log lists the 12 "passed" lines.
- Red proof (acceptance criterion): a throwaway draft PR from a branch off the story branch that breaks one check without touching the site (for example change one expected string in `scripts/check-seo-09.mjs`, or remove one service line from `public/llms.txt`); `verify` goes red at "SEO build checks"; link the run in the story PR, then close the draft PR and delete its branch.
- After merge, the push run on `develop` is green.

## Risks

- **CI build has no Google Places / GA4 env vars.** The checks passed against a local build; in CI the home renders without the reviews section. `check-seo-10.mjs` only fails when unverified rating data _is_ rendered, and `check-seo-14.mjs` reads the consent component source, so no check needs the env vars. The first `verify` run on the PR is the confirmation; if a check fails only in CI, that is a check bug to fix in this story (app layer), not a reason to skip it.
- **Order with the gap stories.** NRD-113, NRD-115, NRD-116, NRD-117 and NRD-118 add rules that must be green when they land; once this story merges, a gap story that merges red blocks `develop`. Each of them already runs its check in its own acceptance criteria.
- **Routing.** The story carries the `infra` label, which `/team-harness:dev` excludes from its default query; tasks 1.1 and 1.3 are `app` and need `dev NRD-112` by key (or the orchestrator's equivalent), task 1.2 needs `/team-harness:infra`.
- **Runtime.** 12 file-reading scripts add a few seconds; `timeout-minutes: 15` is unchanged.

## ADRs

- Relies on [0005](../adr/0005-sitemap-robots-llms-and-seo-checks.md) (`check-seo-NN` contract, `:dist` form), [0006](../adr/0006-testing-node-test-and-tdd.md) (node:test, TDD), [0011](../adr/0011-ci-verify-workflow.md) (new checks join `verify` as steps; `ci.yml` and `tests/ci-workflow.test.js` change together). No new ADR: this applies ADR 0011 as written.

## Tasks

- [x] 1.1 [NRD-130 app] Add `check:seo:dist` and `check:seo` to `package.json` and document them in `CLAUDE.md`; tests: `tests/package-scripts.test.js` aggregate test first (RED), then the scripts (GREEN), then `pnpm build && pnpm check:seo:dist`.
- [x] 1.2 [NRD-131 infra] Add the "SEO build checks" step (`pnpm check:seo:dist`) after `pnpm build` in `.github/workflows/ci.yml`; tests: existing `tests/ci-workflow.test.js` stays green.
- [x] 1.3 [NRD-132 app] Pin the step in `tests/ci-workflow.test.js` (order marker and placement test); tests: RED with the step deleted locally, GREEN restored.
