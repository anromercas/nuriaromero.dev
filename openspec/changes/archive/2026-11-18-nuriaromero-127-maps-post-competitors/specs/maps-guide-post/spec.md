## ADDED Requirements

### Requirement: The guide works its registered term

The post `/blog/como-aparecer-en-google-maps-negocio-sevilla/` SHALL keep its title and H1 working `como aparecer en google maps` and SHALL have a meta description of at most 160 characters that contains "Google Maps" and "Perfil de Empresa". Its `intentMatrix` signals (title, description, H1 and the content headings "¿Cómo conecto la ficha con mi página web?" and "¿Prefieres que te lo deje montado?") SHALL appear in the built post.

#### Scenario: Term in title, H1 and description

- **WHEN** the intent test reads the post frontmatter
- **THEN** the normalised title contains "como aparecer en google maps", the description has at most 160 characters and contains "Google Maps" and "Perfil de Empresa"
- **AND** the test fails on the description published before this change

#### Scenario: Intent signals in the built post

- **WHEN** the intent check runs on the built site
- **THEN** the post title, description, H1 and both content headings contain their signals

### Requirement: Every section opens with a direct answer

Each H2 section of the post SHALL open with a paragraph (not a list or table) of one or two sentences and 15 to 45 words that answers the heading's question on its own, before any context, list or link.

#### Scenario: Leads measured on the Markdown

- **WHEN** the intent test reads each H2 section of the post
- **THEN** its first block is a paragraph of one or two sentences and 15 to 45 words
- **AND** the test fails on the post published before this change

### Requirement: New sections close a measured gap

The post SHALL add at most two new H2 sections, each only for a subtopic listed as a gap in the recorded competitor sample (covered by at least two measured competitors, or present in the People Also Ask) and not answered by the post, and each new section SHALL cite at least one official Google source with a link. No section SHALL be added to reach a word count.

#### Scenario: Gap section added

- **WHEN** a new H2 appears in the post
- **THEN** its subtopic is in the gap list of the "Dato observado (NRD-127)" entry and the section links an official Google help or developer page

#### Scenario: No measured sample

- **WHEN** the competitor sample could not be measured
- **THEN** no new H2 section is added and no length target is set

### Requirement: The guide links to its hub

The post body SHALL contain a contextual link to `/seo-local-sevilla/` with the trailing slash, and the related links and the reciprocal pair between the post and `/seo-local-sevilla/` SHALL stay.

#### Scenario: Hub link in the body

- **WHEN** the intent test reads the post Markdown
- **THEN** the body has a link whose target is exactly `/seo-local-sevilla/`

#### Scenario: Related block and pair kept

- **WHEN** the link checks run on the built site
- **THEN** every link row of the post appears with its anchor and the reciprocal pair with `/seo-local-sevilla/` holds in both directions

### Requirement: The guide makes no promise of position

The post SHALL NOT promise a Google position, a result or a recommendation by an AI assistant; every sentence that mentions a guarantee SHALL be negated.

#### Scenario: Guarantees only in negative form

- **WHEN** the intent test scans each sentence of the post body containing "garantiz"
- **THEN** the sentence also contains a negation ("no", "ninguna", "ningún", "nadie" or "sin")

### Requirement: The update date reflects the real content change

The post SHALL carry an `updatedDate` equal to the date of the commit that changes its content, not earlier than `pubDate` and not later than the build date; the visible "Actualizado el" label, `Article.dateModified` and the sitemap `lastmod` SHALL show that date.

#### Scenario: Update date set and coherent

- **WHEN** the intent test reads the frontmatter
- **THEN** `updatedDate` exists, is on or after `pubDate` and is not in the future

#### Scenario: Built dates agree

- **WHEN** the freshness check runs on the built post
- **THEN** the "Actualizado el" `time` element, `Article.dateModified` and the sitemap `lastmod` carry the same date

### Requirement: The edit is backed by recorded evidence

Before the content changes, the keyword cluster study SHALL hold a dated, measured competitor sample for `como aparecer en google maps`, and figures that could not be measured SHALL be recorded as "sin dato" with their reason.

#### Scenario: Evidence committed first

- **WHEN** the change reaches review
- **THEN** a "Dato observado (NRD-127, <date>)" entry is committed before the content commit, with the ranking domains and page types, the People Also Ask questions, the main-content word count of the measured guides and their median, the post's body word count, a subtopic coverage table and a gap list

### Requirement: CWV are measured before and after the edit

The CWV record SHALL hold the median of three Lighthouse mobile runs of the post before the content change and after it.

#### Scenario: CWV before and after

- **WHEN** the change reaches review
- **THEN** the CWV record shows LCP, CLS, TBT and the LCP element of the post before and after the change
