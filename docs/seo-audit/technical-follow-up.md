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

## Indexación de páginas en foco (2026-11-15, NRD-98)

Diagnóstico de por qué `/tienda-online-sevilla/` y `/inteligencia-artificial/` no están en el índice de Google. Solo lectura: no se ha cambiado código ni se ha escrito nada en Search Console. Ningún estado de indexación se infiere: cada línea cita su fuente y fecha.

### Método y fecha

- Fecha de captura: 2026-11-15, todas las comprobaciones.
- URL Inspection y sitemaps de Search Console: `gsc_inspect` y `gsc_query sitemaps` con la cuenta de servicio de solo lectura, propiedad `sc-domain:nuriaromero.dev`.
- Producción (`https://nuriaromero.dev`, se construye desde `main`): `curl -sS` y `curl -sSIL` sobre `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`, las cabeceras y el HTML de cada URL.
- Enlaces internos: `pnpm build` nuevo sobre `develop` (`5abc00f` más el diseño de NRD-98, 24 páginas) y `parsePage` de `scripts/lib/seo-inventory.mjs` (misma regla que el inventario: enlaces dentro de `<main>`, sin autoenlaces), ejecutado con `node -e`. Aparte, un recuento de `href` en bruto para detectar enlaces sin barra final, que `parsePage` normaliza y por tanto oculta.
- Producción y `develop` coinciden en el conjunto de URLs del sitemap (24 en ambos).
- Las salidas en bruto de GSC y curl no se guardan en el repositorio.

### `/tienda-online-sevilla/`

1. **URL Inspection (2026-11-15, `gsc_inspect`)**: cobertura "URL is unknown to Google"; estado de indexación `INDEXING_STATE_UNSPECIFIED`; último rastreo: ninguno; rastreada como: ninguno; canónica elegida por Google y declarada: ninguna (sin datos); sitemaps que la referencian: N/D (la API de inspección no los devuelve); URLs de referencia: ninguna. Nota: el inventario `inventory-2026-11.md` (misma fecha) la recogía como "Discovered - currently not indexed"; la consulta de esta sesión devuelve "URL is unknown to Google". Se registran ambas lecturas tal cual, sin decidir cuál prevalece.
2. **robots (2026-11-15, producción)**: `robots.txt` tiene `User-agent: *` con `Allow: /` y ninguna regla `Disallow`; la ruta está permitida. Cabecera `X-Robots-Tag`: ausente. `<meta name="robots">` en el HTML: ausente. Origen: `src/components/seo/SEO.astro:19,28` (`noindex` es opt-in y la página no lo pasa) y `astro.config.mjs:62` (`allow: '/'`).
3. **Canónica (2026-11-15, producción)**: `<link rel="canonical" href="https://nuriaromero.dev/tienda-online-sevilla/">`, igual a la URL esperada (propia, con barra final).
4. **Sitemap (2026-11-15)**: presente en `sitemap-0.xml` (vía `sitemap-index.xml`), sin `lastmod` (por diseño: solo posts del blog, `astro.config.mjs:50-57`). Estado en Search Console: `sitemap-index.xml` enviado el 2026-11-14T15:37Z, sin pendiente, 0 errores y 0 avisos, 24 URLs enviadas; `sitemap-0.xml` enviado el 2026-07-09T07:01Z (anterior a la creación de la página, 2026-09-21, commit `f084e16`), 0 errores, 24 URLs enviadas. La API no devuelve la fecha de última lectura por Google: N/D. Tampoco permite saber si el envío del 2026-11-14 fue el primero del índice.
5. **HTTP (2026-11-15, producción, `curl -sSIL`)**: `/tienda-online-sevilla/` responde 200, URL final igual, 0 saltos. `/tienda-online-sevilla` responde 301 a `/tienda-online-sevilla/` y luego 200, 1 salto. `/servicios/tienda-online-sevilla` responde 404: la página se creó el 2026-09-21, después de la reestructuración `/servicios/` a raíz (2026-09-19), por lo que nunca existió bajo `/servicios/` y no necesita fila en `public/_redirects`.
6. **Enlaces internos desde `<main>` (build de `develop`, 2026-11-15)**: 6 páginas de origen: `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`, `/blog/pagina-web-para-restaurantes-que-necesita/`, `/diseno-web-sevilla/`, `/`, `/web-para-comercios-sevilla/`, `/web-para-restaurantes-sevilla/`. Ningún enlace en bruto sin barra final hacia esta URL. Coincide con el inventario (6).
7. **Render sin JS (2026-11-15, `curl` de producción)**: el HTML contiene el H1 "Diseño de tienda online en Sevilla para negocios que quieren vender" y el primer párrafo de `<main>` ("Si tienes un negocio en Sevilla y quieres vender por internet con una tienda online propia, la diseño y la construyo a medida..."). 2.094 palabras en `<main>`.

