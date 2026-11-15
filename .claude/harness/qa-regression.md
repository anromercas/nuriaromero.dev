# QA regression pass

The QA engineer runs this short pass after every story verification and every recheck, in the running app at the tested SHA. Keep it under ~10 minutes. Each step: action, expected result, what to capture as evidence.

## Setup

- Start: `pnpm dev --port 4399 --strictPort` (no other local stack). Stop it when done.
- Test data: none needed. Never submit the real contact form to Formspree; check its client-side validation and states only.

## Core path

1. Open `/` -> hero, services and contact CTA render, no layout break. Evidence: screenshot (desktop and 375 px).
2. Open `/seo-local-sevilla/` and `/diseno-web-sevilla/` -> page renders with its H1, prices and CTA. Evidence: screenshot.
3. Open the mobile menu at 375 px -> it opens, every link navigates, it closes. Evidence: screenshot.
4. Open `/contacto/` -> fill the form with obviously fake data and submit empty first -> validation messages show; do not send a real submission. Evidence: screenshot.
5. Open `/blog/` and one post -> list and post render, internal links work.
6. Reload any page with cleared storage -> consent banner appears; no request to google-analytics.com before accepting (network panel). Evidence: network list.

## Cross-cutting checks

- No console errors (including CSP violations) on the pages visited.
- Keyboard: the core path works without a mouse; focus is visible.
- Narrow viewport (375 px): no horizontal scroll on the pages visited.
- View source of a changed page: one `<h1>`, canonical with trailing slash, JSON-LD present where it was before.

## Not automatable (list as manual checks)

- A real Formspree submission and its email.
- The Google Calendar booking link destination.
- Production headers from Netlify (`public/_headers`) and redirects (`public/_redirects`): only visible on a deploy.
