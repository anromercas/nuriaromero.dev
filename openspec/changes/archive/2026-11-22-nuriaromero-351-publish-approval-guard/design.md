## Context

- Story: [NRD-351](https://nuriaromerodev.atlassian.net/browse/NRD-351), epic M3 (NRD-4), 2 points, follow-up 7 of NRD-327. PO decision (2026-11-21): the GitHub label is `publish-approved`, distinct from the agents' `pr-approved`; only the owner applies it.
- Posts are flat files `src/content/blog/<slug>.md|mdx` with YAML frontmatter. `draft` defaults to `false` (`src/content/blog-schema.ts:21`), so a post without `draft: true` is public; pages, RSS and the blog index filter `!data.draft` (`src/pages/blog/[slug].astro:7`, `src/pages/rss.xml.ts:8`, `src/pages/blog/index.astro:15`). The repository already decides "draft" with `/^draft:\s*true\s*$/m` on the frontmatter block (`scripts/lib/blog-posts.mjs:22`, `readPosts`). The scaffold always writes `draft: true` (`scripts/lib/post-frontmatter.mjs`).
- CI: `.github/workflows/ci.yml`, single required job `verify` (`ci.requiredChecks`), triggered by `pull_request` to `develop` (default types: opened, synchronize, reopened) and pushes to `develop` and `main`; `permissions: contents: read`; `actions/checkout@v4` with the default shallow fetch. `tests/ci-workflow.test.js` pins triggers, step order (install, build, unit tests, SEO checks), read-only permissions and the absence of `secrets.`, `netlify` and `deploy`.
- The skill `.claude/skills/blog-pipeline/SKILL.md` step 5 hands the branch to the PR flow and says "only the owner flips `draft`"; `tests/blog-pipeline-skill.test.js:53` asserts `SKILL.md` never matches `/draft:\s*false/`.
- ADR 0020 left the flip guard out of its decision; ADR 0021 (written with this design) records it.

## Goals / Non-Goals

**Goals:** a deterministic, tested guard that blocks a PR publishing a post unless the owner's label is present; re-evaluation when the label is added; no effect on PRs without a draft change; the skill and the NRD-327 design naming the label.

**Non-Goals:** guarding direct pushes; branch protection or repository settings; guarding pages or `public/llms.txt`; adding the label from any automation.

## Decisions

**Approach.** Split the guard into a pure core and a thin git CLI, following the pipeline-scripts pattern (`scripts/lib/*.mjs` plus a CLI in `scripts/`, ADR 0020). The core takes a list of changes `{ path, before, after }` (file contents or `null`) and the PR labels and returns the posts that become published and a verdict, so all five acceptance cases are unit tests without git. The CLI computes the merge base of the PR base and head, asks git for the added, modified and renamed files under `src/content/blog/` with rename detection, reads both versions with `git show`, and calls the core; it uses `execFileSync("git", [...])` (no shell) and reads base, head and labels from `env`, so label names never reach a shell. In CI the step runs before `pnpm build` (fail fast, no install needed), only on `pull_request`, after a full-history checkout so the merge base exists; the trigger adds `labeled` and `unlabeled` so the owner's label starts a new run (the existing `concurrency` group cancels the stale one). The draft rule moves into an exported `isDraft(source)` in `scripts/lib/blog-posts.mjs` used by both `readPosts` and the guard, so "draft" has one definition.

**Files**

| Action | Path | Symbol | Layer |
| --- | --- | --- | --- |
| modify | `scripts/lib/blog-posts.mjs` | export `isDraft(source)`; `readPosts` uses it | app |
| create | `scripts/lib/publish-approval.mjs` | `PUBLISH_LABEL`, `isBlogPost`, `publishedPosts`, `checkPublishApproval`, `parseLabels` | app |
| create | `scripts/check-publish-approval.mjs` | CLI: env `BASE_SHA`, `HEAD_SHA`, `PR_LABELS` | app |
| create | `tests/publish-approval.test.js` | unit cases and one real git run | app |
| modify | `.github/workflows/ci.yml` | `pull_request.types`, checkout `fetch-depth: 0`, step "Publish approval guard" | infra |
| modify | `tests/ci-workflow.test.js` | contract cases for the guard step (workflow contract test, owned with `ci.yml` as in NRD-313) | infra |
| modify | `.claude/skills/blog-pipeline/SKILL.md` | step 5 names `publish-approved` (shared `.claude/` path) | app |
| modify | `tests/blog-pipeline-skill.test.js` | case "publish label named" | app |
| modify | `docs/designs/NRD-327-blog-content-pipeline.md` | section 2 row 5, section 4 publish row, section 6 item 7 marked as done by NRD-351 | app |
| created by TL | `docs/adr/0021-publish-approval-label-guard.md`, `docs/adr/README.md` index row | ADR 0021 | design |

**Interfaces**

```js
// scripts/lib/blog-posts.mjs
export function isDraft(source: string): boolean
// true when the frontmatter block (/^---\r?\n([\s\S]*?)\r?\n---/) has a line /^draft:\s*true\s*$/m

// scripts/lib/publish-approval.mjs
export const PUBLISH_LABEL = "publish-approved";
export function isBlogPost(path: string): boolean            // /^src\/content\/blog\/[^/]+\.mdx?$/
/** changes: [{ path, before: string | null, after: string | null }] (before = previous path's content for renames) */
export function publishedPosts(changes): { path: string, reason: "flipped" | "draft-removed" | "new" }[]
// counts when isBlogPost(path) && after !== null && !isDraft(after) && (before === null || isDraft(before));
// reason: before === null -> "new"; after has /^draft:\s*false\s*$/m -> "flipped"; else "draft-removed"
export function parseLabels(raw: string | undefined): string[] // JSON array of names; "" / undefined / "null" -> []
export function checkPublishApproval({ changes, labels }): { ok: boolean, published, message: string }
// ok = published.length === 0 || labels.includes(PUBLISH_LABEL)
// failure message, one line per post, e.g.:
// "Publish approval guard: src/content/blog/a.md goes from draft to published (flipped) and the PR lacks the GitHub label \"publish-approved\". Only the owner adds it."
```

CLI `scripts/check-publish-approval.mjs` (exit codes: 0 ok, 1 blocked, 2 usage or git error):

1. Read `BASE_SHA`, `HEAD_SHA`, `PR_LABELS` from `process.env`; missing base or head -> usage message, exit 2.
2. `git merge-base BASE HEAD` -> `mergeBase`.
3. `git diff --name-status -z -M --diff-filter=AMR mergeBase HEAD -- src/content/blog` -> entries `A path`, `M path`, `R<score> old new`.
4. `before` = `null` for A, `git show mergeBase:path` for M, `git show mergeBase:old` for R; `after` = `git show HEAD:path`.
5. `checkPublishApproval({ changes, labels: parseLabels(PR_LABELS) })`; print the message (stdout on success, stderr on failure) and exit.

CI step (in `verify`, after `pnpm install --frozen-lockfile`, before `pnpm build`):

```yaml
on:
  pull_request:
    branches: [develop]
    types: [opened, synchronize, reopened, labeled, unlabeled]
# ...
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
# ...
      - name: Publish approval guard
        if: github.event_name == 'pull_request'
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
          PR_LABELS: ${{ toJSON(github.event.pull_request.labels.*.name) }}
        run: node scripts/check-publish-approval.mjs
```

`permissions` stays `contents: read`; no secret, no new action. The existing ci-workflow order markers stay in order (the new step contains none of them).

**Data.** No schema, storage or settings change; `.claude/harness.json` (`merge.auto`, `ci.requiredChecks`) unchanged. Migration: none.

**Test plan (TDD order)**

1. Task 1.1 (app), `tests/publish-approval.test.js` first, RED before the lib and CLI exist:
   - `isDraft`: `draft: true` in frontmatter -> true; `draft: false`, no `draft`, or `draft: true` only in the body -> false (also a `readPosts` regression: existing `tests/blog-*.test.js` stay green).
   - `publishedPosts` / `checkPublishApproval` with inline fixtures (scenarios of `publish-approval-guard`): draft to published (`flipped`, blocked, message names the path and `publish-approved`); `draft` removed (`draft-removed`, blocked); new published post (`new`, blocked); no change (new draft, body edits of a draft and of a published post, renamed published post via `before` = published content, deletion `after: null`, file outside the blog folder) -> nothing listed, ok with `labels: []`; change with `labels: ["pr-approved", "publish-approved"]` -> ok; with `["pr-approved"]` only -> blocked.
   - `parseLabels`: `'["a","publish-approved"]'`, `""`, `undefined`, `"null"`.
   - Real git run: `mkdtemp` repo, `git init`, commit `src/content/blog/a.md` with `draft: true` on the base, branch and flip it, run `node scripts/check-publish-approval.mjs` with `cwd` = temp repo and env base/head SHAs (`spawnSync`, `git -c user.name=t -c user.email=t@example.com`): exit 1 and stderr names the post and the label; same with `PR_LABELS='["publish-approved"]'`: exit 0; a branch that only edits the body: exit 0; no `BASE_SHA`: exit 2 (scenario "Missing commits").
2. Task 1.2 (infra), `tests/ci-workflow.test.js` cases first, RED before `ci.yml` changes: `pull_request` keeps `branches: [develop]` and lists the five types; checkout has `fetch-depth: 0`; a step runs `node scripts/check-publish-approval.mjs` with `if: github.event_name == 'pull_request'`; its `env` has `BASE_SHA`, `HEAD_SHA` and `PR_LABELS` from `github.event.pull_request`; the `run:` line contains no `${{`; the guard appears after `pnpm install --frozen-lockfile` and before `run: pnpm build`; existing cases (order, one build, read-only permissions, no secrets/netlify/deploy) stay green.
3. Task 1.3 (app), `tests/blog-pipeline-skill.test.js` case first: step 5 of `SKILL.md` contains `publish-approved` and "only the owner" applies it, contains no instruction to add the label (`/add[^\n]*publish-approved/i` absent outside the "never adds" sentence; simplest: assert the exact sentence of the design and absence of `gh pr edit`), and still never matches `/draft:\s*false/` (write "flips `draft` to false", never the colon form). Also assert `docs/designs/NRD-327-blog-content-pipeline.md` mentions `publish-approved`.

Fixtures and fakes: inline strings and one temporary git repo; nothing committed under `src/content/blog/`.

**Exact wording for task 1.3** (SKILL.md step 5, English as the rest of the skill): "CI `verify` fails on a PR that publishes a post (a `draft` flag flipped to false, removed, or a new post without `draft: true`) until the PR carries the GitHub label `publish-approved`. Only the owner applies `publish-approved`; the skill never adds it." The NRD-327 design gets the same rule in section 2 row 5 ("Gap" column: "Closed by NRD-351: CI guard, label `publish-approved`, ADR 0021"), section 4 publish row and section 6 item 7.

**Real-browser / e2e checks.** None in the site (no UI change). QA verifies the CI behavior on GitHub: on the story PR itself (no blog change) `verify` is green without labels and the guard step logs that nothing is published; the guard's own failure and label cases are proven by the real-git test. Optional, if the orchestrator runs it: a throwaway PR that flips the `draft` of a fixture post shows `verify` red with the message, then green after the owner adds the label; never merged.

**Owner-account actions (executed by the orchestrator)**

- Create the GitHub label `publish-approved` in `anromercas/nuriaromero.dev` (`gh label create publish-approved --description "Owner approval to publish a blog post"`) if it does not exist: **executable owner action** (configured `gh` CLI, owner account). Creating the label does not approve anything.
- Apply `publish-approved` to a publishing PR: **hard limit**, it is the owner's publish decision itself (ADR 0021); no agent applies it.

**ADRs relied on:** 0006 (node:test, TDD), 0009 (branch flow, PRs into `develop`), 0011 (CI verify workflow), 0020 (blog pipeline, owner gates), 0021 (this rule).

## Risks / Trade-offs

- [Label events re-run the full `verify` build] -> accepted; label changes on PRs are rare, and the concurrency group cancels the superseded run.
- [Agents could still add the label with `gh`] -> rule in ADR 0021, the skill and the PR review; a `permissions.deny` rule for `gh pr edit --add-label publish-approved` in `.claude/settings.json` is proposed to the PO as a follow-up, not part of this story.
- [Direct pushes to `develop` skip the guard] -> ADR 0009 branch flow; branch protection is an owner setting (hard limit), noted for the owner.
- [Frontmatter written as `draft: 'true'` or `draft: yes` would read as published] -> fail-safe direction (blocks, needs the label); the scaffold always writes `draft: true`.
- [Shallow checkout would break `merge-base`] -> `fetch-depth: 0`, pinned by the contract test; the CLI exits 2 (fails `verify`) on any git error instead of passing.
- [`tests/ci-workflow.test.js` lives in `tests/**` (app globs) but is edited by the infra task] -> same routing as NRD-313: the workflow and its contract test change in one commit so the suite never goes red.

## UI spec

**Scope.** No rendered page, component, token or style changes: the story touches CI, scripts and skill/doc text only (no file under `src/components`, `src/layouts`, `src/pages`). Checklist items 1-3 and 5-9 (screens, hierarchy, visual states, design system, responsive, interactions, accessibility, GEO) are n/a. The only user-facing surface is the developer-facing output of `scripts/check-publish-approval.mjs` in the GitHub Actions log of the "Publish approval guard" step, specified below so the developer and the reviewers can check exact strings. All strings are English, like the rest of the CI and scripts; one line per message, plain text, no colors or emoji (the Actions log is read as plain text).

**Output per outcome** (`<path>` is the repository-relative post path, `<reason>` is `flipped`, `draft-removed` or `new`):

| Outcome | Stream / exit | Exact text |
| --- | --- | --- |
| Blocked (one line per post, in `git diff` order) | stderr, exit 1 | `Publish approval guard: <path> goes from draft to published (<reason>) and the PR lacks the GitHub label "publish-approved". Only the owner adds it.` |
| Nothing published | stdout, exit 0 | `Publish approval guard: no blog post goes from draft to published in this PR.` |
| Published with the label (one line per post) | stdout, exit 0 | `Publish approval guard: <path> goes from draft to published (<reason>), approved by the GitHub label "publish-approved".` |
| Missing `BASE_SHA` or `HEAD_SHA` | stderr, exit 2 | `Publish approval guard: BASE_SHA and HEAD_SHA are required (pull_request event).` |
| Git error (merge base, diff or show fails) | stderr, exit 2 | `Publish approval guard: git <subcommand> failed: <first line of git's stderr>` |

- The blocked text is the design's interface example verbatim (tests match on the path and `publish-approved`).
- Assumption: the "nothing published" line is added because the design only says "print the message" and QA needs a log line proving the guard ran on a PR without blog changes.
- Assumption: the "approved by the label" line makes the owner's approval visible in the log of a publishing PR.
- Assumption: the missing-SHA line names both variables so the cause is clear from the log alone.
- Assumption: the git-error line names the failing git subcommand in one line; the guard never prints a pass on error.
- Assumption: a new post (`new`) also reads "goes from draft to published", keeping one message shape for a case the owner treats the same way.
- Label names read from `PR_LABELS` are never echoed back in any message.

**Skill/doc text.** The `SKILL.md` step 5 and NRD-327 wording is fixed by the design ("Exact wording for task 1.3"); no UI-spec change.
