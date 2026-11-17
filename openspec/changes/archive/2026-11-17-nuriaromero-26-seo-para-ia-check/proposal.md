# Proposal

## Why

Tracker: [NRD-26](https://nuriaromerodev.atlassian.net/browse/NRD-26) (epic NRD-3, milestone M2). Later edits could add, without anyone noticing, a promise, a second H1, an own `Offer` or wording that cannibalises the home on `/seo-para-ia/`. Other key pages already have build guards (`scripts/check-seo-*.mjs`, run by CI `verify` through `pnpm check:seo:dist`). The M2 exit criterion asks for the page's `dist/` check passing.

**Dependencies.** Blocked by NRD-24 (`openspec/changes/nuriaromero-24-seo-para-ia-page/`, the page) and NRD-25 (`openspec/changes/nuriaromero-25-seo-para-ia-links/`, the `llms.txt` entry the check asserts). Cut or rebase this branch after both merge into `develop`.

## What Changes

- New pure module `scripts/lib/seo-para-ia-contract.mjs` that returns every contract failure for the built page, its sitemap and `llms.txt`.
- New `scripts/check-seo-21.mjs` (next free number) that reads `dist/seo-para-ia/index.html`, `dist/sitemap-0.xml` and `dist/llms.txt`, prints every failure and exits 1, or prints a pass line. Contract: one `<h1>` containing "SEO para IA"; canonical `https://nuriaromero.dev/seo-para-ia/`; JSON-LD with `Service`, `FAQPage` and `BreadcrumbList` and a `Service` without `offers`; "consultor" only inside the single `<a href="/">consultor SEO en Sevilla</a>`; no promise wording; the URL in the sitemap; the entry in `llms.txt` under "## Servicios".
- `package.json`: `check:seo-21` (`pnpm build && node scripts/check-seo-21.mjs`) and `check:seo-21:dist`, and `node scripts/check-seo-21.mjs` appended to `check:seo:dist`, so CI `verify` runs it (no workflow change: `ci.yml` already runs `pnpm check:seo:dist`).

## Capabilities

### New Capabilities

None. (The requirement below extends `seo-para-ia-page`, created by NRD-24's change; archive order NRD-24, NRD-25, NRD-26.)

### Modified Capabilities

- `seo-para-ia-page`: adds the build-time guard (ADDED requirement).

## Out of scope

- After promotion to production (owner-account actions, M2 exit criterion, not in this story): URL inspection and indexing request in Search Console and the Search Console baseline for the page's queries.
- Changing the page, its data, other checks or the CI workflow.

## Impact

- Code (layer `app`): new `scripts/lib/seo-para-ia-contract.mjs`, new `scripts/check-seo-21.mjs`, `package.json` (three script entries), new `tests/seo-para-ia-check.test.js`. `tests/package-scripts.test.js` enforces the scripts automatically once the file exists.
- CI: `verify` runs one more check through the existing `pnpm check:seo:dist` step; `ci.requiredChecks` unchanged.
- No dependency, URL, price or CSP change. Not radical.
