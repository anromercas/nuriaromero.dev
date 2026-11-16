# Design

## Context

See proposal.md (Why). State on `develop` (b062e47):

- `src/components/Breadcrumbs.astro` (28 lines): prop `items: { name; url }[]`; `<nav aria-label="Miga de pan" class="mb-6 text-sm text-gray-400">`, `<ol class="flex flex-wrap items-center gap-x-2">`, separator `<span aria-hidden="true">/</span>`, current item `<span aria-current="page" class="text-gray-200">`, links `class="hover:text-blue-500 hover:underline"` with no focus style.
- Callers: `src/pages/{blog/index,portfolio,recursos,contacto,sobre-mi}.astro`, `src/layouts/{BlogPostLayout,ServiceLayout,LegalLayout}.astro`. Template pages sit on `template-ground` (`--ink-ground` #050a18); `LegalLayout` and the default `ServiceLayout` sit on the `Layout.astro` ground (gray-950 = `--site-ground` #030712 plus a 30% purple radial at the top).
- `src/styles/template.css` (ADR 0014) defines the ink tokens in `:root` and `.tpl-link` (color `--text-body`, sky underline at 0.7 alpha, offset 0.3em, radius 0.25rem, hover `--sky-accent`, `:focus-visible` `outline: 2px solid var(--sky-signal); outline-offset: 4px`). It is imported per component; the breadcrumbs do not import it today.
- Contrast of the tokens (computed): `--sky-signal` 9.2:1 on ink ground, 9.4:1 on site ground; `--text-body` 16.0 / 16.3; `--text-secondary` 13.3 / 13.6; `--text-muted` 7.7 / 7.9.
- Tests: `tests/breadcrumb-trailing-slash.test.js` (caller URLs), `tests/template-components.test.js` (token values equal `DESIGN.md`), page template tests assert `<Breadcrumbs` order. `check-seo-02` checks the BreadcrumbList last item equals the canonical.

## Goals / Non-Goals

**Goals:**

- Breadcrumbs on ink tokens with the shared template link focus, AA text and no overflow at 320 px.

**Non-Goals:**

- Any change to breadcrumb items, BreadcrumbList JSON-LD, or the surrounding layouts.

## Decisions

**Approach.** One component rewrite. The component imports `@/styles/template.css` (the same per-component import every template section uses, ADR 0014), so the tokens and `.tpl-link` exist on every page that renders breadcrumbs, including legacy-ground pages. Links take `class="tpl-link"` instead of a local link rule: same colour, underline, hover and 2px sky focus outline as every other template text link, so the focus indicator is consistent and is not redefined. A scoped `<style>` sets the trail: muted separators, secondary-text current item, wrap on narrow screens. Removing Tailwind palette utilities from the component also removes the only gray/blue classes in it; the layout utilities that remain are replaced by scoped CSS so the component is self-contained.

1. **Reuse `.tpl-link`, do not add a breadcrumb-specific focus rule.** One focus style for template text links; a test pins that `.tpl-link:focus-visible` keeps a `--sky-signal` 2px outline.
2. **Current item vs links.** Links in `--text-body` with the sky underline (recognisable as links); the current item in `--text-secondary`, no underline, `aria-current="page"`; separator in `--text-muted`, `aria-hidden`.
3. **Long titles.** `overflow-wrap: anywhere` on items and `min-width: 0` on `li` so a post title wraps inside the trail.

**Files** (all layer `app`):

- Modify `src/components/Breadcrumbs.astro`.
- Create `tests/breadcrumbs-ink.test.js`.

**Interfaces.** Props unchanged: `interface Props { items: { name: string; url: string }[] }`. Markup:

```astro
---
import "@/styles/template.css";
interface Props { items: { name: string; url: string }[] }
const { items } = Astro.props;
---
<nav aria-label="Miga de pan" class="crumbs">
  <ol>
    {items.map((item, i) => (
      <li>
        {i > 0 && <span class="crumbs-sep" aria-hidden="true">/</span>}
        {i === items.length - 1
          ? <span aria-current="page" class="crumbs-current">{item.name}</span>
          : <a href={item.url} class="tpl-link">{item.name}</a>}
      </li>
    ))}
  </ol>
</nav>
<style>
  .crumbs { margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.875rem; line-height: 1.5; }
  .crumbs ol { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem 0.5rem; margin: 0; padding: 0; list-style: none; }
  .crumbs li { display: flex; align-items: center; gap: 0.5rem; min-width: 0; overflow-wrap: anywhere; }
  .crumbs-sep { color: var(--text-muted); }
  .crumbs-current { color: var(--text-secondary); }
</style>
```

Exact spacing and weights may be refined by the UI spec; the token choices, the `tpl-link` reuse and the ARIA markup are fixed.

**Data.** None: no schema, storage or settings impact.

**Test plan (TDD order).** `tests/breadcrumbs-ink.test.js`, RED before the rewrite:

1. No `gray-` / `blue-` substring in `src/components/Breadcrumbs.astro` (scenario "No legacy palette").
2. The component imports `@/styles/template.css`; every `<a` carries `class="tpl-link"`; `template.css` `.tpl-link:focus-visible` body matches `outline:\s*2px solid var\(--sky-signal\)` (scenario "Visible focus").
3. The component `<style>` uses `var(--text-muted)` and `var(--text-secondary)` and no `#hex` / `rgb(` literal.
4. Contrast computed in the test from the `template.css` `:root` hex values (WCAG relative luminance): `--sky-signal` >= 3 against `--ink-ground` and `--site-ground`; `--text-body`, `--text-secondary`, `--text-muted` >= 4.5 against both (scenario "AA text contrast").
5. `aria-label="Miga de pan"`, `aria-current="page"`, `aria-hidden="true"` present (scenario "Semantics").

Existing `tests/breadcrumb-trailing-slash.test.js`, the page template tests and `check-seo-02` cover URLs and JSON-LD (unchanged). Suite, `pnpm build`, `pnpm check:seo:dist` green.

**Real-browser / e2e checks (QA).**

- `/blog/` and one post (e.g. `/blog/como-aparecer-en-google-maps-negocio-sevilla/`): Tab onto "Inicio" and "Blog": 2px sky outline visible, not clipped; hover turns the link sky; colours match the template world.
- At 320 px and 375 px on a post: the trail wraps, no horizontal scroll.
- One legacy-ground page (`/privacidad/`) and one default `ServiceLayout` page: breadcrumbs readable over the purple top radial and focus visible.
- Accessibility tree: `navigation "Miga de pan"`, last item `aria-current=page`.

**ADRs relied on.** 0014 (template tokens and per-component `template.css` import), 0004 (JSON-LD through `schema.ts`, untouched), 0006 (TDD).

## Risks / Trade-offs

- Importing `template.css` on legacy pages adds its `:root` tokens and a few unused classes there; harmless (no global element selectors in it) and the cost is small.
- `.tpl-link` underlines breadcrumb links permanently (before: underline on hover only). Intended: it matches the template link convention and makes links distinguishable from the current item without relying on colour.

## UI spec

Mode: Operate (wayfinding). Refinement of an existing shared component; no new component, no new token. Design authority: `DESIGN.md` ("Buttons and focus": text links underlined, 2px `sky-signal` focus outline with 2-4px offset; motion 0.2s `--ease-out`) and the ink tokens in `src/styles/template.css`.

### Breadcrumbs (`src/components/Breadcrumbs.astro`)

**1. Screens and layout.** Same placement on every caller (`src/pages/{blog/index,portfolio,recursos,contacto,sobre-mi}.astro`, `src/layouts/{BlogPostLayout,ServiceLayout,LegalLayout}.astro`): first child of the first `SectionContainer` (`src/components/SectionContainer.astro`), above the hero / post header / legal `h1`, left aligned with the content column. One horizontal trail: `link / link / current`. Callers are not touched.

**2. Hierarchy.** The trail is secondary wayfinding, never competing with the `h1` below it.
- Links (`.tpl-link`): `--text-body` with the sky underline; they read as the actionable parts.
- Current item (`.crumbs-current`): `--text-secondary`, no underline, not a link; it reads as "you are here" through the missing underline, not through colour alone.
- Separator (`.crumbs-sep`): `--text-muted`, the quietest element.
- Size: 0.875rem (14px), weight 400 for all three, line-height 1.5. Assumption: no weight change on the current item; the underline/no-underline contrast is enough and keeps the trail quiet.
- Reading order = DOM order: Inicio, intermediate levels, current page.

**3. States.** Static, server-rendered; no loading, empty, error or async state. Single-item trail (only the current page): renders the current item alone, no separator (already true from `i > 0`). n/a otherwise.

**4. Copy.** Unchanged: item names come from each caller's `breadcrumbs` array; `aria-label="Miga de pan"`; separator glyph `/`. No new strings.

**5. Design system reuse.**
- `src/styles/template.css`: tokens `--text-body`, `--text-secondary`, `--text-muted`, `--sky-signal`, `--sky-accent`, `--sky-signal-rgb`, `--ease-out`; class `.tpl-link` (colour, underline at 0.7 alpha, offset 0.3em, radius 0.25rem, hover `--sky-accent`, `:focus-visible` 2px `--sky-signal` outline, offset 4px). Not redefined in the component.
- Spacing on the existing 0.25rem scale: `margin-bottom: 1.5rem` on `nav` (same as today's `mb-6`), column gap 0.5rem, row gap 0.25rem.
- Scoped additions allowed in the component `<style>` (on top of the design's block):
  - `.crumbs a { display: inline-block; padding-block: 0.1875rem; }` Assumption: raises each link's hit area to about 27px tall (21px line + 6px) so it clears the 24px minimum target (WCAG 2.5.8) without changing the visual size; the focus outline then wraps the padded box, giving it breathing room.
  - `.crumbs-sep { user-select: none; }` Assumption: copying the trail should not copy decorative slashes inconsistently; purely cosmetic, optional.
- No Tailwind palette or layout utilities left in the component; no hex or `rgb(` literal in its `<style>`.

**6. Responsive.**
- 320 px and up: one flex row with `flex-wrap: wrap`; items wrap as whole units at the separators first.
- A long current title (post titles) wraps inside its own `li` (`min-width: 0`, `overflow-wrap: anywhere`); the separator stays glued to the start of its item (separator lives inside the `li`, before the text), so a wrapped line never begins with an orphan `/` detached from its item.
- No truncation, no ellipsis, no hiding of intermediate levels at any width. Assumption: trails are at most 3 levels on this site (Inicio / Blog / post), so full text is affordable and avoids hiding content.
- No horizontal overflow at 320 px; the `main` `px-4` (16px) gutter is larger than the 6px the focus outline extends (4px offset + 2px), so the outline of the first link is not clipped at the left edge.
- No breakpoint-specific rules.

**7. Interactions.**
- Hover (pointer): link colour goes `--text-body` to `--sky-accent` (from `.tpl-link`), 0.2s `--ease-out`; underline stays.
- Focus: `:focus-visible` only; 2px solid `--sky-signal`, offset 4px, radius 0.25rem; no focus ring on mouse click. Same on ink ground and on the legacy `Layout.astro` ground (`LegalLayout`, default `ServiceLayout`).
- Pressed: no extra style (browser default navigation).
- Current item: not focusable, no hover change, cursor default.
- Motion: only the colour transition; it is exempt from reduced motion (no movement). No entrance animation on the trail itself (the parent `SectionContainer` reveal stays as is).

**8. Accessibility hand-off.**
- Landmark: `nav aria-label="Miga de pan"` wrapping an `ol` (list semantics kept; `list-style: none` alone can drop list semantics in Safari/VoiceOver, so keep the `ol` and do not add `role` overrides; Assumption: acceptable as today, QA reads the accessibility tree).
- Tab order: the links left to right; the current item is skipped (it is a `span`).
- Last item `aria-current="page"`; separators `aria-hidden="true"`.
- No async results to announce. No icon-only controls.
