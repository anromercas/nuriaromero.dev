# 0003. Single `app` layer with `src/data` as the single source of truth

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

The site has no backend, domain model or persistence: every change is pages, components, data, client scripts or build checks, and they ship together. What does need protection is consistency of business facts (NAP, prices, services, trust signals), because the same fact appears in copy, metadata and JSON-LD and Google penalises inconsistent NAP.

## Decision

- One layer, `app`, owns `src/**`, `public/**`, `tests/**`, `scripts/**` and the root config files. Subtasks are not split by layer.
- Inside it the folders keep their roles: `src/pages` (routes, thin), `src/layouts` (page shells), `src/components` (UI, grouped by surface: `seo`, `seo-local`, `services`), `src/data` (facts and page data), `src/lib` (pure builders and build-time fetchers), `src/scripts` (client scripts), `src/content` (blog collection).
- Business facts live once in `src/data/*.ts`: NAP and contact in `site.ts`, service and niche page data in `services.ts` and `niches.ts` typed by `ServicePageData` (`types.ts`), intents and routes in `seo-intents.ts`, internal links in `internal-links.ts`, trust signals with a verification status in `local-trust.ts`. Pages, layouts and `src/lib/schema.ts` import them.
- Service and niche pages are a data object rendered by `ServiceLayout`, not bespoke markup.

## Consequences

- Changing a price, phone or address is one edit in `src/data`, and copy, metadata and JSON-LD follow.
- Files that cannot import TypeScript (`public/llms.txt`, static HTML) duplicate facts by hand; build checks guard some of them (ADR 0005).
- A second layer (for example a CMS or an API) is a layering change and needs the user.

## Evidence

- `.claude/harness.json` `layers.app.paths`.
- `src/data/site.ts` ("Fuente única de verdad de los datos del negocio"), `src/data/types.ts` (`ServicePageData`), `src/data/services.ts`, `src/data/niches.ts`, `src/data/seo-intents.ts`, `src/data/internal-links.ts`, `src/data/local-trust.ts` (`TrustStatus`).
- `src/pages/automatizaciones.astro` and the other service/niche pages: `<ServiceLayout page={...} />`.
- `src/lib/schema.ts` imports `SITE`; `scripts/check-seo-07.mjs`, `check-seo-10.mjs`, `check-seo-11.mjs` import `src/data/*.ts` as the reference.
