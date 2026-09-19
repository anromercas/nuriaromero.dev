# Technical and measurement follow-up

> **Note (2026-09-19):** service pages moved from `/servicios/<slug>` to
> root `/<slug>` (see `odd/tasks/servicios-a-raiz.md`), with 301 redirects
> in place. References to `/servicios/` below are historical — they were
> accurate on the date each check was run and are left as-is to preserve
> the audit trail.

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
- [x] Image work is supported by LCP/performance evidence and followed by a comparable remeasurement. CrUX field data (2026-09-18): 404, origin has insufficient Chrome traffic for the dataset — legitimate "no field data yet" result. PSI lab data obtained 2026-09-19 via authenticated PSI API (mobile strategy, 2 runs per page):
  - `/`: LCP 1.0–1.2 s, CLS 0–0.096, TBT 0 ms, performance score 0.98.
  - `/portfolio/`: LCP 0.9 s, CLS 0.021, TBT 0 ms, performance score 1.00.
  Both pages are well within Google's "good" thresholds (LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms — see [web.dev Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)). This is lab data (simulated, single-session), not field data from real users, and covers only `/` and `/portfolio/`, not the sector or blog pages — noted as scope limits, not a full-site guarantee. No image-specific optimization work was triggered, since no candidate page showed a performance problem.
- [x] Indexing, traffic, and CWV findings are labeled verified only when supported by the relevant data; otherwise explicitly remain unverified. Search Console checked 2026-09-19 (site owner's own logged-in session, read via claude-in-chrome, nuriaromero.dev domain property):
  - **Indexing**: 19 of 29 known URLs indexed. Not indexed: 8 "Página con redirección" (site-caused, likely trailing-slash/canonical redirects — expected, not necessarily a problem), 1 "Descubierta: actualmente sin indexar", 1 "Rastreada: actualmente sin indexar" (both Google-side, common for a low-traffic site and not inherently a bug).
  - **Performance (last 3 months, ~2026-06-21 to 2026-09-19)**: 10 total clicks, 222 impressions, 4.5% average CTR, 26.8 average position across the whole domain.
  - **Top pages by clicks**: `/` (8 clicks / 80 impressions), `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` (1/25), `/sobre-mi/` (1/11). Several pages have impressions but 0 clicks yet, including `/servicios/` (70 impressions) and the sector pages `/web-para-restaurantes-sevilla/` and `/web-para-comercios-sevilla/` (4 impressions each).
  - GA4 showed a "data collection not active" warning in its own UI. Investigated: the consent-gated tracking code (`src/components/AnalyticsConsent.astro`, `src/scripts/analytics-consent.js`) has the correct measurement ID (`G-NCV98R3HW7`), correct consent-gating logic, and `ViewTransitions` is present so `astro:page-load` fires as expected. Live-tested by visiting the production site, clearing a stale local consent choice, and accepting: `dataLayer` received the correct `consent`/`config` calls. The `gtag/js` script request returned a 503 in that specific browser test session, but `curl` to the same URL directly returned 200 — the 503 was an artifact of that browser session (likely an extension), not a real server or code problem. Conclusion: the GA4 warning is best explained by low real traffic (10 clicks/3 months) combined with opt-in consent, not a tracking bug — no code change made. GA4's own organic-traffic reports were not cross-checked against Search Console this session.
  - This data reflects the site's state *before* this session's content edits; it is a baseline, not evidence that any specific correction changed rankings, traffic, or indexing. Do not attribute future changes in these numbers to this session's edits without a comparable remeasurement after enough time has passed.
- [x] No untrustworthy sitemap dates are introduced; optional `/llms.txt` and FAQ-rich-result work is not treated as a blocker. No sitemap `lastmod` or `/llms.txt` work was done — correctly left as non-blocking, per the audit's own guidance.

## Verification

- Tested URLs: `/`, `/portfolio/`, `/servicios/`. Device/context: desktop Chrome via claude-in-chrome, local production preview (`astro preview`). Date: 2026-09-18. Console result: no messages (log/warn/error) on any of the three pages after a full reload.
- Performance data source: CrUX API (2026-09-18, 404 — insufficient traffic) and authenticated PSI API (2026-09-19, mobile, 2 runs on `/` and `/portfolio/`) — see acceptance criteria above for figures.
- Indexing/traffic data source: Google Search Console (nuriaromero.dev domain property), read on 2026-09-19 via the site owner's own logged-in session — see acceptance criteria above for figures. GA4 was not checked this session.
- The 20-URL sitemap count is only a sitemap inventory snapshot; it does not establish index coverage.
