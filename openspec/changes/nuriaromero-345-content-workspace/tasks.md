# Tasks

Ships before NRD-349 (skill) and NRD-350 (idea queue), which write into `seo/contenido/`.

## 1. Content workspace

- [x] 1.1 [NRD-354 app] Track `seo/contenido/README.md` (structure, queue fields and statuses, rules), record the storage decision in `docs/designs/NRD-327-blog-content-pipeline.md`, commit exact paths only; tests: `tests/content-workspace.test.js` first (README exists and names `tema.md`, `esquema.md`, `ideas.json` and every status; design line names `seo/contenido/`)

## Workflow follow-up

- QA checks `git show --stat` of the story commit (no other `seo/` path).
- Archive the change at dev-done (`/team-harness:dev`).
