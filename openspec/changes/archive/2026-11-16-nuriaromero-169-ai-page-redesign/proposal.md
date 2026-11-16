# Proposal

## Why

Tracker: [NRD-169](https://nuriaromerodev.atlassian.net/browse/NRD-169) (epic NRD-162, milestone M4). `/inteligencia-artificial/` has about 1,393 visible words in `<main>` and still renders the legacy `ServiceLayout` blocks in the old gray Tailwind world. The owner wants it on the `/seo-local-sevilla/` template: same structure and visual elements, much less text, and a FAQ built from the real questions of people looking for AI for their company (DataForSEO research of 2026-11-16, copied in the story).

**Depends on NRD-212** (sprint order NRD-212 first): the 750-850 range is measured with NRD-212's method. This page has no `RealProof`, so its count does not change with NRD-212, but the branch is rebased on `develop` after it.

## What Changes

- `src/pages/inteligencia-artificial.astro` renders `ServiceLayout variant="template"` in reference order: hero with a drawn chatbot conversation that hands off to a person and a secondary link to the price; proof strip (experience plus the live Google rating when present); bento "qué puede hacer la IA en tu negocio" (chatbot web/WhatsApp, agent that books or takes an order, answers with your information, handoff to a person, summaries, RGPD), one sentence each; process timeline (use case, pilot with your data, adjustment, final connection); the comparison "¿IA a medida o ChatGPT tal cual?"; one plan with the published price "desde 399 €"; FAQ in two columns; related links; closing band and NAP. No real-proof section: no AI project is published.
- `inteligenciaArtificial` (`src/data/services.ts`) is shortened: hero display title and accent, a shorter subtitle, secondary link, new benefits keyword heading, six bento items, four steps, six sourced FAQ items, new `cta`; the price moves into `const AI_FROM = "399 €"` used by `pricing.from` and the price answer.
- New page illustrations in `src/components/ia/`.
- `internalLinksBySource["/inteligencia-artificial/"]` gains a contextual row to the GEO guide.
- `/inteligencia-artificial/` registered in `scripts/lib/template-pages.mjs` (`words: [750, 850]`, `service: true`).

## Capabilities

### New Capabilities

- `ai-page`: what `/inteligencia-artificial/` must show and guarantee on the template: intent placement kept, section order, text budget, sourced FAQ mirrored in FAQPage, honest answers about which AI to use and about chatbots, the published price and pilot time as the only figures, one plan equal to the Service offer, no GEO targeting, coherent internal links.

### Modified Capabilities

None.

## Out of scope

- Title, meta description and H1 (intent row of NRD-124 / `src/data/seo-intents.ts`, pinned by `tests/seo-meta-titles.test.js`): the copy adjustment to the SERP is NRD-126's, gated on indexation. Epic criterion C3 ("owned keyword in title and H1") is read as "keep the registry placement"; see design decision 1.
- "posicionamiento en ia" / GEO targeting (owned by `/seo-para-ia/`, NRD-24/25/26); the page only links to the GEO guide.
- Any new price or lead time; competitor prices from the research.
- "cursos de ia para empresas" (training intent).

## Impact

- Code: `src/pages/inteligencia-artificial.astro`, `src/data/services.ts` (`inteligenciaArtificial`, one constant), `src/data/internal-links.ts` (one row), new `src/components/ia/*.astro`, `scripts/lib/template-pages.mjs`, `tests/ia-template.test.js`.
- SEO: FAQPage from nine to six questions; Service keeps one Offer 399 equal to the visible plan; BreadcrumbList unchanged; intent signals (title, description, H1, process and pricing keyword headings) kept; ownership unchanged.
- No URL, price, dependency or CSP change. Not radical.
