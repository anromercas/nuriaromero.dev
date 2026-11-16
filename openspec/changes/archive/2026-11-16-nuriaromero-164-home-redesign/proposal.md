# Proposal

## Why

Tracker: [NRD-164](https://nuriaromerodev.atlassian.net/browse/NRD-164) (epic NRD-162). The home (`src/pages/index.astro`) has about 1,818 visible words in `<main>` and still uses the old gray/yellow Tailwind world (`DESIGN.md` "Known Drift"). The owner wants it built on the `/seo-local-sevilla/` template: same section order and visual world, much less text, and a FAQ made only of the real questions people ask when they search "consultor seo sevilla" (720/month), the head term the home owns (`keywordOwners`, ADR 0013).

**Depends on NRD-163** (change `nuriaromero-163-reusable-local-components`): this change uses its components, `src/styles/template.css`, `SectionHeading`, `BentoTile`, the FAQ `links` field and `scripts/lib/template-pages.mjs`. Development starts only after NRD-163 is merged into `develop`; the branch is rebased on it first.

## What Changes

- `src/pages/index.astro` is recomposed with the template sections, in reference order: hero with a drawn mock, proof strip (real, sourced figures only), asymmetric bento "qué hago" (one tile per service linking to its owner page), process timeline with the real portrait, real proof (real review and real projects) plus the comparison "¿Consultor SEO o agencia?", FAQ in two columns, related links, closing band and NAP. No plans section: the home links to the plans on `/seo-local-sevilla/`.
- Visible words in `<main>` go from about 1,818 to 900-1,100 (method: `parsePage().mainWordCount`).
- The FAQ uses 6-8 of the 8 sourced questions in the story; price answers use the published plans (`tierFrom(seoLocal, "Local")`, `tierFrom(seoLocal, "Local Pro")`, IVA not included) and link to `/seo-local-sevilla/`; FAQPage is built from the same array.
- Removed from the home: the old hero with the raster portrait as LCP image, the "hitos" icon row, the services-by-problem list, the niche pills, the all-services price grid, the old process list, the "Casos de éxito" block, `GoogleReviews`, `InternalLinks`, `CTASection`, `TitleSection` and glyph icons.
- New home illustrations in `src/components/home/` (hero mock and the six service tile drawings).
- `/` registered in `scripts/lib/template-pages.mjs` (`words: [900, 1100]`, `service: false`).
- Source tests that pin old home markup are migrated to the new structure; their SEO intent (title, H1, first paragraph keyword, alt text, single price source, reviews JSON-LD fetched once, CTA markers) is kept.

## Capabilities

### New Capabilities

- `home-page`: what the home must show and guarantee (owned keyword placement, template sections, text budget, sourced FAQ mirrored in FAQPage, honest proof, links to service owners).

### Modified Capabilities

None (`page-template` from NRD-163 is consumed, not changed).

## Out of scope

- Title, H1 and meta description wording decided in NRD-122 (kept: "Consultor SEO en Sevilla | Nuria Romero, SEO local y para IA", H1 "Consultor SEO en Sevilla para negocios locales", `homeDescription` template).
- Any new figure or data not approved (NRD-23 stays open): proof only from the live Google rating and facts already published in `src/data`.
- Changes to the template components themselves beyond what NRD-163 delivered (if a gap appears, ask the Tech Lead; a component change must keep `/seo-local-sevilla/` unchanged and its check-seo-16 baseline green).
- Header, Footer, BookingButton, WhatsApp button, consent banner.
- Swapping the timeline dot fill to an ink token (it would also change `/seo-local-sevilla/`; stays `--site-ground`).

## Impact

- Code: `src/pages/index.astro`, new `src/components/home/*.astro`, `scripts/lib/template-pages.mjs`, tests in `tests/`.
- SEO: Person, FAQPage and AggregateRating/Review JSON-LD set unchanged in kind; FAQPage content changes with the new FAQ. No URL change, no new dependency, no CSP change, no price change. Not radical.
- Performance: the LCP element stops being the raster portrait (it moves, lazy, into the process section); `scripts/check-seo-12.mjs` markers stay on the new hero.
