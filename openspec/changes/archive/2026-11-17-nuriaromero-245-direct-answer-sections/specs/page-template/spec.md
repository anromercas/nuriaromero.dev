## ADDED Requirements

### Requirement: Sections can open with a direct answer

A template section SHALL accept an optional direct answer supplied by the page. When supplied, it SHALL render as the first paragraph after the section's keyword heading and display title, before any list, card, plan, step or FAQ item of that section, marked as the section's direct answer. A section without an answer SHALL render as before.

#### Scenario: Section with an answer

- **WHEN** a page passes a direct answer to its process section
- **THEN** the built section shows, in order, the keyword heading, the display title, the answer paragraph and then the steps

#### Scenario: Section without an answer

- **WHEN** a page passes no direct answer to a section
- **THEN** the section renders no empty answer paragraph and its markup is otherwise unchanged

#### Scenario: FAQ section answer replaces the lede

- **WHEN** a page passes a direct answer and no lede to the FAQ section
- **THEN** the FAQ intro shows the answer paragraph and the booking button, with no empty lede

### Requirement: Key sections open with a self-contained direct answer

Each template page SHALL register its key sections (what it is, who it is for or which option, price if any, how I work, FAQ). Each SHALL open with a self-contained answer of one or two sentences and 15 to 45 words, in Spanish with `tú`, with no promises, no invented figures and prices read from the site data. Word ranges SHALL still hold, shortening other text rather than the answer.

#### Scenario: Registered key section without an answer

- **WHEN** a page registers `proceso-title` as a key section and that section has no direct answer first
- **THEN** the template contract check fails naming the page and the section

#### Scenario: Answer too short or too long

- **WHEN** a registered key section's answer has fewer than 15 or more than 45 words, or more than two sentences
- **THEN** the template contract check fails naming the page, the section and the measured length

#### Scenario: Answer preceded by a list

- **WHEN** a list, card or FAQ item appears in a registered key section before its answer paragraph
- **THEN** the template contract check fails naming the page and the section

#### Scenario: Price answer reads the site data

- **WHEN** a price section's answer cites a price
- **THEN** the figure comes from the same `src/data` value the plans render, and the page source holds no price literal in the answer

#### Scenario: Pages covered

- **WHEN** the site is built
- **THEN** `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/automatizaciones/`, `/desarrollo-software-medida/`, `/inteligencia-artificial/` and `/seo-para-ia/` each register their key sections and pass the check

#### Scenario: Word range kept

- **WHEN** answers are added to a page with a word range
- **THEN** the page's visible owner text still falls inside its registered range
