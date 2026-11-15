# NRD-14 - Remove `dark:` variants from pages and drop `darkMode: 'class'` (dark-only cleanup, batch 2 of 2)

## Why

[NRD-14](https://nuriaromerodev.atlassian.net/browse/NRD-14) (M0, epic NRD-1; source `odd/tasks/eliminar-selector-tema-dark-only.md` items 2-3; Tech Lead finding `tailwind.config.mjs:4`). After NRD-13 cleans `src/layouts`, `src/components` and `src/scripts/contact-form.js`, the remaining `dark:` usages on `develop` (f595037) are 67 lines in 9 page files: `src/pages/index.astro` (26), `contacto.astro` (10), `tienda-online-sevilla.astro` (7), `recursos.astro` (7), `diseno-web-sevilla.astro` (7), `blog/index.astro` (6), `seo-para-clinicas-capilares-sevilla.astro` (2), `web-para-comercios-sevilla.astro` (1), `portfolio.astro` (1). `tailwind.config.mjs:4` still sets `darkMode: 'class'`. This story closes M0's last exit criterion ("no orphan theme code").

## What changes

1. **Same mechanical rule as NRD-13** (see `docs/designs/NRD-13-dark-variants-components.md`, "What changes" 1): for each `dark:` token delete the light token that sets the same CSS property under the same remaining variant chain, then drop the prefix; prefix-only removal when there is no light counterpart; light-only tokens stay. Examples in the home: `text-gray-700 dark:text-gray-200` -> `text-gray-200`; `text-gray-700 dark:[&>strong]:text-yellow-200 [&>strong]:text-yellow-500 ... dark:text-gray-400` -> `[&>strong]:text-yellow-200 ... text-gray-400`; `group-hover:text-white dark:text-blue-400 dark:group-hover:text-white` -> `text-blue-400 group-hover:text-white`; `focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400` -> `focus-visible:outline-blue-400`.
   **Dead state tokens (Tech Lead decision: identical render, same rule as NRD-13 "What changes" 1).** A light `hover:`/`focus:`/`focus-visible:`/`active:` token whose CSS property is also set by a plain `dark:` token, with no `dark:<same-state>:` counterpart, never renders today (same specificity 0,2,0, `dark:` emitted later in Tailwind 3.4.1). It is deleted together with its light pair. Known cases in this story: the niche pills at `src/pages/index.astro:275` and `src/pages/diseno-web-sevilla.astro:39`, where `hover:border-blue-500 hover:text-blue-500` are deleted, so the pills keep border `gray-600` and text `gray-200` on hover, as today. A deliberate blue hover would be a separate design story. Blog cards (`dark:hover:` pair), services rows (`group-hover`, 0,3,0) and the focus outline (`dark:focus-visible:` pair) are live and follow the main rule.
2. **Guard widened to `src/`.** `tests/dark-variants.test.js` (created by NRD-13) gets the pages first, then its scope becomes the whole `src/` tree (AC 3).
3. **`darkMode: 'class'` removed** from `tailwind.config.mjs`, last, in the same commit that makes `src/` clean (with zero `dark:` tokens the setting has no effect; removing it earlier would turn the remaining `dark:` tokens into `prefers-color-scheme` media queries). The test asserts the config has no `darkMode` key. `<html lang="es" class="dark">` and `color-scheme: dark` stay (`tests/dark-only-layout.test.js`): they drive native form controls and scrollbars.
4. **Task doc.** `odd/tasks/eliminar-selector-tema-dark-only.md` items 2 and 3 checked off with the commit ids (DoD "related `odd/tasks` doc kept consistent"; `odd/` is a shared path, edited in this story's last subtask).

## Out of scope

- Colour or contrast changes; bugs found by the comparison are filed by QA.
- Copy changes on the home (`#proceso` heading and paragraph belong to NRD-122, which lands first and which this story is blocked by).
- `src/layouts`, `src/components` (NRD-13).

## Requirements and scenarios

### Requirement: no `dark:` variant anywhere under `src/`, no class dark mode config

`rg -n 'dark:' src` SHALL return nothing; `tailwind.config.mjs` SHALL have no `darkMode` key; `tests/dark-variants.test.js` SHALL scan the whole `src/` tree and assert the config.

#### Scenario: guard

- WHEN `node --test tests/dark-variants.test.js` runs
- THEN it passes, and it fails with file and line when a `dark:` token appears anywhere under `src/` or `darkMode` reappears in `tailwind.config.mjs`

#### Scenario: fixed dark setup kept

- WHEN `node --test tests/*.test.js` runs
- THEN `tests/dark-only-layout.test.js` and `tests/dark-only-cleanup.test.js` still pass

### Requirement: no visual change on any page type

Each element SHALL render with the colours it renders today.

#### Scenario: page types

- WHEN QA compares the built home, a service page (`/diseno-web-sevilla/`, `/tienda-online-sevilla/`), the capilares page (`/seo-para-clinicas-capilares-sevilla/`), a niche page (`/web-para-comercios-sevilla/`), `/blog/` and one blog post, a legal page (`/privacidad/`), `/contacto/`, `/recursos/` and `/portfolio/` at 375 px and desktop against `develop`
- THEN colours, hover and focus states are identical, and a visitor whose OS uses a light theme still gets the dark site

#### Scenario: build and typecheck

- WHEN `pnpm build` (includes `astro check`), `pnpm astro check` and `pnpm check:seo:dist` run
- THEN all pass

## Files

| Layer | Action | Path                                                                                                                                                                                                        | Task                                                            |
| ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `app` | modify | `tests/dark-variants.test.js`                                                                                                                                                                               | 1.1 (add five page files), 1.2 (scope `src/`, config assertion) |
| `app` | modify | `src/pages/index.astro`, `src/pages/diseno-web-sevilla.astro`, `src/pages/tienda-online-sevilla.astro`, `src/pages/seo-para-clinicas-capilares-sevilla.astro`, `src/pages/web-para-comercios-sevilla.astro` | 1.1 (43 lines)                                                  |
| `app` | modify | `src/pages/contacto.astro`, `src/pages/recursos.astro`, `src/pages/blog/index.astro`, `src/pages/portfolio.astro`                                                                                           | 1.2 (24 lines)                                                  |
| `app` | modify | `tailwind.config.mjs`                                                                                                                                                                                       | 1.2 (remove `darkMode: 'class'`)                                |
| `app` | modify | `odd/tasks/eliminar-selector-tema-dark-only.md`                                                                                                                                                             | 1.2 (shared path: items 2-3 checked with commit ids)            |

## Interfaces

```js
// tests/dark-variants.test.js (end state)
const SCOPES = ["src"];
test("tailwind config has no darkMode setting", () => {
  assert.doesNotMatch(
    readFileSync("tailwind.config.mjs", "utf8"),
    /\bdarkMode\s*:/,
  );
});
```

## Data

None.

## Test plan (TDD order)

1. Task 1.1: add the five home/service/niche page files to `SCOPES` (RED: 43 hits), clean them (GREEN); full suite and `pnpm build`.
2. Task 1.2: set `SCOPES = ["src"]` and add the config test (RED: 24 hits plus `darkMode`), clean the four pages, remove `darkMode: 'class'` (GREEN); `rg -n 'dark:' src` returns 0; `pnpm build`, `pnpm astro check`, `pnpm check:seo:dist`; update the `odd/tasks` doc.
3. Format only edited files.

## Real-browser / e2e checks

- Every page type listed above at 375 px and 1280 px: screenshots against `develop` show no colour change, including the home hero (yellow `strong` accent), the services list hover, the price cards and the niche pills on home and `/diseno-web-sevilla/`.
- With the OS (or DevTools "Emulate prefers-color-scheme: light") set to light: the site still renders dark everywhere (proves the config removal did not reintroduce media-based dark mode).
- Keyboard focus visible on the home services links (`focus-visible:outline-blue-400`) and the `/contacto/` links.

## Risks

- **Order.** Blocked by NRD-13 (existing `Blocks` link; this story extends its test) and by NRD-122 (both edit `src/pages/index.astro`; new `Blocks` link). NRD-121 changes `/diseno-web-sevilla/` through data only (no edit of `diseno-web-sevilla.astro`), so no conflict.
- **Wrong pair deleted.** Same mitigation as NRD-13 (pair by property and variant chain; screenshot comparison).
- **Dead state tokens coming alive.** A purely mechanical removal would make the niche pills turn blue on hover (specificity trap, "What changes" 1). Mitigation: delete the dead tokens (identical render); QA compares the hover `getComputedStyle` of the pills on `/` and `/diseno-web-sevilla/` against `develop`.

## ADRs

Relies on [0002](../adr/0002-tailwind-and-typescript.md), [0006](../adr/0006-testing-node-test-and-tdd.md). No new ADR.

## UI spec

Expected outcome: **identical render**. This story changes class strings and one config key only; no layout, copy, token, component or interaction is added, removed or restyled. Baseline: the `develop` commit this story branches from (with NRD-13 and NRD-122 merged), built with `pnpm build` and served from `dist/`.

### What must stay pixel-identical

For every element of the nine edited pages, the computed value of these properties must equal the baseline, in every state:

- `color`, `background-color`, `background-image`, `border-color`, `outline-color` at rest.
- The same properties under `:hover`, `.group:hover` and `:focus-visible`.
- Text colour of the `strong` children in the home hero lede (`src/pages/index.astro`, `[&>strong]:text-yellow-200`).
- Nothing else may move: font, size, spacing, radius, line breaks and element order are unchanged (the diff touches colour utilities only).

Elements that need a close look, because they carry a light variant chain next to the dark token:

| Page                                                                                                | Element                                | Must render (rest / interaction)                                                                                                                      |
| --------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/index.astro`                                                                             | Hero eyebrow `h1`, headline, lede      | `gray-200` / `white` / `gray-400`, lede `strong` `yellow-200` semibold                                                                                |
| `src/pages/index.astro`                                                                             | Four value cards (icon, `h3`, `p`)     | icon `blue-400`, `h3` `gray-100`, `p` `gray-400`                                                                                                      |
| `src/pages/index.astro`                                                                             | Services list rows                     | border `gray-700`; title `blue-400`, `white` on row hover; arrow `blue-400`, shifts right on hover; focus `outline-blue-400` 2px, offset 2px, rounded |
| `src/pages/index.astro`                                                                             | Niche pills                            | border `gray-600`, bg `gray-800/50`, text `gray-200`; hover: no colour change, as today (see "Known conflict")                                                                     |
| `src/pages/index.astro`                                                                             | Price cards and footnote               | border `gray-700`, bg `gray-800/50`, label `gray-400`, price `white`, link `blue-400`, note `gray-500`                                                |
| `src/pages/diseno-web-sevilla.astro`                                                                | Niche pills; check list                | pills as above; check marks `green-400`, `strong` `white`                                                                                             |
| `src/pages/tienda-online-sevilla.astro`                                                             | Inline link; check list                | link `blue-400`, underline on hover; check marks `green-400`, `strong` `white`                                                                        |
| `src/pages/seo-para-clinicas-capilares-sevilla.astro`, `src/pages/web-para-comercios-sevilla.astro` | Inline links                           | `blue-400`, underline behaviour as today                                                                                                              |
| `src/pages/blog/index.astro`                                                                        | Post cards                             | border `gray-700`, `blue-500` on hover, bg `gray-800/50`, hover shadow; date `gray-500`, title `gray-100`, link text `blue-400`                       |
| `src/pages/contacto.astro`                                                                          | Booking panel, contact list, FAQ cards | panel border `blue-900`, bg `blue-950/30`; headings `gray-100`/`white`; body `gray-300`; FAQ border `gray-700`, bg `gray-800/50`; notes `gray-500`    |
| `src/pages/recursos.astro`                                                                          | Resource cards, aside                  | border `gray-700`, bg `gray-800/50`, titles `gray-100`, links `blue-400`, aside text `gray-300`                                                       |
| `src/pages/portfolio.astro`                                                                         | `h1`                                   | `white`                                                                                                                                               |

Pages that render only through layouts and components (`/privacidad/`, a blog post) are not edited here, but they are compared too, because removing `darkMode` affects the whole stylesheet.

### Known conflict: niche pill hover (decided by the Tech Lead: identical render)

In the current build (Tailwind 3.4.1, `darkMode: 'class'`), `:is(.dark .dark\:text-gray-200)` and `.hover\:text-blue-500:hover` have the same specificity (0,2,0), and the `dark:` rules are emitted later in the CSS. As a result the niche pills at `src/pages/index.astro:275` and `src/pages/diseno-web-sevilla.astro:39` **do not change border or text colour on hover today**: `hover:border-blue-500 hover:text-blue-500` lose to `dark:border-gray-600 dark:text-gray-200`. The mechanical rule ("What changes" 1) leaves `border-gray-600 text-gray-200 hover:border-blue-500 hover:text-blue-500`, and the pills would start turning blue on hover. That breaks "identical render". Tech Lead decision: identical render. On hover the pills keep border `gray-600` and text `gray-200`, so the dead `hover:border-blue-500 hover:text-blue-500` tokens on those two elements are deleted too. This is the "dead state tokens" rule in "What changes" 1, shared with NRD-13. A deliberate blue hover would be a separate design story.

No other edited element has this problem. The blog cards already carry `dark:hover:border-blue-500`, the services rows use `group-hover` (0,3,0, which already beats the `dark:` token), and the focus ring has its own `dark:focus-visible:` pair.

### Checklist

- Screens and layout, hierarchy, copy: n/a, unchanged.
- States: n/a. These are static pages and no state is added.
- Design system reuse: only Tailwind default-palette utilities already in use stay. No new token or component. `<html class="dark">` and `color-scheme: dark` in `src/layouts/Layout.astro` stay.
- Responsive: n/a, no breakpoint utilities change. Identity is checked at 375 px and 1280 px.
- Interactions: hover, group-hover and focus-visible behave exactly as in the table. No transition is added or removed.
- Accessibility hand-off: the focus ring on the home services rows and the `/contacto/` links must stay visible. Contrast is unchanged because the colours are unchanged.

### How QA proves it (real-browser checks)

1. Build the baseline and the PR and serve each `dist/`. Capture full-page screenshots at 375 px and 1280 px of `/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/seo-para-clinicas-capilares-sevilla/`, `/web-para-comercios-sevilla/`, `/blog/`, one blog post, `/privacidad/`, `/contacto/`, `/recursos/`, `/portfolio/`. Pixel-diff each pair. Expected: no differing pixels, except in regions that are animated or load asynchronously.
2. Hover and focus, on both builds: hover a home services row (title turns `white`, arrow shifts), a blog card (border `blue-500`), and a niche pill on `/` and `/diseno-web-sevilla/` (result per "Known conflict"). Tab to a services row and a `/contacto/` link (2px `blue-400` outline). Compare `getComputedStyle` colours between builds.
3. With DevTools "Emulate CSS prefers-color-scheme: light" (or a light OS theme), reload `/` and `/contacto/`. They must look the same as in step 1, still dark. This proves media-based dark mode did not come back.
4. Any computed-colour mismatch is a QA bug against this story. There is no exception: the pill hover stays as today (Tech Lead decision, identical render).

## Tasks

- [ ] 1.1 [NRD-157 app] Remove `dark:` from the home, service, capilares and niche pages; tests: add the five files to `tests/dark-variants.test.js` first (RED).
- [ ] 1.2 [NRD-158 app] Remove `dark:` from contacto, recursos, blog index and portfolio, drop `darkMode: 'class'`, update the `odd/tasks` doc; tests: guard scope `src/` and the config assertion first (RED).
