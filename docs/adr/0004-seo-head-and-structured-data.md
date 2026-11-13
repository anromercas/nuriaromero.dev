# 0004. SEO head and JSON-LD through `src/components/seo` and `src/lib/schema.ts`

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

The site lives on local search and AI answers. Title, description, canonical, Open Graph and structured data must be correct and consistent on every page, and entities (business, person, website) must cross-reference each other by `@id`.

## Decision

- Every page renders through `Layout.astro`, directly or via `ServiceLayout`, `BlogPostLayout` or `LegalLayout`. Only `Layout.astro` writes `<html>`/`<head>`.
- `Layout` passes `title`, `description`, `canonical`, `ogImage`, `ogType` and `noindex` to `src/components/seo/SEO.astro`, the only place that writes `<title>`, meta description, canonical, robots meta, Open Graph and Twitter tags. Canonical defaults to `Astro.url.pathname` resolved against `site`.
- JSON-LD is built by pure functions in `src/lib/schema.ts` (`localBusinessSchema`, `websiteSchema`, `personSchema`, `serviceSchema`, `faqSchema`, `articleSchema`, `breadcrumbSchema`, `reviewsSchema`) from `src/data`, and emitted only by `src/components/seo/Schema.astro`. Several entities in one call are wrapped in a single `@graph`.
- `Layout` always emits `LocalBusiness` + `WebSite`; layouts add page entities through the `head` slot (`<Schema slot="head" ...>`).

## Consequences

- A new page type adds a layout or reuses one; it never writes its own head tags or `ld+json` script.
- A new schema type is a new builder in `src/lib/schema.ts` reading `src/data`, covered by a test or a `check-seo` script.
- Structured data text stays in Spanish (ADR 0008) and only states verifiable facts (`local-trust.ts` status).

## Evidence

- `src/layouts/Layout.astro` (`<SEO ... />`, `<Schema schema={[localBusinessSchema(), websiteSchema()]} />`, `<slot name="head" />`).
- `src/components/seo/SEO.astro`, `src/components/seo/Schema.astro` (SEO-25 `@graph` comment).
- `src/lib/schema.ts` exports; `src/layouts/ServiceLayout.astro`, `BlogPostLayout.astro`, `LegalLayout.astro` (`<Schema slot="head" ...>`).
- No `<title>`, canonical or `application/ld+json` outside `src/components/seo/` in `src/` (checked at adoption).
- `scripts/check-seo-02.mjs` (breadcrumbs), `scripts/check-seo-05.mjs`.
