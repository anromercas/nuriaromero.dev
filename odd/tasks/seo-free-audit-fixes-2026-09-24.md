# SEO free-audit fixes — 2026-09-24

## Objective
Resolve three verified findings from the 2026-09-24 crawl: give `/recursos/` an HTML internal link, use the canonical `/cookies/` URL in internal links, and reduce the oversized profile image by converting it to WebP.

## Problem and rationale
The crawl found `/recursos/` in the sitemap with no HTML inlinks, repeated `/cookies` links causing redirects, and `public/me.jpg` at 1,039,591 bytes. The detailed exports identify exact paths and the repository confirms the current consumers.

## Authorized scope
- Add a contextual internal link to `/recursos/` in the existing homepage internal-links area.
- Change internal links from `/cookies` to `/cookies/` in the consent panel and privacy page.
- Convert the existing profile image with `scripts/process-image.py` (Python/Pillow) to WebP under the existing assets folder and update its consumer; preserve dimensions and verify visual quality.
- Add focused regression coverage for the link targets and generated image reference.
- Do not fix unrelated audit findings or modify other pre-existing user changes.

## Constraints and decisions
- Route: delegated direct implementation; mapping trigger fired because source understanding spans 4+ files, and writer trigger fired because implementation changes multiple files.
- TDD: enabled by user instructions; use RED → GREEN → REFACTOR. Exact existing runner: `node --test tests/analytics-consent.test.js`; build runner: `npm run build`.
- RDD: disabled by default (`gentle-ai review mode status`); do not start a review.
- Delivery: one coherent work-unit commit on a feature branch; conventional commit, no AI attribution.
- Image: keep source JPEG unless existing asset convention says otherwise; save the WebP in the existing asset folder. Never remove unrelated files.

## Acceptance criteria
- The rendered homepage has a crawlable HTML link to `/recursos/`.
- The in-scope links resolve directly to `/cookies/`, without the unnecessary 301.
- The profile image is served from a WebP asset under the existing assets folder, with correct dimensions, valid WebP encoding, and visibly acceptable quality; the original remains intact unless repository conventions explicitly require replacing it.
- Focused tests and `npm run build` pass; test-first RED evidence is reported.
- Only authorized paths are included in the work-unit commit; unrelated existing work remains untouched.

## Tasks
- [x] SEO-FREE-01 — Added the `/recursos/` contextual homepage link, canonicalized both cookie-policy links, converted the portrait to WebP, updated its consumer, and added regression coverage.

## Progress and verification
- Homepage crawlable link added through `src/data/internal-links.ts`, rendered by its existing `InternalLinks` section.
- Both in-scope `/cookies` hrefs now target `/cookies/`.
- `public/me.jpg` preserved; `python3 scripts/process-image.py public/me.jpg public/images/me.webp --format webp` produced valid 3383×3467 WebP at quality 85: 589,722 bytes vs 1,039,591 bytes JPEG (43.3% smaller). Pillow pixel comparison mean absolute channel error: 1/255; visual preview showed no material artifacts.
- RED: `node --test tests/analytics-consent.test.js` — 4 passed, 3 failed as expected for missing resources link, canonical cookie URLs, and WebP consumer/asset.
- GREEN: same command — 7 passed, 0 failed.
- `npm run build` — passed (0 errors, 0 warnings, 1 pre-existing Astro hint about inline JSON-LD script).
- `npm run check:seo-02:dist` — passed (24 HTML files scanned).
- `npm run check:seo-13:dist` — passed.
- Runtime harness: N/A; static Astro site, verified through build and generated-distribution checks.
- Rollback boundary: revert this single SEO-FREE-01 work-unit commit; it contains only task-scope source, test, image, and task-state files.
- Commit: this task is the single HEAD work-unit commit; its immutable hash is reported in the handoff.

## Next step
SEO-FREE-01 complete; no further task authorized in this handoff.
