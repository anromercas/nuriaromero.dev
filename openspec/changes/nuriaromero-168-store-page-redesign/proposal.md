# Proposal

## Why

Tracker: [NRD-168](https://nuriaromerodev.atlassian.net/browse/NRD-168) (epic NRD-162). `/tienda-online-sevilla/` has about 2,095 visible words in `<main>` and still uses the old Tailwind world. The owner wants it built on the `/seo-local-sevilla/` template with much less text and a FAQ made only of the real questions of people who want to build an online store ("diseño tienda online sevilla", owned by this page, ADR 0012/0013). It keeps the NRD-34 intent and starts from the store offer NRD-195 puts in `src/data/store-offer.ts` ("desde 499 €", three options, included and quoted-separately lists).

**Depends on NRD-195** (change `nuriaromero-195-store-offer-pricing`): this change reads `STORE_FROM`, `storeOptions`, `storeIncludes`, `storeQuotedSeparately` and `STORE_FINAL_PRICE_NOTE`, keeps every NRD-195 test green and replaces its legacy `StoreOffer.astro`. Development starts after NRD-195 is merged into `develop`; the branch is rebased on it first.

## What Changes

- `src/pages/tienda-online-sevilla.astro` renders `ServiceLayout variant="template"` in reference order: hero with a drawn store mock (product card and cart) and a secondary link to the prices; proof strip (real figures only); bento "qué lleva tu tienda" (catálogo, pasarela de pago, variantes, envíos sencillos, panel de gestión, SEO de producto; one sentence each, coherent with `storeIncludes`); process timeline (alcance, propuesta cerrada por escrito, construcción, formación y lanzamiento); real proof plus the comparison "¿WooCommerce, Shopify o a medida?"; plans with the three options at the same starting price followed by the included and quoted-separately lists; FAQ in two columns; related links; closing band and NAP.
- `src/data/store-offer.ts` gains, per option, `bestFor` (when to choose it) and `tradeOff` (what to weigh), plus `storeTiers` (the three options mapped to plan tiers at `STORE_FROM`). Price, options and lists are not rewritten.
- `tiendaOnline` (`src/data/services.ts`) is shortened for the template: hero display title and accent, a shorter subtitle that still says "tienda online", six bento items in `benefits`, four short process steps, a new benefits keyword heading, five sourced FAQ items, shorter `cta`. Title, description, H1, process and pricing keyword headings, the price FAQ question and the platform FAQ question stay.
- New page components in `src/components/tienda-online/`: `StoreMock.astro`, `StoreTileArt.astro`, `StoreScope.astro` (template-styled included and quoted-separately lists with the final-price note). `StoreOffer.astro` (NRD-195, legacy) is deleted.
- `SeoLocalPlans` gets two additive layout rules: a lone plan stays one readable column, and three plans sit in three columns from 1024 px (two-plan pages unchanged).
- Intent row of the page: the content signal "Pasarela de pago integrada y probada" (legacy block, removed) is replaced by the comparison keyword heading "¿WooCommerce, Shopify o a medida?".
- `/tienda-online-sevilla/` registered in `scripts/lib/template-pages.mjs` (`words: [900, 1100]`, `service: true`). Visible words go from about 2,095 to 900-1,100.
- Removed: the "¿Ya vendes por Instagram o WhatsApp...?" intro and the "Por qué elegir a alguien que programa" block (the in-content link to `/web-para-comercios-sevilla/` stays through the related row, anchor "web para comercios que también quieren vender online").

## Capabilities

### New Capabilities

- `tienda-online-page`: what `/tienda-online-sevilla/` must show and guarantee on the template: owned keyword placement, section order, text budget, sourced FAQ mirrored in FAQPage, plans that show the store offer from its source, honest proof and illustrations, coherent internal links.

### Modified Capabilities

None (`store-offer` from NRD-195 and `page-template` are consumed, not changed; their requirements keep holding).

## Out of scope

- The store offer itself (price, options, lists, llms.txt line, JSON-LD offer): NRD-195.
- Title, meta description and H1 (NRD-34); the SERP re-read, passage tuning and ownership check after indexation (NRD-125).
- A lead-time answer: no store lead time is published in `src/data`, so the "¿Cuánto se tarda en montar una tienda?" question is omitted (AC: omit or ask the owner).
- Niche pages, other template pages beyond the shared plan-grid rules.

## Impact

- Code: `src/pages/tienda-online-sevilla.astro`, `src/data/services.ts` (`tiendaOnline` only), `src/data/store-offer.ts` (two fields per option, `storeTiers`), `src/data/seo-intents.ts` (one content signal), new `src/components/tienda-online/*.astro`, deleted `StoreOffer.astro`, `src/components/seo-local/SeoLocalPlans.astro` (CSS only), `scripts/lib/template-pages.mjs`, tests.
- SEO: FAQPage follows the five sourced questions; Service keeps one Offer 499 (NRD-195); BreadcrumbList unchanged; reciprocal pair with `/web-para-comercios-sevilla/` kept inside `<main>` through the related row; keyword ownership unchanged.
- No URL, price, dependency or CSP change. Not radical.
