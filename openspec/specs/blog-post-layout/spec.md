# blog-post-layout Specification

## Purpose
Defines what every blog post page `/blog/<slug>/` must show and guarantee on the `/seo-local-sevilla/` template: the post text unchanged, a header with the title as H1, author and dates, readable ink prose, the related links, the booking call and unchanged search signals.

## Requirements

### Requirement: The post text is unchanged by the layout

The visible text and the links of the body of every post SHALL be identical to those in the post baseline, measured on the element that wraps the rendered Markdown and excluding header, related links and closing. The layout SHALL never change them; a story that edits a post's Markdown on purpose SHALL regenerate the baseline in the same commit, and only the edited post's entry may change.

#### Scenario: Body text and links match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** the visible body text and the list of body link destinations and texts are identical for every post

#### Scenario: Markdown sources untouched

- **WHEN** a change modifies only the layout or its components
- **THEN** no file under `src/content/blog/` is modified by that change

#### Scenario: Intentional post edit regenerates the baseline

- **WHEN** a story changes the Markdown of a post
- **THEN** the same commit regenerates the baseline, and the baseline diff touches only that post's entry

### Requirement: The post header keeps title, author and dates

Each post SHALL open, inside its `article`, with the post title as the only H1, the post description, the author linked to `/sobre-mi/`, the publication date and, when present, the update date, each date in a `time` element with its ISO `datetime`.

#### Scenario: Header content

- **WHEN** a built post is read
- **THEN** its `article` holds exactly one H1 equal to the frontmatter title, the description, a link to `/sobre-mi/` reading "Nuria Romero Castillo" and "Publicado el" followed by a `time` element with the publication datetime

#### Scenario: Update date shown only when set

- **WHEN** a post has `updatedDate` in its frontmatter
- **THEN** the header also shows "Actualizado el" with a `time` element for that date, and a post without it shows no update line

### Requirement: The post renders in the ink world

The post page SHALL use the template ground, SHALL style every body element (headings, paragraphs, lists, tables, links, emphasis, rules, block quotes, inline code, code blocks and images) with the template tokens only, and MUST NOT use the old gray styles or `CTASection`.

#### Scenario: Legacy styles removed

- **WHEN** the layout source is inspected
- **THEN** it uses no `CTASection`, `InternalLinks`, `EntryContentStyles` or gray Tailwind class

#### Scenario: Prose readable on mobile

- **WHEN** a post with a table is viewed at 375 px
- **THEN** the page has no horizontal overflow and body text and links meet WCAG 2.2 AA contrast

#### Scenario: Post text untouched

- **WHEN** the change is applied
- **THEN** no file under `src/content/blog/` is modified and the post contract baseline still matches

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

Each post SHALL keep its title, meta description, canonical, Article and BreadcrumbList JSON-LD identical to the post baseline unless a story edits that post on purpose and regenerates its baseline entry in the same commit, SHALL have exactly one H1 and SHALL use trailing-slash internal links.

#### Scenario: Metadata and JSON-LD match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** title, meta description, canonical and the Article and BreadcrumbList entities are identical

#### Scenario: Ownership and link checks pass

- **WHEN** the SEO build checks run
- **THEN** each post has one H1, no internal href without trailing slash and no title, H1 or H2 targeting a term owned by another page

### Requirement: Post table borders are visible

Table cell borders of the post body SHALL reach at least 3:1 contrast against the ground and the header cell surface, through a shared token.

#### Scenario: Table borders visible

- **WHEN** the table cell border token is compared with the ink ground and the card surface
- **THEN** both pairs reach at least 3:1, and the table stays readable at 320 px

### Requirement: Post code and images stay inside the column

Code blocks SHALL scroll horizontally inside the column, images SHALL never be wider than the column, and quote and code text SHALL meet AA contrast, so the page never overflows horizontally.

#### Scenario: Quote, code and image in the ink world

- **WHEN** a post body holds a block quote, inline code, a code block and an image
- **THEN** each is styled with template tokens only, its text (including every syntax-highlight colour of the code block) meets AA contrast, the code block scrolls horizontally inside the column and the image is at most the column width with its aspect ratio kept, with no horizontal page overflow at 320 px

### Requirement: The post contract checks the post structure

The post contract check SHALL fail for any built post that does not have exactly one H1, that lacks the related links block with at least one link, or whose closing section does not link to the booking schedule, naming the failed rule.

