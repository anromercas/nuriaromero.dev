# google-reviews-fetch Specification

## Purpose
Keep the paid Google Places Place Details request that feeds the Google reviews shown on the site to at most one request per build, made only by the Netlify production build, while production pages keep rendering the reviews.

## Requirements

### Requirement: At most one Place Details request per build

The build SHALL request Google review data from Places API (New) Place Details at most once per build process, and every page that shows review data SHALL reuse that single result.

#### Scenario: Several pages need the reviews in one build

- **WHEN** a production build with Places credentials renders every page that calls `getGoogleReviews()`
- **THEN** exactly one Place Details request is made during the whole build

#### Scenario: Repeated calls share one result

- **WHEN** `getGoogleReviews()` is called more than once in the same process
- **THEN** every call returns the same promise and no further request is made

### Requirement: Only the Netlify production build requests reviews

The build MUST NOT request Place Details unless `process.env.CONTEXT` equals `production`. Any other context (unset, `deploy-preview`, `branch-deploy`, `dev`, CI, local, the unattended sprint) SHALL resolve the review data to `null` without a request and without logging, even when Places credentials are set.

#### Scenario: Non-production build with credentials

- **WHEN** the build runs with `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` set and `CONTEXT` unset or different from `production`
- **THEN** no Place Details request is made and the review data is `null`

#### Scenario: Pages without review data

- **WHEN** the review data is `null`
- **THEN** each page renders its existing "reviews unavailable" state (no reviews section, no review quote, no Google rating stat, no reviews JSON-LD) and the build succeeds

### Requirement: The production build still renders the reviews

A build with `CONTEXT=production` and Places credentials SHALL request the reviews and render them on every page that showed them before this change: the home, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-para-ia/`, `/sobre-mi/` and `/portfolio/`. The home SHALL keep emitting its reviews JSON-LD, limited to the visible rating stat and the quoted review (see `home-page`).

#### Scenario: Production build with credentials and reviews

- **WHEN** the build runs with `CONTEXT=production`, Places credentials and a Place Details response that contains reviews
- **THEN** every listed page contains the review data it rendered before (the review quote or reviews section, or the "X,X en Google" stat), the home contains the reviews JSON-LD with an `aggregateRating`, and `scripts/check-google-reviews.mjs` exits 0 on the built home

### Requirement: Null paths stay unchanged

In the production context, missing credentials, a response without reviews, a non-OK response and a thrown request SHALL keep resolving to `null` as before: no request when credentials are missing, a warning that never contains the API key on errors, and the build never fails.

#### Scenario: Production build without credentials

- **WHEN** `CONTEXT=production` and `GOOGLE_PLACES_API_KEY` or `GOOGLE_PLACE_ID` is missing
- **THEN** no request is made and the review data is `null`

#### Scenario: Production build when Places fails

- **WHEN** `CONTEXT=production`, credentials are set and Place Details returns a non-OK status, no reviews, or throws
- **THEN** the review data is `null`, any warning omits the API key, and the build succeeds
