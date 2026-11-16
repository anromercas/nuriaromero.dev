## Purpose

Defines what `/desarrollo-software-medida/` shows and guarantees on the template: the owned "desarrollo de software a medida sevilla" placement, the section order of `/seo-local-sevilla/`, a short text budget, a sourced FAQ mirrored in FAQPage and the published price as the only plan.

## ADDED Requirements

### Requirement: The page keeps its owned keyword placement

`/desarrollo-software-medida/` SHALL keep "Desarrollo de software a medida en Sevilla" in the title and the single H1 and "aplicaciones web a medida" in the description, and MUST NOT use a term owned by another page in the title, H1 or any H2.

#### Scenario: Owned term kept

- **WHEN** the page is built
- **THEN** the title and the only H1 contain "Desarrollo de software a medida en Sevilla" and the description contains "aplicaciones web a medida"

#### Scenario: No term of another owner in headings

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page

### Requirement: The page follows the template section order

The page SHALL render, in this order: hero with a drawn internal-tool illustration, the booking button and a secondary link to the price; proof strip; bento of what can be built to measure with one sentence per tile; process timeline; real proof followed by the "custom or standard software" comparison; plans; FAQ; related links; closing band and NAP; and no legacy block.

#### Scenario: Sections in reference order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no legacy benefits grid, process list, pricing card, FAQ, CTA block, gray Tailwind card or glyph icon

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 750 and 850, measured with the same method as the current figure.

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at least 750 and at most 850

### Requirement: The FAQ uses only sourced questions and matches FAQPage

The FAQ SHALL hold only questions from the story research (what custom software is; how much it costs; what can be built: web app, mobile app, ERP, API; who owns the code; which custom development companies there are in Seville), each answered directly in its first two sentences, and the FAQPage structured data MUST list the same questions in the same order.

#### Scenario: FAQ equals FAQPage

- **WHEN** the template page check compares the visible FAQ with the FAQPage JSON-LD
- **THEN** both list the same questions in the same order

#### Scenario: Price answer from data

- **WHEN** the price question is read
- **THEN** its answer gives the published starting price from site data and the phase-by-phase written quote, and no other figure

#### Scenario: Code ownership as already published

- **WHEN** the code ownership question is read
- **THEN** its answer says the code and documentation are the client's from the first day, as the site already publishes, with no new contractual promise

#### Scenario: Companies in Seville without a ranking

- **WHEN** the question about development companies in Seville is read
- **THEN** its answer explains what to look at when choosing and that Nuria works directly in Seville, and contains no ranking, "las mejores" or named competitor

### Requirement: The only plan is the published price

The plans section SHALL show one plan with the price already published in site data ("desde 999 €", quoted by phases) and its published includes and note, and the Service structured data MUST carry one offer with that price.

#### Scenario: One plan, one offer

- **WHEN** the plans section and the Service JSON-LD are read
- **THEN** there is exactly one plan priced from site data and exactly one Offer with price "999"

### Requirement: Proof and illustrations are honest

Proof SHALL be only published site proof, real client sites presented as what they are, and the live Google rating when available; every drawing MUST be a single-stroke illustration hidden from assistive technology and captioned "Ejemplo ilustrativo" where a figure is shown, with no invented figures, logos or metrics.

#### Scenario: Real proof only

- **WHEN** the proof strip and the real-proof section render
- **THEN** they show only published site proof, the real client sites and the live Google rating when available, with no invented client or metric

#### Scenario: Illustrations

- **WHEN** the hero and bento drawings render
- **THEN** they are decorative SVGs with no numbers or fake data, and the hero figure carries the "Ejemplo ilustrativo" caption

### Requirement: Internal links stay coherent

The page SHALL keep its related links inside `<main>`, including the reciprocal link to `/diseno-web-sevilla/` with the anchor "diseño web para negocios en Sevilla", and every internal link MUST use the trailing-slash form.

#### Scenario: Reciprocal pair intact

- **WHEN** the intent check runs on the built pages
- **THEN** `/desarrollo-software-medida/` links `/diseno-web-sevilla/` with the anchor "diseño web para negocios en Sevilla" inside `<main>`
