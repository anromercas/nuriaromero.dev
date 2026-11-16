# Tasks

Prerequisite: NRD-163 (`nuriaromero-163-reusable-local-components`) merged into `develop`; rebase this branch on it before task 1.1.

## 1. Contract: offers and FAQ links

- [ ] 1.1 [NRD-189 app] `tierBilling: "one-time"` and FAQ `links` in `src/data/types.ts`, one-time Offers in `serviceSchema`, `ServiceLayout` passes `billing`, `disenoWeb` opts in; tests: source assertions in `tests/diseno-web-template.test.js` and the new `/diseno-web-sevilla/` Offer assertion in `scripts/check-seo-02.mjs` first; verify suite, `pnpm build`, `pnpm check:seo:dist` green with check-seo-15 and check-seo-16 unchanged
- [ ] 1.2 [NRD-190 app] Page illustrations `src/components/diseno-web/WebMock.astro` and `src/components/diseno-web/WebTileArt.astro` (kinds movil, seo-local, contacto, google, dominio, soporte; no panel); tests: illustration assertions in `tests/diseno-web-template.test.js` first; verify suite and `pnpm build` green

## 2. Page on the template

- [ ] 2.1 [NRD-191 app] Recompose `src/pages/diseno-web-sevilla.astro` on `ServiceLayout variant="template"` in reference order and shorten `disenoWeb` (hero title/accent, six benefits with "Dominio y hosting a tu nombre" instead of a panel tile, four steps without self-editing, note, cta) keeping title, description, H1, `secondaryCta`, `sectionTitles`, plan names and prices, and add "Un mes de soporte tras el lanzamiento" to the landing `includes`; tests: structure and support-in-both-plans assertions first; verify suite (incl. `tests/diseno-web-sevilla-intent.test.js`), `pnpm build`, `pnpm check:seo:dist` (02, 07, 16) green
- [ ] 2.2 [NRD-192 app] Sourced FAQ (6-7 questions, published prices via `LANDING_FROM`/`WEB_FROM`, links to the price guide and `/seo-local-sevilla/`, WordPress answer without an included panel), copy within 1,000-1,200 words and the `/diseno-web-sevilla/` entry in `scripts/lib/template-pages.mjs`; tests: observe `check:seo-17:dist` RED, FAQ assertions and the no-panel / no-self-edit / support-not-full-only guards on `disenoWeb` and dist first; verify suite, `pnpm build`, `pnpm check:seo:dist` green including 17

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
