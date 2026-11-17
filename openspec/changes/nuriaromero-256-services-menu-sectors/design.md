# Design: Services menu with grouped services only, niche pages in the footer "Por sector"

## Context

See proposal.md - Why. Current state on `develop` (after NRD-24 and NRD-25):

- `src/components/Header.astro:43-48` builds `dropdownItems` from `[...services, ...niches]` (12 entries: 8 from `services`, including `capilarLocal`, plus 4 niches) and derives `isServiciosActive` from them. The same list feeds the desktop dropdown (`group-hover` / `group-focus-within`) and the mobile accordion (`#mobile-submenu-servicios`, links `min-h-12`). `src/scripts/header-mobile-menu.js` only toggles `.mobile-accordion-btn` / panel and does not depend on the list.
- `src/components/Footer.astro` renders "Servicios" from `services` (so it lists capilares too) and "Webs por sector" from `niches`.
- `src/data/services.ts:911-920` `services` = seoLocal, seoParaIa, capilarLocal, disenoWeb, desarrolloSoftware, automatizaciones, inteligenciaArtificial, tiendaOnline. It is read by `tests/single-price-source.test.js` (llms.txt prices by slug), `tests/seo-para-ia.test.js:242` (order), `tests/tienda-online-template.test.js`, and as a source string by `scripts/check-capilar-local.mjs:44`. `focusServices` (lines 923-931) already holds the seven menu services in the required order.
- `src/data/internal-links.ts` already maps `/diseno-web-sevilla/` to the four niche pages and `/seo-local-sevilla/` to the four niche pages and `/seo-para-clinicas-capilares-sevilla/`; both pages render the map through `SeoLocalRelated` (`src/pages/diseno-web-sevilla.astro:194`, `src/pages/seo-local-sevilla.astro:270`), and `scripts/check-seo-06.mjs` verifies every mapped link is rendered inside `<main>` of the built page.
- ADR 0013 "Menu and breadcrumbs" says the menu is built from `services` and `niches` and that parked pages stay listed. The PO now decides, in this story, to move sector pages from the dropdown to the footer; they remain public and linked, so no page is removed (PRD section 9 is not triggered).

## Goals / Non-Goals

**Goals:**

- One data module owns the navigation classification; Header and Footer only render it.
- Desktop and mobile menus show the two headed groups with no sector page, keeping keyboard access, `aria-current` and 44 px touch targets.
- A test fails if a niche page re-enters the menu or a sector page loses its parent link.

**Non-Goals:**

- Touching the `services`, `focusServices` or `niches` arrays, page data, page bodies, JSON-LD, `llms.txt`, redirects or check-seo scripts.
- New menu interactions (Escape on desktop, click-to-open) or a visual redesign beyond adding group headings (the UI spec, if added by the ux-designer, governs the visual detail).

## Decisions

### Approach

Add `src/data/navigation.ts`, which imports the page objects from `services.ts` and `niches.ts` and exports the two service groups, a flattened list of the menu services and the list of sector pages, each entry reduced to `{ title: breadcrumbName, url: slug }`. Header renders each group as a non-interactive heading plus a list labelled by it, in both the desktop dropdown and the mobile accordion, and derives the active state from the flattened services. Footer renders "Servicios" from the flattened services and "Por sector" from the sector list. The `services` array stays as the registry of all service-template pages (prices, llms.txt tests) so the change does not ripple through a dozen tests; a comment there points to `navigation.ts` for menus.

Alternatives considered: (a) moving `capilarLocal` from `services.ts` to `niches.ts` and from the `services` array into `niches`: breaks `single-price-source` (llms.txt maps slugs through `services`), `check-capilar-local` and source-slicing tests (`seo-local-*` slice up to `export const capilarLocal`), for no user-visible gain; (b) a `navGroup` field on `ServicePageData`: spreads presentation data across 12 page objects and still needs ordering logic in the component. Explicit ordered lists in one module are simpler to read and test.

### Files

| Action | Path | Symbols | Layer |
| --- | --- | --- | --- |
| create | `src/data/navigation.ts` | `NavLink`, `ServiceMenuGroup`, `serviceMenuGroups`, `serviceMenuLinks`, `sectorLinks` | app |
| create | `tests/site-navigation.test.js` | data tests (1.1), source tests (1.2) | app |
| modify | `src/data/services.ts` | comment above `export const services` only | app |
| modify | `src/components/Header.astro` | imports, `dropdownItems` removed, `isServiciosActive`, desktop dropdown and mobile accordion markup | app |
| modify | `src/components/Footer.astro` | imports, "Servicios" and "Por sector" columns | app |
| modify | `scripts/check-capilar-local.mjs` | shared-navigation expectation (line 44) | app |
| modify (done in this design) | `docs/adr/0013-seo-site-architecture.md` | amendment of "Menu and breadcrumbs" | design path |

