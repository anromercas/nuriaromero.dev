# ai-discovery Specification

## Purpose

Defines the AI discovery files the static build publishes (`/.well-known/ai.txt`, `/ai/summary.json`, `/ai/faq.json`): generated only from `src/data`, consistent with `robots.txt`, `llms.txt`, the published FAQPage data and the visible prices, kept out of the sitemap, and guarded at build time so they can never drift from what the site shows.

## Requirements

### Requirement: The build publishes the AI discovery files

The static build SHALL emit `/.well-known/ai.txt`, `/ai/summary.json` and `/ai/faq.json` as prerendered files, without a server runtime and without a new dependency. The JSON files MUST be valid JSON and the text file MUST be plain text, each served with a matching `Content-Type`.

#### Scenario: Files exist after the build

- **WHEN** the site is built
- **THEN** `dist/.well-known/ai.txt`, `dist/ai/summary.json` and `dist/ai/faq.json` exist and both JSON files parse

#### Scenario: Content type in production

- **WHEN** the three URLs are requested from the deployed site
- **THEN** the JSON files answer with `Content-Type` `application/json` and `ai.txt` with `text/plain`

### Requirement: Discovery files are built only from site data

Every fact in the discovery files (brand, description, logo, contact, address, area served, profiles, services, prices, questions and answers, crawler rules) SHALL come from the site's data sources; no fact MUST be written by hand in the files or in their generators. The files MUST NOT carry a build date or any date that changes without a content change.

#### Scenario: A data change propagates

- **WHEN** a service's starting price or a FAQ answer changes in the site data and the site is rebuilt
- **THEN** the discovery files show the new value with no other edit

#### Scenario: No build date

- **WHEN** the site is built twice from the same commit on different days
- **THEN** the discovery files are identical

### Requirement: summary.json describes the business and its priced services

`/ai/summary.json` SHALL contain the canonical brand name, site URL, description, logo URL, public email and telephone, postal address, area served, official profiles, a link to each other discovery resource, every service-template page with its absolute URL, description and starting price exactly as shown on the site (and its plans when the page shows plans), and every sector page with its URL and starting price. A service with no price of its own MUST have no starting price in the file.

#### Scenario: Prices match the site data

- **WHEN** the build guard compares each starting price and plan price in `summary.json` with the site's price data
- **THEN** every value is identical, and the guard fails if one differs

#### Scenario: Service without its own price

- **WHEN** `summary.json` lists `/seo-para-ia/`
- **THEN** the entry has a URL and description but no starting price

#### Scenario: Canonical brand

- **WHEN** `summary.json` is read
- **THEN** its brand name is the same canonical brand used in titles, `og:site_name` and the Organization JSON-LD

### Requirement: faq.json mirrors the published FAQPage

`/ai/faq.json` SHALL list, for every page that publishes FAQPage structured data, the page's absolute URL and the same questions and answers, with the same text and order as that page's FAQPage. No page, question or answer MUST appear in one and not in the other.

#### Scenario: A question missing from the FAQPage

- **WHEN** `faq.json` contains a question that the page's built FAQPage does not
- **THEN** the build guard fails naming the page and the question

#### Scenario: A question missing from faq.json

- **WHEN** a built page's FAQPage has a question, or a whole page with FAQPage exists, that `faq.json` does not list
- **THEN** the build guard fails naming the page and the question

#### Scenario: Same answers

- **WHEN** `faq.json` and the FAQPage of the same page are compared
- **THEN** each answer text is identical, and the guard fails on any difference

### Requirement: ai.txt never contradicts robots.txt

`/.well-known/ai.txt` SHALL declare the same user agents with the same allowed and disallowed paths as `robots.txt`, and SHALL link to `llms.txt`, `/ai/summary.json`, `/ai/faq.json` and the sitemap. It MUST NOT claim any ranking, citation or indexing effect.

#### Scenario: Same crawler rules

- **WHEN** the build guard parses `ai.txt` and `robots.txt`
- **THEN** both declare the same user agents and, per agent, the same `Allow` and `Disallow` paths

#### Scenario: ai.txt allows a blocked path

- **WHEN** `ai.txt` allows a path that `robots.txt` disallows for the same agent, or names an agent `robots.txt` does not
- **THEN** the build guard fails

#### Scenario: Links to the other resources

- **WHEN** `ai.txt` is read
- **THEN** it contains the absolute URLs of `llms.txt`, `/ai/summary.json`, `/ai/faq.json` and the sitemap index

### Requirement: Discovery files are crawlable but not listed as pages

The discovery files SHALL NOT appear in the sitemap, and `robots.txt` SHALL NOT disallow them.

#### Scenario: Sitemap and robots

- **WHEN** the site is built
- **THEN** no sitemap file lists `/ai/` or `/.well-known/` URLs and no `Disallow` rule in `robots.txt` matches them

### Requirement: llms.txt links the AI discovery files

`public/llms.txt` SHALL contain a section `## Datos para asistentes de IA` that links, in order, `https://nuriaromero.dev/ai/summary.json`, `https://nuriaromero.dev/ai/faq.json` and `https://nuriaromero.dev/.well-known/ai.txt` as exact file URLs without a trailing slash, each with a short Spanish description. The section MUST NOT promise reading, citation, ranking or special treatment, and the rest of `llms.txt` MUST stay unchanged.

#### Scenario: Section with the three links

- **WHEN** `public/llms.txt` is read
- **THEN** it has the heading `## Datos para asistentes de IA` and, up to the next `## ` heading, exactly the links to `/ai/summary.json`, `/ai/faq.json` and `/.well-known/ai.txt` on `https://nuriaromero.dev`, in that order, without a trailing slash, each with a description

#### Scenario: No promises

- **WHEN** the lines of the section are checked
- **THEN** none mentions a guarantee, citation, ranking position, priority or special treatment

#### Scenario: Every linked file exists in the build

- **WHEN** the site is built and each URL of the section is mapped to a path under `dist/`
- **THEN** every file exists

#### Scenario: Existing llms.txt guards keep passing

- **WHEN** `pnpm check:seo:dist` and the unit suite run after the change
- **THEN** `check-seo-09` (absolute public links, readable sections, no-promise notice, no private URLs) and the price and identity tests over `llms.txt` pass
