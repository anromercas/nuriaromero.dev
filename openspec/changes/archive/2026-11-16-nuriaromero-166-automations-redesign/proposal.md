# Proposal

## Why

Tracker: [NRD-166](https://nuriaromerodev.atlassian.net/browse/NRD-166) (epic NRD-162). `/automatizaciones/` has about 1,327 visible words in `<main>` and still uses the old Tailwind world. The owner wants it built on the `/seo-local-sevilla/` template with much less text and a FAQ of the real questions people ask about automating business processes. It extends NRD-123 (process-automation intent in title, H1 and description) without undoing it.

**Depends on NRD-168** for the one-plan layout rule of `SeoLocalPlans` (sprint order NRD-195, NRD-168, NRD-166, NRD-167, WIP 1). The branch is rebased on `develop` after NRD-168 is merged; if that rule is not there, task 2.1 adds it exactly as NRD-168's design specifies.

## What Changes

- `src/pages/automatizaciones.astro` renders `ServiceLayout variant="template"` in reference order: hero with a drawn flow (incoming message -> sheet/CRM -> alert) and a secondary link to the price; proof strip (real figures only); bento of six real automation examples (WhatsApp, facturas, citas y recordatorios, formularios a hoja o CRM, avisos internos, informes), one sentence each; process timeline of five steps (mapear la tarea, simplificarla, elegir herramienta, piloto con casos reales, dejarla funcionando); the comparison "¿Qué conviene automatizar primero y qué no?"; one plan with the published price "desde 149 €" per automation; FAQ in two columns; related links; closing band and NAP. No real-proof section: no automation project is published (C6).
- `automatizaciones` (`src/data/services.ts`) is shortened: hero display title and accent, a subtitle whose first two sentences define process automation in business language (GEO-1), new benefits keyword heading, six bento items in `benefits`, five steps, six sourced FAQ items, `cta`. Title, description, H1, the process and pricing keyword headings (intent signals), the FAQ keyword heading and `pricing` (from "149 €" literal first, includes, note) stay.
- New page illustrations in `src/components/automatizaciones/`.
- Removed copy that claims savings or return without a source ("Inversión pequeña, retorno rápido", "se amortiza en semanas").
- `/automatizaciones/` registered in `scripts/lib/template-pages.mjs` (`words: [700, 800]`, `service: true`). Visible words go from about 1,327 to 700-800.

## Capabilities

### New Capabilities

- `automatizaciones-page`: what `/automatizaciones/` must show and guarantee on the template: kept intent placement, section order, text budget, business-language direct answer, sourced FAQ mirrored in FAQPage and coherent with the bento, the published price as the only plan and Service offer, no invented savings, honest illustrations, coherent internal links.

### Modified Capabilities

None.

## Out of scope

- Any new price, pack price or discount figure; the "desde 149 €" price stays.
- A `keywordOwners` row for `/automatizaciones/`: the ownership check does not require it and `tests/automatizaciones-intent.test.js` asserts there is none.
- The `/inteligencia-artificial/` FAQ (NRD-169); question 2 here is answered from the automation tools angle.
- Questions "¿Cuáles son los 4 tipos de automatización?" (industrial taxonomy, off-intent for a small business page) and "¿Qué procesos conviene automatizar primero y cuáles no?" as a FAQ item (answered by the comparison section): left out of the FAQ for the word budget.

## Impact

- Code: `src/pages/automatizaciones.astro`, `src/data/services.ts` (`automatizaciones` only), new `src/components/automatizaciones/*.astro`, `scripts/lib/template-pages.mjs`, tests.
- SEO: FAQPage follows the six sourced questions; Service keeps one Offer 149 equal to the visible plan; BreadcrumbList unchanged; intent signals and the reciprocal pair with `/inteligencia-artificial/` (related row) kept.
- No URL, price, dependency or CSP change. Not radical.