### Interfaces

```ts
// src/data/navigation.ts
// Relative imports with the .ts extension so `node --test` can load the module
// (same convention as `./store-offer.ts` in services.ts).
import type { ServicePageData } from "./types.ts"
import { seoLocal, seoParaIa, disenoWeb, tiendaOnline, desarrolloSoftware,
  automatizaciones, inteligenciaArtificial, capilarLocal } from "./services.ts"
import { niches } from "./niches.ts"

export interface NavLink {
  title: string // page.breadcrumbName
  url: string   // page.slug, trailing slash
}

export interface ServiceMenuGroup {
  heading: string // Spanish copy: "Visibilidad" | "Webs y desarrollo"
  items: NavLink[]
}

export const serviceMenuGroups: ServiceMenuGroup[]
// [ { heading: "Visibilidad", items: [seoLocal, seoParaIa] },
//   { heading: "Webs y desarrollo",
//     items: [disenoWeb, tiendaOnline, desarrolloSoftware, automatizaciones, inteligenciaArtificial] } ]

export const serviceMenuLinks: NavLink[] // serviceMenuGroups.flatMap((g) => g.items)

export const sectorLinks: NavLink[] // [...niches, capilarLocal]
```

A private helper `toLink(page: ServicePageData): NavLink` maps the objects. Group heading ids in the Header are derived from the index (`servicios-grupo-${i}` desktop, `servicios-movil-grupo-${i}` mobile) so desktop and mobile never share an id.

Header markup per group (desktop dropdown and mobile accordion, classes indicative; the UI spec wins on visual detail):

```astro
<li>
  <p id={`servicios-grupo-${i}`} class="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400">{group.heading}</p>
  <ul aria-labelledby={`servicios-grupo-${i}`}>
    {group.items.map((item) => <li><a href={item.url} class="block px-4 py-2.5 hover:text-blue-500">{item.title}</a></li>)}
  </ul>
</li>
```

Mobile links keep `flex min-h-12 items-center px-4 py-2.5 text-sm`. Headings are `<p>` (never `<a>`, `<button>`, `<h*>`, nor `tabindex`) so the page heading outline and focus order do not change.

### Data

None: no schema, storage, settings or migration. No URL changes, so no redirects.

### Test plan (TDD order)

`tests/site-navigation.test.js` (node:test; imports `src/data/navigation.ts`, `src/data/services.ts`, `src/data/niches.ts`, `src/data/internal-links.ts` by URL like `tests/seo-para-ia-links.test.js`; reads component source with `readFile`).

Task 1.1, data (RED before `navigation.ts` exists):

1. `serviceMenuGroups` headings are exactly `["Visibilidad", "Webs y desarrollo"]` and their slugs are, in order, `/seo-local-sevilla/`, `/seo-para-ia/` and `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/` (scenarios "Desktop dropdown shows two groups", "SEO para IA is in Visibilidad").
2. No `serviceMenuLinks` url is a niche slug or `/seo-para-clinicas-capilares-sevilla/`; `serviceMenuLinks` equals the flattened groups (scenario "Desktop dropdown shows two groups").
3. `sectorLinks` urls are the four `niches` slugs then `/seo-para-clinicas-capilares-sevilla/`, titles are their `breadcrumbName` (scenario "Footer on any page").
4. The set of `serviceMenuLinks` urls plus `sectorLinks` urls equals the set of `services` and `niches` slugs, with no duplicates (scenario "Every service-template page is classified once").
5. Every url ends with `/`.
6. For each niche slug, `internalLinksBySource["/diseno-web-sevilla/"]` has a `contextual` entry with that path; `internalLinksBySource["/seo-local-sevilla/"]` has a `contextual` entry to `/seo-para-clinicas-capilares-sevilla/` (scenario "Parent services link their sector pages"; rendering in `<main>` is covered by `check-seo-06`, scenario "The links are rendered").

Task 1.2, components (RED before the Header/Footer change):

