# 0001. Static Astro 4 output on Netlify, configured from `public/`

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

The site is a portfolio and local-services site: content changes with releases, not per request. Hosting must be cheap, fast and simple, and every production deploy costs Netlify credits (see ADR 0009).

## Decision

- The site is a fully static Astro 4 build: no SSR adapter, no `output: 'server'|'hybrid'`, no API routes or endpoints under `src/pages/`. Data that comes from a third-party API is fetched at build time only.
- Netlify serves `dist/`. There is no `netlify.toml`: HTTP headers live in `public/_headers` and redirects in `public/_redirects`, which Astro copies verbatim into `dist/`.
- Redirects are real server 301s in `public/_redirects`, never meta-refresh pages.

## Consequences

- No runtime secrets or server code; anything dynamic (contact form, analytics) is a third-party service called from the browser (ADR 0007).
- A header or redirect change is a normal code change reviewed in a PR, and owned by infra (`infra.ownedPaths`).
- Leaving static output, adding an adapter or adding a server function is a radical change that needs the user.
- Build-time API data (Google reviews) is frozen until the next deploy.

## Evidence

- `astro.config.mjs`: `defineConfig` with integrations and `site`, no `output` and no `adapter` (static default).
- `package.json`: `astro` 4.4.5; no `@astrojs/netlify` adapter.
- `public/_headers` (security headers, CSP, cache for `/_astro/*`, `noindex` for `/informes/*`); `public/_redirects` (301s from `/servicios/*`).
- No `netlify.toml` at the repository root.
- `src/lib/google-reviews.ts`: build-time `fetch` to the Places API, with the comment that the site is static without SSR.
