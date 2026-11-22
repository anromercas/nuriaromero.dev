## ADDED Requirements

### Requirement: Draft posts are never published

A blog post with `draft: true` in its frontmatter SHALL NOT produce a page under `dist/blog/<slug>/`, and its URL SHALL NOT appear in any `dist/sitemap-*.xml`, in `dist/rss.xml`, in `dist/blog/index.html` or in `dist/llms.txt`. A unit test SHALL prove it on a real build that contains a draft fixture and a published control post.

#### Scenario: Draft fixture stays out of every output

- **WHEN** an isolated build contains the fixture post `borrador-de-prueba` with `draft: true`
- **THEN** `dist/blog/borrador-de-prueba/index.html` does not exist and `/blog/borrador-de-prueba/` appears in none of the sitemap files, `rss.xml`, `blog/index.html` and `llms.txt`

#### Scenario: Published control reaches the outputs

- **WHEN** the same build contains `publicado-de-prueba` with `draft: false` and the same body
- **THEN** its page exists and its URL appears in a sitemap file, in `rss.xml` and in `blog/index.html`, which proves the test can see a leak

#### Scenario: Hand-kept llms.txt never links a draft

- **WHEN** `public/llms.txt` is compared with the posts in `src/content/blog/`
- **THEN** it links no slug whose frontmatter has `draft: true`

#### Scenario: A filter is removed

- **WHEN** the `!data.draft` filter is removed from `src/pages/rss.xml.ts` (locally, to observe RED)
- **THEN** `node --test tests/blog-drafts.test.js` fails naming `rss.xml`
