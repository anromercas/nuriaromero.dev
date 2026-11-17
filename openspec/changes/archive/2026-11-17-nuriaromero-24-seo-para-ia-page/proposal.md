# Proposal

## Why

Tracker: [NRD-24](https://nuriaromerodev.atlassian.net/browse/NRD-24) (epic NRD-3, milestone M2 "GEO / AI visibility"). Business owners who ask how to show up in ChatGPT, Perplexity or Google's AI Overviews find no commercial page on the site: GEO only exists in the informational post `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md`. Measured national demand: "geo seo" 590/month, "seo para ia" 320, "seo ia" 320 (DataForSEO, 2026-10-09), "posicionamiento en ia" 70 (SEO report 2026-11-13); the `posicionamiento en ia` SERP is national, with no Seville-local result (ADR 0013, S3 2026-11-15).

Owner decisions of 2026-11-17 (PRD decision log, PR #97): D1 = A (the work is part of the Local Pro plan, no price of its own); D2 = "SEO para IA", slug `/seo-para-ia/`; D4 = B (editorial hero `SeoLocalHero`, "The Editorial Hero Rule" in `DESIGN.md`). D3 was answered later the same day (owner comment on NRD-24 of 2026-11-17 10:59, plan update in PR #99): an initial review with a technical GEO audit plus a fixed set of client questions asked to the main AI assistants, and a monthly follow-up that repeats them, compares with the previous month, adds AI-assistant visits and delivers a written report. Process steps 1 and 4 use that method in this story (PR #99 wording, without tool or vendor names and without figures). Choosing slug and price variant is read as acceptance of ADR 0013 proposal P1 (this change records that in ADR 0013's status).

Copy source: `odd/tasks/seo-para-ia-geo-page.md`, trimmed to the word budget. Its October architecture (`ServiceLayout` legacy blocks, `ServiceHero`, the "optional T9" hero, a new `SeoParaIaHero.astro`, price variant B) is superseded by the story criteria and by D4; this design follows `DESIGN.md` and D4, never those stale lines.

**Sprint order.** This story is first: NRD-25 (links, intent registry, `llms.txt`) is blocked by it, and NRD-26 (`check-seo-21`) is blocked by NRD-25.

## What Changes

- New page `src/pages/seo-para-ia.astro` on `ServiceLayout variant="template"`, composed only of the NRD-163 components (`src/components/seo-local/`) in the `/seo-local-sevilla/` world: editorial hero `SeoLocalHero` (small H1 with "SEO para IA", display title with one accent, page drawing in the `visual` slot) plus proof strip; bento of what is worked on (six tiles); process timeline whose byline carries the page's only link to `/` with the anchor "consultor SEO en Sevilla"; "Esta web aplica lo que te propongo" (only facts the build really has); one plan card, Local Pro, read from `seoLocal`; six sourced FAQ items; related links (filled by NRD-25); closing band and NAP. Never `ServiceHero`.
- New data entry `seoParaIa: ServicePageData` in `src/data/services.ts`, listed in `services` (header dropdown and footer, ADR 0013 "Menu and breadcrumbs") and `focusServices` (PRD section 5 lists the page as in focus; the 404 links it). Its price is `tierFrom(seoLocal, "Local Pro")`: one source, no typed figure.
- The Service JSON-LD of the page emits no `Offer` of its own: `ServicePageData` gains `ownOffer?: boolean` and `serviceSchema` accepts a missing price; every other service page renders byte-identical JSON-LD.
- New page drawings in `src/components/seo-ia/` (hero figure and bento tile art).
- `/seo-para-ia/` registered in `scripts/lib/template-pages.mjs` (`words: [750, 850]`, `service: true`), so `check-seo-17` guards it.
- ADR 0013 status updated: P1 accepted by the owner's D1/D2 answers.
- `odd/tasks/seo-para-ia-geo-page.md` marks its stale `ServiceHero` / T9 / variant B lines as superseded and points to this change.

## Capabilities

### New Capabilities

- `seo-para-ia-page`: what `/seo-para-ia/` shows and guarantees: national "SEO para IA" placement without terms owned by the home or `/seo-local-sevilla/`, the template section order with the editorial hero, a text budget, a sourced FAQ mirrored in FAQPage, no promise that an AI recommends the business, the Local Pro price read from one source with no own Offer, honest "this site applies it" claims, one link to the home with the owner anchor, and a place in the menu, sitemap and 404.

### Modified Capabilities

None. (The `serviceSchema` change keeps every existing page's output identical; no living spec describes it.)

## Out of scope

- Internal links to and from the page, `intentMatrix`/`keywordOwners`/`serviceRoutes` rows, `reciprocalLinks`, the `seo.rankTracking` page of "posicionamiento en ia" and the `public/llms.txt` entry: NRD-25.
- The build check `check-seo-21` on `dist/seo-para-ia/index.html`: NRD-26.
- A price of its own, a review or audit product, or any figure about AI visibility (D1 = A; no evidence exists).
- Naming the tools or vendors of the D3 method (geo-optimizer-skill, DataForSEO) or its internal figures (10-15 questions, 3-5 runs) on the page: internal method, not customer copy.
- Niche variants (`/seo-para-ia-clinicas/` and similar), backlinks, Search Console submission and baseline (M2 exit criterion, owner action after promotion).
- Titles, H1, H2 and meta of the home and `/seo-local-sevilla/`.

## Impact

- Code (layer `app`): `src/data/types.ts`, `src/lib/schema.ts`, `src/layouts/ServiceLayout.astro`, `src/data/services.ts`, new `src/pages/seo-para-ia.astro`, new `src/components/seo-ia/AiAnswerMock.astro` and `SeoIaTileArt.astro`, `scripts/lib/template-pages.mjs`, new `tests/seo-para-ia.test.js`, `tests/not-found-page.test.js` (six to seven focus slugs). Shared docs: `odd/tasks/seo-para-ia-geo-page.md`.
- Design docs (written by the TL in this change): `docs/adr/0013-seo-site-architecture.md` (status of P1).
- SEO: one new indexable URL in the sitemap (automatic), Service (no Offer) + FAQPage (six) + BreadcrumbList; header, footer and 404 gain one link "SEO para IA".
- Radical-change review: creating a public page is radical (invariants, DEL-7) and was approved by the owner (D1/D2, PRD decision log 2026-11-17). No price changes (Local Pro 500 €/mes + IVA is already published and is read, not written). No new dependency, external service, URL removal or CSP change.
