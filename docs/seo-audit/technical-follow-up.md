# Technical and measurement follow-up

**Priority:** Medium for the observed SVG errors; low for optional metadata; measurement work is data-dependent.
**Evidence:** Malformed SVG path errors were observed in the browser console. The audit could not access Search Console/GA4, PSI/CrUX, or verify indexing and field Core Web Vitals. Sitemap contains 20 URLs.
**Dependencies:** Reproduce console errors on current pages; authorized access to Google Search Console/Analytics and/or PSI/CrUX data for measurement checks.

## Steps

1. Reproduce the SVG console errors on current rendered pages and record the affected page and asset from browser evidence before changing anything.
2. Correct only confirmed malformed SVG path data, then recheck the affected page(s) and console. Avoid guessing asset paths or editing unrelated illustrations.
3. Establish LCP evidence using PSI/CrUX or another suitable measurement before prioritizing below-the-fold image optimization. Optimize only confirmed candidates and remeasure.
4. When authorized data access exists, verify indexing in Search Console and review GA4 organic traffic and PSI/CrUX field metrics. Until then, leave these as unverified rather than inferring outcomes.
5. Consider sitemap `lastmod` only if the site has trustworthy per-URL modification dates. It is low priority and should not be fabricated.
6. Treat `/llms.txt` as optional: its 404 is not a release blocker. FAQ rich results are not an expected result for this commercial site; do not add FAQ markup solely to pursue them.

## Acceptance criteria

- [x] The previously observed SVG error is either reproduced and fixed with a clean recheck, or documented as not reproducible with date and page tested. Not reproducible on 2026-09-18: checked `/`, `/portfolio/`, and `/servicios/` on a fresh production build (`pnpm build` + `pnpm preview`) with a full page reload before each console read (Chrome DevTools console, via claude-in-chrome) — no console messages of any kind on any of the three pages. No malformed SVG path data found in `src/components/icons/*.astro` on inspection either. Treating the original finding as stale/already resolved rather than actively fixing anything, since there's nothing to reproduce.
- [ ] Image work is supported by LCP/performance evidence and followed by a comparable remeasurement. Still blocked: no PSI/CrUX or field data access this session.
- [ ] Indexing, traffic, and CWV findings are labeled verified only when supported by the relevant data; otherwise explicitly remain unverified. Still blocked: no Search Console/GA4 access this session. Explicitly unverified, not inferred.
- [x] No untrustworthy sitemap dates are introduced; optional `/llms.txt` and FAQ-rich-result work is not treated as a blocker. No sitemap `lastmod` or `/llms.txt` work was done — correctly left as non-blocking, per the audit's own guidance.

## Verification

- Tested URLs: `/`, `/portfolio/`, `/servicios/`. Device/context: desktop Chrome via claude-in-chrome, local production preview (`astro preview`). Date: 2026-09-18. Console result: no messages (log/warn/error) on any of the three pages after a full reload.
- Performance/indexing/traffic data source: none available this session (no Search Console, GA4, or PSI/CrUX access) — remains explicitly unverified, not inferred from the console check or from content edits made elsewhere.
- The 20-URL sitemap count is only a sitemap inventory snapshot; it does not establish index coverage.
