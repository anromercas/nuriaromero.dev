## Why

[NRD-352](https://nuriaromerodev.atlassian.net/browse/NRD-352). The FAQ gap report of NRD-323 (`docs/research/NRD-323-faq-gap-report.md`, sections 4.1 and 7) found three recurring questions that `/seo-local-sevilla/`, the owner of "seo local sevilla", "agencia seo sevilla" and "posicionamiento web sevilla" (ADR 0012, ADR 0013), does not answer in its FAQ: L1 "¿Cuánto cuesta el SEO local?", L5 "¿Qué es el SEO local?" and L8 "¿Cómo influye la ficha de Google en el SEO local?". Evidence: R16 (PAA, KW-Labs, 2026-11-16), KC S1 (2026-11-13) and S10 (2026-11-15); `que es el seo local` 90 and `seo local google my business` 70 searches (Spain, KW-Labs, 2026-11-16).

## What Changes

- `seoLocal.faqs` in `src/data/services.ts` gains two entries: L5 "¿Qué es el SEO local?" (first entry) and L1 "¿Cuánto cuesta el SEO local?" (right after "¿Qué diferencia hay entre Local y Local Pro?"), with the Spanish answers of section 4.1 of the report.
- The L1 answer reads both plan prices with `tierFrom(seoLocal, "Local")` and `tierFrom(seoLocal, "Local Pro")` at read time (a getter on the entry), never typed (NRD-10).
- L8 is merged into the Google Maps entry (FAQ #2 today) as one added sentence on the Google Business Profile and what each plan does with it; no new figures. PO decision (2026-11-21): no third new entry, the page already has 9 (M4: less text).
- The FAQ grows from 9 to 11 entries; the FAQPage JSON-LD and `/ai/faq.json` follow `seoLocal.faqs` automatically, and the `check-seo-16` baseline fixture is regenerated in the same commit.
- A test pins the new entries, the L8 sentence, the entry order and the live price read.

## Capabilities

### New Capabilities

- `seo-local-page`: the FAQ of `/seo-local-sevilla/` answers what local SEO is, what it costs (prices from the single pricing source) and how the Google Business Profile fits, with direct answers and no promised result. The page had no living spec until now.

### Modified Capabilities

- None. `ai-discovery` already requires the FAQPage JSON-LD and `/ai/faq.json` to mirror the visible FAQ; its requirements do not change.

## Impact

- Code: `src/data/services.ts` (`seoLocal.faqs`), `tests/seo-local-faq.test.js` (new), `tests/fixtures/seo-local-sevilla.baseline.json` (regenerated FAQPage entities). Layer `app`.
- Public output: visible FAQ, FAQPage JSON-LD of `/seo-local-sevilla/`, `/ai/faq.json`. The page `dateModified` moves with the commit to `src/data/services.ts` (ADR 0017, real content change).
- No new dependency, no schema or settings change, no price change (prices are read, not edited), no new markup or component.
- Word count: about 1,496 to about 1,572 words; the page has no declared word range (`scripts/lib/template-pages.mjs`), and the PO declared none.

## Out of scope

- Declaring a word budget for `/seo-local-sevilla/` (PO decision: not yet).
- Changing the key sections of the page (`src/pages/seo-local-sevilla.astro`), including the existing "¿Cuánto cuesta?" direct answer.
- FAQ changes on any other page (home, contact, `/diseno-web-sevilla/`, parked niche pages).
- Questions L2, L6 and L9 of the report (one source each).
