# Tasks

Prerequisite: rebase on `develop` after NRD-195 (runtime-import price test) and NRD-168 (one-plan rule of `SeoLocalPlans`) are merged; if the one-plan rule is missing, task 2.1 adds it as NRD-168's design specifies.

## 1. Page illustrations

- [ ] 1.1 [NRD-208 app] `src/components/software/AppMock.astro` and `SoftwareTileArt.astro` (web, movil, gestion, api, reservas, datos); tests: illustration assertions in `tests/software-template.test.js` first; verify suite and `pnpm build` green

## 2. Page on the template

- [ ] 2.1 [NRD-209 app] Recompose `src/pages/desarrollo-software-medida.astro` on `ServiceLayout variant="template"` in reference order (proof strip `SITE_PROOF[0]`, rating when present, `SITE_PROOF[1]`; real proof with an honest note; comparison; one plan from `desarrolloSoftware.pricing` with `SeoLocalPlans` unchanged and "desde" in the lede), add `SOFTWARE_FROM` and shorten `desarrolloSoftware` (hero title/accent, subtitle, secondary link, benefits keyword, six tiles, four steps, cta) keeping title, description, H1, process/pricing keyword headings, includes and note; tests: structure and single-literal assertions first; verify suite (incl. `tests/software-medida-intent.test.js`, `tests/seo-meta-titles.test.js`), `pnpm build`, `pnpm check:seo:dist` (02, 07, 16) green
- [ ] 2.2 [NRD-210 app] Five sourced FAQ items (price from `SOFTWARE_FROM` by phases, code ownership as already published, companies in Seville without a ranking), copy within 750-850 words (trimming order in design.md "Decisions on the UX open questions" item 3) and the `/desarrollo-software-medida/` entry in `scripts/lib/template-pages.mjs`; tests: observe `check:seo-17:dist` RED, FAQ assertions first; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 17

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
