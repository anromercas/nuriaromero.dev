## ADDED Requirements

### Requirement: The page answers which projects it shows first

`/portfolio/` SHALL say in its first two sentences which real projects are shown (websites made for Seville businesses that can be visited on their own domains), under one H1 "Casos de éxito".

#### Scenario: Direct answer in the hero

- **WHEN** the hero of the built page is read
- **THEN** its first two sentences say what the real projects are and where they can be visited, and the page has exactly one H1, "Casos de éxito"

### Requirement: The page follows the adapted template sections

The page SHALL render, in this order: breadcrumbs; short hero with the booking button; real proof with the published projects as ink project cards; related service links; closing band with the booking button. It MUST NOT render a FAQ, a proof strip, plans, a NAP block or any legacy block.

#### Scenario: Sections in order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each section after the hero opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no glyph heading icon, gray Tailwind text, shadowed project card or legacy CTA block

### Requirement: The page stays short

The visible words in the page `<main>` SHALL be at most 250, measured with the template page check method (live third-party content excluded).

#### Scenario: Word cap

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at most 250

### Requirement: Only published projects, shown honestly

The real proof section SHALL show only the projects already published on the site, with their real screenshots, descriptive alternative texts and links, in the ink project cards (0.9rem corners, no shadows, asymmetric layout), and the page MUST NOT show any metric, result, testimonial or logo that is not published and verified.

#### Scenario: Ink cards with real screenshots

- **WHEN** the real proof section is read
- **THEN** it shows exactly the published projects as ink cards with a real screenshot, an alternative text and an external link each

### Requirement: Search and structured data stay coherent

The page SHALL NOT use a term owned by another page in its title, H1 or any H2, and SHALL emit a BreadcrumbList that matches the visible breadcrumbs and no Service or FAQPage entity.

#### Scenario: Ownership check passes

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page

#### Scenario: Breadcrumbs only

- **WHEN** the JSON-LD of the built page is read
- **THEN** it holds a BreadcrumbList equal to the visible breadcrumbs and no Service or FAQPage

### Requirement: The page leads to the services and to booking

The related links SHALL point to the web design, online store and custom software pages and to the contact page, with trailing slashes, and the closing band SHALL offer the booking button.

#### Scenario: Related links and booking

- **WHEN** the links in the page `<main>` are read
- **THEN** they include `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/` and `/contacto/`, and the closing band has the booking button
