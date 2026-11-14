# NRD-20 - Real-browser mobile UX check of / and /seo-local-sevilla/

## Why

[NRD-20](https://nuriaromerodev.atlassian.net/browse/NRD-20) (M1, epic NRD-2). Most visitors arrive on mobile. SEO-12 compacted the home hero, capped the consent banner at `min(34vh, 18rem)` on small screens and resized the floating WhatsApp button. None of this was checked in a real browser: `docs/seo-audit/full-audit-2026-09-21/tasks/12-ux-mobile-y-prueba-visual.md` says so explicitly ("No se ejecutó Playwright/CUA ni se generaron capturas nuevas"). Since NRD-15, a header booking CTA (from 768 px) joins the hero CTA, the drawer CTA, the consent panel and the WhatsApp button. Overlaps or focus problems would hit the primary conversion.

## What changes

- A dated real-browser validation section in audit task 12 (Spanish, like the file), with a 24-row matrix, keyboard notes and verdicts.
- Screenshots attached to the story (not committed).
- One NRD bug per defect, linked from the doc.
- No product code changes (story AC).

## Out of scope

- Fixing anything found: each defect becomes its own bug.
- Other pages (niche pages are parked), Lighthouse/CWV (NRD-18 and NRD-50).
- Committing screenshots to the repo.

## Requirements and scenarios

### Requirement: test target

The pass SHALL run against a production build of `develop` HEAD served locally (`pnpm build`, then `pnpm astro preview --port 4399`). That is what the next scheduled promotion ships, including the NRD-15 header CTA, which production does not have yet. The commit SHA MUST be recorded. Nothing is deployed.

#### Scenario: target recorded

- WHEN the section is written
- THEN it states the `develop` SHA, the Chrome version and that the target was a local preview of `dist/`

### Requirement: layout matrix

For `/` and `/seo-local-sevilla/`, at 360x800, 390x844, 414x896 and 1440x900, in the consent states first visit (site data cleared), accepted and rejected, the pass SHALL record horizontal scroll and overlaps.

#### Scenario: no horizontal scroll

- WHEN the page is loaded and scrolled to the bottom
- THEN `document.documentElement.scrollWidth <= window.innerWidth`, or the row records the offending element

#### Scenario: no overlap

- WHEN the bounding rects of `#analytics-consent` (if visible), `#whatsapp-floating-button` and every visible booking link (hero, header bar from 768 px, `#mobile-menu` when open) are compared, in the first viewport and after scrolling
- THEN none intersect, or the row records which ones and where

#### Scenario: consent states

- WHEN the visitor accepts or rejects
- THEN the panel closes, does not reappear on reload, and the reopen control (if any) does not overlap the WhatsApp button

### Requirement: keyboard

At 390 and 1440 px the focus order SHALL be logical and visible through the header (logo, nav or menu toggle, header CTA from 768 px), the hero CTA and the consent controls.

#### Scenario: first visit keyboard

- WHEN a keyboard user tabs from the top of the page on first visit
- THEN focus reaches the consent controls (Aceptar, Rechazar, Configurar, Guardar), the header and the hero CTA in a logical order, each with a visible focus indicator, never hidden behind a fixed element

### Requirement: defects become bugs

Each defect SHALL become an NRD bug (Error, `qa-bug`, `app`, epic NRD-2) with evidence. With no defects, the doc MUST say "sin defectos" and no issue is created.

#### Scenario: defect found

- WHEN a row's verdict is "falla"
- THEN the row carries the bug key, and the bug has page, width, consent state, steps, expected and actual result, screenshot and `path:line` when known

## Files (layer `app`)

| Action | Path                                                                         | Notes                                                                                                         |
| ------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| modify | `docs/seo-audit/full-audit-2026-09-21/tasks/12-ux-mobile-y-prueba-visual.md` | append "Validación en navegador <fecha> (NRD-20)" in Spanish; update "Estado"; keep older sections as history |

## Interfaces

None. Table columns: página | ancho | estado de consentimiento | scroll horizontal | solapes | foco | veredicto | evidencia (file name) | bug.

Elements to measure, read from the code:

- `#analytics-consent` (`src/components/AnalyticsConsent.astro:1`) with controls `#consent-accept`, `#consent-reject`, `#consent-customize` and `#consent-save`;
- `#whatsapp-floating-button` (`src/components/WhatsAppButton.astro:13`);
- the header bar CTA and the drawer `BookingButton` (`src/components/Header.astro`);
- the hero `BookingButton` of each page.

## Data

None. Screenshots go to `$TMPDIR/nuriaromero-qa/NRD-20/` (the harness `qa.evidenceDir`) and are attached to the story.

## Test plan (TDD order)

No behaviour change, so no `tests/*.test.js` case: the DoD TDD item does not apply, and the PR says so. Verification is the recorded evidence:

1. Record the `develop` SHA and run `pnpm build`; it must be green.
2. Serve `dist/` with `pnpm astro preview --port 4399`.
3. Run the 24 combinations and the keyboard pass with Chrome DevTools MCP (device emulation, touch on).
4. Fill the table, file the bugs.

## Real-browser / e2e checks

This story is the real-browser check. QA spot-checks two rows against their screenshots: one at 390 px first visit, one at 1440 px accepted.

## Risks

- **Production differs from `develop`** until the next promotion. The record names the SHA. A defect found only in the new header CTA is still valid, because it ships next.
- **Concurrent changes.** NRD-49 (button colours), NRD-11 (header logo) and NRD-12 (layout CSS) touch the same surfaces. If they merge to `develop` first, the pass covers them too. That is fine, and the SHA records it.
- **Emulation is not a device.** Note any doubt for a later check on a physical phone. Do not invent results.

## ADRs

0001 (static build), 0007 (consent), 0009 (no deploys outside the schedule).

## Tasks

- [x] 1.1 [NRD-56 app] Run the real-browser pass (2 pages x 4 widths x 3 consent states plus keyboard) on a local preview of `develop` and record it in audit task 12; tests: none (measurement only), record SHA, Chrome version and screenshots.
- [x] 1.2 [NRD-57 app] File an NRD bug per defect and link it from audit task 12, or record "sin defectos"; tests: none.
