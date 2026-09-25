# Casos de éxito

## Objective
Present client work as «Casos de éxito» without listing this site as its own case.

## Problem and why
The current cases list includes the portfolio itself, and the menu says «Portfolio». Both obscure that the section is intended to show real client work.

## Authorized scope and constraints
- Remove the nuriaromero.dev entry from the shared project list.
- Rename visible home, navigation, portfolio-page, and relevant cross-link copy to «Casos de éxito».
- Preserve the `/portfolio/` URL and existing client cases; do not migrate routes or touch unrelated worktree changes.
- TDD: enabled by project instruction; runner `node --test tests/casos-exito.test.js`. Delivery strategy: ask-on-risk; forecast under 100 authored changed lines.

## Tasks
- [x] **CE-01** — Remove the self-referential project from the shared list. Route: delegated writer (source and regression test span multiple non-trivial files). Acceptance: home and `/portfolio/` render only Arkady and Adf; existing service filters remain valid. Checks: observed RED→GREEN focused test, build, rendered case count.
- [x] **CE-02** — Rename visible cases labels and correct the portfolio-page intro. Route: same delegated writer (multiple source files). Acceptance: home heading, menu, page metadata/breadcrumb/heading, and resources link say «Casos de éxito»; URL stays `/portfolio/`. Checks: observed RED→GREEN focused test, build, link navigation.

## Progress and evidence
- Both tasks implemented on `feat/casos-de-exito`. Focused test observed RED then GREEN (2/2); `npm run build` passed with 0 errors and 0 warnings (one pre-existing Astro hint; Google Reviews 403 omitted reviews). `git diff --check` passed.
- Generated home and `/portfolio/` each render exactly two client cases; live browser confirms menu text and accessible name «Casos de éxito», and the unchanged `/portfolio/` destination.
- Runtime boundary: Astro dev preview at `/portfolio/`; rollback boundary: the cases-specific hunks in `src/pages/index.astro`, `src/components/Projects.astro`, `src/components/Header.astro`, `src/pages/portfolio.astro`, `src/pages/recursos.astro`, and `tests/casos-exito.test.js`.
- Receipt-driven review: disabled/unmanaged unless the user has explicitly enabled it; no review receipt claimed.
- Work-unit commit: `ecb2abc` (`feat(home): present client work as success cases`). The prior uncommitted home-service refinements and unrelated changes remain outside the commit.
- Existing uncommitted home and unrelated SEO/consent changes predate this feature and must not be included in its commit.

## Next step
Collect user feedback; keep `/portfolio/` until a separately authorized URL migration is planned.
