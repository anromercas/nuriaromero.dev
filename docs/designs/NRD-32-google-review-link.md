# NRD-32 - Google review request link and client review template

## Why

[NRD-32](https://nuriaromerodev.atlassian.net/browse/NRD-32) (M1, epic NRD-2). Source: S-2026-11-13-2. The local pack and the ChatGPT answers for "seo local / agencia seo sevilla" show competitors with 4 to 77 Google reviews. nuriaromero.dev is absent, and the site gives the owner no tool to ask happy clients for a review. This story gives the site and the owner that tool, without inventing proof.

Current state (verified in code):

- The verified GBP lives in `src/data/local-trust.ts:18-29`. `placeId` `ChIJ8Uv-vM9f0CoR8J75dj4I0HM` is written twice there (`profileUrl`, `placeId`) and once more in `src/data/site.ts:46` (`sameAs`).
- Read-reviews links are built inline from the Places API `placeId` in `src/components/GoogleReviews.astro:77` and `src/components/seo-local/RealProof.astro:37`.
- The contact form status is a text-only live region (`src/components/ContactForm.astro:110-113`). `src/scripts/contact-form.js:79` sets it with `textContent`, so it cannot hold a link.
- The footer (`src/components/Footer.astro:54`) prints "Sevilla y su área metropolitana" and no street address. `localTrust.gbp.serviceArea` says "Sevilla y área metropolitana". `localTrust.gbp.publicAddress` repeats `SITE.address.full` as a literal.

## What changes

- `local-trust.ts`: one `GBP_PLACE_ID` const, from which `placeId`, `profileUrl` and a new `writeReviewUrl` are derived.
- Contact form success state: a hidden `<p id="form-review-invite">` rendered at build time with the link. `contact-form.js` reveals it on success only.
- Footer: full GBP address (`SITE.address.full`) plus the service area from `localTrust.gbp.serviceArea`. `publicAddress` reads `SITE.address.full`. NAP test.
- `docs/google-review-request-template.md`: Spanish email and WhatsApp templates with the same link, plus a sync test.

## Out of scope

- The reviews block itself (NRD-16) and `aggregateRating` (NRD-19).
- Any count, rating or review text on the site (invariant "Real proof only").
- Replacing the `placeId` in `site.ts` `sameAs` and in the two read-reviews links: they are not the review-request link. A follow-up may unify them.
- Sending requests to clients (manual, by the owner).
- Privacy pages: no new data, processor or tracker. The link is a plain navigation to Google.

## Requirements and scenarios

### Requirement: single source for the review URL

The GBP write-review URL SHALL be `https://search.google.com/local/writereview?placeid=<GBP_PLACE_ID>`, derived once in `src/data/local-trust.ts`, and reused everywhere.

#### Scenario: no duplicates

- WHEN `tests/google-review-link.test.js` scans `src/**`
- THEN `writereview` appears only in `local-trust.ts`, and the place id literal appears once there

### Requirement: optional review invite on success

After a successful contact submission the form SHALL show a short Spanish line inviting existing clients to leave a Google review, linking to `writeReviewUrl` in a new tab with `rel="noopener noreferrer"`. It MUST NOT be a condition or an incentive, and MUST NOT appear in the idle, sending or error states.

#### Scenario: success

- WHEN Formspree answers `ok`
- THEN `#form-status` shows the existing success text and `#form-review-invite` becomes visible with the link

#### Scenario: error or resubmit

- WHEN the submission fails, or a new submission starts
- THEN `#form-review-invite` is hidden

#### Scenario: no incentive

- WHEN the invite copy is read
- THEN it contains no reward, discount, draw or condition wording

### Requirement: consistent NAP

Name, address and phone MUST be identical in the footer, the `localBusinessSchema` JSON-LD and `local-trust.ts`. The La Rinconada address and the "Sevilla y área metropolitana" service area MUST come from data.

#### Scenario: NAP test

- WHEN `tests/nap-consistency.test.js` runs
- THEN the footer renders `SITE.name`, `SITE.address.full`, `SITE.phone` (`tel:+${SITE.whatsapp}`) and `localTrust.gbp.serviceArea`, with no literals; `publicAddress` is `SITE.address.full`; and `full` equals `street, postalCode municipality, region`

#### Scenario: built pages

- WHEN `pnpm build` runs, followed by `check:seo-10:dist` and `check:seo-11:dist`
- THEN both pass

### Requirement: review request template

`docs/google-review-request-template.md` SHALL contain a Spanish email template and a WhatsApp template using the same URL, and Google's policy rules.

#### Scenario: template in sync

- WHEN the place id in `local-trust.ts` changes
- THEN `tests/review-template-sync.test.js` fails until the doc uses the new URL

## Files (layer `app`)

| Action | Path                                     | Notes                                                                |
| ------ | ---------------------------------------- | -------------------------------------------------------------------- |
| modify | `src/data/local-trust.ts`                | `GBP_PLACE_ID`, `writeReviewUrl`, `publicAddress: SITE.address.full` |
| modify | `src/components/ContactForm.astro`       | hidden invite paragraph under `#form-status`                         |
| modify | `src/scripts/contact-form.js`            | toggle `#form-review-invite`                                         |
| modify | `src/components/Footer.astro`            | full address and service area from data                              |
| create | `docs/google-review-request-template.md` | Spanish templates                                                    |
| create | `tests/google-review-link.test.js`       |                                                                      |
| create | `tests/nap-consistency.test.js`          |                                                                      |
| create | `tests/review-template-sync.test.js`     |                                                                      |

## Interfaces

```ts
// src/data/local-trust.ts
import { SITE } from "@/data/site";

const GBP_PLACE_ID = "ChIJ8Uv-vM9f0CoR8J75dj4I0HM";

export const localTrust = {
  gbp: {
    status: "verified" as TrustStatus,
    placeId: GBP_PLACE_ID as string | null,
    profileUrl:
      `https://www.google.com/maps/place/?q=place_id:${GBP_PLACE_ID}` as
        string | null,
    // "Write a review" dialog of the verified profile; used by the contact
    // success state and docs/google-review-request-template.md.
    writeReviewUrl:
      `https://search.google.com/local/writereview?placeid=${GBP_PLACE_ID}` as
        string | null,
    publicAddress: SITE.address.full as string | null,
    serviceArea: "Sevilla y área metropolitana",
  },
  socialProof: [] as SocialProofRecord[],
} as const;
```

Check that `site.ts` does not import `local-trust.ts`; today it imports nothing, so there is no cycle.

```astro
<!-- src/components/ContactForm.astro, inside the status row, after #form-status -->
{showReviewInvite && (
  <p id="form-review-invite" hidden class="text-sm text-gray-300">
    ¿Ya has trabajado conmigo? Si te apetece, puedes
    <a
      href={localTrust.gbp.writeReviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="underline"
    >
      dejar una reseña en Google
    </a>
    .
  </p>
)}
```

`showReviewInvite = localTrust.gbp.status === "verified" && Boolean(localTrust.gbp.writeReviewUrl)`. The row is currently `flex justify-end`. The UI spec decides the final placement: it can sit below the button row so the live region and the button do not reflow.

`contact-form.js`, inside `initContactForm`:

- `const reviewInvite = document.getElementById('form-review-invite')` (may be null).
- At submit start and in the error and catch branches: `if (reviewInvite) reviewInvite.hidden = true`.
- In the `res.ok` branch: `reviewInvite.hidden = false`.

## Data

`local-trust.ts` shape gains `writeReviewUrl`. No schema or storage change. JSON-LD output is unchanged: `hasMap` still uses `SITE.mapsUrl`, and `sameAs` is untouched.

## Test plan (TDD order)

1. `tests/google-review-link.test.js` (RED, task 1.1): source-level checks of the derived URL, the single literal, the hidden paragraph with `target`/`rel`, the toggle in each script branch, and the no-incentive regex. Then implement (GREEN). `tests/google-calendar-reserva.test.js` and the other form tests stay green.
2. `tests/nap-consistency.test.js` (RED, task 1.2). Footer and `publicAddress` changes (GREEN). Then `pnpm build`, `check:seo-10:dist`, `check:seo-11:dist`, `check:seo-02:dist`.
3. `tests/review-template-sync.test.js` (RED, task 1.3), then the doc (GREEN).

## Real-browser / e2e checks

- `/contacto/` at 375 and 1280 px:
  - Submit with Formspree mocked or a real test message; the owner deletes it afterwards.
  - After success: the invite appears, the link opens the Google review dialog in a new tab, and focus is not stolen.
  - On error (offline in DevTools): no invite.
  - Submit again: the invite hides while sending.
- The live region still announces the success text (screen reader or the Accessibility pane).
- Footer on `/` and `/seo-local-sevilla/` at 320 and 375 px: the full address wraps without overflow.
- Dark contrast of the invite text and link is at least 4.5:1.

## Risks

- The `writereview?placeid=` URL is Google's documented share pattern, but Google can change it. One const keeps that change to a single edit, and QA checks that the link opens the dialog.
- The footer gains a line on every page. This is a visible change requested by the NAP criterion. The UI spec owns the layout.
- Size: three small work units, which can look large for 2 points. The NAP footer change is the extra part; the PO may consider 3.

## ADRs

0003 (data in `src/data`), 0007 (contact form, CSP: no new origin, navigation only), 0008 (Spanish copy).

## UI spec

Scope: two refinements of existing old-world components (DESIGN.md "Known Drift": the contact page, `ContactForm` and `Footer` use the Tailwind gray/blue styling, with `<html class="dark">` fixed). Both keep the incumbent look; no new token, colour, font or component. Mode: Operate (the visitor has just finished a task). No "New component".

### 1. Contact form: review invite on success (`src/components/ContactForm.astro`, `src/scripts/contact-form.js`)

**Layout and placement**

- Wrap the existing status row (`div.flex.items-center.justify-end.gap-3` holding `#form-status` and `#submit-btn`) and the new invite in one `<div class="space-y-3">`, so the invite sits 0.75rem below the row instead of inheriting the form's `space-y-6` (1.5rem) gap. The status row itself is unchanged. Assumption: the tighter gap ties the invite to the success message it follows.
- `#form-review-invite` is the last child of that wrapper, below the button row, full width of the form column, text left-aligned. It never sits inside the flex row, so showing it does not reflow the live region or move the button. Assumption: below the row was the placement the design left open; left alignment keeps a multi-line sentence readable in the narrow md two-column layout (form column is about 330 px at 768 px).
- DOM order: status, button, invite. After a submit, focus stays on `#submit-btn`; the next Tab reaches the review link.

**Hierarchy**

- Primary information in the success state stays the existing green status text. The invite is secondary: same `text-sm` size, neutral colour, no icon, no button styling, no box. It must read as an optional aside, never as a next step or a call to action.

**Copy (Spanish, exact)**

- Paragraph: `¿Ya has trabajado conmigo? Si te apetece, puedes ` + link + `.`
- Link text: `dejar una reseña en Google`
- Visually hidden suffix inside the link: ` (se abre en una pestaña nueva)` in a `<span class="sr-only">`. Assumption: the link opens a new tab and screen-reader users should know before activating it; sighted users get no extra text, to keep the line short.
- The final period follows `</a>` with no whitespace in between (the Interfaces snippet's line break before `.` would render "Google ." with a space). Assumption: typographic correctness.
- The wording is the design's and contains no reward, discount, draw or condition wording (no-incentive scenario). The existing success text is unchanged.

**Design system reuse**

- Paragraph: `text-sm text-gray-600 dark:text-gray-300` (the classes of `#form-status` in its idle state, `ContactForm.astro`), replacing the snippet's bare `text-gray-300` so it follows the form's light/dark pairs.
- Link: the privacy-policy link pattern of the same form, `text-blue-600 underline dark:text-blue-400`, plus `hover:text-blue-500` (footer link hover) and `rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400`. Assumption: the form's links have no explicit focus style today; a visible outline in an existing blue step is the minimum for a link revealed after an async action.
- Visibility uses only the `hidden` attribute. Do not put a `display` utility (`block`, `flex`) on the paragraph: it would override the attribute.
- Contrast on the dark ground (gray-950): gray-300 about 13:1, blue-400 about 7:1; both pass 4.5:1.

**States**

| State                                         | `#form-status`      | `#form-review-invite`                                                |
| --------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| Idle (page load, View Transitions navigation) | empty               | hidden (build-time `hidden`)                                         |
| Client validation error                       | error text          | hidden                                                               |
| Sending (`Enviando…`, button disabled)        | empty               | hidden                                                               |
| Success (`res.ok`)                            | existing green text | visible                                                              |
| Server error / network error                  | error text          | hidden                                                               |
| Resubmit after success                        | cleared             | hidden again at submit start                                         |
| GBP not verified or no `writeReviewUrl`       | as above            | not rendered (`showReviewInvite` false); the script tolerates `null` |

- The client validation branch (`!form.checkValidity()`) also hides the invite. Assumption: the design lists submit start, error and catch; validation returns before submit start, so a success followed by an invalid resubmit would otherwise leave the invite next to an error message. This stays inside `contact-form.js`.
- `form.reset()` on success does not hide the invite.

**Interactions**

- No animation or transition on reveal: it appears with the success text. No auto-hide timer, no focus move, no scroll.
- Link: `target="_blank"`, `rel="noopener noreferrer"`. Plain navigation; no click tracking.

**Responsive**

- 320 to 767 px: form full width; the invite wraps to two or three lines under the button row.
- 768 px and up (`md:grid-cols-2` in `src/pages/contacto.astro`): same position in the narrow form column; wrapping is expected, no truncation, no `whitespace-nowrap`.

**Accessibility hand-off**

- The invite is outside the `aria-live` region on purpose: the live region keeps announcing only the success text. Do not add `aria-live`, `role="status"` or `role="alert"` to the invite.
- Focus order after success: button, then review link. Accessible name of the link: "dejar una reseña en Google (se abre en una pestaña nueva)".

### 2. Footer: NAP address and service area (`src/components/Footer.astro`)

**Layout and placement**

- Third column only (`<address>` under the `{SITE.name}` heading). Line order:
  1. `{SITE.address.full}`: "Camino Andalucía, 426, 41309 La Rinconada, Sevilla"
  2. `Zona de servicio: {localTrust.gbp.serviceArea}`: "Zona de servicio: Sevilla y área metropolitana"
  3. email (unchanged)
  4. phone (unchanged)
  5. LinkedIn · GitHub (unchanged)
- Lines 1 and 2 replace the current single line `{SITE.address.locality} y su área metropolitana`. Each is a `<p>` in the existing `space-y-1.5` stack, with the classes inherited from `<address>` (`text-sm not-italic text-zinc-800/90 dark:text-zinc-200/90`).
- Copy: the label `Zona de servicio:` is the only new literal. Assumption: a bare "Sevilla y área metropolitana" right under a La Rinconada street address reads as a second address; the label says it is the coverage area. Address and area values come only from data (NAP test).
- The address is plain text, not a link (a Maps profile link is out of scope).

**Hierarchy, states, interactions**

- The column heading stays the name; address first because NAP reads name, address, phone. Assumption: NAP order.
- Static: no states, no new interactions. The other columns, the bottom row and the legal row are untouched.

**Responsive**

- 320 to 639 px: one column; the address wraps onto two lines at 320 px with no horizontal overflow.
- 640 px and up (`sm:grid-cols-3`): the column is about 200 px wide and the address wraps to three lines. Natural wrapping only: no `whitespace-nowrap`, no truncation, no manual `<br>` (the test reads `SITE.address.full` as one expression).

**Accessibility hand-off**

- Keep the `<address>` element; no new focusable elements.

### Checklist coverage

Screens and layout, hierarchy, states, copy, design-system reuse, responsive, interactions and accessibility are covered above for both components. Loading and empty data states: n/a beyond the form states table (static build, no fetched data).

## Tasks

- [x] 1.1 [NRD-53 app] Derive `writeReviewUrl` from one `GBP_PLACE_ID` in `local-trust.ts` and reveal the optional review invite on the contact success state; tests: `tests/google-review-link.test.js` first.
- [x] 1.2 [NRD-54 app] Footer shows `SITE.address.full` and the service area from `localTrust`, and `publicAddress` reads `SITE.address.full`; tests: `tests/nap-consistency.test.js` first.
- [x] 1.3 [NRD-55 app] Spanish email and WhatsApp review request template in `docs/` with the same URL; tests: `tests/review-template-sync.test.js` first.
