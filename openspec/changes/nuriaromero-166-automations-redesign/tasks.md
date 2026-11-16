# Tasks

Prerequisite: rebase on `develop` after NRD-168 (`nuriaromero-168-store-page-redesign`) is merged, for the one-plan rule of `SeoLocalPlans`; if it is missing, task 2.1 adds it as NRD-168's design specifies.

## 1. Page illustrations

- [ ] 1.1 [NRD-205 app] `src/components/automatizaciones/FlowMock.astro` and `AutomationTileArt.astro` (whatsapp, facturas, citas, formularios, avisos, informes; no brand logos); tests: illustration assertions in `tests/automatizaciones-template.test.js` first; verify suite and `pnpm build` green

## 2. Page on the template

- [ ] 2.1 [NRD-206 app] Recompose `src/pages/automatizaciones.astro` on `ServiceLayout variant="template"` in reference order (no real-proof section, one plan from `automatizaciones.pricing`) and shorten `automatizaciones` (hero title/accent, defining subtitle, secondary link, benefits keyword, six examples, five steps, cta) keeping title, description, H1, process/pricing keyword headings and `pricing`; proof strip `SITE_PROOF[0]` plus the rating when present (one cell without reviews); fallback one-plan rule `max-width: 36rem`, left-aligned; tests: structure, direct-answer and savings-guard assertions first (digit rule on `automatizaciones` strings only; on `<main>` only the claims regex); verify suite (incl. `tests/automatizaciones-intent.test.js`), `pnpm build`, `pnpm check:seo:dist` (02, 07, 16) green
- [ ] 2.2 [NRD-207 app] Six sourced FAQ items using the UI spec answers as binding copy (examples = bento, AI answer from the automation angle with the IA link; trim only from the last sentence; design guards win), copy within 700-800 words and the `/automatizaciones/` entry in `scripts/lib/template-pages.mjs`; tests: observe `check:seo-17:dist` RED, FAQ assertions first; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 17

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
