# Tasks

Prerequisite: rebase on `develop` after NRD-212 (word budget without the live review quote) is merged.

## 1. Page illustrations

- [ ] 1.1 [NRD-214 app] `src/components/ia/ChatMock.astro` and `AiTileArt.astro` (chatbot, agente, respuestas, persona, resumenes, rgpd); tests: illustration assertions in `tests/ia-template.test.js` first; verify suite and `pnpm build` green

## 2. Page on the template

- [ ] 2.1 [NRD-215 app] Recompose `src/pages/inteligencia-artificial.astro` on `ServiceLayout variant="template"` in reference order (proof strip `SITE_PROOF[0]` plus rating when present; no real proof; comparison "¿IA a medida o ChatGPT tal cual?"; one plan from `inteligenciaArtificial.pricing`), add `AI_FROM` and shorten `inteligenciaArtificial` (hero title/accent, subtitle, secondary link, benefits keyword, six tiles, four steps, cta) keeping title, description, H1, process/pricing/faq keyword headings, includes and note, plus the GEO guide row in `src/data/internal-links.ts`; tests: structure and single-literal assertions first; verify suite (incl. `seo-meta-titles`, `seo-intents-copy-sync`, `adr-0013-link-rows`, `software-medida-intent`, `automatizaciones-template`), `pnpm build`, `pnpm check:seo:dist` (02, 07, 16) green
- [ ] 2.2 [NRD-216 app] Six sourced FAQ items (best AI by use case without a best brand, ChatGPT difference, how to implement, AI agent, chatbot with handoff and no absolute guarantee, price from `AI_FROM` and the 1-2 week pilot), copy within 750-850 words (trimming order in design.md) and the `/inteligencia-artificial/` entry in `scripts/lib/template-pages.mjs`; tests: observe `check:seo-17:dist` RED, FAQ assertions first; verify suite, `pnpm build`, `pnpm check:seo:dist` green incl. 17

## Workflow follow-up

- QA runs the real-browser checks and the Rich Results validation in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
