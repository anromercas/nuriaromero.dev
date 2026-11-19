## Context

`.github/workflows/ci.yml` (job `verify`, ADR 0011) runs: checkout, pnpm 11, Node 24, `pnpm install --frozen-lockfile` (line 30), `node --test tests/*.test.js` (31), `pnpm build` (32), `pnpm check:seo:dist` (33-34). Test files gate their build-dependent cases on `dist/`:

- `hasBuild = existsSync(dist/index.html) && existsSync(dist/_astro)`: `tests/font-loading.test.js:9-10,94`, `tests/font-assets.test.js:8-9,43`.
- `existsSync(dist/...)` skips or `t.skip`: `blog-post-template` (83-130), `software-template` (350-356), `not-found-page` (126-175), `og-url-guard` (110), `ai-discovery` (241, 282), `store-offer` (175), `recursos-template` (85-89), `ia-template` (430), `tienda-online-template` (394), `automatizaciones-template` (279, 363, 398), `blog-index-template` (67-115), `diseno-web-template` (436).

In CI all of them skip. Locally, with a fresh `dist/`, the full suite is 910 tests, 0 skipped, 0 failed, about 0.8 s (measured on `develop` 8e567f6 at design time). `tests/ci-workflow.test.js:28-48` pins the marker order `... install, node --test, pnpm build, check:seo:dist`, and `:51-65` pins one `check:seo:dist` step after the build.

## Goals / Non-Goals

**Goals:**

- Every `dist/` case runs in `verify`, on the build of the same job, with one build and one test run.
- The contract test fails if the tests move back before the build.
- A runtime guard makes a skipped `dist/` case impossible in CI, independent of the YAML text.
- Local `node --test tests/*.test.js` without `dist/` is unchanged.

**Non-Goals:**

- A second, pre-build test run or splitting the suite into build/no-build files (the suite is sub-second; a pre-build run would still skip the `dist/` cases, which AC 1 forbids).
- Changing what other tests assert.

## Decisions

**Approach.** Move the unit-test step after `pnpm build` (install -> build -> unit tests -> SEO checks). The suite costs under a second, so job time does not grow; the build still runs once. `tests/ci-workflow.test.js` is updated to the new marker order and gains a test that counts the build and test steps and requires the test step after the build. A new `tests/ci-dist-guard.test.js` fails when `CI === "true"` and the build is missing (same `hasBuild` definition as the font tests), and is skipped otherwise. ADR 0011 is amended with the new step order and the rule below.

**Ownership decision (recorded in the ADR 0011 amendment).** `ci.yml` (infra-owned) and its contract test `tests/ci-workflow.test.js` (app-owned) must change in one commit: the current test pins the old order, so changing either file alone leaves a red commit that `commands.preCommit` rejects, and TDD needs the new contract test RED before `ci.yml` changes. Task 1.1 is therefore one `infra` subtask that edits both files; this is the only `tests/` file the infra subtask touches. The guard test and the comment fix are a separate `app` subtask (1.2).

**Files**

| Path | Action | Layer / owner | Symbols / lines |
| --- | --- | --- | --- |
| `.github/workflows/ci.yml` | modify | infra (task 1.1) | `jobs.verify.steps`: move `- run: node --test tests/*.test.js` from line 31 to after `- run: pnpm build` |
| `tests/ci-workflow.test.js` | modify | infra (task 1.1, paired contract test, ADR 0011 amendment) | test "verify steps run in the required order" markers; new test "runs the unit tests once, after the single build" |
| `tests/ci-dist-guard.test.js` | create | app (task 1.2) | guard test |
| `tests/blog-post-template.test.js` | modify | app (task 1.2) | line 83 comment `(skipped without dist/, as in CI before the build)` -> `(skipped without dist/; CI builds first, NRD-311)` |
| `docs/adr/0011-ci-verify-workflow.md` | modify | TL (written in this design branch) | "Amendment (NRD-311)" section |

**Interfaces**

Target `ci.yml` steps (nothing else changes: name, triggers, permissions, concurrency, timeout, versions):

```yaml
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: node --test tests/*.test.js
      - name: SEO build checks
        run: pnpm check:seo:dist
```

