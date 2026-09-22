# SEO audit backlog 2026-09-22

## Objective
Execute the 12 actionable tasks from the second SEO audit round (`docs/seo-audit/full-audit-2026-09-22/tasks/`, SEO-15 to SEO-26), one at a time per user instruction, with one work-unit commit per task on `develop` and review before push.

## Problem
The 2026-09-22 live-site audit (11 parallel specialists + synthesis) confirmed SEO-01/03/09/11/12 resolved in production, but surfaced 12 new/still-open issues: consent-dialog accessibility (3 convergent sources), WhatsApp button overlap at 360px, templated niche-page FAQ closing text (same as 2026-09-21, unresolved), missing "agencia" in /seo-local-sevilla/ title/H1, trailing-slash gaps in shared Header/Footer, FAQ duplication across niche/service pages, and others. Full detail in `docs/seo-audit/full-audit-2026-09-22/FULL-AUDIT-REPORT.md` and `ACTION-PLAN.md`.

## Why
User explicitly authorized executing the backlog "poco a poco" (one task at a time), each followed by its own commit and review, rather than batching.

## Constraints
- Work on `develop`; one task at a time, user reviews after each.
- Preserve unrelated untracked files.
- Never invent GBP, testimonial, ranking, traffic, or backlink evidence.
- Conventional Commits, no AI attribution (per user's global CLAUDE.md rule).

## Effective TDD
- Mode: enabled (Strict TDD Mode, per session config).
- Source: session instructions.
- Runner: project scripts (`npm run build`; existing `check:seo-*` scripts; `npm test`).

## Checklist
- [x] SEO-15 Trailing slash in Header/Footer — `docs/seo-audit/full-audit-2026-09-22/tasks/15-trailing-slash-header-footer.md`
- [x] SEO-16 Consent panel ARIA role, button size, overflow, Tab reachability — `docs/seo-audit/full-audit-2026-09-22/tasks/16-accesibilidad-panel-consentimiento.md`
- [ ] SEO-17 through SEO-26 — pending, see `docs/seo-audit/full-audit-2026-09-22/tasks/`

## Progress evidence
(updated per task as completed)

- **SEO-15 (2026-09-22):** Added trailing slash to the 7 shared `href`/`url` values in `src/components/Header.astro` (`navItems` array) and `src/components/Footer.astro` (bottom nav + legal links): `/portfolio/`, `/blog/`, `/sobre-mi/`, `/contacto/`, `/aviso-legal/`, `/privacidad/`, `/cookies/`. Extended `scripts/check-seo-02.mjs` with a `sharedNavPages` list and a per-file `<header>`/`<footer>` bare-href check. RED: extended check failed against unfixed templates (bare hrefs found across all 22 rendered pages). GREEN: `npm run check:seo-02` passed after the fix (`scanned 23 HTML files`). HTTP verification via `BROWSER=none netlify dev --offline --no-open --dir dist --port 8888` + `curl -sSIL --max-redirs 0`: all 7 routes returned `200 OK` direct, no `Location` header. Regression: `check:seo-02` through `check:seo-14` (11 checks) all passed on the same `dist`; `git diff --check` clean. One commit on `develop`.
- **SEO-15 follow-up (2026-09-22):** a `review-reliability` pass on that first commit found a real coverage gap in `check-seo-02.mjs`'s new header/footer scan: `getSections(html, "header")` only captured `<header>...</header>`, but in `Header.astro` the `<header>` closes right after the desktop `<nav>` (~line 128) while the mobile-menu drawer (`<div id="mobile-menu-overlay">` / `<div id="mobile-menu">`, ~lines 130-211) is a sibling `<div>` rendered immediately after, duplicating the same 7 shared-nav links — so a regression limited to the mobile-menu hrefs would pass the check undetected (false negative). RED: temporarily stripped the trailing slash from only the mobile `<a href={link.url}>` for `/portfolio/` (desktop link untouched); `npm run build` + `check:seo-02` still passed despite the bug, confirming the gap; change reverted. Fix: added `getHeaderSections(html)` to `scripts/check-seo-02.mjs`, which locates the adjacent `#mobile-menu` div after `</header>` and includes it via balanced `<div>` counting (not assumed DOM nesting); swapped it in at both call sites that scan the shared header, left the footer scan untouched (no equivalent structure there). GREEN: same RED reproduction now failed correctly (23 issues); reverted, then clean build + `check:seo-02` passed. Regression: `check:seo-02` through `check:seo-14` (11 checks) passed again on the same `dist`; `git diff --check` clean. `Header.astro`/`Footer.astro` untouched (real diff limited to `scripts/check-seo-02.mjs` plus these two doc files). One commit on `develop`, no new task ID.

- **SEO-16 (2026-09-22):** Fixed `src/components/AnalyticsConsent.astro`: `role="dialog"` → `role="region"` (banner is non-blocking, not a real modal — no `aria-modal`/focus trap/Escape-close added, per "No hacer"); 3 action buttons `min-height: 2.75rem` → `3rem` (48px); mobile `max-height: min(34vh, 18rem)` → `min(35vh, 18.5rem)` to remove the ~4px internal overflow at 360px. Also moved `<AnalyticsConsent />` in `src/layouts/Layout.astro` from after `<Footer />` (end of DOM) to immediately after `<body>` opens (before `<Header />`) — this is a DOM-order/focus fix, not a visual change (`position: fixed`), and was needed because Tab order follows DOM order and the panel's buttons were unreachable within 20 Tab presses regardless of ARIA role. RED (Playwright/Python against locally served `dist`): `role="dialog"` no `aria-modal` on all 4 viewports; 360px overflow `scrollHeight 274 vs clientHeight 270` (matches `visual.md`); button heights 45.1875px at 390/414px (matches `visual.md`); 20-Tab reproduction from `visual.md` at 390px never reached the 3 buttons. GREEN: `role="region"`; 360px `scrollHeight 277 == clientHeight 277`; button heights exactly 48px; same 20-Tab reproduction now reaches `#consent-accept`/`#consent-reject`/`#consent-customize` at presses 2/3/4. `Escape` still does not close the panel in either RED or GREEN — correct for `role="region"` (no modal-close semantics to define). Regression: `npm run build` (0 errors) + `check:seo-02` through `check:seo-14` on fresh `dist`; `check:seo-12` initially failed because it hardcoded the old `34vh/18rem`/`2.75rem` values — updated `scripts/check-seo-12.mjs`'s regexes to the new intentional values, then all 11 checks passed. `git diff --check` clean. Verification script was ad-hoc (Python + system Playwright 1.60.0), not added as a permanent project script — existing `check:seo-*` scripts are static-HTML parsers, not browser-interaction tests, so it didn't fit that pattern. One commit on `develop`.

## Next step
Implement SEO-17 (see `docs/seo-audit/full-audit-2026-09-22/tasks/17-solape-whatsapp-flotante.md`).
