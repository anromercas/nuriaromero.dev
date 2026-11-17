## Why

Tracker: [NRD-243](https://nuriaromerodev.atlassian.net/browse/NRD-243).

The home's visible `<main>` text repeats "Sevilla" 22 times (Tech Lead and PO count on `dist/index.html`, 2026-11-17). Many repetitions are gratuitous editorial copy (section headings, a portrait caption that repeats the hero subtitle, the projects intro), which reads as keyword stuffing and lowers citability; title, H1, schema, NAP and the owner-page anchors already give the local signal. The PO replaced the density criterion with an absolute cap: at most 14 occurrences, measured after NRD-245.

## What Changes

- Nine of the ten editable occurrences listed in the story are reworded or removed. That leaves 13 occurrences, one below the cap, as slack for NRD-245's home answers. The one kept is the shared proof stat "2 webs en Sevilla" (`SITE_PROOF`, used by nine pages). The twelve protected occurrences stay as they are.
- The shared project descriptions drop the redundant ", Sevilla" after "barrio del Cerro del Águila" (visible on `/` and `/portfolio/`).
- The home's link to `/portfolio/` uses the anchor "casos de éxito de webs para negocios locales" (only the `/` source; other pages keep theirs).
- New build-time guard: the home's template contract carries a term cap (`sevilla` ≤ 14), counted on visible `<main>` text without the live review, case- and accent-insensitive, checked by `scripts/check-seo-17.mjs`.

## Out of scope

- The 12 protected occurrences (H1, hero subtitle, owner-page anchors, restaurant niche anchor, real project titles, the quoted real keyword, NAP address), title, meta description, JSON-LD, `areaServed`.
- `SITE_PROOF` and every other page's copy (except the shared project descriptions accepted by the PO).
- Density metrics and stopword lists.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `home-page`: the home caps the repetitions of the city name in its visible text.

## Impact

- `src/pages/index.astro` (copy props), `src/data/internal-links.ts` (one anchor), `src/components/Projects.astro` (two descriptions), `scripts/lib/page-contract.mjs`, `scripts/lib/template-pages.mjs`, `scripts/check-seo-17.mjs`, `tests/page-contract.test.js`, `tests/home-template.test.js` (one copy literal updated to the new caption, same assertion).
- Depends on NRD-245 (blocks this story): build and measure on a branch that includes NRD-245's home answers.
- No dependency, URL, price or schema change; nothing radical.
