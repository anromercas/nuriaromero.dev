# Tasks

Starts after NRD-345, NRD-346, NRD-347 and NRD-348 are merged into `develop`. Ships before NRD-350.

## 1. Blog pipeline skill

- [x] 1.1 [NRD-362 app] Approval gate: `isApproved` in `scripts/lib/outline-lint.mjs`; `scripts/blog-scaffold.mjs --write` requires a lint-clean, approved `--outline` with the same slug; tests: `tests/blog-outline-lint.test.js` and `tests/blog-scaffold.test.js` cases first (pending, missing, lint-failing, slug mismatch write nothing; approved writes `draft: true`)
- [x] 1.2 [NRD-363 app] Create `.claude/skills/blog-pipeline/SKILL.md` (five steps, five approval points, marked scaffold block, owner-only `draft` flip) and `templates/tema.md`, `templates/esquema.md`; add only that folder; tests: `tests/blog-pipeline-skill.test.js` first (frontmatter, approval order, scripts and voice guide named, no `draft: false`, scaffold block run as written yields `draft: true`, template passes the lint)
- [x] 1.3 [NRD-364 app] Point `seo/contenido/README.md` ("Cómo se usa") and `CLAUDE.md` to the skill; tests: `tests/content-workspace.test.js` case first (README names `.claude/skills/blog-pipeline/`)

## Workflow follow-up

- QA runs the skill on a sample topic in an attended session and deletes the sample artifacts.
- Archive the change at dev-done (`/team-harness:dev`).
