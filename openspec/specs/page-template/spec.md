# page-template Specification

## Purpose
Defines the reusable section system that every public page of the site is composed from, modelled on `/seo-local-sevilla/`: content-by-props sections, one shared set of ink tokens, swappable illustrations, optional sections, and a build-time contract per template page.

## Requirements

### Requirement: Section content comes from the page

Each template section (hero, proof strip, bento, process, real proof, comparison, plans, FAQ, related links, closing, NAP) SHALL render only the content the page passes to it: headings with their accent phrase, texts, tiles, steps, plans, questions, links and CTA labels. A section MUST NOT read the data of a specific page; site-wide facts (business name, address, phone, booking URL) remain allowed.

#### Scenario: A second page renders a section with its own content

- **WHEN** a page other than `/seo-local-sevilla/` renders the FAQ section with its own keyword heading, title, accent phrase and questions
- **THEN** the built page shows exactly those headings and questions and none of the `/seo-local-sevilla/` copy

#### Scenario: No section imports page data

- **WHEN** the section component sources are inspected
- **THEN** none of them imports `seoLocal` or any other page data object

### Requirement: Every section heading has one keyword heading and one accent phrase

A section SHALL open with a sentence-case keyword heading (the real `h2`, or the `h1` in the hero) followed by a display title paragraph in which at most one phrase, given by the page, is set as the serif accent.

#### Scenario: Accent phrase present in the title

- **WHEN** a page passes a title and an accent phrase contained in it
- **THEN** the display title renders the accent phrase once inside an `em` and the rest as plain text

#### Scenario: Accent phrase absent from the title

- **WHEN** the accent phrase is not part of the title or no accent is given
- **THEN** the display title renders the whole title as plain text with no `em`

### Requirement: Ink tokens live in one place

The ink grounds, card surfaces, hairlines, sky signal and accent, recommend yellow, the band, the keyword heading, the display title and the serif accent style SHALL be defined once, with the values recorded in `DESIGN.md`, and every template section SHALL use those definitions instead of its own copy.

#### Scenario: Token values match the design system

- **WHEN** the shared token definitions are compared with the `DESIGN.md` colour and typography tokens
- **THEN** every shared token carries the `DESIGN.md` value

#### Scenario: Sections stop copying token values

- **WHEN** the section component styles are inspected
- **THEN** none redefines the band, the display title or the serif accent style

### Requirement: Illustrations are supplied by the page

The hero visual, each bento tile illustration and the closing visual SHALL be provided by the page, so each page draws its own single-stroke illustration, and the bento SHALL keep one "Ejemplo ilustrativo" caption under the whole grid.

#### Scenario: Page draws its own bento tile

- **WHEN** a page renders a bento tile with its own SVG, title and sentence
- **THEN** the tile shows that SVG styled with the shared signal and soft strokes, then the title and the sentence

#### Scenario: Page draws its own hero visual

- **WHEN** a page passes its own drawing as the hero visual
- **THEN** the hero renders that drawing in the visual column with the sky halo behind it

### Requirement: Sections are optional

A page SHALL be able to omit any section (for example plans or NAP) without breaking the band rhythm or the separators, and a template page MUST NOT render legacy fallback blocks for sections it omits.

#### Scenario: Page without plans

- **WHEN** a template page omits the plans section
- **THEN** no plans band, no legacy pricing card and no empty band is rendered, and the remaining sections keep their spacing

### Requirement: FAQ answers can link to the owner page

A FAQ item SHALL accept optional links (label and path each) rendered after its answer, while the FAQPage structured data keeps the answer text only.

#### Scenario: FAQ item with a link

- **WHEN** a page passes a question whose item has links to `/diseno-web-sevilla/` and to a guide
- **THEN** the visible answer ends with both links and the FAQPage answer text is the answer without the link labels

### Requirement: The reference page renders unchanged

`/seo-local-sevilla/` SHALL keep its visible text, heading outline, `<main>` markup except `class` and `data-astro-cid-*` attributes, and JSON-LD (Service with one offer per plan, FAQPage, BreadcrumbList) after the sections become reusable.

#### Scenario: JSON-LD and headings match the committed baseline

- **WHEN** the site is built and the reference page check runs
- **THEN** the JSON-LD and the h1-h3 outline of `/seo-local-sevilla/` equal the committed baseline

#### Scenario: Main markup comparison

- **WHEN** the `<main>` of the page built before the change is compared with the one built after it, ignoring `class` and `data-astro-cid-*` attributes
- **THEN** no difference is reported

#### Scenario: Screenshots

- **WHEN** QA captures `/seo-local-sevilla/` before and after at 375, 768 and 1280 px
- **THEN** the captures are identical except for justified antialiasing differences

### Requirement: Template pages meet their contract at build time

Every page registered as a template page SHALL pass a build-time check of its contract: visible word count in `<main>` inside its declared range when one is declared, visible FAQ questions equal to the FAQPage questions in the same order, and a Service entity present or absent as declared.

#### Scenario: FAQ and structured data diverge

- **WHEN** a registered page shows a question that the FAQPage does not list, or the reverse
- **THEN** the template page check fails naming the page and the question

#### Scenario: Word count over the target

- **WHEN** a registered page has more visible words in `<main>` than its declared maximum
- **THEN** the template page check fails with the measured count and the range

#### Scenario: Unexpected Service entity

- **WHEN** a page declared without Service emits a Service entity
- **THEN** the template page check fails

### Requirement: Word budget excludes live third-party content

The template page word count in `<main>` MUST NOT include the text inside any element marked with the attribute `data-word-budget="exclude"`, so a page measures the same with and without that live third-party content. The live Google review quote of the real proof section SHALL carry that marker on its whole block.

#### Scenario: Same count with and without the review quote

- **WHEN** the word count of a page `<main>` that holds the marked review quote is compared with the count of the same `<main>` without the quote
- **THEN** both counts are identical

#### Scenario: Text outside the marker is counted

- **WHEN** a page `<main>` holds text before and after a marked element
- **THEN** every word outside the marked element is counted and none inside it

#### Scenario: Review quote carries the marker

- **WHEN** the real proof section renders a live Google review
- **THEN** the review quote block, including its text, stars, author, relative date and link to Google, carries the `data-word-budget="exclude"` marker

#### Scenario: Delivered pages keep their ranges

- **WHEN** the site is built without Google Places variables and the template page check runs
- **THEN** every registered page passes with its range and copy unchanged and the reference page renders unchanged

### Requirement: Project cards can render in the ink world

The real proof section SHALL accept an opt-in ink variant for its project cards that shows the same published projects (title, description, technologies, real screenshot and link) in the ink world: screenshots with 0.9rem corners, no shadows, hairline borders and an asymmetric layout. Without the option, the project cards SHALL render exactly as before.

#### Scenario: Ink cards on request

- **WHEN** a page renders the real proof section with the ink variant
- **THEN** the project cards use the ink surfaces and hairlines, the screenshots have 0.9rem corners and no shadow, and the cards do not form a grid of identical tiles

#### Scenario: Default unchanged

- **WHEN** a page renders the real proof section without the option
- **THEN** its project cards markup is the same as before the variant existed

#### Scenario: Same content in both variants

- **WHEN** the same projects render in both variants
- **THEN** both show the same project titles as h3, descriptions, screenshot alternative texts and links
