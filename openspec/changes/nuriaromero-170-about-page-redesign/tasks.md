# Tasks

Prerequisite: rebase on `develop` after NRD-212 (word budget without the live review quote) is merged.

## 1. Shared ink project cards

- [ ] 1.1 [NRD-217 app] `variant?: "legacy" | "ink"` in `src/components/Projects.astro` (legacy unchanged, ink with 0.9rem screenshots, no shadows, hairlines, asymmetric layout) and `projectsVariant` in `src/components/seo-local/RealProof.astro`; tests: variant assertions in `tests/template-components.test.js` first; verify suite (incl. `casos-exito`), `pnpm build`, `pnpm check:seo:dist` (16) green

## 2. Page on the template

- [ ] 2.1 [NRD-218 app] Recompose `src/pages/sobre-mi.astro` on `Layout` + `.template-ground` (breadcrumbs, hero with portrait, proof strip, process with byline links and career record, real proof with `projectsVariant="ink"`, closing), delete `Hero`, `AboutMe`, `Experience`, `ExperienceItem`, `Badge`, `SocialPill`, move the anchor assertion in `tests/seo-consultor-strategy.test.js` and drop `Hero.astro` from `tests/trailing-slash-links.test.js`, add the `/sobre-mi/` entry (550-600, no Service) in `scripts/lib/template-pages.mjs`; tests: `tests/sobre-mi-template.test.js` first and `check:seo-17:dist` RED; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 07 and 17

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
