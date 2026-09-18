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

- [ ] The previously observed SVG error is either reproduced and fixed with a clean recheck, or documented as not reproducible with date and page tested.
- [ ] Image work is supported by LCP/performance evidence and followed by a comparable remeasurement.
- [ ] Indexing, traffic, and CWV findings are labeled verified only when supported by the relevant data; otherwise explicitly remain unverified.
- [ ] No untrustworthy sitemap dates are introduced; optional `/llms.txt` and FAQ-rich-result work is not treated as a blocker.

## Verification

Record the tested URL(s), device/page context, date, console result, and performance data source. The 20-URL sitemap count is only a sitemap inventory snapshot; it does not establish index coverage.
