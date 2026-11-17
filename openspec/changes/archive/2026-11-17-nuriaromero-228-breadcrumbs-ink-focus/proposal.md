# Proposal

## Why

Tracker: [NRD-228](https://nuriaromerodev.atlassian.net/browse/NRD-228) (epic NRD-162, milestone M4). The breadcrumbs render on `/blog/`, every post, `/portfolio/`, `/recursos/`, `/contacto/`, `/sobre-mi/`, every `ServiceLayout` page and every `LegalLayout` page, but `src/components/Breadcrumbs.astro` still carries the pre-M4 gray Tailwind palette (`text-gray-400`, `text-gray-200`, `hover:text-blue-500`) and no focus style of its own, so keyboard focus relies on the browser default over the ink ground. It is the last element of the in-focus pages outside the `/seo-local-sevilla/` visual world (follow-up LOW of the NRD-221 / NRD-222 reviews).

## What Changes

- `Breadcrumbs.astro` imports the shared ink tokens (`src/styles/template.css`, ADR 0014) and styles text, separator, links and the current item with them; no `gray-*` or `blue-*` class remains.
- Links reuse the shared `.tpl-link` rule (body text, sky underline, sky hover, 2px sky `:focus-visible` outline), so the focus indicator is the same as every other template text link.
- The current item wraps long post titles (`overflow-wrap: anywhere`) so the trail never overflows at 320 px.
- Same props, same markup semantics: `aria-label="Miga de pan"`, `aria-current="page"`, the decorative separator `aria-hidden`, the trailing-slash URLs passed by callers; the BreadcrumbList JSON-LD is untouched.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `page-template`: adds a requirement for the shared breadcrumbs in the ink world with a visible focus.

## Out of scope

- The BreadcrumbList JSON-LD (`breadcrumbSchema` in `src/lib/schema.ts`) and the breadcrumb items each page passes.
- Restyling `LegalLayout`, `ServiceLayout` (default variant) or any other legacy block around the breadcrumbs.
- The `.tpl-link` rule itself (reused as is).

## Impact

- Code (layer `app`): `src/components/Breadcrumbs.astro`, new `tests/breadcrumbs-ink.test.js`.
- `template.css` now also ships on pages that did not import it (`/contacto/`, `/sobre-mi/`, `/portfolio/`, legal pages, default `ServiceLayout`): a few KB of tokens and shared classes, no visual effect beyond the breadcrumbs.
- No URL, schema, copy, dependency, CSP or Netlify change. Not radical.
