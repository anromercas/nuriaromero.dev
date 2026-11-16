# Spec Delta

## Purpose

Defines what `/diseno-web-sevilla/` shows and guarantees: the owned "diseño web sevilla" placement, the template section order from `/seo-local-sevilla/`, a short text budget, a FAQ built only from sourced questions and mirrored in FAQPage, Service offers equal to the visible plans, and only already-published prices.

## ADDED Requirements

### Requirement: The page keeps its owned keyword placement

`/diseno-web-sevilla/` SHALL keep "diseño web Sevilla" in the title and in the single H1, and MUST NOT use a term owned by another page in the title, H1 or any H2; "cuánto cuesta una página web en Sevilla" (owned by the price guide) MAY appear only in body copy or FAQ answers.

#### Scenario: Owned term kept

- **WHEN** the page is built
- **THEN** the title and the only H1 contain "Diseño web Sevilla"

#### Scenario: Price-guide term stays out of headings

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 targets "cuanto cuesta una pagina web en sevilla" or any other term owned by another page

### Requirement: The page follows the template section order

The page SHALL render, in this order: hero with a drawn web illustration, the booking button and a secondary link to the prices; proof strip; bento of what the website includes with one sentence per tile; process timeline; real client sites followed by the "freelance, studio or agency" comparison; plans; FAQ; related links; closing band and NAP.

#### Scenario: Sections in reference order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no legacy benefits grid, process list, pricing card, FAQ or CTA block and no glyph icons

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 1,000 and 1,200, measured with the same method as the current figure.

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at least 1,000 and at most 1,200

### Requirement: Plans show only already-published prices

The plans SHALL be the landing and the full website with the prices already published in site data ("desde 149 €" and "desde 399 €"), the full website marked as recommended, and the page MUST NOT publish any new price, price range or competitor figure while decision S-2026-11-13-1 is open.

#### Scenario: Plan prices from data

- **WHEN** the plans section renders
- **THEN** it shows exactly two plans with the prices from site data and the full website carries the "Recomendado" badge

#### Scenario: No market or competitor figures

- **WHEN** the visible text is checked
- **THEN** it contains no price other than those published in site data and no market range such as "entre 500 y 3.000 €"

### Requirement: Service offers equal the visible plans

The Service structured data SHALL list one Offer per visible plan with that plan's name and one-time price in EUR, without a monthly unit price, while the monthly offers of `/seo-local-sevilla/` stay unchanged.

#### Scenario: One-time offers

- **WHEN** the JSON-LD of the built page is read
- **THEN** the Service has two Offers named as the visible plans with prices 149 and 399 EUR and no `unitText` "MON"

#### Scenario: Reference page untouched

- **WHEN** the reference page check runs
- **THEN** the `/seo-local-sevilla/` Service still has its two monthly offers and equals the baseline

### Requirement: The FAQ uses only sourced questions and matches FAQPage

The FAQ SHALL contain only questions taken from the sourced list in NRD-165 (natural rewording allowed), each answer SHALL give the direct answer in its first two sentences, and the FAQPage SHALL list exactly the visible questions in the same order.

#### Scenario: FAQ equals FAQPage

- **WHEN** the template page check compares the visible FAQ with the FAQPage
- **THEN** both list the same questions in the same order

#### Scenario: Price questions answered with published prices

- **WHEN** an answer is about what a website costs or what budget is needed
- **THEN** it uses the published "desde 149 €" and "desde 399 €" and links to `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`

#### Scenario: Honest DIY objection

- **WHEN** the question about making the website yourself for free is included
- **THEN** the answer says when doing it yourself makes sense and when it does not, without targeting the DIY keyword in any heading

### Requirement: Proof and illustrations are honest

The page SHALL show only real, sourced figures and real client sites, omit a proof cell when its data is absent, caption hypothetical drawings "Ejemplo ilustrativo", and MUST NOT promise rankings, traffic or leads.

#### Scenario: Reviews unavailable at build time

- **WHEN** the Google reviews data is unavailable during the build
- **THEN** the rating cell and the review quote are omitted and the page still builds

### Requirement: Internal links stay coherent

The related links SHALL keep the reciprocal link with the price guide and the links to the software and portfolio pages recorded for this page, and every internal link SHALL end in `/`.

#### Scenario: Reciprocal pair intact

- **WHEN** the internal links of the built page are read
- **THEN** it links to `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` and the guide still links back to `/diseno-web-sevilla/`
