## Why

Tracker: [NRD-278](https://nuriaromerodev.atlassian.net/browse/NRD-278).

NRD-243 changed the home's contextual anchor to `/portfolio/` from "casos de éxito de webs para negocios en Sevilla" to "casos de éxito de webs para negocios locales" (`src/data/internal-links.ts:16`, `/` source only). ADR 0013, the source of the internal-linking and keyword-ownership rules, still lists the old anchor in row 5 of table A (`docs/adr/0013-seo-site-architecture.md:171`). A developer following the ADR could "fix" the data back and add one more "Sevilla" to a home that sits at its cap of 14 (guard from NRD-277).

## What Changes

- ADR 0013 table A, row 5 (`/` → `/portfolio/`): anchor becomes the published "casos de éxito de webs para negocios locales", with a short note in the Reason column that it changed with NRD-243 (2026-11-17) to keep the home's "Sevilla" cap. The ADR Status line records the amendment.
- `tests/adr-0013-link-rows.test.js` gains a doc-sync test: it parses table A rows 1-11 from the ADR and asserts source, target and anchor equal the test's `rows` array, which is already pinned to `internalLinksBySource`. ADR and data can no longer drift silently.
- Optional: one line at the end of `docs/designs/NRD-119-registry-link-rows.md` pointing to ADR 0013 for the current row 5 anchor.

## Out of scope

- Row 4 (`/diseno-web-sevilla/` → `/portfolio/`): unchanged, it already matches the published anchor (`src/data/internal-links.ts:31`).
- Rewriting `docs/designs/NRD-119-registry-link-rows.md` (historical record, PRD section 11).
- Any change under `src/`, `public/` or `scripts/`; any other ADR row or table.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. Documentation and a test only; no site behavior changes (`skip_specs: true`).

## Impact

- `docs/adr/0013-seo-site-architecture.md`, `tests/adr-0013-link-rows.test.js`, optionally `docs/designs/NRD-119-registry-link-rows.md`.
- No dependency, URL, copy, schema or data change; nothing radical.
