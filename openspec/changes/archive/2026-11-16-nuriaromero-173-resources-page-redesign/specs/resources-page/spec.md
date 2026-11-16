## ADDED Requirements

### Requirement: The page answers which guides it offers first

`/recursos/` SHALL say in its first two sentences which resources it gathers and for whom, under one H1 "Recursos para citar y compartir".

#### Scenario: Direct answer in the hero

- **WHEN** the hero of the built page is read
- **THEN** its first two sentences say what the resources are and who they are for, and the only H1 reads exactly "Recursos para citar y compartir"

### Requirement: The page follows the adapted template sections

The page SHALL render, in this order: breadcrumbs; short hero with the booking button; the resources section as asymmetric rows with one sentence and one link per resource, ending with the transparency note; closing band with the booking button. It MUST NOT render a FAQ, a proof strip, plans, a grid of identical cards with glyph icons or any legacy block.

#### Scenario: Sections in order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each section after the hero opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no gray Tailwind card, gray bordered aside or glyph icon grid

### Requirement: The page stays short

The visible words in the page `<main>` SHALL be at most 250, measured with the template page check method.

#### Scenario: Word cap

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at most 250

### Requirement: The linkable resources and the policy stay

The resources section SHALL link, with trailing slashes, to `/sobre-mi/`, `/portfolio/`, `/blog/` and the GEO guide, and SHALL state that links are not bought, without any invented figure or promise.

#### Scenario: Resource links and policy

- **WHEN** the built page is read
- **THEN** it links to the four resources with trailing slashes and contains "No se compran enlaces"

### Requirement: Search and structured data stay coherent

The page SHALL NOT use a term owned by another page in its title, H1 or any H2 (resource titles are row headings below H2), and SHALL emit a BreadcrumbList that matches the visible breadcrumbs and no Service or FAQPage entity.

#### Scenario: Ownership check passes

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page

#### Scenario: Breadcrumbs only

- **WHEN** the JSON-LD of the built page is read
- **THEN** it holds a BreadcrumbList equal to the visible breadcrumbs and no Service or FAQPage
