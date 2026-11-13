# NRD-10 - Single source of truth for prices in the home meta and llms.txt

## Why

[NRD-10](https://nuriaromerodev.atlassian.net/browse/NRD-10) (M0, epic NRD-1). The invariant "Data lives in `src/data`" is broken for prices: the home meta description hardcodes "300 €/mes + IVA" (`src/pages/index.astro:121`) and `public/llms.txt:10-11` repeats service prices by hand. A price change in `src/data/services.ts` would leave stale prices in Google snippets and AI answers.

## What changes

- `src/data/services.ts` exports a small helper `tierFrom(service, tierName)`.
- `src/pages/index.astro` builds its meta description from `tierFrom(seoLocal, "Local")`; rendered text identical to today.
- New `tests/single-price-source.test.js`: home description from data, and `public/llms.txt` prices checked against `src/data/services.ts`.
- `tests/seo-meta-titles.test.js` home case adapted to the new expression.

## Out of scope

- Changing any price shown (radical).
- Generating `llms.txt` (it stays a static file in `public/`; no endpoint, invariant "Static output"; PRD decision log 2026-11-13).
- Prices inside FAQ prose and service copy in `services.ts` and the home FAQs (`index.astro:106`): prose lives in `src/data` or the page already; a broader prose-vs-tier guard is a separate story if the PO wants it (SEO report item S-2026-11-13-1 about blog prices is waiting for the user).
- The capilares page missing from `llms.txt` (parked page).

## Requirements and scenarios

### Requirement: home description derives its price from data

The home meta description SHALL be built from the `from` value of the `Local` tier of `seoLocal` in `src/data/services.ts`, and the rendered text MUST stay `Consultor SEO en Sevilla para negocios locales: aparece en Google, Maps y en las respuestas de IA. SEO local desde 300 €/mes + IVA y trato directo.` (<= 160 characters).

#### Scenario: current data

- WHEN the site is built with the current `seoLocal` data
- THEN `dist/index.html` has exactly the description above and the title is unchanged

#### Scenario: price changes in data

- WHEN the `Local` tier `from` changes in `services.ts`
- THEN the home description shows the new value with no edit to `index.astro`

#### Scenario: tier renamed or removed

- WHEN no tier named `Local` exists in `seoLocal`
- THEN `tierFrom` throws and the build fails with a message naming the slug and tier

#### Scenario: literal price reintroduced

- WHEN someone writes a `€` amount literally in the home description template
- THEN `tests/single-price-source.test.js` fails

### Requirement: llms.txt prices match the data

Every price in the `## Servicios` section of `public/llms.txt` MUST equal a `from` value of the matching service's `pricing` in `src/data/services.ts` (amount and `/mes` qualifier); the services that list prices there today (diseño web: landing 149 €, web 399 €; SEO local: Local 300 €/mes, Local Pro 500 €/mes) MUST list all their tier prices.

#### Scenario: drift

- WHEN a price in `services.ts` or `llms.txt` changes on one side only
- THEN the test fails naming the URL and the price

#### Scenario: priced service without prices in llms.txt

- WHEN a `## Servicios` line lists no price (software, automatizaciones, IA, tienda)
- THEN the test passes (no price to compare), but the URL must still map to a service in `services.ts`

#### Scenario: slug changes

- WHEN a `## Servicios` URL no longer matches any `slug` in `services.ts`
- THEN the test fails

## Files (layer `app`)

| Action                                          | Path                                | Symbol                                                                    |
| ----------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------- |
| create                                          | `tests/single-price-source.test.js` | -                                                                         |
| modify                                          | `tests/seo-meta-titles.test.js`     | test `home title includes Sevilla and description stays within 160 chars` |
| modify                                          | `src/data/services.ts`              | new export `tierFrom`                                                     |
| modify                                          | `src/pages/index.astro`             | frontmatter `homeDescription`; `<Layout description={homeDescription}>`   |
| unchanged unless the test finds a real mismatch | `public/llms.txt`                   | -                                                                         |

## Interfaces

`src/data/services.ts`:

```ts
/** `from` label of a named pricing tier; throws so a renamed tier fails the build. */
export function tierFrom(service: ServicePageData, tierName: string): string {
  const tier = service.pricing.tiers?.find((t) => t.name === tierName);
  if (!tier)
    throw new Error(`Pricing tier "${tierName}" not found in ${service.slug}`);
  return tier.from;
}
```

`src/pages/index.astro` frontmatter:

```ts
import { services, seoLocal, tierFrom } from "@/data/services";

const homeDescription = `Consultor SEO en Sevilla para negocios locales: aparece en Google, Maps y en las respuestas de IA. SEO local desde ${tierFrom(seoLocal, "Local")} y trato directo.`;
```

and `<Layout title="Consultor SEO en Sevilla | Nuria Romero, SEO local y para IA" description={homeDescription}>`.

## Data

No schema or storage change. `ServicePageData.pricing.tiers[].from` (`src/data/types.ts:46-48`) is the source. No migration.

## Test plan (TDD order)

Tests are source-level (regex over the files, as in `tests/seo-meta-titles.test.js`); importing the TS data from node:test is not done in this repo.

1. NRD-43, `tests/single-price-source.test.js` (RED):
   - helper `localTierFrom(servicesSrc)`: slice `export const seoLocal` to the next `export const`, match `name:\s*"Local",[\s\S]*?from:\s*"([^"]+)"` (first match, which is the `Local` tier, not `Local Pro`).
   - `index.astro` matches ``const homeDescription = `([^`]+)` ``; the template contains `${tierFrom(seoLocal, "Local")}`; the template without the `${...}` part has no `€`; replacing the expression with the extracted value equals the exact expected description; length <= 160.
   - `index.astro` has `description={homeDescription}` on `<Layout`.
   - `services.ts` has `export function tierFrom(`.
   - Update `tests/seo-meta-titles.test.js` home case: title from `<Layout\s+title="([^"]+)"`, description from the rendered `homeDescription` (same substitution helper or a local copy).
   - Implement (GREEN); `pnpm build`; compare `dist/index.html` `<meta name="description">` with production: identical.
