# NRD-15 - Booking call CTA in the site header

## Why

[NRD-15](https://nuriaromerodev.atlassian.net/browse/NRD-15) (M1, epic NRD-2). Booking a call is the site's one primary conversion (PRD principle 4). A visitor convinced while reading any page should not have to scroll to find it.

Current state (verified in code, differs from the story text): the mobile drawer already renders `<BookingButton class="w-full" />` as its first item (`src/components/Header.astro:152-154`, guarded by `tests/google-calendar-reserva.test.js` "mobile navigation keeps the booking CTA"). Only the desktop nav bar (`Header.astro:59-137`, links visible from `md`) has no CTA. Story scope therefore reduces to the desktop bar.

## What changes

- One `BookingButton` in the desktop nav bar, visible from `md` (768 px) up, hidden below.
- The mobile drawer CTA stays as is. At any viewport exactly one booking link is visible in the header: bar from `md`, drawer below `md` (the drawer and its toggle are `md:hidden`).
- New `tests/header-booking-cta.test.js`.

## Out of scope

- `BookingButton` label and styles site-wide (it is shared by the home, contact and service heroes).
- Mobile bar CTA (a compact button next to the hamburger): not needed because the drawer CTA exists; the UX spec may revisit it in another story.
- The floating WhatsApp button, the mobile menu script, CSP.

## Requirements and scenarios

### Requirement: desktop header CTA

The header nav bar SHALL show one booking CTA linking to `bookingUrl` (`src/data/site.ts:54`) through `BookingButton`, visible from 768 px, without overflow or overlap from 768 to 1440 px.

#### Scenario: desktop

- WHEN a visitor views any page at 1024, 1280 or 1440 px
- THEN the nav bar shows the booking CTA after the nav links, on one line, with no overflow

#### Scenario: tablet

- WHEN the viewport is 768-1023 px
- THEN the CTA is visible and the bar does not overflow or wrap

### Requirement: one booking link per breakpoint

The header MUST never show two booking CTAs at the same time.

#### Scenario: mobile

- WHEN the viewport is below 768 px
- THEN the bar shows no CTA and the drawer shows its existing CTA when opened

#### Scenario: source guard

- WHEN `Header.astro` is changed
- THEN `tests/header-booking-cta.test.js` fails unless there are exactly two `BookingButton` usages, one in the bar hidden below `md`, one in `#mobile-menu`, and no raw booking URL

### Requirement: accessible CTA

The CTA SHALL have an accessible name, a visible focus ring and be reachable by keyboard in DOM order after the nav links; the mobile menu MUST still open and close with keyboard and touch.

#### Scenario: keyboard

- WHEN a keyboard user tabs through the desktop header
- THEN focus moves logo -> Servicios -> Casos de éxito -> Sobre mí -> Contacto -> CTA, with a visible ring, and Enter opens the booking page in a new tab

### Requirement: no layout or CSP regression

The fixed header height and the hero CLS MUST NOT change; no new external origin.

#### Scenario: CLS

- WHEN the home loads at 375 and 1280 px
- THEN the header height equals today's and Lighthouse CLS is not worse than the NRD-18 baseline

## Files (layer `app`)

| Action | Path                               | Notes                                             |
| ------ | ---------------------------------- | ------------------------------------------------- |
| create | `tests/header-booking-cta.test.js` | source-level, `readSource` pattern                |
| modify | `src/components/Header.astro`      | add bar CTA; maybe `navLinkClass` padding at `md` |

## Interfaces

In `Header.astro`, inside `<nav>` after the desktop `<ul class="hidden md:flex ...">` and before `#mobile-menu-btn`:

```astro
<BookingButton
  class="hidden md:inline-flex ml-2 shrink-0 whitespace-nowrap"
  label="Reservar"
  ariaLabel="Reservar una primera sesión"
/>
```

Decisions, taken after the UI spec raised them:

- **Label.** The bar's visible text is `Reservar`, with the calendar icon, at every desktop width (768 px and up). The full label "Reserva una primera sesión" does not fit at 768 px (UI spec estimate: about 855 px of content in about 730 px of space). The heroes, pricing cards and drawer keep the full label. A per-breakpoint label in `BookingButton` and a second instance in the bar are both rejected: the first changes the shared component for one use, the second breaks the one-link-per-breakpoint guard.
- **Accessible name.** `ariaLabel` does not have to be identical to the visible text. It must start with the visible text, so it satisfies label-in-name (WCAG 2.5.3). `Reservar una primera sesión` meets that.
- **Overflow at 768-1023 px.** Step 1: set `navLinkClass` to `px-2.5 lg:px-3.5`. Step 2, only if QA still measures overflow: hide the CTA icon between 768 and 1023 px. To do that, add an optional, backward-compatible `iconClass?: string` prop to `BookingButton.astro`, merged into the `CalendarIcon` class list (default unchanged), and pass `iconClass="md:max-lg:hidden"` from the header. Showing the CTA only from 1024 px is rejected: below `lg` the hamburger and drawer are hidden (`md:hidden`), so tablets would get no booking link at all.
- **"Reservar una llamada"** (the story's suggestion) is not used. It does not fit, and "llamada" appears in no other CTA on the site. This is a copy choice inside the AC's "unless the UX spec decides otherwise". I flagged it to the PO in the tracker; it is not radical.

## Data

None. `bookingUrl` already lives in `src/data/site.ts`; the booking origin is opened as a link (no CSP change).

## Test plan (TDD order)

1. `tests/header-booking-cta.test.js` (RED):
   - count `<BookingButton` in `Header.astro` === 2.
   - the substring between `<nav` and `</nav>` contains `<BookingButton` whose `class` has `hidden`, `md:inline-flex` and `whitespace-nowrap`, with `label="Reservar"` and an `ariaLabel` that starts with `Reservar` (label-in-name).
   - the drawer `<BookingButton` keeps the default label (no `label=` prop).
   - only if the overflow fallback is applied: `BookingButton.astro` declares `iconClass?: string` and passes it to `CalendarIcon` alongside `size-4`; the header's bar instance passes `iconClass="md:max-lg:hidden"`. `tests/google-calendar-reserva.test.js` must stay green: default label, `aria-hidden` icon, `booking-first-word`.
   - the substring from `id="mobile-menu"` (the drawer, not the button's `aria-controls`; match `<div\s+id="mobile-menu"`) contains the other `<BookingButton`.
   - `Header.astro` contains no `bookingUrl`, `calendar.google.com` or `href=` pointing to the booking URL.
   - `id="mobile-menu-btn"` with `aria-controls="mobile-menu"` and `aria-expanded` still present.
2. Implement (GREEN); full suite (existing `tests/google-calendar-reserva.test.js` stays green); `pnpm build`.

## Real-browser / e2e checks

- 1440, 1280, 1024, 900, 768 px: CTA visible on one line, no overflow, no overlap with the Servicios dropdown (open it by hover and by focus).
- 375 and 320 px: no CTA in the bar; open the drawer by touch and by keyboard (Enter/Space on the toggle, Escape or toggle to close); the drawer CTA is present once; floating WhatsApp button does not overlap the header.
- Keyboard focus order and visible ring on the CTA (dark theme, `<html class="dark">` fixed).
- Header height and hero position unchanged versus production screenshots; Lighthouse CLS on `/` mobile and desktop not worse than the NRD-18 baseline.

## Risks

- AC wording "the header renders exactly one link to `bookingUrl`" is read as "exactly one visible per breakpoint": the drawer CTA already exists in the same component, so the DOM holds two links with mutually exclusive visibility. Flagged to the PO in the tracker comment.
- Width at 768 px: the logo, four links and the CTA may not fit even with the short label. Handled first by the `md` padding rule, then by hiding the icon from 768 to 1023 px (see Interfaces). The CTA is never moved to 1024 px and up.
- The short visible label `Reservar` is vaguer than the full promise. That is acceptable because the header pill is a persistent shortcut, the accessible name carries the full meaning, and every other CTA keeps the full label.
- Size: the mobile part already exists, so the story is likely smaller than 3 points (PO's call).
- Must not reach production before the NRD-18 baseline (`NRD-18 Blocks NRD-15`).

## ADRs

0003 (data from `src/data`), 0007 (CSP), 0008 (Spanish copy).

## UI spec

Scope: the desktop nav bar of `src/components/Header.astro` only. Mobile drawer, `BookingButton` internals and every other page stay untouched. Site theme is dark (`<html class="dark">`), so the dark-variant classes are the ones the visitor sees.

### Header bar CTA (768 px and up)

**Layout and order.** Inside `<nav>`, left to right: logo link, the desktop `<ul>` (Servicios, Casos de éxito, Sobre mí, Contacto), then the CTA, then `#mobile-menu-btn` (already `md:hidden`, so at `md`+ the CTA is the last visible item). The CTA sits inside the existing rounded-full nav capsule, vertically centred by the nav's `items-center`; no divider, no extra wrapper.

- Markup, exactly one instance in the bar, as in Interfaces: `<BookingButton class="hidden md:inline-flex ml-2 shrink-0 whitespace-nowrap" label="Reservar" ariaLabel="Reservar una primera sesión" />`. `whitespace-nowrap` keeps the label on one line so the bar height cannot change.

**Label** (Interfaces, decisions "Label", "Accessible name" and "Reservar una llamada").

- Visible text: `Reservar`, with the existing calendar icon, at every desktop width from 768 px. The full label does not fit at 768 px (estimate with Onest 16 px medium: about 855 px of content against about 730 px available). Heroes, pricing cards and the mobile drawer keep "Reserva una primera sesión".
- Accessible name: `Reservar una primera sesión` (via `ariaLabel`). It starts with the visible text, as the label-in-name rule (WCAG 2.5.3) requires; it does not have to be identical. Spanish per ADR 0008.
- "Reservar una llamada" (story suggestion): not used; copy decision taken by the Tech Lead and flagged to the PO.

**Hierarchy.** The CTA is the only filled control in the bar and the primary action of every page header; nav links stay secondary text links. Reading order: logo, links, CTA. Do not add a second filled or outlined control to the bar.

**Spacing and fit.**

- Overflow step 1 (Interfaces, decision "Overflow at 768-1023 px"): change `navLinkClass` padding from `px-3.5` to `px-2.5 lg:px-3.5`, so 768-1023 px keeps about 45 px of slack (estimated total about 684 px) and 1024 px+ is visually identical to today plus the CTA (about 715 px at 1024 px).
- Overflow step 2, only if QA still measures overflow at 768-1023 px after step 1: hide the calendar icon in that range through the new optional `iconClass` prop of `BookingButton.astro` (default unchanged), passing `iconClass="md:max-lg:hidden"` from the bar instance. The pill then reads `Reservar` text only from 768 to 1023 px and gets its icon back from 1024 px; the accessible name does not change. Do not shorten the label, hide nav links or move the CTA to `lg` instead (rejected in the design).
- `ml-2` (8 px) between the last link's padding and the pill; `shrink-0` keeps the pill intact.
- Height: the pill is about 42 px (`py-2`, 24 px line height, 1 px border), below the 48 px `min-h-12` of the nav links, so the fixed header height does not change.
- Font size: inherits the nav's `text-base` (16 px) at `md`+; do not override.

**Design system reuse.**

- `src/components/BookingButton.astro`: the site-wide booking pill (DESIGN.md "Buttons and focus", `action-blue` fill, `action-blue-border` border; in Tailwind `bg-blue-600 border-blue-700`, dark `bg-blue-500 border-blue-400`, hover one step lighter, white text, `rounded-full`, `focus-visible:ring ring-blue-500/80 ring-offset-2`). No new colours, radii or tokens.
- `src/components/icons/Calendar.astro` (through `BookingButton`, `aria-hidden`; its class can take `iconClass` only in the overflow step 2 fallback).
- Nav capsule styles in `Header.astro` (`bg-white/50 dark:bg-gray-800/90`, scroll-driven shadow/blur) unchanged; the solid blue pill reads on both the transparent top state and the blurred scrolled state.
- New component: none.

**States.**

- Default, hover (`hover:bg-blue-500` / dark `hover:bg-blue-400`), focus-visible ring: inherited from `BookingButton`, no changes.
- Active/current page: n/a (external link; never `aria-current`, never `text-blue-500`).
- Loading, empty, error, disabled: n/a (static link, no data).

**Responsive.**

| Width         | Bar                                                              | Drawer                                                    |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| 320-767 px    | No CTA (`hidden`); logo + hamburger as today                     | Existing full-width `BookingButton` first item, unchanged |
| 768-1023 px   | Logo, 4 links at `px-2.5`, CTA `Reservar`; one line, no overflow | Not rendered visibly (`md:hidden`)                        |
| 1024-1440 px+ | Logo, 4 links at `px-3.5`, CTA `Reservar`; one line              | Same                                                      |

- Mobile bar CTA: n/a in this story (drawer CTA covers it, per design Out of scope).
- If QA measures overflow at 768 px despite the padding rule, apply overflow step 2 (icon hidden at 768-1023 px via `iconClass`), described under "Spacing and fit".

**Interactions.**

- Click / Enter opens the booking page in a new tab (`target="_blank"`, inherited). No confirmation, no optimistic state.
- The Servicios dropdown opens centred under Servicios (`min-w-56`) and must not cover the CTA at 768 px; verify on hover and focus.
- Transition: the existing colour `transition` only; no new motion, so nothing to gate for `prefers-reduced-motion`.

**Accessibility hand-off.**

- Tab order: logo, Servicios, (dropdown items when focus-within opens it), Casos de éxito, Sobre mí, Contacto, CTA. The CTA is last in DOM inside `<nav>` before the hidden hamburger.
- Accessible name `Reservar una primera sesión`; the icon stays `aria-hidden`.
- Focus ring: the existing `ring-offset-2` uses Tailwind's default white offset, which shows as a white gap on the dark capsule; this matches every other booking CTA on the site, so keep it (flag only if `a11y-responsive` reports contrast issues).
- New-tab behaviour is not announced, same as every other booking CTA; unchanged in this story.

### Mobile drawer CTA (below 768 px)

n/a: unchanged (`<BookingButton class="w-full" />` first item of `#mobile-menu`, full label).

## Tasks

- [x] 1.1 [NRD-45 app] Add the desktop booking CTA (`Reservar`, aria "Reservar una primera sesión") to the header bar, one booking link per breakpoint, padding rule at `md`, and the icon-hiding fallback only if QA measures overflow at 768 px; tests: `tests/header-booking-cta.test.js` first.
