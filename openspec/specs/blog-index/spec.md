# blog-index Specification

## Purpose
Defines what the blog index `/blog/` must show and guarantee on the `/seo-local-sevilla/` template: a direct answer, the post list read from the blog collection, a short word budget, coherent search signals and the booking call.

## Requirements

### Requirement: The blog index answers what it offers first

`/blog/` SHALL say in its hero, under one H1, what the visitor finds in the blog and for whom, in at most two sentences, followed by the booking button.

#### Scenario: Direct answer in the hero

- **WHEN** the hero of the built page is read
- **THEN** there is exactly one H1, and the sentence below the display title says what the guides are about and who they are for

### Requirement: The blog index follows the adapted template sections

The page SHALL render, in this order: breadcrumbs; short hero; the post list section opening with a keyword heading and a display title; closing band with the booking button. It MUST NOT render a FAQ, a proof strip, plans, a grid of identical cards, glyph icons or any legacy gray block.

#### Scenario: Sections in order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the breadcrumbs, the hero, the post list and the closing band appear in that order, and the post list and the closing each open with a sentence-case keyword heading followed by a display title with at most one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the page source and the built page are inspected
- **THEN** they contain no gray Tailwind card or text class and no arrow glyph link

### Requirement: Posts are listed from the blog collection

The post list SHALL show every non-draft post of the `blog` collection, newest first, each with its publication date, its title and its description exactly as in the post frontmatter, and a link to `/blog/<slug>/` with the trailing slash. Post titles SHALL be row headings below H2.

#### Scenario: Every post listed with its own data

- **WHEN** the built page is compared with the blog collection
- **THEN** each non-draft post appears once, newest first, with its frontmatter title, description and publication date and a link ending in `/blog/<slug>/`

#### Scenario: Post content untouched

- **WHEN** the change is applied
- **THEN** no file under `src/content/blog/` is modified

### Requirement: The blog index stays short

The visible words in the page `<main>`, including the titles and descriptions of the current posts, SHALL be between 150 and 350, measured with the template page check method.

#### Scenario: Word cap

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is between 150 and 350

### Requirement: Search and structured data stay coherent

The page SHALL keep its current title and meta description, SHALL NOT use a term owned by another page in its title, H1 or any H2, and SHALL emit a BreadcrumbList equal to the visible breadcrumbs and no Service or FAQPage entity.

#### Scenario: Ownership check passes

- **WHEN** the keyword ownership check runs on the built site
- **THEN** no title, H1 or H2 of `/blog/` targets a term owned by another page

#### Scenario: Breadcrumbs only

- **WHEN** the JSON-LD of the built page is read
- **THEN** it holds a BreadcrumbList (Inicio, Blog) with trailing-slash items and no Service or FAQPage

### Requirement: The page ends with the booking call

The page SHALL end with the closing band holding the booking button, and SHALL NOT invent figures or promise results.

#### Scenario: Closing band with booking

- **WHEN** the end of the built `<main>` is read
- **THEN** the last section is the closing band with a link to the booking schedule and no figure or promise of results
