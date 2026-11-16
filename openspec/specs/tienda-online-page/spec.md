# tienda-online-page Specification

## Purpose
Defines what `/tienda-online-sevilla/` shows and guarantees on the template: the owned "diseño tienda online sevilla" placement, the section order of `/seo-local-sevilla/`, a short text budget, a FAQ of sourced questions mirrored in FAQPage, plans that read the store offer source, and honest proof.

## Requirements

### Requirement: The page keeps its owned keyword placement

`/tienda-online-sevilla/` SHALL keep "Diseño de tienda online en Sevilla" in the title and in the single H1, and MUST NOT use a term owned by another page in the title, H1 or any H2.

#### Scenario: Owned term kept

- **WHEN** the page is built
- **THEN** the title and the only H1 start with "Diseño de tienda online en Sevilla"

#### Scenario: No term of another owner in headings

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page

### Requirement: The page follows the template section order

The page SHALL render, in this order: hero with a drawn store illustration, the booking button and a secondary link to the prices; proof strip; bento of what the store includes with one sentence per tile; process timeline; real proof followed by the "WooCommerce, Shopify or custom" comparison; plans; FAQ; related links; closing band and NAP; and no legacy block.

#### Scenario: Sections in reference order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no legacy benefits grid, process list, pricing card, FAQ, CTA block, gray Tailwind card or glyph icon

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 900 and 1,100, measured with the same method as the current figure.

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at least 900 and at most 1,100

### Requirement: Plans show the store offer from its source

The plans SHALL show the three store options at the starting price read from the store offer source, followed by the included list, the quoted-separately list with its link and the written-final-price note from the same source, and MUST NOT show any other price or a recommended option.

#### Scenario: Three plans at one price

- **WHEN** the plans section renders
- **THEN** it shows exactly three plans named after the store options, each with the source starting price, none with the "Recomendado" badge

#### Scenario: Scope lists below the plans

- **WHEN** the block after the plans renders
- **THEN** it lists every included item and every quoted-separately item of the source, links `/automatizaciones/` and shows the final-price note

### Requirement: The comparison helps choose among the offered options

The comparison section SHALL present WooCommerce, Shopify and the custom store as offered options at the same starting price, each with when to choose it and what to weigh, and MUST NOT present a platform that is not offered as an option.

#### Scenario: Three offered options compared

- **WHEN** the comparison section is read
- **THEN** it has one item per store option of the source and names no other platform as an option

### Requirement: The FAQ uses only sourced questions and matches FAQPage

The FAQ SHALL hold only questions from the story research (price; how to create, set up or open a store; Shopify or WooCommerce; large catalogue or multi-warehouse stock; legal and technical requirements), each answered directly in its first two sentences, and the FAQPage structured data MUST list the same questions in the same order.

#### Scenario: FAQ equals FAQPage

- **WHEN** the template page check compares the visible FAQ with the FAQPage JSON-LD
- **THEN** both list the same questions in the same order

#### Scenario: Price answer from the source

- **WHEN** the price question is read
- **THEN** its answer gives the source starting price with the panel and basic scope included and the written final price, and quotes no competitor figure

#### Scenario: Large catalogues answered honestly

- **WHEN** the large-catalogue question is read
- **THEN** its answer says large catalogues, bulk imports or stock synced with other systems are quoted separately and does not offer a platform outside the three options

#### Scenario: Legal question without legal advice

- **WHEN** the legal and technical requirements question is read
- **THEN** its answer lists practical basics (domain, HTTPS, legal texts, payment gateway) and promises no legal compliance

#### Scenario: No unpublished lead time

- **WHEN** the FAQ and the page copy are read
- **THEN** no store lead time is stated

### Requirement: Proof and illustrations are honest

Proof SHALL be only real, verified or already published data, and every drawing MUST be a single-stroke illustration captioned "Ejemplo ilustrativo" with no invented figures, logos or testimonials.

#### Scenario: Real proof only

- **WHEN** the proof strip and the real-proof section render
- **THEN** they show only published site proof, real client sites and the live Google rating when available

#### Scenario: Illustrations

- **WHEN** the hero and bento drawings render
- **THEN** they are decorative SVGs hidden from assistive technology, carry the "Ejemplo ilustrativo" caption where a figure is shown, and contain no numbers or fake metrics

### Requirement: Internal links stay coherent

The page SHALL keep its related links and the reciprocal in-content link to `/web-para-comercios-sevilla/` inside `<main>`, and every internal link MUST use the trailing-slash form.

#### Scenario: Reciprocal pair intact

- **WHEN** the intent check runs on the built pages
- **THEN** `/tienda-online-sevilla/` links `/web-para-comercios-sevilla/` with an anchor containing "web para comercios" inside `<main>`
