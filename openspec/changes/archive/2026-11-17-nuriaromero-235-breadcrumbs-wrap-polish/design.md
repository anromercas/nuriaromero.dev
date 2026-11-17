# Design

## Context

See proposal.md (Why). Current state on `develop` (a227f03):

- `src/components/Breadcrumbs.astro`: scoped `<style>` with `.crumbs ol { gap: 0.25rem 0.5rem; }` and `.crumbs-current { color: var(--text-secondary); }`; links use the shared `.tpl-link`, whose `:focus-visible` in `src/styles/template.css` is `outline: 2px solid var(--sky-signal); outline-offset: 4px` (ring extent 6 px).
- The root font size is 106.25% (`Layout.astro`), so `0.25rem` is about 4.25 px.
- `src/layouts/Layout.astro` paints the body backdrop as `bg-gray-950` (#030712, equal to `--site-ground`) plus `radial-gradient(ellipse_80%_80%_at_50%_-20%, rgba(120,119,198,0.3), rgba(255,255,255,0))`. Its lightest colour is the 0.3 stop over gray-950: about #262948.
- `tests/breadcrumbs-ink.test.js` already has `token()`, `luminance()` and `contrast()` helpers and checks the ink and site grounds. Measured on #262948: muted 5.49:1, secondary 9.47:1, body (link) 11.41:1, sky 6.57:1, so the new contrast test is coverage (passes today), while the cursor and gap tests are the RED ones.

## Goals / Non-Goals

**Goals:** default cursor on the current item; wrapped rows separated by at least the focus ring extent; contrast proven on the purple radial; no visible change on a single-line trail; no copy change.

**Non-Goals:** new tokens, a different focus ring, changing the backdrop.

## Decisions

**Approach.** Two declarations in the component's scoped style: `cursor: default` on `.crumbs-current`, and `gap: 0.375rem 0.5rem` on `.crumbs ol` (row gap 6 px at a 16 px root, 6.4 px at the site's 17 px root; column gap unchanged, so a one-line trail is identical). The row gap rule is tested against the ring values read from `template.css`, so a future ring change that outgrows the gap fails the test. The purple-radial colour is derived in the test from the `rgba()` literal in `Layout.astro`, alpha-composited over `--site-ground`, so a backdrop change is re-checked automatically.

**Files** (all layer `app`):

- Modify `src/components/Breadcrumbs.astro` (`<style>` only).
- Modify `tests/breadcrumbs-ink.test.js`.

**Interfaces.** None changed. Test helpers added inside the test file only:

- `remToPx(value: string): number` (`"0.375rem"` -> 6 at 16 px, `"6px"` -> 6; the conservative 16 px base is used).
- `composite(rgba: [r, g, b, a], groundHex: string): string` (hex result).

**Data.** None.

**Test plan (TDD order).** In `tests/breadcrumbs-ink.test.js`:

1. RED "current breadcrumb item keeps the default cursor": the `.crumbs-current { ... }` rule in the scoped style contains `cursor: default` (scenario "Current item does not look clickable").
2. RED "breadcrumb row gap clears the focus ring": parse `gap: <row> <column>` (or `row-gap`) of `.crumbs ol`; parse `outline: <w>px` and `outline-offset: <o>px` from `.tpl-link:focus-visible` in `template.css`; assert `remToPx(row) >= w + o` and the column gap is still `0.5rem` (scenarios "Focus ring clears the other row at 375 px", "Single-line trail unchanged").
3. Coverage "breadcrumb tokens keep AA contrast on the purple radial": read `src/layouts/Layout.astro`, assert the backdrop element still has `bg-gray-950`, extract the first `rgba(r,g,b,a)` of its `radial-gradient`, composite over `token("--site-ground")`, assert `--text-muted`, `--text-secondary`, `--text-body` >= 4.5 and `--sky-signal` >= 3 (scenario "AA text contrast on the purple radial").
4. Implement the two declarations; `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

**Real-browser / e2e checks (QA).**

- At 375 px on a blog post with a long title (`/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`) and on a service page: the trail wraps; tab onto each link; the sky ring does not touch the text of the other row.
- Hover the current item: default arrow cursor, no colour change.
- At desktop width on `/contacto/` and `/seo-local-sevilla/`: single-line trail looks the same as on `develop`.
- 320 px: no horizontal overflow.

**ADRs relied on.** 0006 (node:test and TDD), 0014 (template section components and ink tokens).

## Risks / Trade-offs

- 2 px more space between wrapped rows on mobile: intended, invisible on a single line.
- The contrast check takes the radial's lightest point only; every other point is darker, so it is the worst case for light text.

## UI spec

Scope: one shared component, `src/components/Breadcrumbs.astro`, rendered by `src/layouts/ServiceLayout.astro`, `src/layouts/LegalLayout.astro`, `src/layouts/BlogPostLayout.astro`, `src/pages/blog/index.astro`, `src/pages/contacto.astro`, `src/pages/sobre-mi.astro`, `src/pages/recursos.astro` and `src/pages/portfolio.astro`. This is a refinement: identity, markup, copy and behaviour outside the two declarations below stay exactly as on `develop`.

### Breadcrumbs trail (`src/components/Breadcrumbs.astro`)

1. **Screens and layout.** No new view, region or order change. The trail stays the first element of the page content, above the H1, with its existing `margin-bottom: 1.5rem`. Item order: ancestor links, separators `/`, then the current item last.
2. **Hierarchy.** Unchanged. Ancestor links (`--text-body`, sky underline) are the only interactive targets; the current item (`--text-secondary`) is the "you are here" label and must read as text, not as a control; separators (`--text-muted`) are decoration.
3. **States.**
   - Link default / hover / focus-visible: unchanged (`.tpl-link` in `src/styles/template.css`: hover `--sky-accent`, focus `outline: 2px solid var(--sky-signal); outline-offset: 4px`).
   - Current item: static. On hover it shows the default arrow cursor (`cursor: default`), no colour, underline or background change, no transition. It is not focusable (it is a `span`, keep it that way).
   - Single-line trail (desktop and short trails on mobile): pixel-identical to `develop`; only the row gap changes and a row gap has no effect on one line.
   - Wrapped trail (two or more rows, typical at 320-414 px on long post titles and service names): rows separated by `0.375rem` (6.4 px at the site's 17 px root), at least the 6 px focus ring extent, so a focused link's ring never touches the glyphs or ring of a link in the adjacent row.
   - Loading, empty, error, disabled: n/a (static, build-time markup; a trail always has at least the current item).
4. **Copy.** No change. Accessible name stays "Miga de pan"; item labels come from the existing `items` prop.
5. **Design system reuse.** Only existing tokens from `src/styles/template.css`: `--text-muted`, `--text-secondary`, `--text-body`, `--sky-signal`, `--sky-accent`; the shared `.tpl-link` class; the component's scoped `<style>`. Exact declarations:
   - `.crumbs-current { color: var(--text-secondary); cursor: default; }`
   - `.crumbs ol { gap: 0.375rem 0.5rem; }` (row gap first; column gap stays `0.5rem`; the inner `li` gap of `0.5rem` around the separator also stays). No new token, no Tailwind class, no `gray-`/`blue-` palette. No "New component".
   - Assumption: the row gap is written as a literal `0.375rem` in the scoped style rather than a new spacing token, because DESIGN.md has no token at this step and the design rules out new tokens.
6. **Responsive.** 320 px: the trail wraps item by item (`flex-wrap: wrap`; long labels break with `overflow-wrap: anywhere`), no horizontal overflow, row gap 0.375rem. 375-767 px: same wrapping rule; most service and legal trails fit on one line, long blog trails wrap to two rows. 768 px and up: single line in practice, look unchanged. Nothing hides or truncates at any width; the current item is never ellipsised.
7. **Interactions.** Hover and focus on links unchanged; the existing `color 0.2s var(--ease-out)` transition on `.tpl-link` stays; nothing is added for the current item. No click handler, no motion.
8. **Accessibility hand-off.** Keep `nav aria-label="Miga de pan"`, the `ol`/`li` list, `aria-current="page"` on the current `span` and `aria-hidden="true"` on separators. Focus order = DOM order (ancestor links left to right, then the page content); the current item is skipped by Tab. Contrast is guaranteed on all three grounds the trail sits on (ink ground, site ground, lightest point of the purple radial in `src/layouts/Layout.astro`): muted, secondary and link text at least 4.5:1, the sky focus ring at least 3:1, as fixed by the design's contrast test. No announcements (static content).

Real-browser verification of the wrap, ring clearance, cursor and 320 px overflow is listed under "Real-browser / e2e checks (QA)" above; no extra checks are added here.