`tests/ci-dist-guard.test.js`:

```js
const distDir = new URL("../dist/", import.meta.url);
const hasBuild =
  existsSync(new URL("index.html", distDir)) &&
  existsSync(new URL("_astro/", distDir));
const inCI = process.env.CI === "true";

test(
  "in CI the unit tests run on a built dist/ (NRD-311)",
  { skip: !inCI && "not in CI" },
  () => {
    assert.ok(hasBuild, "dist/ is not built: in CI, pnpm build must run before node --test (NRD-311)");
  },
);
```

**Data:** none.

**Test plan (TDD order)**

Task 1.1 (infra):

1. RED: in `tests/ci-workflow.test.js`, change the markers of "verify steps run in the required order" to `[..., "pnpm install --frozen-lockfile", "pnpm build", "node --test tests/*.test.js", "pnpm check:seo:dist"]` and add "runs the unit tests once, after the single build": `yml.match(/^\s+(?:- )?run: pnpm build$/gm)` has length 1, `yml.match(/^\s+(?:- )?run: node --test\b.*$/gm)` has length 1, and `yml.indexOf("run: node --test tests/*.test.js") > yml.indexOf("run: pnpm build")` with message "unit tests must run after pnpm build so dist/ cases execute (NRD-311)". Run `node --test tests/ci-workflow.test.js`: both fail on the current `ci.yml` (scenario *Tests moved back before the build*).
2. GREEN: reorder `ci.yml` as above; `node --test tests/ci-workflow.test.js` passes (scenarios *Workflow in the required order*, *One build, SEO checks after it*). The existing test "runs the SEO build checks once, right after the build" stays as is and green.
3. `node --test tests/*.test.js` green; one commit with both files.

Task 1.2 (app):

1. RED: create `tests/ci-dist-guard.test.js`; in a checkout without `dist/` (the story worktree before building), run `CI=true node --test tests/ci-dist-guard.test.js`: fails with the NRD-311 message (scenario *CI without a build*). Run `node --test tests/ci-dist-guard.test.js` without `CI`: skipped (scenario *Local run without a build*).
2. GREEN: `pnpm build`, then `CI=true node --test tests/*.test.js`: guard passes, summary shows `skipped 0` (scenario *CI with a build*). Record the summary line in the commit body.
3. Update the comment at `tests/blog-post-template.test.js:83`. `node --test tests/*.test.js` green.

No fakes or fixtures needed.

**CI evidence checks (QA / orchestrator, replaces real-browser checks):** on the story PR, `gh pr checks` shows `verify` green, and the `verify` log (`gh run view <id> --log`) of the `node --test` step shows the summary `ℹ skipped 0`, the NRD-310 case of `tests/font-loading.test.js` and the `dist/` case of `tests/font-assets.test.js` with a pass mark (not `# SKIP`), and the guard test passing (scenario *Build-dependent cases execute in CI*, AC 5). No real-browser checks (no UI change).

**ADRs relied on:** 0006 (node:test, TDD), 0011 (CI `verify` workflow; amended here).

## Risks / Trade-offs

- [Build-dependent cases run in CI for the first time: CI builds from a shallow clone (`actions/checkout@v4`, depth 1) and without optional env vars (`GOOGLE_PLACES_API_KEY`, GA4), unlike local builds] -> Mitigation: the first `verify` run on the PR is the check. A failing `dist/` case whose assertion depends on local-only env or full history is fixed in this story in the test (app, task 1.2 scope, keeping what it guards) when it is a test-environment assumption, or filed as a `qa-bug` when it exposes a real defect of the CI build; never skipped again.
- [A failing unit test is now reported after the build (about one to two minutes later)] -> Accepted: one build, one run, no skipped guard; the suite itself is sub-second.
- [The guard trusts `CI=true`] -> GitHub Actions always sets it; Netlify does not run the unit suite. A developer exporting `CI=true` locally without a build gets a clear failure message.
- [Cross-owner commit in task 1.1] -> Recorded in the ADR 0011 amendment and in this design; reviewers should treat `tests/ci-workflow.test.js` in the infra commit as in scope.
