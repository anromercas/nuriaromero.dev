## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Search signals and structured data are unchanged

Each post SHALL keep its title, meta description, canonical, Article and BreadcrumbList JSON-LD identical to the post baseline unless a story edits that post on purpose and regenerates its baseline entry in the same commit, SHALL have exactly one H1 and SHALL use trailing-slash internal links. When a post sets `cover`, its `og:image`, `twitter:image` and Article `image` SHALL be the same absolute URL of a 1200 px wide JPEG generated from the cover under `/_astro/`; when it sets no `cover`, they SHALL stay the absolute URL of `SITE.defaultOgImage`.

#### Scenario: Metadata and JSON-LD match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** title, meta description, canonical and the Article and BreadcrumbList entities are identical

#### Scenario: Ownership and link checks pass

- **WHEN** the SEO build checks run
- **THEN** each post has one H1, no internal href without trailing slash and no title, H1 or H2 targeting a term owned by another page

#### Scenario: Cover drives the share image

- **WHEN** a fixture post with a cover is built
- **THEN** `og:image`, `twitter:image` and the Article `image` are the same absolute `https://nuriaromero.dev/_astro/...jpg` URL

#### Scenario: Fallback share image

- **WHEN** a post without a cover is built
- **THEN** `og:image`, `twitter:image` and the Article `image` equal the absolute URL of `SITE.defaultOgImage`, as before
