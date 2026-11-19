## Why

[NRD-298](https://nuriaromerodev.atlassian.net/browse/NRD-298): a business owner in Seville asks "¿cuánto cuesta una página web en Sevilla?" and Google already answers with a figure in the AI Overview and in People Also Ask, citing a competitor. Our post `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` refuses to give any figure ("no hay una cifra única fiable") although `/diseno-web-sevilla/` publishes fixed prices, so it cannot be cited as a price answer. The owner answered decision S-2026-11-13-1 YES on 2026-11-19: a price answer plus a table using only the published web design tariffs (single source `disenoWeb.pricing` in `src/data/services.ts`, NRD-10), no market range.

## What Changes

- The opening paragraph and the "Respuesta corta" section of the post answer the price question with my published web design rates (one-page landing and full website up to 5 pages), each with its "desde" price and the date the rates are stated as current, presented as "mis tarifas", never as a market price.
- A short Markdown table under "Respuesta corta" lists each web design tier (name, "Desde <price>", what it includes) with the same data as `disenoWeb.pricing.tiers`.
- The sentences that say the post gives no figures are rewritten so they do not contradict the table ("no doy cifras de mercado, solo mis tarifas"); `updatedDate` moves to the content commit date.
- **BREAKING (test contract)**: in `tests/price-post-intent.test.js` the guards "no number outside today's set" and "no euro sign or currency word" (NRD-128) are replaced by a drift test against `disenoWeb.pricing`: every euro amount and every number of three or more digits in the body is a published tier price (or the year of the rate date), the table rows equal the tiers, and the rate date equals `updatedDate`. All other guards stay.
- `tests/fixtures/blog-posts.baseline.json` is regenerated for this post only (`check-seo-18`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `web-price-guide-post`: the "no price figure" requirement is removed and replaced by "answers with my published web design rates", "the short answer holds a rates table and no contradiction" and "published rates come from the single price source"; the remaining requirements (term, direct answers, gap sections, hub link, update date, evidence, CWV) are unchanged.

## Impact

- Content: `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md` (Markdown; the price column is right-aligned with `---:`).
- Style: one scoped rule in `src/layouts/BlogPostLayout.astro` so right-aligned table cells (`th`/`td` with `align="right"`) do not wrap; it keeps "Desde 149 €" on one line at 375 px despite the existing `overflow-wrap: anywhere`. No other table is affected (the only other blog table has no aligned columns).
- Tests: `tests/price-post-intent.test.js`, `tests/blog-post-template.test.js` (layout rule), optionally a `markdownTable()` helper in `tests/helpers/post-sections.js`; fixture `tests/fixtures/blog-posts.baseline.json`.
- No change to `src/data/services.ts`, `/diseno-web-sevilla/`, `public/llms.txt`, JSON-LD, sitemap config or dependencies. No price changes (the figures are the ones already published). No radical change.

## Out of scope

- A new FAQ section or FAQPage JSON-LD (suggested by the SEO candidate, not part of the owner decision).
- Prices of other services (online store, SEO, software, automations, AI) in the post, including the store price in the tier `note`.
- Any market range or third-party figure.
- Changes to `/diseno-web-sevilla/`, `public/llms.txt` or `src/data/services.ts`.
