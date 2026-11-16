# 0015. Word budgets measure owner-controlled text

- Status: Accepted
- Date: 2026-11-16

## Context

ADR 0014 gives every template page a visible word range in `<main>`, checked on `dist/` by `scripts/check-seo-17.mjs` through `mainWordCount` (`scripts/lib/page-contract.mjs`). Local and CI builds run without the Google Places variables, so the live review quote of `RealProof` is absent there, while production shows a real review of unbounded length. The check therefore measured a page that is not the one published (NRD-167 QA and review, NRD-212). A real review cannot be trimmed or edited (PRD principle "Real proof only").

## Decision

- A word budget measures only the text the owner controls.
- Live third-party content rendered at build time (today: the Google review quote of `RealProof`) carries the attribute `data-word-budget="exclude"` on the element that wraps the whole block, and `mainWordCount` removes every marked element with its subtree before counting.
- The marker is never placed on owner copy. Bounded live strings that are part of a section's own layout (the `ProofStrip` rating cell) stay counted unless a story decides otherwise.
- `parsePage` and the URL inventory keep counting all visible text.

## Consequences

- A page measures the same in CI and in production; ranges in `scripts/lib/template-pages.mjs` mean owner text.
- A new live embed that should not count needs only the marker, not a check change; reviews reject the marker on owner copy.
- Word counts reported by the inventory and by `check-seo-17` can differ on pages with a live quote; that is intended.

## Evidence

- `scripts/lib/page-contract.mjs` (`WORD_BUDGET_EXCLUDE`, `withoutWordBudgetExcluded`, `mainWordCount`), `src/components/seo-local/RealProof.astro` (`figure.quote`), `scripts/lib/template-pages.mjs` (header comment), `tests/page-contract.test.js`, `tests/template-components.test.js` (NRD-212).
