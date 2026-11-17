# blog-feed Specification

## Purpose

Let readers and feed aggregators subscribe to the blog. The build publishes a static RSS 2.0 feed of the published posts at `/rss.xml`, generated at build time from the blog content collection with no new dependency and no client JavaScript. Every page declares the feed with an alternate discovery link in its head. The feed stays crawlable but is not listed in the sitemap, and the `check-seo-23` build check guards the feed, its items and the discovery link (introduced by NRD-244).

## Requirements

### Requirement: The build publishes an RSS 2.0 feed of published posts

The build SHALL produce `/rss.xml`, a well-formed RSS 2.0 channel "Blog de Nuria Romero" (link `https://nuriaromero.dev/blog/`, Spanish) with one item per published post: title, canonical trailing-slash URL as `link` and permalink `guid`, description and RFC 822 `pubDate`, newest first. Drafts SHALL NOT appear and text SHALL be XML-escaped. The feed SHALL be built at build time with no new dependency, no client JavaScript and no build timestamp.

#### Scenario: Every published post is in the feed

- **WHEN** the site is built with four published posts
- **THEN** `/rss.xml` has four items whose links are `https://nuriaromero.dev/blog/<slug>/`, each with title, description and `pubDate`

#### Scenario: Newest first

- **WHEN** two posts have `pubDate` 2026-03-01 and 2026-06-01
- **THEN** the item of 2026-06-01 comes before the item of 2026-03-01

#### Scenario: Draft post

- **WHEN** a post has `draft: true`
- **THEN** it does not appear in `/rss.xml`

#### Scenario: Special characters

- **WHEN** a title or description contains `&`, `<`, `>` or quotes
- **THEN** the feed escapes them and remains well-formed XML

#### Scenario: Post missing from the feed fails the build check

- **WHEN** `dist/rss.xml` is missing, or a published post of the content collection has no item in it
- **THEN** the feed build check fails naming the missing file or post

### Requirement: Pages declare the feed

Every page SHALL declare the feed in its head with `<link rel="alternate" type="application/rss+xml" title="Blog de Nuria Romero" href="/rss.xml">`, exactly once.

#### Scenario: Discovery link on a post and on the home

- **WHEN** a blog post or the home is built
- **THEN** its head contains the alternate link to `/rss.xml` once

#### Scenario: Missing discovery link fails the build check

- **WHEN** a built HTML page lacks the alternate link
- **THEN** the feed build check fails naming the page

### Requirement: The feed is crawlable but not listed as a page

`/rss.xml` SHALL NOT appear in the sitemap, and `robots.txt` SHALL NOT disallow it.

#### Scenario: Sitemap and robots

- **WHEN** the site is built
- **THEN** no sitemap file lists `/rss.xml` and no `Disallow` rule in `robots.txt` matches `/rss.xml`
