# Tasks

Order matters: the CI step calls the script of 1.1; the skill text of 1.3 describes the guard of 1.1 and 1.2.

## 1. Publish approval guard

- [ ] 1.1 [NRD-369 app] Export `isDraft` from `scripts/lib/blog-posts.mjs`, create `scripts/lib/publish-approval.mjs` (`PUBLISH_LABEL`, `isBlogPost`, `publishedPosts`, `parseLabels`, `checkPublishApproval`) and the CLI `scripts/check-publish-approval.mjs` (env `BASE_SHA`, `HEAD_SHA`, `PR_LABELS`; merge base, rename-aware diff, exit 0/1/2); tests: `tests/publish-approval.test.js` first (draft to published, `draft` removed, new published post, no change incl. rename/deletion/outside file, change with the label, `parseLabels`, real temporary git repo run)
- [ ] 1.2 [NRD-370 infra] In `.github/workflows/ci.yml` add the `pull_request` types (opened, synchronize, reopened, labeled, unlabeled), `fetch-depth: 0` on checkout and the "Publish approval guard" step (pull requests only, env from `github.event.pull_request`, after install and before `pnpm build`); tests: `tests/ci-workflow.test.js` contract cases first (types, fetch depth, condition, env, no `${{` in `run`, position)
- [ ] 1.3 [NRD-371 app] Name `publish-approved` in step 5 of `.claude/skills/blog-pipeline/SKILL.md` (only the owner applies it, the skill never adds it) and in `docs/designs/NRD-327-blog-content-pipeline.md` (sections 2, 4 and 6); tests: `tests/blog-pipeline-skill.test.js` case first (label named, no add instruction, still no `draft: false` text, NRD-327 design mentions the label)

## Workflow follow-up

- Orchestrator: create the GitHub label `publish-approved` if missing (owner-account action in `design.md`); never apply it.
- QA checks `verify` on the story PR (green, guard step reports nothing published).
- Archive the change at dev-done (`/team-harness:dev`).
