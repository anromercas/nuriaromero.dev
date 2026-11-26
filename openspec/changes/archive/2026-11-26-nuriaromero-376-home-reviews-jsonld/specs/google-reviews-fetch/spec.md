## MODIFIED Requirements

### Requirement: The production build still renders the reviews

A build with `CONTEXT=production` and Places credentials SHALL request the reviews and render them on every page that showed them before this change: the home, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-para-ia/`, `/sobre-mi/` and `/portfolio/`. The home SHALL keep emitting its reviews JSON-LD, limited to the visible rating stat and the quoted review (see `home-page`).

#### Scenario: Production build with credentials and reviews

- **WHEN** the build runs with `CONTEXT=production`, Places credentials and a Place Details response that contains reviews
- **THEN** every listed page contains the review data it rendered before (the review quote or reviews section, or the "X,X en Google" stat), the home contains the reviews JSON-LD with an `aggregateRating`, and `scripts/check-google-reviews.mjs` exits 0 on the built home
