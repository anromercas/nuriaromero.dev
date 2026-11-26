## MODIFIED Requirements

### Requirement: The post renders its cover without layout shift

When a post sets `cover`, `BlogPostLayout` SHALL render one `figure.post-cover` between the post header and `data-post-body`, holding a `<picture>` with AVIF and WebP sources and an `img[data-post-cover]` with `alt` from `cover.alt`, explicit `width` and `height`, `loading="eager"` and `fetchpriority="high"`, styled with the ink template tokens. The generated cover files and the share JPEG SHALL be encoded at quality 60. Without `cover`, the post markup SHALL stay identical to today.

#### Scenario: Post with a cover

- **WHEN** a fixture post with a 1600x900 cover and alt "Mostrador de una tienda en Sevilla" is built
- **THEN** its page has one `figure.post-cover` between the header and `[data-post-body]`, with `source[type="image/avif"]`, `source[type="image/webp"]` and an `img[data-post-cover]` with that alt, numeric `width` and `height`, `loading="eager"` and `fetchpriority="high"`

#### Scenario: Post without a cover

- **WHEN** a post without `cover` is built
- **THEN** its page has no `figure.post-cover`, no `picture` and no `data-post-cover`

#### Scenario: Cover encoding quality

- **WHEN** the layout renders a cover
- **THEN** the `<Picture>` and the share image generated with `getImage()` both use quality 60

## ADDED Requirements

### Requirement: Every published post carries a sourced cover

Each published post SHALL set a cover file under `src/assets/blog/` named after its slug, cropped to 16:9 and at least 1280 px wide, with a Spanish alt that describes the image in one phrase rather than listing keywords. `src/assets/blog/credits.json` SHALL record for each cover its origin, generation date and crop. Covers MUST NOT show recognisable faces, brands, logos or readable signs.

#### Scenario: The four existing posts

- **WHEN** the site is built
- **THEN** the Google Maps, price, restaurant and GEO posts each render a `figure.post-cover` with their own image and alt, and their og:image and `Article.image` point to that cover

#### Scenario: Cover sources are recorded

- **WHEN** `credits.json` is read
- **THEN** it has exactly one entry per cover file, each with `origin`, `libraryId`, `source`, `generatedAt` and `crop`, and no entry without a file

#### Scenario: Alt describes the image

- **WHEN** a post's cover alt is read
- **THEN** it has between 5 and 20 words, differs from the post title and contains at most one comma

#### Scenario: Covers pass the weight guard

- **WHEN** `pnpm check:seo:dist` runs after the build
- **THEN** `check-seo-25` reports 4 covers checked and no failure

#### Scenario: Dates unchanged

- **WHEN** the covers are added
- **THEN** no post's `pubDate` or `updatedDate` changes, so its `dateModified` stays the same
