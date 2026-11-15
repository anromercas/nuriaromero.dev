# NRD-17 - Measurement baseline: GA4 and Search Console verified in production, SEO KPI and AI-citation baseline

## Why

[NRD-17](https://nuriaromerodev.atlassian.net/browse/NRD-17) (SEO method phase 0, epic NRD-2, M1 exit criterion). Every later SEO story (NRD-22, NRD-73, NRD-74, NRD-78) is unmeasurable without a dated baseline. Search Console access and a first GSC baseline already exist (PR #18, `docs/seo-audit/measurement-seo.md`, section "Línea base 2026-11-14"). NRD-67 (gtag wrapper) reached production with the 2026-11-15 promotion (PR #27), so the GA4 criteria can now be checked.

Current state (verified in code on `develop` 6c7b03c):

- **No conversion event is ever sent.** `src/scripts/analytics-consent.js:2-8` allowlists `contact_click`, `form_submit`, `form_error`, `generate_lead`, `whatsapp_click` and exposes `trackEvent` (`:68`), but nothing calls it (`rg trackEvent src` finds only the definition). The booking CTA (`src/components/BookingButton.astro:24,38`, `bookingUrl` in `src/data/site.ts:54`), the WhatsApp button (`src/components/WhatsAppButton.astro`, `whatsappUrl` in `src/data/site.ts:52`), the `tel:` links (`Footer.astro:63`, `contacto.astro:62`, `SeoLocalNap.astro:15`) and the form success (`src/scripts/contact-form.js:86`) are not wired. The AC "the documented event names arrive in GA4 DebugView" and the booking-click baseline therefore need a small code change. The measurement protocol (`measurement-seo.md`, "Taxonomía de eventos") already documents these names; the AC is the approved attribution need it asks for.
- **`check-seo-14` is red on `develop`.** `scripts/check-seo-14.mjs` (last `expect`) fails on any "N clics / N impresiones / N consultas" anywhere in `measurement-seo.md`; the real 2026-11-14 baseline ("1.199 impresiones, 2 clics") trips it (`node scripts/check-seo-14.mjs` exits 1 today). NRD-21 solved the same problem for `check-seo-13` with `scripts/lib/register-metrics.mjs` (`findUnsourcedMetrics`: numbers only inside `## Línea base YYYY-MM-DD` sections with `Fuente:` and `Fecha de captura:`). Reuse it.
- Google API access: read-only service account, entry point `~/.config/claude-seo/run.sh <gsc_query|gsc_inspect|ga4_report|...>` (outside the repo; never read or print the key or config).
- Position baseline: the latest rank capture is `seo/ranks/history.jsonl`, date 2026-11-13 (12 keywords at Seville, mobile). `seo/` is not tracked in git; it lives in the main checkout only. The doc quotes its date and figures, it does not depend on the file being in the branch.
- `.claude/state/seo/2026-11-13.md` and `2026-11-15.md` (untracked, main checkout) already hold Seville SERP observations, including AI Overview presence for 5 seed terms.

## What changes

1. `findUnsourcedMetrics` accepts a metric pattern; `check-seo-14` uses it with a KPI pattern, so numbers are allowed only in dated, sourced baseline sections. The 2026-11-14 baseline becomes such a section. `check-seo-14` goes green.
2. Consent-gated conversion events are wired with no markup change: one delegated click listener maps the booking link, WhatsApp, `tel:` and `mailto:` links to the allowlisted events; the contact form reports `form_submit` through a DOM event, so the controller stays private to the consent component.
3. GA4 is verified on the live site (accept, reject, revoke) and the event names are verified at the collection endpoint.
4. The GSC KPI baseline is refreshed (28 days) for `/`, `/seo-local-sevilla/` and every in-focus service page, with top queries per page, the position baseline (rank capture 2026-11-13), the sitemap read status and the `/servicios/*` recheck.
5. AI-citation baseline: AI Overview presence and nuriaromero.dev citation for the tracked keywords (DataForSEO), plus the manual ChatGPT/Perplexity prompt check (a checklist for the user if no agent can run it).
6. A "Pendientes de la usuaria" list that names everything that needs the owner.

## Out of scope

- New events, new parameters with personal data, GTM, conversions configured in the GA4 UI (listed for the user), a new tracker or processor.
- Any visual change to CTAs, the consent panel or pages. The consent panel fixes are NRD-69 and NRD-70 (same sprint, after this story).
- New rank-tracking tooling (the AC forbids it).
- Committing raw API exports or anything under `~/.config/claude-seo/`.

## Requirements and scenarios

### Requirement: sourced KPI figures only

`docs/seo-audit/measurement-seo.md` MAY contain KPI figures ("N clics", "N impresiones", "N consultas", "N conversiones", "posición: N") only inside a section whose heading matches `^## Línea base \d{4}-\d{2}-\d{2}` and whose body has a non-empty `Fuente:` line and a valid `Fecha de captura: YYYY-MM-DD` line. Anywhere else `check-seo-14` MUST fail with an `SEO-14:` message.

#### Scenario: unsourced KPI number

- WHEN "84 impresiones" appears in "## KPIs y línea base" (no dated, sourced heading)
- THEN `findUnsourcedMetrics(markdown, KPI_METRIC_PATTERN)` reports it and `check-seo-14` fails

#### Scenario: sourced baseline

- WHEN the same text sits in `## Línea base 2026-11-14 (Search Console)` with `Fuente:` and `Fecha de captura: 2026-11-14`
- THEN nothing is reported and `check-seo-14` passes

#### Scenario: register guard unchanged

- WHEN `findUnsourcedMetrics(markdown)` is called without a pattern
- THEN it behaves exactly as today (`METRIC_PATTERN`, `check-seo-13` and `tests/register-metrics.test.js` unchanged)

### Requirement: conversion events after consent

After the visitor accepts analytics, a click on a contact link SHALL send exactly one allowlisted event with no personal data; before consent, after rejection or after revocation, nothing is sent (existing `trackEvent` guard).

| Link                       | Event            | Params                                   |
| -------------------------- | ---------------- | ---------------------------------------- |
| `href` equals `bookingUrl` | `contact_click`  | `contact_method: "booking"`, `placement` |
| `tel:`                     | `contact_click`  | `contact_method: "phone"`, `placement`   |
| `mailto:`                  | `contact_click`  | `contact_method: "email"`, `placement`   |
| `https://wa.me/...`        | `whatsapp_click` | `placement`                              |
| contact form success       | `form_submit`    | `placement: "contact_form"`              |

`placement` is the nearest landmark of the link (`header`, `nav`, `main`, `footer`, `aside`) or `"page"`. `page_path` is added by `trackEvent`. The phone number, email, href and form fields are never sent.

#### Scenario: booking click with consent

- WHEN analytics is accepted and the visitor clicks the hero booking CTA
- THEN `gtag("event", "contact_click", { contact_method: "booking", placement: "main", page_path })` is called once

#### Scenario: WhatsApp click without consent

- WHEN no choice is stored (or the choice is rejected) and the visitor clicks `#whatsapp-floating-button`
- THEN no `event` call is made and no `/g/collect` request leaves the browser

#### Scenario: unrelated link

- WHEN the visitor clicks an internal link such as `/seo-local-sevilla/`
- THEN `analyticsEventForLink` returns `null` and no event is sent

#### Scenario: form success

- WHEN Formspree answers `ok` for the contact form and analytics is accepted
- THEN one `form_submit` event with `placement: "contact_form"` is sent, carrying no form field

#### Scenario: after a client-side navigation

- WHEN the visitor accepted, navigates with View Transitions and clicks a booking CTA on the new page
- THEN the event is sent once (the listener is registered once on `document` and resolves the link at click time)

### Requirement: GA4 verified in production

The baseline doc SHALL record, dated, the result of accept, reject and revoke on `https://nuriaromero.dev/` (after a full page load; the client-side navigation defect is NRD-69) observed as `/g/collect` requests in the browser network log, and the arrival of each event name of the table above at the GA4 collection endpoint.

#### Scenario: consent states on the live site

- WHEN the agent clears site data on production, loads `/`, and rejects
- THEN no request to `googletagmanager.com` or `google-analytics.com` is made; after accepting (fresh state) `gtag/js` loads and `/g/collect?...en=page_view` answers 204; after revoking from the footer on a fully loaded page no further `/g/collect` request follows a page view

#### Scenario: event names

- WHEN the wired build runs (production after promotion, or `pnpm preview` of the branch build against the same measurement id if the promotion has not happened yet) and each link type is clicked with consent
- THEN each `/g/collect` request shows `en=<event>` and only `ep.contact_method`, `ep.placement`, `ep.page_path`; test events sent from localhost are dated and labelled "eventos de prueba" in the doc so they are excluded from the baseline

### Requirement: KPI baseline

`measurement-seo.md` SHALL contain a new `## Línea base <fecha> (Search Console, 28 días)` section with `Fuente:`, `Fecha de captura:` and the exact window returned by the API: site totals; clicks, impressions, CTR and average position for `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`; the top 5 queries per page; booking clicks (`contact_click` with `contact_method=booking`) from GA4 for the same window, or "N/D: evento cableado el <fecha>, sin ventana completa" as an explicit gap; the sitemap `sitemap-index.xml` read status; the `/servicios/*` URL Inspection states. The 2026-11-14 section stays as history.

#### Scenario: page with no impressions

- WHEN an in-focus page has no rows in the window
- THEN its cells read "N/D: sin impresiones en la ventana", never 0 for position or CTR

#### Scenario: position baseline

- WHEN the section is written
- THEN it names `seo/ranks/history.jsonl`, the capture date 2026-11-13, the number of tracked keywords and, per keyword, the position or "fuera del top 100"; no new rank calls are made

### Requirement: AI-citation baseline

`measurement-seo.md` SHALL contain `## Línea base <fecha> (citación en IA)` with `Fuente:`, `Fecha de captura:` and `Llamadas:`: for each keyword in `seo.rankTracking.keywords`, whether the Seville SERP shows an AI Overview, whether nuriaromero.dev is among its references, and the referenced domains; then a table of 3-5 prompts for ChatGPT and Perplexity with the date, the tool and the cited domains.

#### Scenario: DataForSEO calls

- WHEN the developer has DataForSEO access
- THEN at most 12 `serp/google/organic/live/advanced` calls (location Seville, language `es`, mobile) are made, within `seo.dataforseo.maxCallsPerRun` (30); the call count and endpoint are written in `Llamadas:`

#### Scenario: no agent can query ChatGPT or Perplexity

- WHEN the manual prompt check cannot be run by an agent
- THEN the prompt table lists the prompts with "Pendiente: usuaria" in the result cells, the item is listed under "Pendientes de la usuaria", and the rest of the story closes (PO decision 2026-11-15)

#### Scenario: no promise

- WHEN the AI section is written
- THEN it states observed facts only (present / absent / cited / not cited); no forecast of future citations

### Requirement: owner checklist

`measurement-seo.md` "Pendientes humanos y de producción" SHALL be rewritten as "Pendientes de la usuaria" with only what still needs the owner: GA4 key events (conversions) to mark in the GA4 UI, DebugView confirmation if desired, the manual AI prompt check if not done, the data-retention setting, and anything an agent could not verify. Items already done (property verification, sitemap submission) move to the dated sections.

## Files (layer `app`)

| Action | Path                                    | Notes                                                                                                                                   |
| ------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| modify | `scripts/lib/register-metrics.mjs`      | `findUnsourcedMetrics(markdown, pattern = METRIC_PATTERN)`; export `KPI_METRIC_PATTERN`                                                 |
| modify | `tests/register-metrics.test.js`        | KPI pattern cases; current `measurement-seo.md` reports nothing                                                                         |
| modify | `scripts/check-seo-14.mjs`              | replace the inline "invent performance metrics" regex with the helper                                                                   |
| modify | `src/scripts/analytics-consent.js`      | `analyticsEventForLink`, `placementFor`; `ANALYTICS_DOM_EVENT` constant                                                                 |
| modify | `src/components/AnalyticsConsent.astro` | script only: one `document` click listener and one `site:analytics` listener calling `controller.trackEvent`; no markup or style change |
| modify | `src/scripts/contact-form.js`           | dispatch `site:analytics` (`form_submit`) on `res.ok`                                                                                   |
| modify | `tests/analytics-consent.test.js`       | mapping and consent-gating tests                                                                                                        |
| modify | `docs/seo-audit/measurement-seo.md`     | restructured 2026-11-14 baseline; event taxonomy (`contact_method`); new dated sections; owner checklist                                |

`AnalyticsConsent.astro`, `analytics-consent.js` and `contact-form.js` are compliance-privacy paths (review applies). NRD-69 and NRD-70 edit the same component script after this story merges: keep the two new listeners as plain `document` listeners registered once, which is the pattern NRD-69 adopts.

## Interfaces

```js
// scripts/lib/register-metrics.mjs
export const KPI_METRIC_PATTERN =
  /(?:\b\d+\s+(?:clics|impresiones|conversiones|consultas|backlinks?)\b|posición\s*[:=]\s*\d)/gi; // same terms as today's inline regex in check-seo-14
/** @param {string} markdown @param {RegExp} [pattern=METRIC_PATTERN] global regex */
export function findUnsourcedMetrics(markdown, pattern = METRIC_PATTERN) {}

// src/scripts/analytics-consent.js
export const ANALYTICS_DOM_EVENT = "site:analytics";
/** @returns {'header'|'nav'|'main'|'footer'|'aside'|'page'} */
export function placementFor(element) {} // element.closest('header,nav,main,footer,aside')?.localName ?? 'page'
/**
 * @param {{ href: string, placement: string, bookingUrl: string }} link
 * @returns {{ name: 'contact_click'|'whatsapp_click', params: Record<string,string> } | null}
 */
export function analyticsEventForLink({ href, placement, bookingUrl }) {}
```

Component script additions (TypeScript in `AnalyticsConsent.astro`, `bookingUrl` imported from `@/data/site`):

```ts
document.addEventListener("click", (event) => {
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
    "a[href]",
  );
  if (!link) return;
  const found = analyticsEventForLink({
    href: link.getAttribute("href")!,
    placement: placementFor(link),
    bookingUrl,
  });
  if (found) controller.trackEvent(found.name, found.params);
});
document.addEventListener(ANALYTICS_DOM_EVENT, (event) => {
  const { name, params } = (event as CustomEvent).detail ?? {};
  controller.trackEvent(name, params); // allowlist enforced inside
});
```

`contact-form.js`: `document.dispatchEvent(new CustomEvent('site:analytics', { detail: { name: 'form_submit', params: { placement: 'contact_form' } } }))` right after the success status (`:86-87`).

## Data

No storage, schema or settings change. GA4 receives the allowlisted events already documented; the new parameter `contact_method` (`booking|phone|email`) is documented in the event taxonomy. No personal data. CSP unchanged (same GA endpoints).

## Test plan (TDD order)

1. Task 1.1 - `tests/register-metrics.test.js` (RED): `findUnsourcedMetrics(md, KPI_METRIC_PATTERN)` reports "84 impresiones" outside a baseline section; reports nothing inside `## Línea base 2026-11-14` with `Fuente:` and `Fecha de captura:`; the real `docs/seo-audit/measurement-seo.md` reports nothing (fails until the doc is restructured); existing cases untouched. GREEN: helper param, `check-seo-14` wired, 2026-11-14 section renamed to `## Línea base 2026-11-14 (Search Console)` with `Fecha de captura: 2026-11-14`. Then `node scripts/check-seo-14.mjs` passes.
2. Task 1.2 - `tests/analytics-consent.test.js` (RED): `analyticsEventForLink` for booking, `tel:`, `mailto:`, `wa.me`, internal link (`null`), booking URL with a different query (`null` unless equal); `placementFor` with a fake `closest`; consent gating: `controller.trackEvent('contact_click', …)` sends nothing before consent and after `reject()`, sends once after `accept()`; `ALLOWED_EVENTS` contains every name the mapper returns. A source test asserts `contact-form.js` dispatches `site:analytics` with `form_submit` and that `AnalyticsConsent.astro` listens to `ANALYTICS_DOM_EVENT`. GREEN, then `pnpm build` and `pnpm check:seo-14:dist`.
3. Tasks 1.3-1.5 - documentation from observed data; `node --test tests/*.test.js` and `check-seo-14` stay green after each section is added.

## Real-browser / e2e checks

- Production, fresh profile: reject -> no Google request; accept -> `gtag/js` plus `/g/collect en=page_view` 204; revoke from the footer on a fully loaded page -> no further collect.
- Branch build (or production after promotion), consent accepted: hero booking CTA, header booking CTA, footer phone, footer email, WhatsApp button, contact form success each produce one collect request with the expected `en` and no personal data in `ep.*`.
- Same with consent rejected: no collect request on any click.
- After a View Transitions navigation, a booking click still sends exactly one event (no duplicate listener).

## Risks

- **Size.** The event wiring was not visible at refinement; it adds about 1-2 points to a 5-point story. It is small and isolated (one pure function, two listeners, one dispatch). Booking-click history starts when the wiring reaches production (next scheduled promotion), so the 28-day booking baseline is an explicit gap in this story, with its start date.
- **Test events in GA4.** Verifying event names before promotion sends a few events from localhost to the real property; they are dated and labelled in the doc. If promotion happens first, verify on production instead.
- **Agent access.** DataForSEO and the Google `run.sh` are reachable by the developer agent per the harness and the 2026-11-14 setup; ChatGPT/Perplexity may not be. Missing access becomes a "Pendiente: usuaria" line, not a blocker. DebugView itself is a UI the agents never log into; the network evidence plus an optional owner confirmation replaces it.
- **Merge order with NRD-69/NRD-70.** All three touch `AnalyticsConsent.astro`. Sprint order is NRD-17, NRD-69, NRD-70; the later branches start from `develop` after this one merges.
- **Loosening a guard.** The SEO-14 rule becomes stricter about provenance (dated, sourced sections) rather than looser; locked by tests.

## ADRs

0005 (build-time SEO checks), 0006 (node:test and TDD), 0007 (GA4 after consent, CSP), 0008 (Spanish copy, English code).

## Tasks

- [ ] 1.1 [NRD-81 app] Let `findUnsourcedMetrics` take a pattern, add `KPI_METRIC_PATTERN`, use it in `check-seo-14` and restructure the 2026-11-14 baseline as a dated, sourced section; tests: `tests/register-metrics.test.js` first.
- [ ] 1.2 [NRD-82 app] Wire consent-gated conversion events (booking, phone, email, WhatsApp via a delegated listener; `form_submit` via `site:analytics`) and document `contact_method`; tests: `tests/analytics-consent.test.js` first.
- [ ] 1.3 [NRD-83 app] Verify GA4 on the live site (accept, reject, revoke) and each event name at the collection endpoint; record it dated in `measurement-seo.md`; tests: check-seo-14 and the unit suite stay green.
- [ ] 1.4 [NRD-84 app] Refresh the 28-day Search Console baseline for the home, `/seo-local-sevilla/` and the in-focus service pages, top queries per page, booking clicks or gap, position baseline from the 2026-11-13 rank capture, sitemap and `/servicios/*` recheck; tests: check-seo-14.
- [ ] 1.5 [NRD-85 app] Record the AI-citation baseline (AI Overview presence and citation for the tracked keywords, at most 12 DataForSEO calls; manual ChatGPT/Perplexity prompt table) and rewrite the owner checklist; tests: check-seo-14.