2. NRD-44, same file:
   - parse `## Servicios` until the next `## `; per line, URL path via `https://nuriaromero\.dev(/[^)]+)`, prices via `/(\d+(?:\.\d{3})*)\s?€(\s?\/mes)?/g`.
   - for each path, slice the `export const` block containing `slug: "<path>"`; collect `from:\s*"([^"]+)"` inside its `pricing:` block into `{amount, monthly}`.
   - assert subset (each llms price in data) and completeness for `/diseno-web-sevilla/` and `/seo-local-sevilla/` (each tier price appears in llms).
   - RED proof: temporarily change `399 €` to `349 €` in `llms.txt`, see the failure, restore; record it in the PR.

## Real-browser / e2e checks

None visible. QA compares the built home `<meta name="description">` and `og:description` (if derived) with production text: byte-identical. `pnpm check:seo-15:dist` and `pnpm check:seo-09:dist` stay green.

## Risks

- `tests/seo-meta-titles.test.js` currently parses `description="..."` literally; forgetting to update it breaks the suite (covered in NRD-43).
- Regex parsing of `services.ts` is brittle to formatting; keep the patterns tolerant to whitespace and fail with clear messages. Prettier formats only edited files, so `services.ts` layout is stable.
- Euro sign spacing: data uses a non-breaking or normal space consistently ("300 €"); the regex accepts optional whitespace.

## ADRs

0003 (single `app` layer, `src/data` as single source of truth), 0004 (SEO head through `SEO.astro`), 0005 (`llms.txt` and checks), 0006 (node:test, TDD).

## UI spec

No user-facing UI change. The story touches only the home `<head>` meta description (`src/pages/index.astro`, rendered through `src/components/seo/SEO.astro`), the static `public/llms.txt`, `src/data/services.ts` (a helper, no data change) and tests. No view, component, layout, style, token or copy visible on the page changes; checklist items 1-8 are n/a.

- Visible prices must stay identical: every price shown on the home, `/seo-local-sevilla/`, `/diseno-web-sevilla/` and any other page that renders `services.ts` pricing keeps today's text, format and position (e.g. `300 €/mes + IVA`, `500 €/mes + IVA`, `149 €`, `399 €`).
- The rendered home `<meta name="description">` (and `og:description` / `twitter:description` if derived from it) stays byte-identical to today: `Consultor SEO en Sevilla para negocios locales: aparece en Google, Maps y en las respuestas de IA. SEO local desde 300 €/mes + IVA y trato directo.` The euro amount keeps the same space character it has in `services.ts` today.
- `public/llms.txt` text stays unchanged unless the new test finds a real mismatch with `services.ts`.

## Tasks

- [x] 1.1 [NRD-43 app] Build the home meta description from the `seoLocal` Local tier via `tierFrom`; tests: `tests/single-price-source.test.js` home cases and the updated `tests/seo-meta-titles.test.js` first.
- [ ] 1.2 [NRD-44 app] Guard `public/llms.txt` service prices against `src/data/services.ts`; tests: llms cases in `tests/single-price-source.test.js`, RED by a temporary price edit.
