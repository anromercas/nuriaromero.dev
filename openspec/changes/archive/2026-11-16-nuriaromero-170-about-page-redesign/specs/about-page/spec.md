## ADDED Requirements

### Requirement: The page answers who, what and where first

`/sobre-mi/` SHALL say in the first two sentences of its hero who Nuria Romero is, what she does (web development and local SEO for businesses) and where (Seville), with one H1 that names her.

#### Scenario: Direct answer in the hero

- **WHEN** the hero of the built page is read
- **THEN** its first two sentences name Nuria Romero, her work and Seville, and the page has exactly one H1

### Requirement: The page follows the adapted template sections

The page SHALL render, in this order: breadcrumbs; hero with the real portrait, the booking button and a secondary link to the process; proof strip; process timeline about how she works; real proof with the published projects; closing band with the booking button. It MUST NOT render a services bento, plans, a FAQ, a NAP block or any legacy block.

#### Scenario: Sections in order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each section after the hero opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no gray Tailwind text block, yellow highlight, glyph section title, availability badge or rotated portrait

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 550 and 600, measured with the template page check method (live third-party content excluded).

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at least 550 and at most 600

### Requirement: No owned term is targeted

The page SHALL NOT use a term owned by another page in its title, H1 or any H2, and SHALL link to the home with the anchor "consultor SEO en Sevilla" once and to `/seo-local-sevilla/` with a natural anchor.

#### Scenario: Ownership check passes

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page

#### Scenario: Links to the home and to SEO local

- **WHEN** the links in the page `<main>` are read
- **THEN** there is exactly one link to `/` with the text "consultor SEO en Sevilla" and at least one link to `/seo-local-sevilla/`

### Requirement: Structured data matches the visible page

The page SHALL emit the existing Person entity and a BreadcrumbList that matches the visible breadcrumbs, and MUST NOT emit a Service or a FAQPage entity.

#### Scenario: Person and breadcrumbs only

- **WHEN** the JSON-LD of the built page is read
- **THEN** it holds the Person entity and a BreadcrumbList equal to the visible breadcrumbs, and no Service or FAQPage

### Requirement: Proof is real

The proof strip SHALL show only facts already published in site data (the experience figure, the published projects figure) and the live Google rating when it exists; the career record and the project cards SHALL show only roles, companies, dates and projects already published on the site; no metric, testimonial or logo is invented.

#### Scenario: Proof strip without reviews

- **WHEN** the site is built without Google reviews
- **THEN** the proof strip shows only the site-data facts and no empty cell

#### Scenario: Only published projects

- **WHEN** the real proof section is read
- **THEN** it shows only the published projects with their real screenshots and links
