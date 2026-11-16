## Purpose

Defines what `/automatizaciones/` shows and guarantees on the template: the process-automation intent placement, the section order of `/seo-local-sevilla/`, a short text budget, a direct business-language answer, a sourced FAQ mirrored in FAQPage and the published price as the only plan.

## ADDED Requirements

### Requirement: The page keeps its intent placement

`/automatizaciones/` SHALL keep "Automatización de procesos en Sevilla" in the title, the description and the single H1, and MUST NOT use a term owned by another page in the title, H1 or any H2.

#### Scenario: Intent kept

- **WHEN** the page is built
- **THEN** the title, the meta description and the only H1 contain "Automatización de procesos en Sevilla"

#### Scenario: No term of another owner in headings

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page

### Requirement: The page follows the template section order

The page SHALL render, in this order: hero with a drawn automation flow, the booking button and a secondary link to the price; proof strip; bento of six automation examples with one sentence per tile; process timeline; the "what to automate first and what not" comparison; plans; FAQ; related links; closing band and NAP; with no real-proof section and no legacy block.

#### Scenario: Sections in reference order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no legacy benefits grid, process list, pricing card, FAQ, CTA block, gray Tailwind card or glyph icon

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 700 and 800, measured with the same method as the current figure.

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at least 700 and at most 800

### Requirement: The page answers what process automation is first

The first two sentences of the hero copy SHALL define process automation in business language, without jargon left unexplained.

#### Scenario: Direct answer

- **WHEN** the hero subtitle is read
- **THEN** its first two sentences say what automating a process means for a business and name no tool without saying what it does

### Requirement: The FAQ uses only sourced questions and matches FAQPage

The FAQ SHALL hold only questions from the story research (what process automation is; best AI to automate; examples in a company; automating WhatsApp messages; automating invoices and admin tasks; how to start), each answered directly in its first two sentences, and the FAQPage structured data MUST list the same questions in the same order.

#### Scenario: FAQ equals FAQPage

- **WHEN** the template page check compares the visible FAQ with the FAQPage JSON-LD
- **THEN** both list the same questions in the same order

#### Scenario: Examples answer matches the bento

- **WHEN** the examples question is read
- **THEN** its answer names the six bento examples

#### Scenario: AI question from the automation angle

- **WHEN** the best-AI question is read
- **THEN** its answer talks about the tools used to automate and where AI fits in a flow, and its question text differs from the AI page question about the best AI for companies

### Requirement: The only plan is the published price

The plans section SHALL show one plan with the price already published in site data ("desde 149 €" per automation) and its published includes and note, and the Service structured data MUST carry one offer with that price.

#### Scenario: One plan, one offer

- **WHEN** the plans section and the Service JSON-LD are read
- **THEN** there is exactly one plan priced from site data and exactly one Offer with price "149"

### Requirement: No invented savings or return

The page copy MUST NOT state time savings, return on investment, payback periods or percentages that have no source.

#### Scenario: No savings figures

- **WHEN** every copy string of the page data and the built `<main>` are checked
- **THEN** they contain no "ROI", "retorno", "amortiza", percentage, or number of hours or weeks saved

### Requirement: Proof and illustrations are honest

Proof SHALL be only published site proof and the live Google rating when available, and every drawing MUST be a single-stroke illustration hidden from assistive technology and captioned "Ejemplo ilustrativo" where a figure is shown, with no numbers or fake metrics.

#### Scenario: Illustrations

- **WHEN** the hero and bento drawings render
- **THEN** they are decorative SVGs with no figures or tool logos, and the hero figure carries the "Ejemplo ilustrativo" caption

### Requirement: Internal links stay coherent

The page SHALL keep its related links inside `<main>`, including the reciprocal link to `/inteligencia-artificial/` with the anchor "chatbots y soluciones con IA", and every internal link MUST use the trailing-slash form.

#### Scenario: Reciprocal pair intact

- **WHEN** the intent check runs on the built pages
- **THEN** `/automatizaciones/` links `/inteligencia-artificial/` with the anchor "chatbots y soluciones con IA" inside `<main>`