7. `Header.astro` imports from `@/data/navigation`, does not import `@/data/niches`, and does not contain `[...services, ...niches]` (scenario "Components hold no page lists").
8. `Header.astro` iterates `serviceMenuGroups` twice (desktop and mobile), renders each heading inside a `<p` with an `id` referenced by `aria-labelledby`, and never wraps `group.heading` in `<a`, `<button` or `<h` (scenarios "Mobile accordion shows the same groups", "Keyboard and touch").
9. `isServiciosActive` is computed from `serviceMenuLinks` (scenarios "Active state on a service page", "No active state on a sector page").
10. Mobile service links keep `min-h-12`; the accordion button keeps `min-h-11 min-w-11` (scenario "Keyboard and touch").
11. `Footer.astro` contains "Por sector", not "Webs por sector", renders `sectorLinks` and `serviceMenuLinks`, and does not import `@/data/niches` (scenario "Footer on any page").

Fakes/fixtures: none; the real data modules are pure. Existing tests that must stay green unchanged: `header-booking-cta`, `casos-exito`, `google-calendar-reserva`, `nap-consistency`, `dark-only-cleanup`, `seo-para-ia` (services order), `single-price-source`. Then `pnpm build`, `pnpm check:seo:dist` (02 header structure, 06 link map) and `pnpm check:capilar-local`.

### Real-browser / e2e checks (QA)

- Desktop (1280 px), on `/` and `/seo-para-ia/`: hover "Servicios" shows "Visibilidad" (2 links) then "Webs y desarrollo" (5 links); no sector page; headings are visibly distinct from links and not clickable.
- Desktop keyboard: Tab from the logo reaches "Servicios", the dropdown opens via `focus-within`, Tab visits the seven links in order and never stops on a heading; the existing browser default focus ring is visible on the dark ground (no new focus style in this story; an invisible ring is a defect for QA to report).
- `aria-current="page"` and blue colour on "Servicios" on `/seo-local-sevilla/`, `/seo-para-ia/`, `/tienda-online-sevilla/`; not on `/web-para-clinicas-sevilla/` or `/seo-para-clinicas-capilares-sevilla/`.
- Mobile 375 px: open the drawer, expand "Servicios": same two headings and seven links, each link at least 44 px high, no horizontal overflow; drawer scrolls if needed; closing with Escape and outside click still works.
- Footer at 375 px and at `sm` (3 columns): "Servicios" (7) and "Por sector" (5) columns; "Webs por sector" absent.
- `/diseno-web-sevilla/` and `/seo-local-sevilla/` show the related links to the sector pages.

### ADRs relied on

- ADR 0013 (SEO site architecture), amended in this design: the menu is built from `src/data/navigation.ts`; sector pages leave the dropdown and keep footer and parent-service links.
- ADR 0012 (keyword ownership): unaffected; no title, H1 or H2 changes.

## Risks / Trade-offs