**Conclusión del diagnóstico en el sitio: sin causa en el sitio.** Los siete controles pasan; el estado de Google es el registrado en el punto 1 y no se amplía con inferencias.

### `/inteligencia-artificial/`

1. **URL Inspection (2026-11-15, `gsc_inspect`)**: cobertura "URL is unknown to Google"; estado de indexación `INDEXING_STATE_UNSPECIFIED`; último rastreo: ninguno; rastreada como: ninguno; canónica elegida por Google y declarada: ninguna (sin datos); sitemaps que la referencian: N/D (la API de inspección no los devuelve); URLs de referencia: ninguna.
2. **robots (2026-11-15, producción)**: ruta permitida por `User-agent: *` con `Allow: /`, sin `Disallow`. Cabecera `X-Robots-Tag`: ausente. `<meta name="robots">`: ausente. Origen: `src/components/seo/SEO.astro:19,28` y `astro.config.mjs:62`.
3. **Canónica (2026-11-15, producción)**: `<link rel="canonical" href="https://nuriaromero.dev/inteligencia-artificial/">`, igual a la URL esperada (propia, con barra final).
4. **Sitemap (2026-11-15)**: presente en `sitemap-0.xml` (vía `sitemap-index.xml`), sin `lastmod` (por diseño: solo posts del blog, `astro.config.mjs:50-57`). Estado en Search Console: el mismo que el de `/tienda-online-sevilla/` (índice enviado el 2026-11-14T15:37Z sin errores; `sitemap-0.xml` enviado el 2026-07-09T07:01Z, anterior a la página, primer commit 2026-09-19). La fecha de última lectura por Google: N/D.
5. **HTTP (2026-11-15, producción, `curl -sSIL`)**: `/inteligencia-artificial/` responde 200, URL final igual, 0 saltos. `/inteligencia-artificial` responde 301 a `/inteligencia-artificial/` y luego 200, 1 salto. `/servicios/inteligencia-artificial` responde 301 a `/inteligencia-artificial/` (`public/_redirects:6`) y luego 200, 1 salto, sin cadena.
6. **Enlaces internos desde `<main>` (build de `develop`, 2026-11-15)**: 3 páginas de origen: `/automatizaciones/`, `/desarrollo-software-medida/`, `/`. Ningún enlace en bruto sin barra final hacia esta URL. La navegación del `<header>` no cuenta (regla del inventario: solo `<main>`).
7. **Render sin JS (2026-11-15, `curl` de producción)**: el HTML contiene el H1 "Inteligencia artificial aplicada a tu negocio" y el primer párrafo de `<main>` ("La IA ya no es cosa de grandes empresas. Un chatbot que responde a tus clientes a las 11 de la noche..."). 1.386 palabras en `<main>`.

**Conclusión del diagnóstico en el sitio: sin causa en el sitio.** Los siete controles pasan; el estado de Google es el registrado en el punto 1.
