# Proposal

## Why

Tracker: [NRD-167](https://nuriaromerodev.atlassian.net/browse/NRD-167) (epic NRD-162). `/desarrollo-software-medida/` has about 1,404 visible words in `<main>` and still uses the old Tailwind world. The owner wants it built on the `/seo-local-sevilla/` template with much less text and a FAQ of the real questions of people looking for custom software. It extends NRD-124 (page intent, "desarrollo de software a medida sevilla" owned here, "aplicaciones web a medida" in the description) without undoing it.

**Depends on NRD-195 and NRD-168** (sprint order NRD-195, NRD-168, NRD-166, NRD-167, WIP 1): the price constant used in the FAQ relies on NRD-195's runtime-import refactor of `tests/single-price-source.test.js`, and the single plan relies on NRD-168's one-plan rule in `SeoLocalPlans`. The branch is rebased on `develop` after both are merged; if the one-plan rule is missing, task 2.1 adds it as NRD-168's design specifies.

## What Changes

- `src/pages/desarrollo-software-medida.astro` renders `ServiceLayout variant="template"` in reference order: hero with a drawn internal tool (a panel with an orders or bookings list) and a secondary link to the price; proof strip (real figures only); bento "qué se puede hacer a medida" (aplicación web, app para el móvil, gestión interna/ERP, API e integraciones, reservas, panel de datos), one sentence each; process timeline (análisis, fase 1 con precio y plazo cerrados, entregas parciales, ampliación); real proof plus the comparison "¿Software a medida o estándar?"; one plan with the published price "desde 999 €" by phases; FAQ in two columns; related links; closing band and NAP.
- `desarrolloSoftware` (`src/data/services.ts`) is shortened: hero display title and accent, a shorter subtitle, secondary link, new benefits keyword heading, six bento items in `benefits`, four steps, five sourced FAQ items, new `cta`; the price moves into `const SOFTWARE_FROM = "999 €"` used by `pricing.from` and the price answer (one literal). Title, description, H1, the process and pricing keyword headings (intent signals), the FAQ keyword heading, `pricing.includes` and `pricing.note` stay.
- New page illustrations in `src/components/software/`.
- `/desarrollo-software-medida/` registered in `scripts/lib/template-pages.mjs` (`words: [750, 850]`, `service: true`). Visible words go from about 1,404 to 750-850.

## Capabilities

### New Capabilities

- `software-page`: what `/desarrollo-software-medida/` must show and guarantee on the template: owned keyword placement, section order, text budget, sourced FAQ mirrored in FAQPage, code ownership answered with what is already published, no ranking of companies, the published price as the only plan and Service offer, honest proof and illustrations, coherent internal links.

### Modified Capabilities

None.

## Out of scope

- Any new price, phase price or lead time; "desde 999 €" stays.
- Title, description, H1 and the "aplicaciones web a medida sevilla" ownership settled in NRD-124.
- Sortlist/Clutch profiles (NRD-160, off-site).
- "¿Software a medida o software estándar para mi empresa?" as a FAQ item: weak evidence (the story says to use it only as the visible comparison).

## Impact

- Code: `src/pages/desarrollo-software-medida.astro`, `src/data/services.ts` (`desarrolloSoftware` and one constant), new `src/components/software/*.astro`, `scripts/lib/template-pages.mjs`, tests.
- SEO: FAQPage follows the five sourced questions; Service keeps one Offer 999 equal to the visible plan; BreadcrumbList unchanged; intent signals and the reciprocal pair with `/diseno-web-sevilla/` (related row) kept; ownership unchanged.
- No URL, price, dependency or CSP change. Not radical.
