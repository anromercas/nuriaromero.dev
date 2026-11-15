# 0007. Formspree contact form, GA4 after consent, CSP in `public/_headers`

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

A static site (ADR 0001) cannot receive form posts or run analytics server-side. The site processes personal data of Spanish visitors, so RGPD/LOPDGDD and LSSI-CE apply: no non-essential cookies or tracking before consent.

## Decision

- Contact form: `ContactForm.astro` posts with `fetch` from `src/scripts/contact-form.js` to Formspree (`https://formspree.io/f/mdklbyaz`). The script hooks `astro:page-load` and wraps its state in a function so it survives View Transitions.
- Analytics: GA4 with Consent Mode. `analytics-consent.js` sets every consent signal to `denied` by default and only loads `gtag.js` and sends `analytics_storage: granted` after the visitor accepts in `AnalyticsConsent.astro`; the choice is stored in `localStorage` (`site-analytics-consent`). Only an allow-list of events is sent. The measurement id is `PUBLIC_GA4_MEASUREMENT_ID`.
- CSP and security headers live in `public/_headers`. `script-src` is `'self'` plus `https://www.googletagmanager.com` with no `'unsafe-inline'` (inline scripts were moved to `src/scripts/*.js`, SEO-27); `connect-src` and `form-action` allow Formspree and Google Analytics; `style-src` keeps `'unsafe-inline'` for Astro scoped styles.
- `/privacidad/` and `/cookies/` describe the processors (Formspree, Google Analytics) and must change with them.

## Consequences

- A new third-party origin (script, image, font, form endpoint) needs a deliberate CSP edit in the same story; a CSP widened with `*` or `'unsafe-eval'` is rejected.
- Inline `<script is:inline>` or inline event handlers break under the CSP; client code goes in `src/scripts/` and is imported.
- A new processor, tracker or form field is a radical change and must update the legal pages.

## Evidence

- `src/components/ContactForm.astro`, `src/scripts/contact-form.js` (`ENDPOINT`, SEO-27 comment).
- `src/components/AnalyticsConsent.astro` (`import.meta.env.PUBLIC_GA4_MEASUREMENT_ID`), `src/scripts/analytics-consent.js` (`DENIED_CONSENT`, `ALLOWED_EVENTS`, `createConsentController`).
- `public/_headers` (`Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `Permissions-Policy`).
- `src/pages/privacidad.astro`, `src/pages/cookies.astro`; `tests/analytics-consent.test.js`; `scripts/check-seo-12.mjs`.
