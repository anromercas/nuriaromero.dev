# 0014. Template section components and shared ink tokens

- Status: Accepted
- Date: 2026-11-16

## Context

The owner rule recorded in epic NRD-162 (2026-11-16) says every public page follows the structure and visual world of `/seo-local-sevilla/` ("The Annotated Storefront" in `DESIGN.md`). That page's sections live in `src/components/seo-local/*`, but they read `seoLocal` or carry their copy inline, and the ink tokens, `.band`, keyword heading, display title and serif accent are copied in every component and in the route's global style block. `tailwind.config.mjs` has an empty `theme.extend`, and the components style themselves with Astro scoped CSS, not Tailwind utilities. `ServiceLayout` fills every unfilled slot with an old-world fallback block.

## Decision

- `src/components/seo-local/` is the template section library for every public page. Folder and component names stay as they are (renaming would churn tests and history for no behaviour gain).
- A section component renders only what the page passes through typed props (types in `src/components/seo-local/types.ts`) and slots (illustrations, rich lede text, bylines). It never imports page data (`seoLocal`, `disenoWeb`...); site-wide data (`SITE`, `bookingUrl`) is allowed.
- The ink tokens are CSS custom properties in `src/styles/template.css`, with the values of the `DESIGN.md` front matter, together with `.template-ground`, `.band`, `.tpl-kw`, `.tpl-display` and `.tpl-accent`. Components import the stylesheet in their frontmatter, so it only ships on template pages. Tailwind `theme.extend` stays empty for this world.
- Every section heading goes through `SectionHeading.astro` (keyword heading as the real `h2`/`h1`, display title paragraph, at most one accent phrase).
- Pages built on `ServiceLayout` use `variant="template"`: unfilled slots render nothing and `<main>` gets `.template-ground`. Pages that are not service pages (home, contact) use `Layout` directly with the same components and put `.template-ground` on their `<main>`.
- Each template page registers its build-time contract in `scripts/lib/template-pages.mjs` (visible word range, visible FAQ equals FAQPage, Service presence), checked by `scripts/check-seo-17.mjs`. The reference page JSON-LD and heading outline are frozen by `scripts/check-seo-16.mjs` and its fixture; a story that changes the reference page on purpose regenerates the fixture in the same commit.

## Consequences

- New pages compose sections instead of copying them; design changes to a section reach every page at once, so a change to a shared component must be checked on every template page (screenshots, `check-seo-17`).
- Markup passed through slots carries the page's style scope: component rules that style slotted content use `:global()` under the component's own class.
- Designs for page stories list which sections they use, the props they pass and their `templatePages` entry; reviews reject a page that copies token values or section markup.
- Old-world shared components (`BookingButton`, `Projects`, `Breadcrumbs`, Header, Footer) are still rendered inside template pages until a later story migrates them.

## Evidence

- `src/components/seo-local/*`, `src/components/seo-local/types.ts`, `src/components/seo-local/SectionHeading.astro`, `src/components/seo-local/BentoTile.astro` (NRD-163).
- `src/styles/template.css`, `src/layouts/ServiceLayout.astro` (`variant`), `src/pages/seo-local-sevilla.astro`.
- `scripts/lib/page-contract.mjs`, `scripts/lib/template-pages.mjs`, `scripts/check-seo-16.mjs`, `scripts/check-seo-17.mjs`, `tests/template-components.test.js`.
- Design: `openspec/changes/nuriaromero-163-reusable-local-components/design.md`.
