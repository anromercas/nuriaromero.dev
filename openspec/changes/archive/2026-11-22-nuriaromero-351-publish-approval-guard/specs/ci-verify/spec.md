## ADDED Requirements

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
