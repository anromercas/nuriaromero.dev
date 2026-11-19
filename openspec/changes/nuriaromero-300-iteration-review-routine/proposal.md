## Why

[NRD-300](https://nuriaromerodev.atlassian.net/browse/NRD-300): when the first data-backed SEO review (NRD-78, not before 2026-12-14) arrives there is no written routine saying what to look at per owner page, with which source and what to decide; `docs/seo-audit/measurement-seo.md` only has a generic cadence ("Cadencia y registro de cambios"). Split from NRD-78 by the owner on 2026-11-19, this is the part that does not depend on waiting: the routine plus a guard that the tracked keywords keep matching the keyword ownership map.

## What Changes

- New section `## Revisión de iteración` in `docs/seo-audit/measurement-seo.md` (Spanish, like the rest of the document): cadence, the per-owner-page comparison against the NRD-17 baselines, a review record template reusing the existing annotation template, a mandatory per-page decision (keep, adjust, escalate) and a control step for tracked keywords versus `keywordOwners`.
- New pure function `untrackedOwners(owners, trackedRows)` in `scripts/lib/keyword-ownership.mjs`.
- `tests/rank-tracking-keywords.test.js` checks every `keywordOwners` term (not only `/seo-para-ia/`) is in `seo.rankTracking.keywords` with the same page.
- New `tests/iteration-review-routine.test.js` checks the section exists and names every owner URL.

## Capabilities

### New Capabilities

- `seo-iteration-review`: the written per-owner-page iteration review routine and the guard that rank tracking follows the keyword ownership map.

### Modified Capabilities

None.

## Impact

- Docs: `docs/seo-audit/measurement-seo.md` (layer `app`).
- Scripts and tests: `scripts/lib/keyword-ownership.mjs`, `tests/rank-tracking-keywords.test.js`, `tests/iteration-review-routine.test.js` (layer `app`).
- `.claude/harness.json` is read by the test, never edited (AC 4). No change to the published site, no dependency, no radical change.

## Out of scope

- Running the first review or reading any data (NRD-78).
- Proposing or adding tracked keywords: the 12 `keywordOwners` terms are already tracked with their owner pages, plus `tienda online sevilla` as navigational reference (ADR 0013).
- Any change to `.claude/harness.json`, `src/data/seo-intents.ts` or public pages.
