# site-identity Specification

## Purpose

Defines how the site names itself so search and answer engines join every signal to one entity: the canonical brand "Nuria Romero" from the site data in page titles, Open Graph, JSON-LD entities, the header logo name and `llms.txt`, with complete Organization nodes and the domain only as an alternate name.

## Requirements

### Requirement: Indexable titles end with the canonical brand

Every indexable page SHALL publish a `<title>` that ends with the canonical brand string defined once in the site data ("Nuria Romero"). The brand SHALL be appended once, after the page's own title and the separator " | ", unless the page title already ends with the brand. The page's own title SHALL NOT contain the brand anywhere else, and the domain SHALL NOT be used as the brand in a title. `og:title` and `twitter:title` SHALL carry the page's own title without the suffix.

#### Scenario: Service page title gains the suffix

- **WHEN** the build renders a page whose own title is "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €"
- **THEN** its `<title>` is "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 € | Nuria Romero"
- **AND** its `og:title` is "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €"

#### Scenario: Title already ending with the brand

- **WHEN** a page's own title already ends with "Nuria Romero" (for example "Recursos para citar y compartir — Nuria Romero")
- **THEN** its `<title>` is rendered unchanged, with the brand exactly once

#### Scenario: Home title keeps its keyword first

- **WHEN** the build renders the home
- **THEN** its `<title>` starts with "Consultor SEO en Sevilla", ends with " | Nuria Romero" and contains "Nuria Romero" only once

#### Scenario: Legal pages stop using the domain as brand

- **WHEN** the build renders `/aviso-legal/`, `/privacidad/` or `/cookies/`
- **THEN** the `<title>` ends with " | Nuria Romero" and does not contain "nuriaromero.dev"

#### Scenario: A title without the brand fails the build check

- **WHEN** an indexable page in `dist/` has a `<title>` that does not end with "Nuria Romero"
- **THEN** the structured-data build check fails naming the page

#### Scenario: Page-owned title length stays guarded

- **WHEN** the `/seo-local-sevilla/` title is checked for length
- **THEN** the 65-character limit applies to the title without the " | Nuria Romero" suffix, and the check also requires the suffix

### Requirement: Open Graph site name is the canonical brand

Every page SHALL publish `og:site_name` equal to the canonical brand string from the site data.

#### Scenario: Site name differs from the brand

- **WHEN** any built page has an `og:site_name` different from "Nuria Romero"
- **THEN** the structured-data build check fails naming the page

### Requirement: Organization nodes are complete

Every JSON-LD node whose type includes `Organization`, `ProfessionalService` or `LocalBusiness` SHALL carry `name` equal to the canonical brand and `url` equal to the site URL. The business entity SHALL carry the domain only as `alternateName`. The node that adds real Google review data to the shared business `@id` SHALL include the same `name` and `url`.

#### Scenario: Home with real Google reviews

- **WHEN** the build has real Google review data and renders the home
- **THEN** the node carrying `aggregateRating` and `review` has `@id` "https://nuriaromero.dev/#business", `name` "Nuria Romero" and `url` "https://nuriaromero.dev"

#### Scenario: Build without review data

- **WHEN** the build has no Google review data
- **THEN** no reviews node is emitted and every remaining Organization-typed node has `name` and `url`

#### Scenario: Incomplete node fails the build check

- **WHEN** any built page contains an Organization-typed node without `name` or `url`
- **THEN** the structured-data build check fails naming the page and the node `@id`

### Requirement: Header logo is named with the brand

The header logo link SHALL have an accessible name that starts with the brand "Nuria Romero" and contains the text the wordmark shows ("nuriaromero.dev"), so the name includes the visible label. The visual wordmark SHALL NOT change.

#### Scenario: Screen reader reads the logo link

- **WHEN** an assistive technology reads the header logo link on any page
- **THEN** its accessible name is "Nuria Romero, nuriaromero.dev"
- **AND** the link has no `aria-label` that replaces the image's alternative text

#### Scenario: Voice control uses the visible wordmark

- **WHEN** a voice-control user asks to activate "nuriaromero.dev", the text shown by the wordmark
- **THEN** the header logo link is activated because its accessible name contains that text

### Requirement: llms.txt uses the canonical brand

`/llms.txt` SHALL name the site and its owner with the canonical brand; the domain MAY appear only as the site's address.

#### Scenario: llms.txt introduction

- **WHEN** `/llms.txt` is read
- **THEN** its title line is "# Nuria Romero" and its summary refers to the site as the website of Nuria Romero, not as "nuriaromero.dev" alone
