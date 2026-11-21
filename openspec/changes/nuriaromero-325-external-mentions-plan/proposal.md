## Why

Tracker: [NRD-325](https://nuriaromerodev.atlassian.net/browse/NRD-325).

AI assistants weigh third-party mentions of a brand heavily, and low domain authority is PRD problem #1. A baseline already exists (`docs/designs/NRD-21-backlink-baseline-outreach.md`, figures in `docs/seo-audit/authority-backlink-register.md`, "Línea base 2026-11-14") and NRD-72 holds the first outreach with 5 verified opportunities, deferred by the owner. What is missing is a ranked target list, a small set of tactics and a 90-day plan the owner can approve.

## What Changes

- New research document `docs/research/NRD-325-mentions-plan.md`: delta versus the NRD-21 baseline (referring domains and brand mentions, every figure with source and call date), at least 20 ranked targets, 3 tactics with effort and expected return stated as hypotheses, options that cost money listed for the owner, a 90-day plan that starts with NRD-72, a DataForSEO call log (at most 30 calls) and proposed follow-up stories in prose.

## Out of scope

- Sending outreach or contacting anyone; creating accounts or profiles.
- Committing to anything paid (sponsorship, paid listings, association fees): options only (PRD section 9).
- Filing follow-up stories (PO, after the owner approves the tactics).
- Redoing the NRD-21 baseline; any change under `src/` or `public/`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. Documentation only (`skip_specs: true`).

## Impact

- One new file `docs/research/NRD-325-mentions-plan.md` (layer `app`, `docs/**`).
- DataForSEO spend within `seo.dataforseo.maxCallsPerRun` (30 calls).
- No dependency, URL, copy, schema or data change; nothing radical.