- [Fewer sitewide links to sector pages] Every page loses one header link per sector page. Mitigation: footer links remain on every page and the parent services link them contextually; the pages are parked (PRD section 5), so ranking impact is not a goal of this milestone.
- [Two lists to keep in sync] A new service page must be added to `services` and to a navigation group. Mitigation: test 4 fails when a page in `services` or `niches` is not classified.
- [Group heading contrast] Small gray headings on the dropdown ground may fall below AA. Mitigation: use `text-gray-400` or lighter on `bg-gray-800/95` (or the UI spec value) and let a11y-responsive check it.
- [PR #103 overlap] NRD-26 edits `package.json` and adds `check-seo-21`; this change touches neither, so no merge conflict is expected.

## UI spec

Scope: three surfaces of the shared old-world chrome (DESIGN.md "Shared pieces cross both worlds"): the desktop "Servicios" dropdown and the mobile drawer accordion in `src/components/Header.astro`, and the "Servicios" / "Por sector" columns of `src/components/Footer.astro`. This is a refinement: the header pill, drawer, overlay, chevron, booking button, transitions and footer grid keep their current look and behaviour. Only the group headings are new visual elements. Data comes from `src/data/navigation.ts`; copy below is what renders.

### Design system reuse

- Tokens: the existing Tailwind gray scale used by the header and drawer (`bg-gray-800/95`, `border-gray-700`, `text-gray-200`, `text-gray-300`, `text-gray-400`), `text-blue-500` for hover and active, the footer's `text-zinc-100` / `text-zinc-200/90`. No new colour, size or radius token; no template.css (`--sky-signal`) token is pulled into the header.
- Components: `src/components/Header.astro` (dropdown panel `min-w-56 rounded-xl border border-gray-700 bg-gray-800/95 py-2 shadow-lg backdrop-blur`, accordion `.mobile-accordion-btn` / `.mobile-accordion-panel`), `src/scripts/header-mobile-menu.js` (unchanged), `src/components/Footer.astro` (column pattern `h2.mb-3.text-sm.font-semibold.text-zinc-100` + `ul.space-y-1.5.text-sm.text-zinc-200/90`).
- New component: none.
- Heading style follows DESIGN.md typography rules: sentence case, no uppercase, no letter-spacing, no icon (DESIGN.md bans tracked uppercase eyebrows and overlines). This overrides the indicative `uppercase tracking-wide` classes in the Interfaces snippet above.

### 1. Desktop "Servicios" dropdown (md and up, 768 px+)

Layout and hierarchy:

- Trigger unchanged: the "Servicios" button in the nav pill, opened by `group-hover` / `group-focus-within`, centred under the trigger (`left-1/2 -translate-x-1/2 pt-2`).
- Panel unchanged in surface (`rounded-xl border border-gray-700 bg-gray-800/95 py-2 shadow-lg backdrop-blur`), width `min-w-56` (still fits "Diseño web en Sevilla" and "Tienda online en Sevilla" without wrapping; the panel grows with content, never truncates).
- Content order, top to bottom:
  1. Heading "Visibilidad"
  2. Links: "SEO local en Sevilla", "SEO para IA"
  3. Heading "Webs y desarrollo"
  4. Links: "Diseño web en Sevilla", "Tienda online en Sevilla", "Software a medida", "Automatizaciones", "Inteligencia artificial"
- The links are the primary content; headings are quiet wayfinding labels and must read as secondary.

Group heading (`<p>`, non-interactive):

- Classes: `px-4 pt-2 pb-1 text-sm font-semibold text-gray-400`. Assumption: `text-sm` (0.875rem) sits inside DESIGN.md's label range (0.78-0.9rem); `text-gray-400` on `bg-gray-800/95` measures about 5.5:1 (AA for small text) and is one step quieter than the `text-gray-200` links, so hierarchy comes from colour and size, not caps.
- Spacing between groups: the second group's wrapper gets `mt-2 border-t border-gray-700 pt-2`. Assumption: a hairline divider in the panel's own border colour separates the two groups more clearly than extra whitespace alone, reusing an existing token; no divider above the first group.
- The heading carries the `id` referenced by its list's `aria-labelledby` (`servicios-grupo-${i}`).

Links:

- Unchanged: `block px-4 py-2.5 hover:text-blue-500`, inherited `text-gray-200`, `text-base font-medium` from the nav (`text-sm` below 640 px is irrelevant here because the dropdown is `md+`).
- No link is marked current inside the dropdown (out of scope; current behaviour kept).

Interactions:

- Hover on a link: `text-blue-500`, no transition change. Headings have no hover style, `cursor: default` (the browser default for `<p>`), no pointer change.
- Focus: Tab from the "Servicios" button opens the panel through `focus-within`; Tab visits the seven links in the order above and leaves the panel to "Casos de éxito". Headings are never in the tab order. Focus indicator: the existing browser default ring is kept (no new focus style in this story).
- No Escape handling, no click-to-open (Non-Goals).

### 2. Mobile drawer accordion (below 768 px, from 320 px)

Layout and hierarchy:

- Drawer, overlay, booking button, "Servicios" row (label span + `.mobile-accordion-btn` with chevron) unchanged.
- Expanded panel `#mobile-submenu-servicios` keeps `ml-3 border-l border-gray-700` and the grid-rows expand animation; inside it, the same order as desktop: heading "Visibilidad", its 2 links, heading "Webs y desarrollo", its 5 links.

Group heading (`<p>`, non-interactive):

- Classes: `px-4 pt-3 pb-1 text-xs font-semibold text-gray-300`. Assumption: mobile links are `text-sm text-gray-400`, so the heading is distinguished by weight and one lighter step (`text-gray-300`) at a smaller size; `text-gray-500` would fail AA on the drawer ground and is not used.
- The first heading uses `pt-2` instead of `pt-3`. Assumption: keeps the first label close to the "Servicios" row it belongs to.
- No divider between mobile groups (the left rule already frames the panel; the heading's top padding separates the groups). Assumption: avoids a second line crossing the `border-l`.
- Heading id `servicios-movil-grupo-${i}`, referenced by the group list's `aria-labelledby`.
- Headings are not touch targets and have no minimum height; they must not look tappable (no hover colour, no chevron).

Links: unchanged `flex min-h-12 items-center px-4 py-2.5 text-sm text-gray-400 hover:text-blue-500` (48 px, above the 44 px minimum).

Responsive:

- 320 px: drawer width is `min(340px, 85vw)` = 272 px; minus `px-3`, `ml-3` and `px-4`, the longest strings ("Webs y desarrollo", "Tienda online en Sevilla", "Diseño web en Sevilla") fit on one line at `text-sm`. If a future label wraps, it wraps inside the link (no truncation, no ellipsis); the link stays at least 48 px.
- Expanded height: 2 headings plus 7 links of 48 px is about 410 px plus the booking button and 4 nav rows; on short viewports the drawer scrolls (`overflow-y-auto overscroll-contain`, already present). No horizontal overflow at any width.
- `prefers-reduced-motion`: existing rule disables the panel transition; nothing new animates.

Interactions and focus:

- The accordion toggles as today; `aria-expanded` on the button and `aria-controls="mobile-submenu-servicios"` unchanged.
- When collapsed, the links stay out of view as today (grid-rows 0fr + overflow hidden); the script is not modified.
- Tab order when expanded: accordion button, then the seven links in order, then "Casos de éxito". Headings never receive focus.
- Escape and overlay click still close the drawer (unchanged script).

### 3. Active state of "Servicios"

- Desktop button and mobile label span: `text-blue-500` and `aria-current="page"` on the seven menu service pages only (derived from `serviceMenuLinks`).
- On the four niche pages and `/seo-para-clinicas-capilares-sevilla/`, no header item is active (no nav item maps to them). This is intended: sector pages are reached from the footer and parent services.

### 4. Footer columns

Layout: unchanged grid `grid gap-8 border-t border-gray-700 pt-8 sm:grid-cols-3`: one column per block stacked below 640 px, three columns from 640 px. Column order: "Servicios", "Por sector", then the `SITE.name` NAP column.

- Column 1, heading "Servicios" (`h2`, existing classes). Links, in this order: "SEO local en Sevilla", "SEO para IA", "Diseño web en Sevilla", "Tienda online en Sevilla", "Software a medida", "Automatizaciones", "Inteligencia artificial". No group sub-headings in the footer. Assumption: seven short links scan fine as one list; sub-headings would add a third heading level to a compact column.
- Column 2, heading "Por sector" (`h2`, existing classes; replaces "Webs por sector"). Links, in this order: "Web para restaurantes", "Web para clínicas", "Web para comercios", "Web para despachos y gestorías", "SEO para clínicas capilares en Sevilla".
- Link style unchanged: `hover:text-blue-500 hover:underline` inside `ul.space-y-1.5.text-sm.text-zinc-200/90`.
- Responsive: at 640-767 px the column is about 190 px wide; "SEO para clínicas capilares en Sevilla" wraps onto two lines inside its `li`, which is acceptable (no truncation, no `whitespace-nowrap`). At 320 px all labels fit one line in the stacked column.
- The footer's touch-target spacing is not changed in this story (existing pattern, out of scope).

### 5. States

- Loading, empty, error, partial, success: n/a. Menus are rendered at build time from static data; there is no async content. The build-time tests guarantee the groups are never empty.
- Disabled: n/a.
- Current page inside the dropdown or footer lists: no special styling (unchanged behaviour).

### 6. Copy (Spanish, exact)

- Group headings: "Visibilidad", "Webs y desarrollo" (fixed by the story and spec).
- Footer column heading: "Por sector" (fixed by the story); "Servicios" unchanged.
- Link labels: each page's existing `breadcrumbName`, verbatim; no new copy. Note: the story names the second item "SEO para IA / GEO", but the rendered label is the page's `breadcrumbName` "SEO para IA", as the design's Interfaces fix it. Assumption: keeping `breadcrumbName` keeps menu, breadcrumbs and footer consistent.
- Accessible names unchanged: "Mostrar submenú de Servicios" (accordion button), "Abrir menú de navegación".

### 7. Accessibility hand-off

- Each group is `<li><p id>…</p><ul aria-labelledby>…</ul></li>`, so screen readers announce the list name ("Visibilidad, lista, 2 elementos"). Headings are `<p>`, never `<h*>`, `<a>`, `<button>` or `tabindex`, so the page heading outline and tab order stay as today.
- The mobile panel currently nests `<ul>` directly inside `<ul>`; the group `<li>` wrappers must be the direct children of the inner `<ul class="min-h-0 overflow-hidden">` so the nested lists are valid.
- Touch targets: mobile links 48 px, accordion button `min-h-11 min-w-11` (44 px), unchanged.
- Contrast: desktop heading `text-gray-400` and mobile heading `text-gray-300` on `bg-gray-800/95` both meet AA for small text; `a11y-responsive` verifies on the built page.
- No live-region announcements needed (no async results).

### 8. GEO-ready content

n/a: the header and footer are site chrome, not a content section; the canonical brand string is unchanged.
