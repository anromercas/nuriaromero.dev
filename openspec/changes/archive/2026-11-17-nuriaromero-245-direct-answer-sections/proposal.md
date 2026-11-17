## Why

Tracker: [NRD-245](https://nuriaromerodev.atlassian.net/browse/NRD-245).

Answer engines cite blocks that answer on their own. Today the template sections average 35 words and none opens with a definition or a direct answer; "chunk readiness" scores 46/100 (GEO audit, geo-optimizer-skill 4.19.7, 2026-11-17). Solving it in the template section components makes every template page inherit it.

## What Changes

- The template section heading (`SectionHeading`) accepts an optional direct answer (1-2 sentences, 15-45 words) rendered as the first paragraph under the section's keyword heading and display title, before any list, card or FAQ item. The five key-section components (`ReviewBento`, `SeoLocalProcess`, `SeoLocalAgencia`, `SeoLocalPlans`, `SeoLocalFaq`) forward it; the FAQ lede becomes optional.
- The key sections (what the service is, who it is for / which option, price, how I work, FAQ) of `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/automatizaciones/`, `/desarrollo-software-medida/`, `/inteligencia-artificial/` and `/seo-para-ia/` open with a self-contained answer in Spanish (`tú`), with prices read from `src/data`, no promises and no invented figures.
- Each page's key sections are registered in `scripts/lib/template-pages.mjs`; `scripts/check-seo-17.mjs` fails when a registered key section has no direct answer first or its length is out of range. Word ranges stay as they are: other text is trimmed when an answer does not fit.

## Out of scope

- Hero, proof (`RealProof`), related links, closing and NAP sections; pages outside the list (contact, about, portfolio, resources, blog, niche pages, legal).
- Rewriting FAQ questions or answers (their FAQPage parity stays as is), titles, H1s, keyword headings, prices or offers.
- The home vocabulary work of NRD-243 (blocked; see its tracker comment).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `page-template`: sections can open with a direct answer, and template pages register key sections that must open with one.

## Impact

- `src/components/seo-local/SectionHeading.astro`, `ReviewBento.astro`, `SeoLocalProcess.astro`, `SeoLocalAgencia.astro`, `SeoLocalPlans.astro`, `SeoLocalFaq.astro`, `src/styles/template.css` (answer style per the UI spec), the eight page files, `scripts/lib/page-contract.mjs`, `scripts/lib/template-pages.mjs`, `scripts/check-seo-17.mjs`, tests.
- Copy-heavy: about 39 answers and trims on pages close to their word ceiling (`/inteligencia-artificial/` 849/850, `/seo-para-ia/` 842/850, `/automatizaciones/` 788/800).
- No dependency, no URL, price or schema change.
