# SEO free-audit fixes — 2026-09-24

## Objective
Resolve three verified findings from the 2026-09-24 crawl: give `/recursos/` an HTML internal link, use the canonical `/cookies/` URL in internal links, and reduce the oversized profile image by converting it to WebP.

## Problem and rationale
The crawl found `/recursos/` in the sitemap with no HTML inlinks, repeated `/cookies` links causing redirects, and `public/me.jpg` at 1,039,591 bytes. The detailed exports identify exact paths and the repository confirms the current consumers.

## Authorized scope
- Add a contextual internal link to `/recursos/` in the existing homepage internal-links area.
- Change internal links from `/cookies` to `/cookies/` in the consent panel and privacy page.
- Use the WebP portrait in the repository assets folder and update its consumer; preserve dimensions and verify visual quality. The user moved it to `src/assets/me.webp` and removed the JPEG source.
- Add focused regression coverage for the link targets and generated image reference.
- Do not fix unrelated audit findings or modify other pre-existing user changes.

## Constraints and decisions
- Route: delegated direct implementation; mapping trigger fired because source understanding spans 4+ files, and writer trigger fired because implementation changes multiple files.
- TDD: enabled by user instructions; use RED → GREEN → REFACTOR. Exact existing runner: `node --test tests/analytics-consent.test.js`; build runner: `npm run build`.
- RDD: disabled by default (`gentle-ai review mode status`); do not start a review.
- Delivery: one coherent implementation work-unit commit on a feature branch; conventional commit, no AI attribution.
- Image: reference `src/assets/me.webp` as an Astro asset; do not recreate a public copy or restore the removed JPEG.

## Acceptance criteria
- The rendered homepage has a crawlable HTML link to `/recursos/`.
- The in-scope links resolve directly to `/cookies/`, without the unnecessary 301.
- The profile image is imported from `src/assets/me.webp`, with correct dimensions, valid WebP encoding, and visibly acceptable quality; no removed JPEG/public copy is referenced.
- Focused tests and `npm run build` pass; test-first RED evidence is reported.
- Only authorized paths are included in the work-unit commit; unrelated existing work remains untouched.

## Tasks
- [x] SEO-FREE-01 — Added the `/recursos/` contextual homepage link, canonicalized both cookie-policy links, converted the portrait to WebP, updated its consumer, and added regression coverage.
- [x] SEO-FREE-02 — Updated AboutMe to consume the user-moved WebP through Astro assets and aligned focused regression coverage.

## Progress and verification
- Homepage crawlable link added through `src/data/internal-links.ts`, rendered by its existing `InternalLinks` section.
- Both in-scope `/cookies` hrefs now target `/cookies/`.
- At SEO-FREE-01 time, `python3 scripts/process-image.py public/me.jpg public/images/me.webp --format webp` produced a 3383×3467 WebP at quality 85: 589,722 bytes vs 1,039,591 bytes JPEG (43.3% smaller). The user subsequently moved the WebP to `src/assets/me.webp` and removed the JPEG.
- RED: `node --test tests/analytics-consent.test.js` — 4 passed, 3 failed as expected for missing resources link, canonical cookie URLs, and WebP consumer/asset.
- GREEN: same command — 7 passed, 0 failed.
- `npm run build` — passed (0 errors, 0 warnings, 1 pre-existing Astro hint about inline JSON-LD script).
- `npm run check:seo-02:dist` — passed (24 HTML files scanned).
- `npm run check:seo-13:dist` — passed.
- Runtime harness: N/A; static Astro site, verified through build and generated-distribution checks.
- Rollback boundary: revert this single SEO-FREE-01 work-unit commit; it contains only task-scope source, test, image, and task-state files.
- Implementation commit: `503dd5b0ecc7920e9a7df8b0320ed68a76d74085` (`fix(seo): link resources and optimize profile image`).
- SEO-FREE-02 RED: updated focused portrait assertion first; `node --test tests/analytics-consent.test.js` — 6 passed, 1 failed because AboutMe lacked the Astro asset import/render binding.
- SEO-FREE-02 GREEN: `node --test tests/analytics-consent.test.js` — 7 passed, 0 failed.
- `npm run build` — passed (24 pages, 0 errors, 0 warnings; 1 pre-existing inline JSON-LD hint). Build optimized the imported image as `dist/_astro/me.Yt7x5cb6_18FY1g.webp`; no public duplicate was added.
- Rollback boundary: this SEO-FREE-02 commit alone, including the Astro import/rendering change, focused test, moved image, and this task record.
- SEO-FREE-02 implementation commit: `6e7b7b519332f4dc8a2b6931447c36267a3b602f` (`fix(seo): reference moved portrait asset`).

## Next step
SEO-FREE-02 implementation and verification are complete; commit identity is recorded below.
