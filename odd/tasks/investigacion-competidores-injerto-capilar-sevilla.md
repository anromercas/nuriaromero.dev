# Investigación de competidores: injerto capilar en Sevilla

## Objective
Investigate public Google Search/Maps visibility and public website conversion signals for hair-transplant clinics in Seville to assess a local SEO niche.

## Authorized scope
- Public information only; no login, personal data, contact, CAPTCHA bypass, or anti-bot circumvention.
- Six Google Spain queries and the initial competitor list supplied by the user.
- Evidence report and screenshots saved under `research/competidores-sevilla/`.

## Tasks
- [x] T1 Attempted Google SERP queries; Google blocked after the first query. Saved blocker and alternative Bing screenshots.
- [x] T2 Inspected 10 public competitor/brand pages with Playwright; Quirónsalud returned 403.
- [x] T3 Compiled cautious Markdown report with limitations, evidence paths, and a €299 service recommendation.

## Checks
- Use Playwright in a clean browser context.
- Record `No visible` when evidence is unavailable.
- Do not infer search volume, rankings beyond observed SERP positions, or business outcomes.

## Route
- T1: delegated direct research worker if available; otherwise local Playwright due browser-tool timeout.
- T2: local Playwright/public web inspection, no credentials.
- T3: local atomic report write after evidence review.

## Progress
Completed. Google/Maps visibility remains unverified because Google blocked the clean Playwright session; website signals and public-source limitations are documented in `research/competidores-sevilla/informe.md`.
