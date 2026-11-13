# 0009. Branch flow and budgeted production deploys from `main`

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

Netlify builds production from `main`, and each production deploy spends credits: the budget is about 300 credits, roughly 20 production deploys a month. Work must keep flowing without each merge triggering a deploy.

## Decision

- Work happens on `feat/*` (or `fix/*`, `chore/*`, `docs/*`) branches cut from `develop`, named `{type}/{KEY}-{slug}`.
- Branches merge into `develop` with merge commits (no squash, no rebase-merge). Conventional Commits, no AI attribution.
- Only `main` deploys to production. `develop` is promoted to `main` with a merge commit by a separate scheduled task, at most 20 times a month (every 2 days), never by a sprint run or on each feature merge (`merge.deployOnMerge: false`).
- A hotfix that must reach production outside the schedule is the user's decision, because it spends budget.

## Consequences

- Merged work can wait up to two days before reaching production; QA happens on local builds, not on production.
- `develop` must always be releasable, since the scheduled promotion takes whatever is there.
- Adding Netlify branch deploys, deploy previews on every PR or other paid infrastructure needs the user.

## Evidence

- `git log --merges`: `Merge branch 'feat/seo-consultor-sevilla-home' into develop`, `merge: promote develop to main`, `merge: bring develop into main (...)`.
- Branches `feat/capilar-local-captacion`, `feat/casos-de-exito`, `feat/seo-28-meta-titles-descriptions`, `develop`, `main`.
- `.claude/harness.json`: `repo.baseBranch: develop`, `repo.mergeMethod: merge`, `repo.branchPattern`, `merge.deployOnMerge: false`, `infra.notes`.
- `CLAUDE.md` ("Ramas: `feat/*` desde `develop`. `develop` se fusiona en `main` para publicar").
