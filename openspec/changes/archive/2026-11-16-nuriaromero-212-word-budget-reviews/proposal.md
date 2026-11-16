# Proposal

## Why

Tracker: [NRD-212](https://nuriaromerodev.atlassian.net/browse/NRD-212) (epic NRD-162, milestone M4). The M4 exit criterion is that every template page keeps the visible words of its `<main>` inside the range set in its story. `scripts/check-seo-17.mjs` measures `dist/`, but local and CI builds run without the Google Places variables, so `RealProof` (`src/components/seo-local/RealProof.astro:28-52`) renders no review quote there. In production the quote is present: the full text of a real review (unbounded length), author, relative date and "Ver todas las reseñas en Google". The guard measures a page that is not the one published. PO decision: the budget measures the text Nuria controls; a real review is never trimmed or edited (PRD principle "Real proof only"), so it is excluded explicitly and testably, not by accident of the build environment.

## What Changes

- The review quote `figure` of `RealProof` carries the marker attribute `data-word-budget="exclude"`.
- `mainWordCount` (`scripts/lib/page-contract.mjs`) removes every element carrying that marker (with its whole subtree) before counting. `parsePage` (`scripts/lib/seo-inventory.mjs`) and the URL inventory keep counting all visible text.
- The header comment of `scripts/lib/template-pages.mjs` states that the `words` range excludes the live review quote.
- ADR 0015 records the rule: word budgets measure owner-controlled text; live third-party content is excluded by an explicit marker.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `page-template`: the build-time contract measures the word budget without content marked as live third-party content.

## Out of scope

- Trimming or editing review text; changing the word ranges or copy of pages already delivered.
- The live Google rating cell of `ProofStrip` ("4,9 en Google / N opiniones", at most about five words, bounded): not named by the story; it stays counted. Noted for the PO as a possible follow-up.
- NRD-211 (format hook scope, draft PR #71).

## Impact

- Code: `scripts/lib/page-contract.mjs`, `src/components/seo-local/RealProof.astro`, `scripts/lib/template-pages.mjs`, `tests/page-contract.test.js`, `tests/template-components.test.js`, `docs/adr/0015-word-budget-owner-text.md` and the ADR index.
- No visible change on any page (an extra `data-*` attribute only); no SEO, JSON-LD, URL, dependency or CSP change. Not radical.
- Sprint order: lands before NRD-169, NRD-170, NRD-172 and NRD-173, whose ranges are measured with this method.
