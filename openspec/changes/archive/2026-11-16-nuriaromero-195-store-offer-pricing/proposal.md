# Proposal

## Why

Tracker: [NRD-195](https://nuriaromerodev.atlassian.net/browse/NRD-195) (epic NRD-4, M3). Owner decisions of 2026-11-16 (PRD §14, two entries): a basic online store costs **desde 499 €**, includes a management panel, and comes in three options the client chooses, all at the same starting price (WooCommerce, Shopify, a custom-coded store such as Next.js + Supabase), with a fixed list of what is included and what is quoted separately. Today `/tienda-online-sevilla/` still says "399 €" (the full website the store is built on) and that gateway, stock, variants and shipping are quoted separately; its FAQ presents Shopify only as a rival; the Service JSON-LD publishes 399; `public/llms.txt`, `/diseno-web-sevilla/` and `/web-para-comercios-sevilla/` say the store is quoted separately. Visitors comparing closed prices (persona 3), search engines and AI assistants read an offer that no longer exists.

## What Changes

- New single source `src/data/store-offer.ts`: `STORE_FROM = "499 €"`, the three `storeOptions` (name, optional example, one-sentence recurring cost), `storeIncludes`, `storeQuotedSeparately` (the last item links to `/automatizaciones/`) and `STORE_FINAL_PRICE_NOTE`. No other file writes a store figure or list by hand.
- `tiendaOnline` (`src/data/services.ts`) reads the source: `pricing.from = STORE_FROM`, `pricing.includes = storeIncludes`, `pricing.note = STORE_FINAL_PRICE_NOTE`; the price, gateway, Shopify/Wix and product-load FAQs, the shipping/stock FAQ, the "Tienda propia, sin comisión de marketplace" benefit, process step 1 and the hero secondary link label are rewritten to the new offer. Title, meta description and H1 do not change (no price in them).
- `/tienda-online-sevilla/` overrides the legacy `pricing` slot with a new presentational component `src/components/tienda-online/StoreOffer.astro` (legacy page styling, props only): "Desde 499 €", the three options with their recurring cost, the included list, the quoted-separately list and the final-price note. NRD-168 replaces it when the page moves to the template.
- Service JSON-LD of the page: one Offer, `price` "499", EUR, derived from `pricing.from` through the existing `serviceSchema` (no offer per option, no schema code change).
- `/diseno-web-sevilla/`: the full-website tier note becomes "tienda online desde 499 €" read from `STORE_FROM` and mentions the store page; `/web-para-comercios-sevilla/`: the pricing note and the second paragraph of the price FAQ give the store price from `STORE_FROM` and point to `/tienda-online-sevilla/` (panel sentences untouched, PRD §12 open question).
- `public/llms.txt`: the store line says "desde 499 €", panel included, WooCommerce, Shopify or custom; guarded by a test against the source, like the home and service prices (NRD-10).
- `tests/single-price-source.test.js` reads prices by importing `src/data/services.ts` at run time instead of regex-parsing string literals (so a price held in a constant is still seen); `tests/tienda-online-retarget.test.js` "price logic is unchanged" moves to the new rule.

## Capabilities

### New Capabilities

- `store-offer`: what the site publishes about the online store offer: one price source, the three options with their recurring costs, the included and quoted-separately lists, consistent FAQ and copy, the single Service offer, the llms.txt line and the store mentions on other pages.

### Modified Capabilities

- `diseno-web-page`: "Plans show only already-published prices" allows the store mention in the full-website plan to carry the store price read from the store offer source.

## Out of scope

- The redesign of `/tienda-online-sevilla/` on the template, its word budget and its sourced FAQ (NRD-168, next in the sprint, blocked by this story).
- Panel or self-editing sentences on niche pages (`src/data/niches.ts`): open question PRD §12; only the store price changes there.
- Title, meta description, H1 and intent row of the store page (NRD-34), the legacy page blocks outside the pricing section.
- Any third-party amount (Shopify fee, gateway fees, shipping costs), lead time, discount or percentage.

## Impact

- Code: new `src/data/store-offer.ts`, `src/data/services.ts` (`tiendaOnline`, one `disenoWeb` tier note), `src/data/niches.ts` (two comercio strings), new `src/components/tienda-online/StoreOffer.astro`, `src/pages/tienda-online-sevilla.astro`, `public/llms.txt`, `scripts/check-seo-02.mjs`, tests.
- SEO: Service offer of `/tienda-online-sevilla/` 399 -> 499; FAQPage follows the rewritten FAQ (the price question text is unchanged, the platform question is reworded); no URL, heading or title change. Reviews: SEO (src/data, llms.txt), UX and a11y (new component).
- Price change decided by the owner (PRD §14, 2026-11-16), so not an agent radical decision. No new dependency, service, CSP or schema change.
