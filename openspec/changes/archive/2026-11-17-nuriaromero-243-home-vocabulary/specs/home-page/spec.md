## ADDED Requirements

### Requirement: The home caps repetitions of the city name

The visible text of the home's `<main>`, excluding the live Google review, SHALL contain "sevilla" (case- and accent-insensitive, counted per word) at most 14 times. The protected occurrences SHALL stay: the H1 and hero subtitle "consultor SEO en Sevilla", the owner-page anchors, the restaurant niche anchor, the real project titles, the quoted real keyword and the NAP address. Replacements SHALL be true (no area without real work) and in Spanish with `tú`.

#### Scenario: Count over the cap fails the build check

- **WHEN** the built home has more than 14 occurrences of "sevilla" in its visible `<main>` text
- **THEN** the template contract check fails naming the route, the term, the count and the cap

#### Scenario: Live review does not count

- **WHEN** the live Google review quote contains "Sevilla"
- **THEN** that occurrence is not counted, because the review block is excluded like in the word budget

#### Scenario: Protected occurrences remain

- **WHEN** the home is built after this change
- **THEN** the H1, the hero subtitle, the anchors to `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/` and `/web-para-restaurantes-sevilla/`, both real project titles, the quoted keyword "administradores de fincas en sevilla" and the NAP address still contain "Sevilla"

#### Scenario: Count after NRD-245

- **WHEN** NRD-245's direct answers are on the home
- **THEN** any "Sevilla" they contain counts toward the same cap of 14
