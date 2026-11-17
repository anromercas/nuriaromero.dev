# Tasks

Dependencies: blocked by NRD-24 (the page) and NRD-25 (the `llms.txt` entry); cut or rebase this branch after both merge into `develop`.

## 1. Build check

- [ ] 1.1 [NRD-255 app] `scripts/lib/seo-para-ia-contract.mjs` (`seoParaIaFailures`), `scripts/check-seo-21.mjs` (optional dist dir argument, every failure listed, exit 1) and `check:seo-21`, `check:seo-21:dist` plus `check:seo:dist` in `package.json`; tests: `tests/seo-para-ia-check.test.js` fixture and mutation tests first, record the missing-page RED of the script; verify suite (incl. `package-scripts`), `pnpm build`, `pnpm check:seo-21:dist` exit 0, `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the checks in design.md on the PR head.
- Archive the change at dev-done (`/team-harness:dev`), after NRD-24's and NRD-25's changes are archived.
