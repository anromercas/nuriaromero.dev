# Add a descriptive H1 to `/portfolio/`

**Priority:** High
**Evidence:** Verified in the audit: the page has no H1.
**Dependencies:** None.

## Steps

1. Inspect the rendered `/portfolio/` page and identify its primary purpose and existing title/intro copy.
2. Add one visible, descriptive H1 that accurately labels the portfolio page and fits the existing content. Avoid repeating a sitewide brand slogan as the only heading.
3. Check the rendered page at desktop and mobile widths; ensure the H1 is present in the page content and does not create duplicate or misleading headings.

## Acceptance criteria

- [x] The rendered `/portfolio/` page has one clear, descriptive H1.
- [x] The heading matches the page's actual purpose and is visible and readable on mobile and desktop.
- [x] Existing section hierarchy remains coherent; no unrelated copy or layout changes are introduced.

## Verification

Inspect the rendered page and its heading outline after deployment or in the project’s normal preview. Record the verified URL and date. Do not claim ranking improvement from the heading change alone.

## Verification record

- **Date:** 2026-09-18
- **Preview:** `http://localhost:4322/portfolio/` (local production preview; not deployed)
- **Build and regression check:** `pnpm run build` passed; the rendered-output check passed after failing on the original page with zero H1 elements.
- **Desktop:** 1440×900; exactly one H1, readable at 30px.
- **Mobile:** 390×844; exactly one H1, wraps to two lines within the 358px content width; no horizontal overflow.
- **Scope:** Existing title icon and visual style retained. No ranking impact is claimed.
