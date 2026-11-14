# 0012. Keyword ownership registry in `src/data/seo-intents.ts`

- Status: Accepted
- Date: 2026-11-14

## Context

Several pages can compete for the same Seville head terms: the home, `/seo-local-sevilla/`, the service pages and the blog. `intentMatrix` in `src/data/seo-intents.ts` records the role of each URL and the signals its title, H1 and copy must carry (`scripts/check-seo-07.mjs`). It does not say which page owns a given search query. Ownership decisions such as "consultor SEO" for the home (SEO-28) were spread across tests and task docs, so a new story could target a term already owned elsewhere without any check failing (NRD-33, NRD-34).

## Decision

- `src/data/seo-intents.ts` exports `keywordOwners: KeywordOwner[]` (`{ keyword, url }`), one row per head term, with the keyword written as tracked in `seo.rankTracking` (lowercase).
- A term has exactly one owner page. Only the owner targets it in `<title>`, H1 or an H2. Other pages may mention it in running copy or link to the owner.
- `tests/keyword-ownership.test.js` enforces uniqueness (after lowercase, accent and whitespace normalisation) and that each owner URL is a real route in the trailing-slash form.
- A story that retargets a page adds or moves the row in the same change. Moving a term between pages is an SEO decision for the PO and is recorded in the story.

## Consequences

- Cannibalization decisions become reviewable data instead of tribal knowledge. `seo-review` checks a diff against the registry.
- The registry is a guardrail, not proof of ranking (invariant "No promised rankings"). Search Console validation stays in NRD-22.
- Pre-existing overlaps found when terms are registered (for example the home H2 "Posicionamiento web en Sevilla: cómo trabajo" against the `/seo-local-sevilla/` ownership) are flagged to the PO, not silently fixed.

## Evidence

- `src/data/seo-intents.ts` (`intentMatrix`, `keywordOwners`)
- `tests/keyword-ownership.test.js`
- `scripts/check-seo-07.mjs` (intent signals on `dist/`)
- `docs/designs/NRD-33-posicionamiento-web-sevilla.md`
