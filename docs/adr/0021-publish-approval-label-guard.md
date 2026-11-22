# 0021. Owner-only `publish-approved` label gates publishing a blog post

- Status: Accepted
- Date: 2026-11-21

## Context

ADR 0020 makes publishing a blog post the owner's flip of `draft` and her merge, and leaves a CI guard on the flip out of that decision. Since NRD-349 and NRD-350 the pipeline commits drafts routinely, and `merge.auto` in `.claude/harness.json` lets the harness merge a green PR into `develop`. Nothing automatic stopped an agent from flipping `draft` itself: the only barrier was the PR approval convention. The approval agents already apply (`pr-approved`) is a tracker label set by agents, so it cannot stand for the owner's decision (NRD-351, PO decision of 2026-11-21).

## Decision

- A pull request that makes a post of `src/content/blog/` published (`draft: true` becomes `draft: false`, the `draft: true` line is removed, or a new post arrives without `draft: true`) fails the required `verify` job unless it carries the GitHub label `publish-approved`.
- Only the owner applies `publish-approved`. No agent, skill, script or harness command adds it, and agent instructions never suggest adding it.
- The detection is a deterministic script (`scripts/check-publish-approval.mjs` with its pure core in `scripts/lib/publish-approval.mjs`), tested in `tests/`, that compares the merge base of the PR with its head. "Draft" means the frontmatter line `draft: true`, the same rule as `readPosts` (`scripts/lib/blog-posts.mjs`); the schema default of `draft` is `false` (`src/content/blog-schema.ts`).
- `verify` runs on the `labeled` and `unlabeled` pull request events, so adding or removing the label re-evaluates the guard.
- The guard runs only on pull requests. Pushes to `develop` and `main` do not run it; they rely on the branch flow of ADR 0009 (story work reaches `develop` only through PRs).

## Consequences

- An agent can still prepare a publishing PR, but it cannot get it green, so `merge.auto` cannot publish a post without the owner.
- Every label change on a PR re-runs `verify` (one extra build per label event).
- A renamed published post is not a new publication (rename detection); a renamed draft that also loses `draft: true` is.
- Reviews check that no change adds `publish-approved` from code or instructions, and that new publishing paths (another content folder, a different draft flag) extend the guard.

## Evidence

- `scripts/check-publish-approval.mjs`, `scripts/lib/publish-approval.mjs`, `tests/publish-approval.test.js` (NRD-351).
- `.github/workflows/ci.yml`: the guard step of `verify`; `tests/ci-workflow.test.js` pins it.
- `.claude/skills/blog-pipeline/SKILL.md` step 5 and `docs/designs/NRD-327-blog-content-pipeline.md` name the label.
