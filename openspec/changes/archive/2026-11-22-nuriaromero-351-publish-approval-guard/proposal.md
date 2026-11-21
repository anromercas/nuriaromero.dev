## Why

[NRD-351](https://nuriaromerodev.atlassian.net/browse/NRD-351). Nothing stops an agent from changing `draft: true` to `false` in a blog post: publishing relies only on the PR approval convention (`docs/designs/NRD-327-blog-content-pipeline.md`, section 2 step 5 and section 4). Since NRD-349 and NRD-350 the pipeline commits drafts routinely and `merge.auto` merges green PRs, so a CI guard becomes the only automatic barrier before a post goes public.

## What Changes

- New script `scripts/check-publish-approval.mjs` (pure core in `scripts/lib/publish-approval.mjs`) that lists every post of `src/content/blog/` that a PR makes published between its merge base and its head: `draft: true` to `draft: false`, `draft: true` removed, or a new post without `draft: true`. It exits 1 when there is one and the PR lacks the GitHub label `publish-approved`, naming the post and the label.
- `scripts/lib/blog-posts.mjs` exports the existing draft rule (`isDraft`) so the guard and `readPosts` share it.
- The required `verify` job of `.github/workflows/ci.yml` runs the guard on pull requests (full history checkout, PR base, head and labels passed through `env`), and the `pull_request` trigger adds the `labeled` and `unlabeled` types so the owner's label re-runs it. PRs without a draft change pass unchanged.
- `tests/publish-approval.test.js` covers draft to published, `draft` removed, new published post, no change, and the change with the label present, plus a real git run; `tests/ci-workflow.test.js` pins the guard step.
- `.claude/skills/blog-pipeline/SKILL.md` (step 5) and `docs/designs/NRD-327-blog-content-pipeline.md` name the `publish-approved` label; ADR 0021 records the rule. Only the owner applies the label; no agent adds it.

## Capabilities

### New Capabilities

- `publish-approval-guard`: detection of a blog post becoming published in a PR and the owner-label rule that blocks it.

### Modified Capabilities

- `ci-verify`: `verify` runs the publish approval guard on pull requests and re-runs on label changes.
- `blog-pipeline-skill`: the publish step names the `publish-approved` label and that only the owner applies it.

## Impact

- Code: `scripts/check-publish-approval.mjs`, `scripts/lib/publish-approval.mjs`, `scripts/lib/blog-posts.mjs`, `tests/publish-approval.test.js` (layer `app`); `.github/workflows/ci.yml` and its contract test `tests/ci-workflow.test.js` (infra); `.claude/skills/blog-pipeline/SKILL.md`, `tests/blog-pipeline-skill.test.js`, `docs/designs/NRD-327-blog-content-pipeline.md` (app; `.claude/` file as shared path).
- CI: one extra step (git only, no install) in `verify`; `verify` also runs on label events. `ci.requiredChecks` stays `["verify"]`; `merge.auto` unchanged. The PR description must call out the `ci.yml` trigger change.
- No new dependency, no secret, no external service, no site output change.
- ADR 0021 (new).

## Out of scope

- Blocking direct pushes to `develop` or `main` (branch protection is a repository setting, owner-only).
- A deny rule in `.claude/settings.json` that stops agents from running `gh pr edit --add-label publish-approved` (possible follow-up for the PO).
- Guarding other publishable content (pages, `public/llms.txt`).
- Creating the GitHub label itself as code (it is an owner-account action, see design).
