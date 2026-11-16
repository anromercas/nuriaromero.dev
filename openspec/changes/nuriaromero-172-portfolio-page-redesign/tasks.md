# Tasks

Prerequisite: rebase on `develop` after NRD-212 (word budget without the live review quote) and NRD-217 (NRD-170 task 1.1, ink project cards) are merged.

## 1. Page on the template

- [ ] 1.1 [NRD-219 app] Recompose `src/pages/portfolio.astro` on `Layout` + `.template-ground` (breadcrumbs, short hero with H1 "Casos de éxito", `RealProof` with `projectsVariant="ink"`, related links, closing), add the `"/portfolio/"` entry in `src/data/internal-links.ts`, the `/portfolio/` entry (max 250, no Service) in `scripts/lib/template-pages.mjs`, and move the H1 assertion of `tests/casos-exito.test.js` to the hero keyword; tests: `tests/portfolio-template.test.js` first and `check:seo-17:dist` RED; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 07, 13 and 17

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
