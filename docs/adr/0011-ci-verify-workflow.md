# 0011. CI `verify` workflow on GitHub Actions

- Status: Accepted
- Date: 2026-11-13

## Context

Until NRD-6 the repository had no CI: unit tests and the build ran only on developers' machines, and the team-harness auto-merge needs a required status check (`.claude/harness.json`: `ci.workflowFile: ci.yml`, `ci.requiredChecks: ["verify"]`). Production is built by Netlify from `main` only, on a budget of about 20 deploys a month (ADR 0009), so CI must not deploy or trigger builds there.

The toolchain has two version constraints: `pnpm-workspace.yaml` uses `allowBuilds` (pnpm 11 syntax) so `sharp` and `esbuild` can run their install scripts, and the lockfile is `lockfileVersion: '9.0'`.

## Decision

- One workflow, `.github/workflows/ci.yml`, named `CI`, with one job whose id and name are `verify`. It is the single required check.
- Triggers: `pull_request` to `develop`, `push` to `develop` and `main`.
- Steps: checkout, `pnpm/action-setup` (pnpm 11), `actions/setup-node` (Node 24, pnpm store cache), `pnpm install --frozen-lockfile`, `node --test tests/*.test.js`, `pnpm build` (`astro check && astro build`).
- Read-only token (`permissions: contents: read`), no secrets, no deploy, no paid services. The build must pass without optional env vars (Google Places, GA4).
- Toolchain versions are pinned in the workflow only. Files Netlify reads (`.nvmrc`, `.node-version`, `package.json` `packageManager`, `netlify.toml`) are not added by CI work; changing the production build image is the user's decision.
- New checks join the same `verify` job as extra steps rather than new required jobs, so the required-check list stays `["verify"]`.
- Making `verify` required in branch protection is done by the user.

## Consequences

- Every PR to `develop` and every promotion to `main` is verified; a failing test, type error, build error or lockfile drift turns `verify` red.
- Adding a test or a `check-seo-*` step to CI means editing `ci.yml` and `tests/ci-workflow.test.js` together.
- Bumping pnpm or Node means editing the workflow and checking that Netlify's settings match.
- CI and Netlify can diverge in Node version until the user aligns the Netlify setting.

## Evidence

- `.github/workflows/ci.yml`, `tests/ci-workflow.test.js` (NRD-6).
- `pnpm-workspace.yaml` (`allowBuilds`), `pnpm-lock.yaml` (`lockfileVersion: '9.0'`), `package.json` `build` script.
- `.claude/harness.json` `ci` block.
