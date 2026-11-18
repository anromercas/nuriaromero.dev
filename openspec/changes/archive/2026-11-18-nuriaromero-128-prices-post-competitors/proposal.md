# Proposal

## Why

Tracker: [NRD-128](https://nuriaromerodev.atlassian.net/browse/NRD-128) (phase 5 step 9b of ADR 0013; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 9b"; epic NRD-4, milestone M3). `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` owns `cuanto cuesta una pagina web en sevilla` (`keywordOwners`, step 0; no measured volume; four price questions in People Also Ask) and is now indexed (URL Inspection 2026-11-17). Price queries still land on `/diseno-web-sevilla/`. The post's title and H1 work the term, but the description does not, five of six sections fail the direct-answer rule (two leads of 48 and 50 words, one of 6 words, one numbered list, one of 3 sentences), the intro talks about the absence of a market study instead of answering, and there is no update date. SEO-2 has a registered SERP (S10, 2026-11-15: three service pages, one price list, price guides `hostinger.com` and `ideandoazul.com`) but no URLs and no word counts; the post has no CWV baseline. The user decision S-2026-11-13-1 (prices in the blog post) is still open, so no figure may be added or changed (SEO-4, PO constraint).

## What Changes

- **Evidence first (SEO-2, DEL-6).** One DataForSEO SERP call (S10 kept no URLs) plus at most five main-content word counts of the ranking price guides and price lists; subtopic table and gap list; Lighthouse baseline before editing. Competitor price figures may be noted in the evidence document, never in the post.
- **SEO-1.** Description rewritten to work the term; the `intentMatrix` `descriptionSignal` follows it. Title, H1 and URL unchanged.
- **GEO-1.** Every H2 section opens with a direct answer of one or two sentences and 15 to 45 words; the intro answers instead of apologising.
- **Gaps.** At most two new H2 sections from the measured gap list, qualitative only (design candidates: recurring yearly costs; what changes between a simple site, a corporate site and an online store).
- **SEO-4 guard.** A test fails if the post body gains any number outside today's set {2, 5, 75, 10} or any euro sign or currency word. The post points to the published fixed price on `/diseno-web-sevilla/` without writing the figure.
- **SEO-6.** The body keeps its links to `/diseno-web-sevilla/` (pair already in both directions).
- **Freshness.** `updatedDate` = date of the content commit.
- **Guards.** New `tests/price-post-intent.test.js` (reuses `tests/helpers/post-sections.js` from NRD-127); post baseline regenerated in the same commit.

## Capabilities

### New Capabilities

- `web-price-guide-post`: what the price guide guarantees (intent signals, direct answers, no price figures, hub link, real update date, evidence behind the edit).

### Modified Capabilities

None. (The baseline rule for intentional post edits is modified by NRD-127 in `blog-post-layout`; archive order NRD-127, then NRD-128.)

## Out of scope

- Adding, changing or quoting any price figure in the post, `services.ts`, `llms.txt` or JSON-LD (S-2026-11-13-1 open; radical per invariants).
- Title, H1, slug or URL changes; merging or removing the post.
- `/diseno-web-sevilla/` copy (the price queries' current landing page).
- Owner actions: none needed to develop the story.

## Impact

- Code (layer `app`): `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md`, `src/data/seo-intents.ts` (one signal), new `tests/price-post-intent.test.js`, regenerated `tests/fixtures/blog-posts.baseline.json`; docs `docs/seo-audit/keyword-clusters-2026-11.md`, `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`.
- Built outputs that follow: `Article` JSON-LD, sitemap `lastmod`, RSS item. `public/llms.txt` entry stays accurate.
- Blocked by NRD-127 (helper and baseline); ships in the same promotion. DataForSEO: at most 6 calls. No dependency, URL, price or CSP change. Not radical.
