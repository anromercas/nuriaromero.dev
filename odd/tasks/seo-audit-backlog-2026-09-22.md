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
- [ ] SEO-16 through SEO-26 — pending, see `docs/seo-audit/full-audit-2026-09-22/tasks/`

## Progress evidence
(updated per task as completed)

- **SEO-15 (2026-09-22):** Added trailing slash to the 7 shared `href`/`url` values in `src/components/Header.astro` (`navItems` array) and `src/components/Footer.astro` (bottom nav + legal links): `/portfolio/`, `/blog/`, `/sobre-mi/`, `/contacto/`, `/aviso-legal/`, `/privacidad/`, `/cookies/`. Extended `scripts/check-seo-02.mjs` with a `sharedNavPages` list and a per-file `<header>`/`<footer>` bare-href check. RED: extended check failed against unfixed templates (bare hrefs found across all 22 rendered pages). GREEN: `npm run check:seo-02` passed after the fix (`scanned 23 HTML files`). HTTP verification via `BROWSER=none netlify dev --offline --no-open --dir dist --port 8888` + `curl -sSIL --max-redirs 0`: all 7 routes returned `200 OK` direct, no `Location` header. Regression: `check:seo-02` through `check:seo-14` (11 checks) all passed on the same `dist`; `git diff --check` clean. One commit on `develop`.

## Next step
Implement SEO-15: add trailing slash to 7 links in `Header.astro`/`Footer.astro`, extend `scripts/check-seo-02.mjs` to cover shared nav components, RED→GREEN evidence, one commit, then review.
