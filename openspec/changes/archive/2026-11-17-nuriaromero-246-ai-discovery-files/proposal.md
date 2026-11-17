## Why

Tracker: [NRD-246](https://nuriaromerodev.atlassian.net/browse/NRD-246).

The owner asked to publish the AI discovery files that the GEO audit scores (geo-optimizer-skill 4.19.7, 2026-11-17, "emerging standard geo-checklist.dev"). They are worth about 3/100 in that rubric and no major AI engine documents reading them, so they are low priority and this change claims no ranking or citation weight for them. The hard rule is that, once published, they never drift from the visible content, the published FAQPage or `robots.txt`.

## What Changes

- New build-time (prerendered) endpoints, no new dependency: `/.well-known/ai.txt`, `/ai/summary.json` and `/ai/faq.json`. The optional `/ai/service.json` is not built: `summary.json` already carries the services with URL and starting price, and a second copy would be one more file to keep in sync.
- `summary.json`: brand, description, logo, contact, NAP, area served, official profiles, services (URL, description, starting price and plans) and sector pages, all read from `src/data`.
- `faq.json`: for every page that publishes a FAQPage, the same questions and answers in the same order, built from the same data and the same answer normalization as the JSON-LD.
- `ai.txt`: one group per crawler rule, generated from the same policy object that feeds `robots.txt`, plus links to `llms.txt`, the two JSON files and the sitemap.
- Data moves so everything is read from `src/data`: the home and contact FAQs leave their pages for `src/data/page-faqs.ts`, the crawler policy leaves `astro.config.mjs` for `src/data/crawler-policy.ts`, and the service area leaves `src/lib/schema.ts` for `src/data/site.ts`. Built HTML and `robots.txt` stay byte-identical.
- The three files are excluded from the sitemap.
- New build guard `scripts/check-seo-24.mjs` (run by CI through `pnpm check:seo:dist`), with its pure contract tested in `tests/`: it fails when a `faq.json` question is missing from the page's FAQPage or the other way round, when a price differs from `src/data`, or when `ai.txt` allows a path that `robots.txt` blocks (or differs in any rule).

## Out of scope

- Generating `public/llms.txt` from data (it stays hand-kept; possible follow-up for the PO).
- `/ai/service.json`.
- Any change to `public/_headers` (infra path): Netlify serves `.json` and `.txt` with the right `Content-Type` by extension. If production shows otherwise, that is an infra story.
- Any visible page copy, price, URL, schema or robots rule change.
- Claims of ranking, citation or indexing effects of these files.

## Capabilities

### New Capabilities

- `ai-discovery`: machine-readable AI discovery files generated at build from site data, consistent with the visible FAQPage, prices and crawler policy.

### Modified Capabilities

- None.

## Impact

- New: `src/data/page-faqs.ts`, `src/data/crawler-policy.ts`, `src/lib/ai-discovery.ts`, `src/pages/.well-known/ai.txt.ts`, `src/pages/ai/summary.json.ts`, `src/pages/ai/faq.json.ts`, `scripts/lib/ai-discovery-contract.mjs`, `scripts/check-seo-24.mjs`, `tests/ai-discovery.test.js`, `tests/ai-discovery-contract.test.js`.
- Modified: `src/data/site.ts`, `src/lib/schema.ts`, `src/pages/index.astro`, `src/pages/contacto.astro`, `astro.config.mjs`, `package.json` (scripts only), `tests/home-template.test.js`, `tests/contact-template.test.js`.
- No dependency, URL, price, copy, layering or external-service change; relies on ADR 0018 (prerendered endpoints). Nothing radical.
