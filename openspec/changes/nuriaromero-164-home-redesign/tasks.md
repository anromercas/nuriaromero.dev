# Tasks

Prerequisite: NRD-163 (`nuriaromero-163-reusable-local-components`) merged into `develop`; rebase this branch on it before task 1.1.

## 1. Home on the template

- [x] 1.1 [NRD-186 app] Home illustrations `src/components/home/HomeHeroMock.astro` and `src/components/home/ServiceTileArt.astro`; tests: `tests/home-template.test.js` illustration assertions first (aria-hidden, 1.5 stroke, no filled icons, "Ejemplo ilustrativo", reduced-motion guard); verify `node --test tests/*.test.js` and `pnpm build` green
- [ ] 1.2 [NRD-187 app] Recompose `src/pages/index.astro` with the template sections in reference order (seo12 markers, no plans, six service tiles linking to their routes) and migrate `tests/seo-meta-titles.test.js`, `tests/home-services-list.test.js` (retired), `tests/technology-copy.test.js`, `tests/dark-variants.test.js`, and append the four niche rows to `internalLinksBySource["/"]` in `src/data/internal-links.ts` (keeps `check-seo-02` green); tests: structure and niche-row assertions in `tests/home-template.test.js` first; verify suite, `pnpm build`, `pnpm check:seo:dist` (02, 06, 07, 12, 16) green
- [ ] 1.3 [NRD-188 app] Sourced FAQ (6-8 questions, prices via `tierFrom`, links to `/seo-local-sevilla/`), short copy and `/` entry in `scripts/lib/template-pages.mjs` (`words: [900, 1100]`, `service: false`); tests: observe `check:seo-17:dist` RED and FAQ assertions in `tests/home-template.test.js` first; verify suite, `pnpm build`, `pnpm check:seo:dist` green including 17 for `/`

## Workflow follow-up

- QA runs the real-browser checks in design.md and compares LCP/CLS with the NRD-18 baseline.
- Archive the change at dev-done (`/team-harness:dev`).
