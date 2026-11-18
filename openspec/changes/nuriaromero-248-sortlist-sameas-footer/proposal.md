## Why

Tracker: [NRD-248](https://nuriaromerodev.atlassian.net/browse/NRD-248).

Answer engines confirm an entity by joining external profiles. `SITE.sameAs` (`src/data/site.ts:43-47`) lists only LinkedIn, GitHub and the Google Business Profile; the GEO audit of 2026-11-17 asks for more entity links. The owner's Sortlist profile is public since 2026-11-18 and NRD-160 verifies and records it as a citation. The footer (`src/components/Footer.astro:60,69`) and `/contacto/` (`src/pages/contacto.astro:68`) read `SITE.sameAs[0]` and `[1]` by position, so any reordering of the list would silently change those visible links.

## What Changes

- Visible profile links (footer LinkedIn and GitHub, `/contacto/` LinkedIn) are resolved by network from `SITE.sameAs` instead of by index; the build fails if a needed profile is missing. The rendered HTML does not change.
- `SITE.sameAs` gains `https://www.sortlist.es/agency/nuria-romero`, so the published JSON-LD (`#business` and `#person`, both built from `SITE.sameAs` in `src/lib/schema.ts`) and `/ai/summary.json` (`src/lib/ai-discovery.ts`) carry it.
- The verified-profile allowlist of the structured-data build check (`scripts/check-seo-11.mjs`) and the `/seo-local-sevilla/` JSON-LD baseline (`tests/fixtures/seo-local-sevilla.baseline.json`) are updated.
- A new test guards the list: https only, no duplicates, Sortlist present, no Clutch, Crunchbase, Wikipedia or Wikidata, and the footer and contact links resolved by network.

## Out of scope

- Clutch (NRD-292), Crunchbase (no real profile), Wikipedia or Wikidata profiles.
- `public/llms.txt` "Perfiles oficiales" (hand-curated, `check-seo-09` allows only LinkedIn and GitHub as external links); a Sortlist link in the footer or any visible UI change.
- Splitting `sameAs` between the business and the person node.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `site-identity`: adds a requirement that official profiles in `sameAs` are verified, valid and unique, and that visible profile links are resolved by network.

## Impact

- `src/data/site.ts`, `src/components/Footer.astro`, `src/pages/contacto.astro`, `scripts/check-seo-11.mjs`, `tests/fixtures/seo-local-sevilla.baseline.json`, `tests/same-as.test.js` (new), `tests/contact-template.test.js`.
- Public JSON-LD and `/ai/summary.json` gain one URL. No dependency, page, URL, copy or price change; nothing radical.
- Depends on NRD-160 (real-browser verification of the Sortlist profile) being merged first.
