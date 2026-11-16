# Proposal

## Why

Tracker: [NRD-165](https://nuriaromerodev.atlassian.net/browse/NRD-165) (epic NRD-162). `/diseno-web-sevilla/` has about 2,082 visible words in `<main>` (the longest page of the site) and still uses the old Tailwind world. The owner wants it built on the `/seo-local-sevilla/` template with much less text and a FAQ made only of the real questions people ask when they search "diseño web sevilla" (720/month, owned by this page, ADR 0013). It extends NRD-121 (title, H1 and H2 work "diseño web sevilla") without undoing it.

**Depends on NRD-163** (change `nuriaromero-163-reusable-local-components`): this change uses its components, `ServiceLayout variant="template"`, `BentoTile`, the FAQ `links` field and `scripts/lib/template-pages.mjs`. Development starts only after NRD-163 is merged into `develop`; the branch is rebased on it first.

## What Changes

- `src/pages/diseno-web-sevilla.astro` renders `ServiceLayout variant="template"` with the template sections in reference order: hero with a drawn web mock (phone and desktop) and a secondary link to the prices, proof strip (real figures only), bento "qué incluye tu web" (six tiles, one sentence each), process timeline with the real portrait, real proof (real client sites) plus the comparison "¿Freelance, estudio o agencia?", plans (landing and full website with the prices already published), FAQ in two columns, related links, closing band and NAP.
- `disenoWeb` in `src/data/services.ts` is rewritten for the shorter page: display title and accent for the hero, six bento items in `benefits`, four short process steps, the 6-7 sourced FAQ items with links to the price guide and to `/seo-local-sevilla/`, `offersFromTiers: true` with `tierBilling: "one-time"`. Title, meta description, H1, breadcrumb name, the four `sectionTitles` and both tier prices stay as they are (NRD-121, S-2026-11-13-1).
- `ServicePageData` gains `tierBilling?: "monthly" | "one-time"` and optional `links` on FAQ items; `serviceSchema` emits one plain Offer per visible plan for one-time pricing (no monthly `UnitPriceSpecification`), so the Service JSON-LD offers equal the visible plans (GEO-4).
- Owner facts of 2026-11-16 (PRD §14, NRD-165 H1 and H2): the landing tier `includes` gains "Un mes de soporte tras el lanzamiento" (support in both plans); the bento has no editing-panel tile (replaced by "Dominio y hosting a tu nombre"), and no copy in `disenoWeb` promises a panel or self-editing (process step "Lanzamiento y primer mes de soporte", the FAQ about managing the website and the WordPress-vs-custom answer are corrected); a panel is quoted separately on request, with no published price.
- Visible words in `<main>` go from about 2,082 to 1,000-1,200.
- Removed from the page: the "¿Tu web actual no te trae clientes...?" intro, the niche pills block (niche pages stay linked from the related row), the old "Webs reales" and "Por qué elegir a alguien de Sevilla" blocks, the legacy benefits grid, process list, pricing card, FAQ and CTA.
- New page illustrations in `src/components/diseno-web/`.
- `/diseno-web-sevilla/` registered in `scripts/lib/template-pages.mjs` (`words: [1000, 1200]`, `service: true`).

## Capabilities

### New Capabilities

- `diseno-web-page`: what `/diseno-web-sevilla/` must show and guarantee (owned keyword placement kept, template sections, text budget, sourced FAQ mirrored in FAQPage, Service offers equal to the visible plans, only already-published prices, honest DIY objection, support month in both plans, no promised editing panel).

### Modified Capabilities

None (`page-template` from NRD-163 is consumed, not changed).

## Out of scope

- Any new price, price range or market figure: decision S-2026-11-13-1 is still open in the PRD. Prices stay "desde 149 €" (landing) and "desde 399 €" (web completa) from `src/data/services.ts`.
- Title, meta description and H1 wording (NRD-121) and the `seo-intents` row signals, unless a heading changes (then the row is updated in the same commit).
- The price guide `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` (NRD-128, indexation gate) and its reciprocal link pair, which stays intact.
- Shared template components (NRD-163) and the niche pages.
- Panel or self-editing claims on other pages (niche pages in `src/data/niches.ts`, the online-store page): flagged to the PO, not changed here.

## Impact

- Code: `src/pages/diseno-web-sevilla.astro`, `src/data/services.ts` (`disenoWeb` only), `src/data/types.ts`, `src/lib/schema.ts` (`serviceSchema` one-time offers), `src/layouts/ServiceLayout.astro` (passes `tierBilling`), new `src/components/diseno-web/*.astro`, `scripts/lib/template-pages.mjs`, tests.
- SEO: FAQPage content changes with the new FAQ; Service offers become two one-time Offers (149 and 399) instead of one; BreadcrumbList unchanged; `/seo-local-sevilla/` JSON-LD must stay byte-identical (monthly branch untouched; check-seo-15 and check-seo-16 guard it). `public/llms.txt` entry already matches the prices, mentions neither support nor a panel, and stays.
- No URL change, no new dependency, no CSP change, no price change. Not radical.
