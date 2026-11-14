# NRD-11 - Remove the orphan theme toggle and use a single header logo

## Why

[NRD-11](https://nuriaromerodev.atlassian.net/browse/NRD-11) (M0, epic NRD-1). The site is dark-only: `<html lang="es" class="dark">` is fixed in `src/layouts/Layout.astro:26`, with `color-scheme: dark`. Yet the repo still carries dead theme code that confuses reviewers. Source: `odd/tasks/eliminar-selector-tema-dark-only.md` items 1, 4, 5 and 6.

Current state (verified in code):

- `src/components/ThemeToggle.astro` and `src/scripts/theme-toggle.js` are imported by nothing (`rg ThemeToggle|theme-toggle src tests scripts` matches only the two files themselves).
- `ThemeToggle.astro` is the only importer of `src/components/icons/Sun.astro`, `Moon.astro` and `System.astro`.
- `src/components/Header.astro:8-9,67-78` imports `logoDark` (`nuriaromerodev-logo-negro.svg`) and `logoLight` (`-blanco.svg`) and renders both with `dark:hidden` / `hidden dark:block`. Only `logoLight` is ever visible. `logo-negro.svg` has no other importer.
- `src/layouts/Layout.astro:87-91` has `@media (prefers-color-scheme: dark) { body { color: ... } }`. It is redundant: `<body class="... dark:text-white">` wins. The bug fix [NRD-12](https://nuriaromerodev.atlassian.net/browse/NRD-12) (designed in the tracker the same day) deletes this block together with the dead `#header-nav` / `@keyframes blur` CSS. Whichever lands first removes it; this story then only asserts it is gone.

## What changes

- Delete `ThemeToggle.astro`, `theme-toggle.js` and the three icons only it used.
- `Header.astro`: one `<Image src={logoLight}>`, same classes for size, the same alt and the same link. Remove the `logoDark` import and delete `src/assets/nuriaromerodev-logo-negro.svg`.
- `Layout.astro`: no `prefers-color-scheme` body block (deleted here only if NRD-12 has not landed). The `@keyframes blur` media block is left to NRD-12.
- New `tests/dark-only-cleanup.test.js`.

## Out of scope

- Removing `dark:` variants and `darkMode: 'class'` ([NRD-13](https://nuriaromerodev.atlassian.net/browse/NRD-13), which this story `Blocks`).
- The `#header-nav` / `@keyframes blur` dead CSS (NRD-12).
- `BookingButton` colours (NRD-49).
- Any visual change.

## Requirements and scenarios

### Requirement: no theme toggle code

The repository MUST NOT contain the theme toggle component, its script or icons used only by it.

#### Scenario: files gone

- WHEN `tests/dark-only-cleanup.test.js` runs
- THEN `src/components/ThemeToggle.astro`, `src/scripts/theme-toggle.js` and `src/components/icons/{Sun,Moon,System}.astro` do not exist, and no file under `src/`, `scripts/` or `tests/` (except the test itself) mentions `ThemeToggle`, `theme-toggle` or imports those icons

### Requirement: single header logo

The header SHALL render exactly one logo image: the white logo visible today, with `alt="Nuria Romero"`, `h-10 w-auto`, `loading="eager"`, inside the existing home link (`aria-label="Ir al inicio"`).

#### Scenario: one image

- WHEN `Header.astro` is read
- THEN it contains exactly one `<Image`, using `logoLight`, and no `dark:hidden`, `dark:block` or `logo-negro`

#### Scenario: visual parity

- WHEN the header is viewed at 375 px and 1280 px before and after
- THEN the screenshots are identical (logo size, position, header height)

### Requirement: no colour-scheme body rule in the layout

`src/layouts/Layout.astro` MUST NOT contain a `prefers-color-scheme` media query that styles `body`. The second `prefers-color-scheme` block (`@keyframes blur`, about line 113) belongs to the dead `#header-nav` CSS that NRD-12 removes. It is out of scope here, and this story's test MUST NOT depend on it, so NRD-11 and NRD-12 can merge in either order without a `Blocks` link. NRD-12's own test asserts that no `prefers-color-scheme` remains at all.

#### Scenario: guard

- WHEN the test reads `Layout.astro`
- THEN no `@media (prefers-color-scheme: ...)` block contains a `body` selector (regex over each media block: `/@media\s*\(prefers-color-scheme[^)]*\)\s*\{\s*body\s*\{/`), and `class="dark"` and `color-scheme: dark` are still present

## Files (layer `app`)

| Action | Path                                                           | Notes                                             |
| ------ | -------------------------------------------------------------- | ------------------------------------------------- |
| delete | `src/components/ThemeToggle.astro`                             |                                                   |
| delete | `src/scripts/theme-toggle.js`                                  |                                                   |
| delete | `src/components/icons/Sun.astro`, `Moon.astro`, `System.astro` | only importer was ThemeToggle                     |
| modify | `src/components/Header.astro`                                  | single `<Image>`, drop `logoDark` import          |
| delete | `src/assets/nuriaromerodev-logo-negro.svg`                     | no other importer                                 |
| modify | `src/layouts/Layout.astro`                                     | only if NRD-12 has not removed the body block yet |
| create | `tests/dark-only-cleanup.test.js`                              |                                                   |

## Interfaces

```astro
---
// Header.astro frontmatter
import logo from "@/assets/nuriaromerodev-logo-blanco.svg";
---

<a href="/" class="flex min-h-12 items-center px-2" aria-label="Ir al inicio">
  <Image
    src={logo}
    alt="Nuria Romero"
    class="block h-10 w-auto"
    loading="eager"
  />
</a>
```

Renaming `logoLight` to `logo` is optional. If renamed, the test matches the `-blanco.svg` import instead of the identifier.

## Data

None.

## Test plan (TDD order)

1. `tests/dark-only-cleanup.test.js` (RED, task 1.1): `existsSync` checks for the five files, and a recursive text scan of `src/`, `scripts/` and `tests/` for the identifiers. Delete the files (GREEN). Then `pnpm astro check` and `pnpm build`.
2. Extend the test (RED, task 1.2): one `<Image` in `Header.astro`, the `-blanco.svg` import, no `dark:hidden` / `dark:block` / `logo-negro`, no `prefers-color-scheme` media block styling `body` in `Layout.astro` (do not assert on the whole file: the `blur` keyframes block is NRD-12's). Edit the header and, if needed, the layout (GREEN). `tests/header-booking-cta.test.js` and `tests/google-calendar-reserva.test.js` stay green. Then `pnpm build`.

## Real-browser / e2e checks

- `/` and `/seo-local-sevilla/` at 375 and 1280 px: the logo is identical in size and position, the header height is unchanged, the home link works and the focus ring shows on the logo link.
- The mobile menu still opens and closes. No console errors on View Transitions navigation (the deleted script was never loaded, so nothing should change).

## Risks

- **Merge order with NRD-12.** Both edit `Layout.astro` in the same region. The second branch to merge resolves a trivial conflict, or finds the block already gone. NRD-11 guards only the `body` block and NRD-12 guards the whole file, so either merge order leaves both tests green. There is deliberately no `Blocks` link between them.
- **Merge order with NRD-13.** NRD-13 rewrites `dark:` classes in `Header.astro`. This story lands first (`Blocks`).
- **Asset deletion.** `logo-negro.svg` is also referenced nowhere under `public/`; `rg logo-negro` must return nothing after the change.

## ADRs

0002 (Tailwind and TypeScript), 0006 (node:test and TDD).

## UI spec

This story changes nothing visible. The spec lists what must stay identical, so the developer and `ux-review` can check parity. It adds no new design.

### Header logo link (`src/components/Header.astro`)

1. **Screens and layout**: every page, through `src/layouts/Layout.astro` -> `<Header />`. The home link stays the first child of the header `<nav>` pill. The order of regions does not change: logo link, nav list (md+), `BookingButton` (md+), `#mobile-menu-btn` (below md).
2. **Hierarchy**: unchanged. The logo is the brand mark and the way home. The booking pill stays the only filled control (DESIGN.md, "Buttons and focus").
3. **States**: n/a (static image, no data). Today the black logo is always `display: none`, because `<html class="dark">` is fixed. After the change only the white logo exists. There is no light state to preserve.
4. **Copy**: unchanged. Link `aria-label="Ir al inicio"`, image `alt="Nuria Romero"`. No new strings.
5. **Design system reuse**: the existing asset `src/assets/nuriaromerodev-logo-blanco.svg`, rendered with the `astro:assets` `<Image>`. The image classes are exactly `block h-10 w-auto`, which is what today's `hidden h-10 w-auto dark:block` resolves to, with `loading="eager"`. The link classes stay `flex min-h-12 items-center px-2`. No new tokens, components or assets.
6. **Responsive**: identical at every width from 320 px up. The logo is 40 px tall (`h-10`) and its width comes from the SVG's 3:1 aspect ratio (about 120 px), inside a link at least 48 px tall (`min-h-12`). At 375 px and 1280 px, compare against the pre-change screenshots: the header height, the logo box and the x-position of the nav items, `BookingButton` and `#mobile-menu-btn` must match. Nothing stacks, hides or wraps differently. At 320 px the pill must not gain horizontal overflow it did not have before.
7. **Interactions**: unchanged. The logo link has no hover style today, and none is added. A click navigates to `/` with View Transitions, as now. The `nav-shadown` scroll animation and the mobile drawer behave exactly as before.
8. **Accessibility hand-off**: the link keeps its accessible name "Ir al inicio" (the `aria-label` overrides the image alt). Assumption: the `aria-label`/alt pair stays as it is, because changing the accessible name is outside a story with no visual change. The focus order does not change: the logo link is still the first focusable element in the header. Focus visibility also stays as today: the link has no custom focus class, so the browser's default outline shows. QA checks that the outline still shows, not that it matches the DESIGN.md `sky-signal` outline, which is out of scope. A screen reader must announce one link with one name, as today.

### Theme toggle (`src/components/ThemeToggle.astro`, `src/scripts/theme-toggle.js`, `src/components/icons/{Sun,Moon,System}.astro`)

Nothing renders these files today, so deleting them changes nothing a visitor sees or hears. Checklist items 1-8: n/a.

### Layout body colour (`src/layouts/Layout.astro`)

Removing `@media (prefers-color-scheme: dark) { body { color: ... } }` must not change the text colour, because `<body class="... dark:text-white">` already sets it. Parity check: the body text colour on `/` and `/seo-local-sevilla/` is the same before and after, with the OS in dark mode and in light mode. Other checklist items: n/a.

## Tasks

- [x] 1.1 [NRD-63 app] Delete `ThemeToggle.astro`, `theme-toggle.js` and the Sun/Moon/System icons; tests: `tests/dark-only-cleanup.test.js` (files gone, no references) first.
- [ ] 1.2 [NRD-64 app] Single `logoLight` `<Image>` in `Header.astro`, delete `logo-negro.svg`, and no `prefers-color-scheme` body block in `Layout.astro` (verify or remove; the `blur` block is NRD-12's); tests: extend `tests/dark-only-cleanup.test.js` first.