#### Scenario: Valid post passes

- **WHEN** the contract is computed for a post with one H1, a related links block with links and a closing section linking to the booking schedule
- **THEN** it returns the same contract fields as before (title, description, canonical, Article and BreadcrumbList, body text and links)

#### Scenario: H1 count is wrong

- **WHEN** a post has no H1 or more than one
- **THEN** the check fails reporting that exactly one H1 is required

#### Scenario: Related links block missing

- **WHEN** a post has no related links block, or the block has no link
- **THEN** the check fails reporting the related links block is not found

#### Scenario: Closing without booking link

- **WHEN** a post has no closing section, or its closing section has no link to the booking schedule
- **THEN** the check fails reporting the closing booking link is not found

### Requirement: A post may set a cover image with required alt text

The blog collection schema SHALL accept an optional `cover` object with exactly two keys: `src`, an image processed by the Astro image pipeline (a file under `src/assets/blog/`), and `alt`, a non-empty string after trimming. A post that sets `cover` without `alt`, with an empty `alt`, or with an unknown key inside `cover` SHALL fail the build. The former `image` string field SHALL no longer exist. Posts without `cover` SHALL validate as today.

#### Scenario: Cover without alt

- **WHEN** a post frontmatter sets `cover.src` and no `cover.alt`
- **THEN** schema validation fails and `pnpm build` stops

#### Scenario: Blank alt

- **WHEN** `cover.alt` is an empty string or only spaces
- **THEN** schema validation fails

#### Scenario: No cover

- **WHEN** a post sets no `cover`
- **THEN** validation passes with the same fields as before (title, description, pubDate, updatedDate, tags, draft)

### Requirement: The post renders its cover without layout shift

When a post sets `cover`, `BlogPostLayout` SHALL render one `figure.post-cover` between the post header and `data-post-body`, holding a `<picture>` with AVIF and WebP sources and an `img[data-post-cover]` with `alt` from `cover.alt`, explicit `width` and `height`, `loading="eager"` and `fetchpriority="high"`, styled with the ink template tokens. Without `cover`, the post markup SHALL stay identical to today.

#### Scenario: Post with a cover

- **WHEN** a fixture post with a 1600x900 cover and alt "Mostrador de una tienda en Sevilla" is built
- **THEN** its page has one `figure.post-cover` between the header and `[data-post-body]`, with `source[type="image/avif"]`, `source[type="image/webp"]` and an `img[data-post-cover]` with that alt, numeric `width` and `height`, `loading="eager"` and `fetchpriority="high"`

#### Scenario: Post without a cover

- **WHEN** a post without `cover` is built
- **THEN** its page has no `figure.post-cover`, no `picture` and no `data-post-cover`, and the 4 existing posts build with unchanged markup

### Requirement: The cover build guard checks alt, dimensions and weight

`scripts/check-seo-25.mjs`, run by `pnpm check:seo:dist`, SHALL fail for a built post when its cover image has a missing or blank `alt`, lacks `width` or `height`, its `figure.post-cover` holds no cover image, a cover file (sources, image, or og:image under `/_astro/`) is missing from `dist/`, or the largest cover file exceeds 102400 bytes. It SHALL pass when no post has a cover.

#### Scenario: Oversized cover file

- **WHEN** one generated cover file of a post is 150 KB
- **THEN** `check-seo-25` exits 1 naming the post and the file

#### Scenario: Missing alt in built HTML

- **WHEN** a built cover image has `alt=""`
- **THEN** `check-seo-25` exits 1 naming the post

#### Scenario: No covers yet

- **WHEN** no built post has a cover
- **THEN** `check-seo-25` exits 0 and reports 0 covers checked

### Requirement: The cover drives the post share image

When a post sets `cover`, its `og:image`, `twitter:image` and Article `image` SHALL be the same absolute URL of a 1200 px wide JPEG generated from the cover under `/_astro/`. When it sets no `cover`, they SHALL stay the absolute URL of `SITE.defaultOgImage`.

#### Scenario: Cover drives the share image

- **WHEN** a fixture post with a cover is built
- **THEN** `og:image`, `twitter:image` and the Article `image` are the same absolute `https://nuriaromero.dev/_astro/...jpg` URL

#### Scenario: Fallback share image

- **WHEN** a post without a cover is built
- **THEN** `og:image`, `twitter:image` and the Article `image` equal the absolute URL of `SITE.defaultOgImage`, as before
