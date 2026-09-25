# Technology stack copy

## Objective
Describe Nuria's general technology stack consistently without mislabeling individual client projects.

## Problem and why
The home lists WordPress, Vite, and React near success cases; the user requested WordPress, Astro, React, Next.js, and more, including comparable copy elsewhere.

## Authorized scope and constraints
- Update the general technology sentence in the home and `Person.knowsAbout` structured data.
- Preserve case-specific tags/descriptions and historical About Me examples; do not imply the two displayed clients used Astro or Next.js.
- Preserve all unrelated/uncommitted worktree changes. Keep the existing `/portfolio/` route.
- Strict TDD from project instruction; runner `node --test tests/technology-copy.test.js`. Delivery strategy: ask-on-risk; forecast under 60 authored lines.

## Tasks
- [x] **TECH-01** — Align general capability copy and structured data. Route: delegated writer (two source files plus test). Acceptance: home names WordPress, Astro, React, Next.js and more in a general-capabilities sentence; Person schema includes Astro and Next.js; client case tags remain factual. Checks: observed RED→GREEN test, build, rendered home copy and JSON-LD.

## Progress and evidence
- Read-only mapping found the home sentence and Person schema as analogous general lists; About Me and project tags are historical/project-specific.
- Branch: `feat/casos-de-exito`; pre-existing dirty files must be preserved.
- RED observed: 2/2 focused assertions failed before the edit. GREEN observed: 2/2 focused tests passed; combined nearby tests 5/5 passed. `npm run build` passed (Astro 0 errors/0 warnings, one existing hint; Google Reviews 403 omitted reviews).
- Generated home text and Person JSON-LD contain the requested stack. Client-project tags and historical About Me examples were left intact. `git diff --check` passed.
- Runtime boundary: static Astro home and Person JSON-LD; rollback boundary: technology sentence hunk in `src/pages/index.astro`, two `knowsAbout` entries in `src/lib/schema.ts`, and `tests/technology-copy.test.js`. Receipt-driven review remains disabled/unmanaged.
- Work-unit commit: `690d96a` (`feat(home): update general technology stack copy`). Pre-existing uncommitted home-service refinements and unrelated worktree changes remain outside this commit.

## Next step
Collect feedback; do not alter case-specific technology tags without project evidence.
