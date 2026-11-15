# NRD-13 - Remove `dark:` variants from layouts and components (dark-only cleanup, batch 1 of 2)

## Why

[NRD-13](https://nuriaromerodev.atlassian.net/browse/NRD-13) (M0, epic NRD-1; source `odd/tasks/eliminar-selector-tema-dark-only.md` item 3). The site is dark-only: `<html lang="es" class="dark">` is fixed in `src/layouts/Layout.astro` with `color-scheme: dark`, and the theme toggle is gone (NRD-11). Yet `tailwind.config.mjs` keeps `darkMode: 'class'` and every element carries two colour sets, e.g. `text-gray-800 dark:text-white`: the light value is never visible, so UI changes must edit both and reviewers cannot tell which one matters. On `develop` (f595037) there are 180 lines with `dark:` under `src/`; 111 of them in `src/layouts` and `src/components` (26 files), plus 2 in `src/scripts/contact-form.js`, which toggles the contact form status classes.

## What changes

1. **Mechanical rule, per class list.** For every `dark:<variant-chain>:<utility>` token: delete the light token that sets the same CSS property under the same remaining variant chain (for example `text-gray-800` for `dark:text-white`, `hover:text-blue-700` for `dark:hover:text-blue-300`, `[&>strong]:text-yellow-500` for `dark:[&>strong]:text-yellow-200`, `block` for `dark:hidden`), then drop the `dark:` prefix. A `dark:` token with no light counterpart just loses its prefix. Light tokens with no `dark:` counterpart stay (they are what renders today). This is exactly "the value visible today in dark mode" because `.dark .dark\:x` always wins over `.x` while `<html class="dark">` is fixed.
   **Dead state tokens (Tech Lead decision: identical render; the same rule applies in NRD-14).** In the built CSS (Tailwind 3.4.1, `darkMode: 'class'`) a plain `dark:<utility>` rule has the same specificity (0,2,0) as a light `hover:`/`focus:`/`focus-visible:`/`active:` rule for the same CSS property, and it is emitted later, so it wins. A light state token whose property is also set by a plain `dark:` token, with no `dark:<same-state>:` counterpart, therefore never renders today. Delete such dead state tokens together with their light pair, so no state starts to render once `dark:` is gone. Tokens with a `dark:<state>:` pair, and `group-hover:`/`group-focus:` tokens (0,3,0, already beat `dark:`), are live and follow the main rule. Known cases in this story (confirming the UI spec, no longer an assumption): `ContactForm.astro` `focus:border-blue-500` on the 4 fields (the `focus:ring-*` ring is another property and stays), `ContactForm.astro:135` `hover:text-blue-500`, `LinkButton.astro` `hover:border-gray-900` and `active:bg-black` (its `hover:bg-gray-800` and `hover:text-white` equal the dark value and may go too), `SocialPill.astro` `active:bg-black`. Making any of these states visible (for example a blue focus border on form fields) is a separate design story, not this one.
2. **Same rule in `@apply` and in JS.** `src/components/EntryContentStyles.astro` applies `dark:` inside `@apply` lines (blog and legal `.entry-content`); `src/scripts/contact-form.js` `setStatus` adds `text-gray-600` + `dark:text-gray-300` for the info state: it becomes `text-gray-300` in both the `remove(...)` list and the `add(...)` call. The script is included here (it belongs to the ContactForm group) so the component and its script change in one commit; NRD-14's scope ("all remaining") shrinks by those two lines.
3. **Guard test.** New `tests/dark-variants.test.js` walks a list of scopes and fails on any `dark:` token in `.astro`, `.ts`, `.js`, `.mjs`, `.css` files under them. Each subtask adds its files to the list first (RED), then cleans them (GREEN); the last subtask replaces the file list with the directories `src/layouts` and `src/components` (plus `src/scripts/contact-form.js`). NRD-14 widens it to `src/` and adds the config assertion.
4. **`darkMode: 'class'` stays** in `tailwind.config.mjs` until NRD-14: pages still use `dark:` after this story, and removing the setting would turn every remaining `dark:` into a `prefers-color-scheme` media query (Tailwind 3 default `media`), a visible regression for visitors with a light OS theme.

Known pairs to watch (not exhaustive): `Layout.astro` background `bg-gray-50 dark:bg-gray-950` (background-color) and the two `bg-[radial-gradient(...)]` tokens (background-image): keep `bg-gray-950` and the dark gradient only; `Layout.astro` body `text-black dark:text-white` -> `text-white`; `Header.astro` / `Footer.astro` `hover:` pairs; `PricingCard.astro` recommended-tier yellow pairs (`dark:bg-yellow-200`, `dark:border-yellow-200`, `dark:bg-yellow-500/5`); `ContactForm.astro` field `bg-*`/`border-*`/`ring-*` pairs and `focus-visible` chains; `dark:before:border-white/15` (keeps the `before:` variant).

## Out of scope

- `src/pages/**` and `tailwind.config.mjs` (NRD-14, which this story `Blocks`).
- Any colour or contrast change. If a kept dark value fails WCAG AA (for example `text-red-600`/`text-green-600` status text on the dark form background, which have no `dark:` counterpart today), QA records it as a bug; this story does not fix it.
- Collapsing duplicated utilities or reordering classes beyond the rule above (`pnpm format` on edited files only).

## Requirements and scenarios

### Requirement: no `dark:` variant in layouts and components

`rg -n 'dark:' src/layouts src/components src/scripts/contact-form.js` SHALL return nothing, and `tests/dark-variants.test.js` SHALL fail if a `dark:` token appears in any file under `src/layouts` or `src/components` or in `src/scripts/contact-form.js`.

#### Scenario: guard

- WHEN `node --test tests/dark-variants.test.js` runs after the story
- THEN it passes, and it fails with the file and line when a `dark:` token is added to any file in scope

#### Scenario: existing guards

- WHEN `node --test tests/*.test.js` runs
- THEN `tests/dark-only-cleanup.test.js`, `tests/dark-only-layout.test.js` (`<html lang="es" class="dark">`, `color-scheme: dark`) and `tests/booking-button-contrast.test.js` still pass

### Requirement: no visual change

Each element SHALL render with the colours it renders today. The `dark` class on `<html>` and `color-scheme: dark` SHALL stay.

#### Scenario: computed styles

- WHEN QA compares the built pages before and after (home, `/diseno-web-sevilla/`, `/seo-local-sevilla/`, `/contacto/`) at 375 px and desktop
- THEN text, background, border, ring and hover/focus colours of header, footer, service components, contact form (idle, sending, success, error states), FAQ, pricing cards (including the recommended tier) and breadcrumbs are identical, and contrast stays WCAG AA where it is today

#### Scenario: contact form status

- WHEN the contact form shows its info ("Enviando...") state
- THEN the status text is `text-gray-300` (today's visible colour) and the success/error states keep `text-green-600`/`text-red-600`

### Requirement: reviewable commits by component group

The change SHALL land in three commits (one per subtask), each green on `node --test tests/*.test.js` and `pnpm build`.

#### Scenario: build

- WHEN `pnpm build && pnpm check:seo:dist` runs after each subtask
- THEN it passes

## Files

| Layer | Action | Path                                                                                                                                                                                                                                                                   | Task                                                                                |
| ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `app` | create | `tests/dark-variants.test.js`                                                                                                                                                                                                                                          | 1.1 (scope list), extended in 1.2, 1.3                                              |
| `app` | modify | `src/layouts/Layout.astro`, `src/layouts/BlogPostLayout.astro`, `src/layouts/LegalLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/EntryContentStyles.astro`                                                               | 1.1 (38 lines)                                                                      |
| `app` | modify | `src/components/services/PricingCard.astro`, `ServiceHero.astro`, `FAQ.astro`, `CTASection.astro`, `ProcessSteps.astro`, `BenefitsGrid.astro`, `src/components/Breadcrumbs.astro`, `TitleSection.astro`, `InternalLinks.astro`                                         | 1.2 (36 lines)                                                                      |
| `app` | modify | `src/components/ContactForm.astro`, `src/scripts/contact-form.js`, `GoogleReviews.astro`, `AboutMe.astro`, `ExperienceItem.astro`, `LocalTrustStatus.astro`, `Hero.astro`, `SocialPill.astro`, `Projects.astro`, `LinkInline.astro`, `LinkButton.astro`, `Badge.astro` | 1.3 (41 lines, 2 of them in the script); test scope switched to the two directories |

## Interfaces

```js
// tests/dark-variants.test.js
const SCOPES = [
  /* files in 1.1-1.2; in 1.3: */ "src/layouts",
  "src/components",
  "src/scripts/contact-form.js",
];
const DARK = /(^|[\s"'`{(])dark:/m; // a class token, not a word like "dark-only" in a comment
// walk each scope (dir -> recursive), filter /\.(astro|ts|js|mjs|css)$/, report file:line of each match
```

## Data

None.

## Test plan (TDD order)

1. Task 1.1: create `tests/dark-variants.test.js` with the six 1.1 files (RED: 38 hits), clean them (GREEN). Run the full suite and `pnpm build`.
2. Task 1.2: add the nine 1.2 files to `SCOPES` (RED), clean (GREEN).
3. Task 1.3: replace the file list with the two directories plus `src/scripts/contact-form.js` (RED on the remaining files), clean (GREEN); `rg -n 'dark:' src/layouts src/components` returns 0; `pnpm build && pnpm check:seo:dist`.
4. Format only edited files.

## Real-browser / e2e checks

- Home, `/diseno-web-sevilla/`, `/seo-local-sevilla/`, `/contacto/`, one blog post (`.entry-content` from `EntryContentStyles`) and `/privacidad/` (`LegalLayout`), at 375 px and 1280 px: side-by-side screenshots against `develop` show no colour change.
- Hover and keyboard focus on header links, booking CTA, footer links, pricing tier buttons, FAQ summaries, internal links; the mobile menu open state.
- Contact form: idle, focus ring on each field, sending, success (review invite visible), error.
- Contrast spot checks with DevTools on body text, muted text (`text-gray-400/500`), links (`text-blue-400`) and the recommended tier: AA as today (DESIGN.md).

## Risks

- **Wrong pair deleted.** The main risk is removing a light token that sets a different property (e.g. `bg-gray-950` vs `bg-[radial-gradient]`) or a different variant chain. Mitigation: the rule pairs by property and variant chain; QA compares screenshots.
- **Dead state tokens coming alive.** A purely mechanical removal would make dead `hover:`/`focus:`/`active:` tokens visible (specificity trap, "What changes" 1). Mitigation: delete them (identical render); QA compares `getComputedStyle` in hover, focus and active states of the contact form fields and link, `LinkButton` and `SocialPill` against `develop`.
- **Order and overlaps.** NRD-13 `Blocks` NRD-14 (existing link). `src/components/services/ServiceHero.astro` renders the H1 that NRD-121 and NRD-124 change through data only: no textual conflict. NRD-120's `src/components/seo-local/*` use scoped CSS and no `dark:`.
- **UI.** No visual change intended; if `team-harness:ux-designer` runs, its spec is "identical rendering".

## ADRs

Relies on [0002](../adr/0002-tailwind-and-typescript.md) (Tailwind), [0006](../adr/0006-testing-node-test-and-tdd.md). No new ADR: dark-only is already decided (NRD-11, DESIGN.md).

## UI spec

Expected result: **identical render**. No screen, component, copy, layout, spacing, typography or motion changes. This section fixes what "identical" means, adds the states where the mechanical rule alone does not guarantee it, and states how QA checks it.

### Why identical is not automatic (specificity)

With Tailwind 3.4.1 and `darkMode: 'class'`, a `dark:x` utility compiles to `:is(.dark .dark\:x)`, specificity (0,2,0). A plain utility is (0,1,0); `hover:`, `focus:` and `active:` utilities are (0,2,0) and are emitted **before** the `dark` variant. So today, where an element has a `dark:` value and a `hover:`/`focus:`/`active:` utility on the same property **without** a `dark:hover:`/`dark:focus:`/`dark:active:` counterpart, the `dark:` value wins and the state colour never shows. Once the `dark:` prefix is dropped, the base becomes (0,1,0) and the state utility starts to apply: a visible change. Responsive colour variants would behave the same, but none sit next to a `dark:` colour in scope (the `sm:text-4xl/5xl` tokens set font-size, not colour).

A scan of the lines in scope found these elements whose state render would change under the rule as written:

| File and element                                                                                                            | Today's render (dark)                                                                              | Render after the rule as written                                 |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/components/ContactForm.astro` name, email, phone, message fields (`focus:border-blue-500` + `dark:border-gray-600`)    | Focused field border stays `gray-600`; only the `focus:ring-2 focus:ring-blue-500` ring shows blue | Focused border turns `blue-500`                                  |
| `src/components/ContactForm.astro` review-invite link, line 135 (`hover:text-blue-500` + `dark:text-blue-400`)              | Hover keeps `blue-400`                                                                             | Hover turns `blue-500`                                           |
| `src/components/LinkButton.astro` (`hover:border-gray-900`, `active:bg-black` + `dark:border-gray-600`, `dark:bg-gray-800`) | Hover border stays `gray-600`; pressed background stays `gray-800`                                 | Hover border `gray-900`; pressed background `black`              |
| `src/components/SocialPill.astro` (`active:bg-black` vs `dark:hover:bg-gray-100`)                                           | Pressed (hover + active) background stays `gray-100`                                               | Pressed background `black` (`active:` is emitted after `hover:`) |

- To keep the render identical, each state token in this table is **dead today** and is deleted together with its light pair: `focus:border-blue-500` (4 fields), `hover:text-blue-500` (ContactForm line 135), `hover:border-gray-900` and `active:bg-black` (LinkButton), `active:bg-black` (SocialPill). Confirmed by the Tech Lead: this is the "dead state tokens" rule in "What changes" 1, shared with NRD-14.
- Pairs checked and unaffected: `dark:text-white` + `hover:text-white` and `dark:bg-gray-800` + `hover:bg-gray-800` in LinkButton (same value); every `hover:` that has a `dark:hover:` counterpart (Header, ServiceHero, LinkInline, AboutMe, `EntryContentStyles` links, SocialPill hover); `hover:underline` / `hover:no-underline` (other property); `focus:ring-*` and `focus-visible:*` (no `dark:` on the same property).
- Global CSS checked: `body { color: rgba(17,17,17,.9) }` in `src/layouts/Layout.astro` is (0,0,1), so `text-white` on `<body>` still wins; the global rules in `src/pages/seo-local-sevilla.astro` (`main`, `.band`) set nothing on in-scope elements; Astro scoped styles use `:where()` and stay below utilities.
- `src/components/Header.astro` scoped `nav { @apply dark:bg-gray-800/90 bg-white/50; }` becomes `@apply bg-gray-800/90;`. The `nav-shadown` scroll animation (transparent at 0, shadow and ring at the end) keeps running on that background.
- `src/layouts/Layout.astro` ground: keep `bg-gray-950` and the dark radial gradient `rgba(120,119,198,0.3)`; remove `bg-gray-50` and the light gradient `rgba(217,216,255,0.5)`.

### What must stay pixel-identical

Each value is today's computed value with `<html class="dark">` and must match after each subtask (1.1, 1.2, 1.3).

- **Layouts (`Layout.astro`, `BlogPostLayout.astro`, `LegalLayout.astro`)**: page ground `gray-950` with the purple top radial halo; body text `white`; blog and legal H1 `white`; date and meta text `gray-500`; blog author link `gray-300`.
- **`.entry-content` (`src/components/EntryContentStyles.astro`)**: h2, h3, strong `white`; p, ul, ol `gray-300`; links `blue-400`, hover `blue-300`; hr and table borders `gray-700`; table header `bg-gray-900` with `white` text.
- **Header (`src/components/Header.astro`)**: nav background `gray-800/90` and its scroll shadow; link text `gray-200`, hover `blue-500`; desktop dropdown `bg-gray-800/95` with `gray-700` border; mobile drawer (open state) `bg-gray-800/95`, `gray-700` borders, accordion buttons and sub-links `gray-400`, hover `blue-500`.
- **Footer (`src/components/Footer.astro`)**: top border `gray-700`; column headings `zinc-100`; links and text `zinc-200/90`; bottom line `zinc-300/80`.
- **Service components (`src/components/services/*`, `Breadcrumbs.astro`, `TitleSection.astro`, `InternalLinks.astro`)**: cards `bg-gray-800/50` with `gray-700` border (InternalLinks `bg-gray-800/40`); headings `white` or `gray-100` as today; muted notes `gray-500`; price check icons `green-400`; recommended tier border `yellow-200`; badge and step dots `bg-yellow-200` with black text; breadcrumbs `gray-400`, current page `gray-200`; links `blue-400`.
- **Contact form (`src/components/ContactForm.astro`, `src/scripts/contact-form.js`)**: intro and labels `gray-300`; fields `bg-gray-800`, `white` text, `gray-600` border; focus shows the `blue-500` ring with the border still `gray-600`; checkbox `gray-600` border on `gray-800`; privacy link `blue-400`; status line idle and "Enviando..." `gray-300`, success `green-600`, error `red-600`; review invite `gray-300`, link `blue-400` (hover stays `blue-400`), focus-visible outline `blue-400`.
- **Shared components**: Hero and AboutMe body `gray-300`, strong `yellow-200` (Hero) / `yellow-100` (AboutMe); AboutMe photo `bg-yellow-500/5` with `white/20` ring; GoogleReviews cards like service cards, empty stars `gray-700`, author `gray-100`; ExperienceItem company `white`, date `white/80`, body `gray-300`, timeline line `white/15`; LinkInline `yellow-200`, hover `yellow-300`; LinkButton and SocialPill `bg-gray-800`, `gray-600` border, `white` text, SocialPill hover inverts to `bg-gray-100` with black text; Badge `bg-gray-800` with `white/80` text; LocalTrustStatus and Projects strong/headings `gray-100`.

### States

- Hover, keyboard focus (`focus-visible`), pressed (`active`) and the mobile menu open state look as today on every interactive element above. Loading, empty, partial and disabled: n/a (no data-driven change). Contact form states: idle, sending, success, error as listed.

### Copy, layout, responsive, design system

- Copy: n/a, no string changes.
- Screens, layout, hierarchy and responsive behaviour (320 px to desktop): n/a, unchanged; the class edits must not touch layout, spacing or breakpoint utilities.
- Design system: the existing Tailwind gray, zinc, blue and yellow scale only; no new tokens or components.

### Accessibility hand-off

- Focus order, accessible names and announcements: unchanged. Contrast stays where it is today; the existing `text-green-600` / `text-red-600` status text on the dark form is out of scope (a bug if it fails AA, per the design).

### How QA checks it

1. Build `develop` and the story branch and serve both. On home, `/diseno-web-sevilla/`, `/seo-local-sevilla/`, `/contacto/`, one blog post and `/privacidad/`, at 375 px and 1280 px, take full-page screenshots and diff them (expected: no diff outside dynamic content).
2. For each element in "What must stay pixel-identical", compare DevTools computed `color`, `background-color`, `background-image`, `border-color`, `box-shadow` (ring) and `outline-color` between both builds, including forced `:hover`, `:focus`, `:focus-visible` and `:active` (DevTools "Force state").
3. Check the four rows of the specificity table explicitly: focused contact field border stays `gray-600`; review-invite link hover stays `blue-400`; LinkButton hover border and pressed background unchanged; SocialPill pressed background unchanged.
4. Contact form: idle, focus on each field, "Enviando...", success (review invite visible), error.
5. `rg -n 'dark:' src/layouts src/components src/scripts/contact-form.js` returns nothing; `<html lang="es" class="dark">` and `color-scheme: dark` remain.

## Tasks

- [x] 1.1 [NRD-154 app] Remove `dark:` from layouts, header, footer and `EntryContentStyles`; tests: create `tests/dark-variants.test.js` scoped to those six files first (RED).
- [x] 1.2 [NRD-155 app] Remove `dark:` from service components, breadcrumbs, title section and internal links; tests: add the nine files to the guard first (RED).
- [ ] 1.3 [NRD-156 app] Remove `dark:` from the contact form (component and `contact-form.js`) and the remaining shared components; tests: switch the guard to `src/layouts`, `src/components` and `contact-form.js` first (RED).
