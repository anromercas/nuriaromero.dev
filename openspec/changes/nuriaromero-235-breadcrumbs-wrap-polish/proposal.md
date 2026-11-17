# Proposal

## Why

[NRD-235](https://nuriaromerodev.atlassian.net/browse/NRD-235): LOW review follow-ups of NRD-228 (breadcrumbs in the ink world, PR #87). The breadcrumbs render on every service, legal, blog, contact, about, resources and portfolio page, so a small flaw repeats site-wide:

- `.crumbs-current` in `src/components/Breadcrumbs.astro` does not declare `cursor: default`, which the NRD-228 UI spec names.
- `.crumbs ol` uses `gap: 0.25rem 0.5rem`: about 4 px between rows when the trail wraps on mobile, against a 6 px focus ring extent (`outline: 2px` + `outline-offset: 4px` on `.tpl-link:focus-visible`), so a focused link's ring can overlap the neighbouring row.
- `tests/breadcrumbs-ink.test.js` checks text contrast on the ink and site grounds, but not on the purple radial backdrop of `src/layouts/Layout.astro` behind the non-template pages that use the breadcrumbs.

## What Changes

- The current item gets `cursor: default`.
- The row gap of the trail grows to `0.375rem` (at least 6 px, the focus ring extent); the column gap stays `0.5rem`, so a single-line trail looks the same.
- The contrast test also covers muted, secondary and link text (and the sky focus ring) on the lightest colour of the purple radial, composited over the site ground.

## Capabilities

### Modified Capabilities

- `page-template`: requirement "Breadcrumbs render in the ink world with a visible focus" (MODIFIED) gains the purple-radial contrast; new requirement "Breadcrumbs keep the current item inert and wrapped rows clear of the focus ring" (ADDED) holds the default cursor and the row gap rule.

## Impact

- `src/components/Breadcrumbs.astro` (scoped `<style>` only), `tests/breadcrumbs-ink.test.js`. Layer `app`.
- No copy, markup, URL, JSON-LD or head change; `check-seo-*` unaffected.
- No radical change.

## Out of scope

- Restyling the breadcrumbs, changing tokens or the focus ring itself.
- Changing the Layout backdrop or any page ground.
- Computing contrast across the whole gradient (only its lightest point, the worst case, is checked).
