# Proposal

## Why

Tracker: [NRD-127](https://nuriaromerodev.atlassian.net/browse/NRD-127) (phase 5 step 9a of ADR 0013; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 9a"; epic NRD-4, milestone M3). `/blog/como-aparecer-en-google-maps-negocio-sevilla/` owns `como aparecer en google maps` (110 searches a month, `keywordOwners`, step 0) and is the main spoke of `/seo-local-sevilla/`. It is now indexed (URL Inspection 2026-11-17, after G1a NRD-113 and the owner's indexing request). Its title and H1 already work the term, but the description does not name Google Maps, four of nine sections do not open with a direct answer (one opens with a numbered list, two with a lead of 8 and 12 words, "Respuesta corta" runs 51 words), the body never links to the hub (only the related block does), and there is no update date. SEO-2 today rests on three domains (`blog.mareaalcalina.com`, `seonet.com.ar`, `palbin.com`, S5 2026-11-13) and no competitor word count; the post has no CWV baseline.

## What Changes

- **Evidence first (SEO-2, DEL-6).** One DataForSEO SERP call plus at most five main-content word counts of the ranking guides; a subtopic coverage table and a gap list; a Lighthouse baseline of the post before editing. No length target unless the sample is measured, and even then the post grows only by sections that close a named gap.
- **SEO-1.** Description rewritten to work the term and keep "Perfil de Empresa" (the `intentMatrix` signal). Title, H1 and URL unchanged.
- **GEO-1.** Every H2 section opens with a direct answer of one or two sentences and 15 to 45 words.
- **Gaps.** At most two new H2 sections, only for gaps in the measured list or the People Also Ask, each with an official Google source (design candidate: "¿Por qué no aparece mi negocio en Google Maps?").
- **SEO-6.** A contextual body link to the hub `/seo-local-sevilla/`; the related block and the reciprocal pair stay.
- **Freshness.** `updatedDate` set to the date of the content commit, so the visible "Actualizado el" label, `Article.dateModified` and the sitemap `lastmod` show the real change.
- **Guards.** New `tests/maps-post-intent.test.js` with a shared Markdown helper `tests/helpers/post-sections.js` (reused by NRD-128); the post baseline `tests/fixtures/blog-posts.baseline.json` regenerated in the same commit, as `scripts/check-seo-18.mjs` prescribes.

## Capabilities

### New Capabilities

- `maps-guide-post`: what the Google Maps guide guarantees (intent signals, direct answers, hub link, honest claims, real update date, evidence behind the edit).

### Modified Capabilities

- `blog-post-layout`: the post baseline is a regression guard, not a content freeze; a story that edits a post on purpose regenerates it in the same commit (MODIFIED "The post text is unchanged by the layout" and "Search signals and structured data are unchanged").

## Out of scope

- Title, H1, slug or URL changes; merging or removing the post (would need the user).
- Any figure, price or promise of position; FAQPage on posts; images.
- The price post (NRD-128) and the other posts.
- Owner actions: none needed to develop the story.

## Impact

- Code (layer `app`): `src/content/blog/como-aparecer-en-google-maps-negocio-sevilla.md`, new `tests/helpers/post-sections.js`, new `tests/maps-post-intent.test.js`, regenerated `tests/fixtures/blog-posts.baseline.json`; docs `docs/seo-audit/keyword-clusters-2026-11.md`, `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`.
- Built outputs that follow automatically: `Article` JSON-LD, sitemap `lastmod`, RSS item, `/blog/` freshness. `public/llms.txt` entry stays accurate (it describes the same guide).
- Ships with NRD-128 in the same promotion (PO, principle 5); NRD-127 blocks NRD-128 (shared helper and baseline file). DataForSEO: at most 6 calls. No dependency, URL, price or CSP change. Not radical.
