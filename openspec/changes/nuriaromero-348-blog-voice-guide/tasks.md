# Tasks

Independent of the other pipeline stories. Ships before NRD-349 (the skill's draft step reads the guide).

## 1. Blog voice guide

- [ ] 1.1 [NRD-361 app] Write `docs/blog-voice.md` (rule sections, Spanish examples, 8-item checklist) and review `que-es-geo-posicionamiento-ia-negocios-sevilla` against it in the PR description without changing the post; tests: `tests/blog-voice.test.js` first (file and rule headings, never-promise rule, brand equals `SITE.name`, 5-10 checklist items)

## Workflow follow-up

- QA checks the review table in the PR and that no `src/` file changed.
- Archive the change at dev-done (`/team-harness:dev`).
