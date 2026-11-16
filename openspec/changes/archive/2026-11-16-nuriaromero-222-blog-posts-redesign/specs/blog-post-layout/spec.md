## Purpose

Defines what every blog post page `/blog/<slug>/` must show and guarantee on the `/seo-local-sevilla/` template: the post text unchanged, a header with the title as H1, author and dates, readable ink prose, the related links, the booking call and unchanged search signals.

## ADDED Requirements

### Requirement: The post text is unchanged by the layout

The visible text and the links of the body of every post SHALL be identical to those rendered before the template layout, measured on the element that wraps the rendered Markdown and excluding header, related links and closing.

#### Scenario: Body text and links match the baseline

- **WHEN** the post contract check compares each built post with the baseline captured from the previous layout
- **THEN** the visible body text and the list of body link destinations and texts are identical for every post

#### Scenario: Markdown sources untouched

- **WHEN** the change is applied
- **THEN** no file under `src/content/blog/` is modified

### Requirement: The post header keeps title, author and dates

Each post SHALL open, inside its `article`, with the post title as the only H1, the post description, the author linked to `/sobre-mi/`, the publication date and, when present, the update date, each date in a `time` element with its ISO `datetime`.

#### Scenario: Header content

- **WHEN** a built post is read
- **THEN** its `article` holds exactly one H1 equal to the frontmatter title, the description, a link to `/sobre-mi/` reading "Nuria Romero Castillo" and "Publicado el" followed by a `time` element with the publication datetime

#### Scenario: Update date shown only when set

- **WHEN** a post has `updatedDate` in its frontmatter
- **THEN** the header also shows "Actualizado el" with a `time` element for that date, and a post without it shows no update line

### Requirement: The post renders in the ink world

The post page SHALL use the template ground, SHALL style headings, paragraphs, lists, tables, links, emphasis and rules of the body with the template tokens only, and MUST NOT use the old gray styles or `CTASection`.

#### Scenario: Legacy styles removed

- **WHEN** the layout source is inspected
- **THEN** it uses no `CTASection`, `InternalLinks`, `EntryContentStyles` or gray Tailwind class

#### Scenario: Prose readable on mobile

- **WHEN** a post with a table is viewed at 375 px
- **THEN** the page has no horizontal overflow and body text and links meet WCAG 2.2 AA contrast

### Requirement: Related links keep their destinations

Each post SHALL show, after the article, the links mapped for its URL in `internalLinksBySource`, with the same destinations and anchors, through the template related links section.

#### Scenario: Mapped links inside main

- **WHEN** the internal link check runs on a built post
- **THEN** every mapped link of that post is an `a` with the same `href` and anchor text inside `<main>`

### Requirement: The post ends with the booking call

Each post SHALL end with the template closing band holding the booking button, without invented figures or promises of results.

#### Scenario: Closing band with booking

- **WHEN** the end of a built post `<main>` is read
- **THEN** the last section is the closing band with a link to the booking schedule

### Requirement: Search signals and structured data are unchanged

Each post SHALL keep its title, meta description, canonical, Article and BreadcrumbList JSON-LD exactly as before, SHALL have exactly one H1 and SHALL use trailing-slash internal links.

#### Scenario: Metadata and JSON-LD match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** title, meta description, canonical and the Article and BreadcrumbList entities are identical

#### Scenario: Ownership and link checks pass

- **WHEN** the SEO build checks run
- **THEN** each post has one H1, no internal href without trailing slash and no title, H1 or H2 targeting a term owned by another page
