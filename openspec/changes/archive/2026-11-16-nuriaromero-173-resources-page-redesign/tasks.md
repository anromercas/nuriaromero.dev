# Tasks

Prerequisite: rebase on `develop` after NRD-212 (word budget method) is merged.

## 1. Page on the template

- [x] 1.1 [NRD-220 app] Recompose `src/pages/recursos.astro` on `Layout` + `.template-ground` (breadcrumbs, short hero with the exact H1 "Recursos para citar y compartir", resources as asymmetric rows with `h3` titles and one sentence and link each, transparency note with "No se compran enlaces", closing) and add the `/recursos/` entry (max 250, no Service) in `scripts/lib/template-pages.mjs`; tests: `tests/recursos-template.test.js` first and `check:seo-17:dist` RED; verify suite (incl. `casos-exito`), `pnpm build`, `pnpm check:seo:dist` green incl. 13 and 17

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
