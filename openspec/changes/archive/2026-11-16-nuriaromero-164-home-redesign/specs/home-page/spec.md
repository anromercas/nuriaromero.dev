# Spec Delta

## Purpose

Defines what the home page `/` shows and guarantees: the owned "consultor seo sevilla" placement, the template section order from `/seo-local-sevilla/`, a short text budget, a FAQ built only from sourced questions and mirrored in FAQPage, and honest proof.

## ADDED Requirements

### Requirement: The home keeps its owned keyword placement

The home SHALL keep "consultor SEO Sevilla" in the title and the single H1, and in the first paragraph of the hero, and MUST NOT use a term owned by another page ("agencia seo sevilla", "seo local sevilla", "posicionamiento web sevilla", "diseño web sevilla" and the rest of `keywordOwners`) in the title, H1 or any H2.

#### Scenario: Owned term in title and H1

- **WHEN** the home is built
- **THEN** the title and the only H1 contain "consultor SEO" and "Sevilla", and the hero subtitle contains "consultor SEO en Sevilla"

#### Scenario: No term owned by another page in headings

- **WHEN** the keyword ownership check runs on the built home
- **THEN** no title, H1 or H2 of the home targets a term owned by another page

### Requirement: The home follows the template section order

The home SHALL render, in this order: hero with a drawn illustration and the booking button, proof strip, bento with one tile per service, process timeline with the owner's real portrait, real proof followed by the "consultor or agency" comparison, FAQ, related links, closing band and NAP; it MUST NOT render a plans section and SHALL link to the plans of `/seo-local-sevilla/` instead.

#### Scenario: Sections in reference order

- **WHEN** the built home `<main>` is read top to bottom
- **THEN** the sections appear in the order above and each opens with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: No plans on the home

- **WHEN** the built home is inspected
- **THEN** it shows no plan cards and contains a link to `/seo-local-sevilla/` from the plans-related copy

#### Scenario: Niche pages stay linked from the home

- **WHEN** the site-architecture check reads the built home `<main>`
- **THEN** it finds a trailing-slash link to each of the four niche pages (`/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/`, `/web-para-abogados-gestorias-sevilla/`) in the related links

### Requirement: Each service tile links to its owner page

The bento SHALL show one tile per public service page listed in `services` except the parked niche service, each with one sentence and a link to that service's route in trailing-slash form.

#### Scenario: Service tiles

- **WHEN** the bento is rendered
- **THEN** every tile has a title, one sentence, a single-stroke illustration and a link whose href is the service route ending in `/`

### Requirement: The home stays within its text budget

The visible words in the home `<main>` SHALL be between 900 and 1,100, measured with the same method as the current figure.

#### Scenario: Word budget

- **WHEN** the template page check measures the built home
- **THEN** the visible word count of `<main>` is at least 900 and at most 1,100

### Requirement: The FAQ uses only sourced questions and matches FAQPage

The home FAQ SHALL contain 6 to 8 questions taken from the eight sourced questions in NRD-164 (natural rewording allowed), each answer SHALL give the direct answer in its first two sentences, and the FAQPage structured data SHALL list exactly the visible questions in the same order.

#### Scenario: FAQ equals FAQPage

- **WHEN** the template page check compares the visible FAQ with the FAQPage of the built home
- **THEN** both list the same questions in the same order and there are between 6 and 8

#### Scenario: Price questions use published plans

- **WHEN** a visible answer talks about what SEO costs
- **THEN** it states the published Plan Local and Local Pro monthly prices with VAT not included, taken from site data, and links to `/seo-local-sevilla/`, and no competitor rate is shown

#### Scenario: Honest answer about the best consultant

- **WHEN** the question about the best SEO consultant is included
- **THEN** the answer explains what to look at when choosing one and never claims that Nuria is the best

### Requirement: Proof on the home is real

The home SHALL show only figures and reviews that are real and sourced (the live Google rating and review, facts already published in site data, real client projects), SHALL omit a proof cell when its data is absent, and MUST NOT promise rankings, traffic, leads or AI recommendations.

#### Scenario: Reviews unavailable at build time

- **WHEN** the Google reviews data is unavailable during the build
- **THEN** the rating cell, the review quote and the reviews structured data are omitted and the page still builds

#### Scenario: Illustrations labelled

- **WHEN** an illustration depicts a hypothetical listing or result
- **THEN** it is captioned "Ejemplo ilustrativo"

### Requirement: The home keeps its primary CTA markers

The hero SHALL keep the booking CTA as the primary action with the markers the build-time hero check relies on, and the hero section SHALL stay excluded from the scroll reveal animation.

#### Scenario: Hero markers present

- **WHEN** the hero check runs on the built home
- **THEN** it finds the hero marker, the primary CTA marker and a booking link to the official schedule
