# VisibilityAudit Graphics Redesign — Design

**Date:** 2026-10-05
**Scope:** `src/components/seo-local/VisibilityAudit.astro` only. The Local/Local Pro pricing comparison and the rest of `/seo-local-sevilla/` (Benefits, Process, FAQ, CTA) are explicitly out of scope for this iteration and will be revisited in a later design.

## Goal

Replace the two remaining pure-text blocks inside `VisibilityAudit` (Parte 02 "qué se revisa" and Parte 03 "qué recibirás") with small, honest graphics that visualize real process/structure — not decoration, not invented metrics, not social proof. Keep the component's existing dark/sky-blue "audit sheet" visual language, which is already the most distinctive and graphic-ready part of the page; do not bridge to the lighter yellow-accented style used elsewhere on the page.

## Non-negotiable constraints (carried over from the original redesign)

- No fabricated metrics, testimonials, rankings, or guaranteed outcomes anywhere in this component.
- `VisibilityAudit` stays page-local / route-specific — no new shared abstraction, no new entries in `src/data/services.ts`. Content stays hardcoded in the component, as it is today.
- No new icon or chart library. New icons are hand-drawn inline SVG, added to the existing `src/components/icons/` folder, matching the current convention (24×24 viewBox, `stroke-width="2" stroke="currentColor" fill="none"`, props spread via `{...Astro.props}`).
- Must stay one-column and overflow-free at both 1440×900 and 390×844 (no fixed widths, no `overflow-x`).
- Must satisfy `@media (prefers-reduced-motion: reduce)` — simplest way to guarantee this is to introduce no animation at all in the new graphics.
- Must not break the existing tests: `tests/seo-local-sevilla-redesign.test.js` (requires a `<section>` with an `<h2>`, an `aria-labelledby`, a `<ul>`, and the literal heading text "Qué recibirás" or "Trabajo que podrás revisar" somewhere in the component) and `scripts/check-seo-15.mjs` (built-output checks unrelated to this component's internals, but must still pass end to end).

## Architecture

No new components, no new files other than icons. `VisibilityAudit.astro` keeps its current three-`<section>` structure (Parte 01 diagnóstico, Parte 02 revisión, Parte 03 entrega verificable). Only the internal markup and scoped `<style>` of sections 2 and 3 change.

```
VisibilityAudit.astro
├─ <section id="revision-local">          (unchanged: Parte 01, text + annotation arrow)
├─ <section aria-labelledby="revision-title">   (Parte 02 — becomes checklist-diagram)
│    └─ <ul class="audit-flow"> 5× <li> (icon + text), vertical connecting line via CSS
└─ <section aria-labelledby="evidencia-title">  (Parte 03 — becomes delivery-cycle diagram)
     └─ <div class="audit-cycle"> 3× node (icon + text) + 1 repeat arrow, no straight timeline — a loop
```

## Component details

### Parte 02 — checklist-diagram (replaces the plain `<ul>` with em-dash bullets)

Still a real `<ul>`/`<li>` list (required by the existing test). Each `<li>` gets a small inline SVG icon before the text, and a thin vertical rule threads through all icons via a CSS pseudo-element on the list (same restrained, one-pixel-rule aesthetic as the rest of the component — no new visual language).

Icon mapping (reusing existing icons where they already fit; adding only what's missing):

| List item | Icon | Status |
| --- | --- | --- |
| Ficha de Google | `MapPin` | New |
| Información pública | `Link` | Reused (already exists) |
| Búsquedas locales | `Search` | New |
| Opiniones y contenido | `Star` | Reused (already exists) |
| Web y medición | `Gauge` | New |

All icons render with `aria-hidden="true"`; the `<li>` text remains the real accessible content, unchanged from today's copy.

### Parte 03 — delivery-cycle diagram (replaces the single paragraph)

The current copy ("No se muestran cifras… Sí podrás revisar el trabajo realizado, las prioridades acordadas y el vídeo-informe mensual con el siguiente paso") becomes three connected nodes in a closed loop, not a straight timeline — deliberately distinct from the unrelated `ProcessSteps` section further down the page, so the two don't visually duplicate each other:

1. **Trabajo revisable** — icon `ProfileCheck` (reused)
2. **Prioridades acordadas** — icon `Briefcase` (reused)
3. **Vídeo-informe mensual** — icon `Calendar` (reused)
4. A `Repeat` icon (new) on a curved return connector back to node 1, labelled "cada mes" — this is what signals recurrence instead of a number.

The `<h2>` keeps its exact current text ("Qué recibirás durante el trabajo.") so the existing test regex continues to match. The explanatory sentence about not showing unverified figures stays as real text near the diagram, not folded into SVG.

## New icon files

Four new files in `src/components/icons/`, following the exact prop/style pattern of the existing `Star.astro` / `Calendar.astro`:
`MapPin.astro`, `Search.astro`, `Gauge.astro`, `Repeat.astro`.

## Data flow

None. No props, no `src/data/services.ts` changes, no new data contracts. This is a presentational-only change to one existing component's internals.

## Testing

- No changes needed to `tests/seo-local-sevilla-redesign.test.js` assertions — the new markup keeps the `<ul>`, the `aria-labelledby` attributes, and the required heading text, so the existing assertions should continue to pass unmodified.
- Run the full existing verification chain after implementation (no new scripts needed for this scoped change):
  ```bash
  node --test tests/seo-local-sevilla-redesign.test.js
  npm run build
  node scripts/check-seo-15.mjs
  node --test tests/*.test.js
  git diff --check
  ```
- Manual check at 1440×900 and 390×844: one column, no horizontal scroll, icons decorative (`aria-hidden`), connecting line/loop readable, reduced-motion has nothing to disable because nothing animates.

## Out of scope (explicitly deferred)

- Local/Local Pro plan comparison becoming a visual matrix.
- Any change to `Benefits`, `Process`, `FAQ`, or `CTASection` sections.
- Any use of the newly installed `impeccable` plugin for polish — to be applied as a separate pass once this component's structure is implemented, not as part of this design.

## Self-review

- **Placeholders:** none — every icon name, section structure, and test expectation is concrete.
- **Internal consistency:** icon reuse list matches the component mapping table; no contradiction with the "no shared abstraction" constraint since icons already live in a shared folder today.
- **Scope:** single component, small enough for one implementation plan.
- **Ambiguity:** "cycle, not timeline" for Parte 03 is stated explicitly to avoid confusion with the unrelated `ProcessSteps` section.
