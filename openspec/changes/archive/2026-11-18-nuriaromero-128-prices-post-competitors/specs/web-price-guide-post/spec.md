## ADDED Requirements

### Requirement: The guide works its registered term

The post `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` SHALL keep its title and H1 working `cuanto cuesta una pagina web en sevilla` and SHALL have a meta description of at most 160 characters that also works the term. Its `intentMatrix` signals (title, description, H1 and the content headings "Qué debo revisar en una propuesta económica" and "Qué preguntas debo hacer antes de contratar") SHALL appear in the built post.

#### Scenario: Term in title, H1 and description

- **WHEN** the intent test reads the post frontmatter
- **THEN** the normalised title and description each contain "cuanto cuesta una pagina web" and "sevilla", and the description has at most 160 characters and contains the row's `descriptionSignal`
- **AND** the test fails on the description published before this change

#### Scenario: Intent signals in the built post

- **WHEN** the intent check runs on the built site
- **THEN** the post title, description, H1 and both content headings contain their signals

### Requirement: Every section opens with a direct answer

Each H2 section of the post SHALL open with a paragraph (not a list or table) of one or two sentences and 15 to 45 words that answers the heading's question on its own.

#### Scenario: Leads measured on the Markdown

- **WHEN** the intent test reads each H2 section of the post
- **THEN** its first block is a paragraph of one or two sentences and 15 to 45 words
- **AND** the test fails on the post published before this change

### Requirement: The guide adds no price figure

While the user decision S-2026-11-13-1 is open, the post body SHALL NOT contain any number other than those it had before this change (2, 5, 75 and 10, outside link URLs and list markers), nor a euro sign or a currency word. It MAY point to the service page where the published price lives, without writing the figure.

#### Scenario: Number set unchanged

- **WHEN** the intent test extracts the numbers of the post body, without link URLs and list markers
- **THEN** every number belongs to {2, 5, 75, 10}, and the body contains no "€", "euro" or "EUR"

#### Scenario: Pointer to the published price

- **WHEN** the reader looks for a concrete price
- **THEN** the post links to `/diseno-web-sevilla/` as the place where the fixed price and its scope are published, with no figure in the post

### Requirement: New sections close a measured gap

The post SHALL add at most two new H2 sections, each only for a subtopic listed as a gap in the recorded competitor sample (covered by at least two measured competitors, or present in the People Also Ask) and not answered by the post; new sections SHALL be qualitative and SHALL NOT be added to reach a word count.

#### Scenario: Gap section added

- **WHEN** a new H2 appears in the post
- **THEN** its subtopic is in the gap list of the "Dato observado (NRD-128)" entry and the section contains no price figure

#### Scenario: No measured sample

- **WHEN** the competitor sample could not be measured
- **THEN** no new H2 section is added and no length target is set

### Requirement: The guide links to its hub and makes no promise

The post body SHALL keep a contextual link to `/diseno-web-sevilla/` with the trailing slash, the reciprocal pair with `/diseno-web-sevilla/` SHALL hold, and every sentence that mentions a guarantee SHALL be negated.

#### Scenario: Hub link and pair

- **WHEN** the intent test reads the post and the link map
- **THEN** the body links to exactly `/diseno-web-sevilla/` and the pair holds in both directions

#### Scenario: Guarantees only in negative form

- **WHEN** the intent test scans each sentence of the body containing "garantiz"
- **THEN** the sentence also contains a negation ("no", "ninguna", "ningún", "nadie" or "sin")

### Requirement: The update date reflects the real content change

The post SHALL carry an `updatedDate` equal to the date of the commit that changes its content, not earlier than `pubDate` and not later than the build date; the "Actualizado el" label, `Article.dateModified` and the sitemap `lastmod` SHALL show it.

#### Scenario: Update date set and coherent

- **WHEN** the intent test reads the frontmatter
- **THEN** `updatedDate` exists, is on or after `pubDate` and is not in the future

#### Scenario: Built dates agree

- **WHEN** the freshness check runs on the built post
- **THEN** the "Actualizado el" `time` element, `Article.dateModified` and the sitemap `lastmod` carry the same date

### Requirement: The edit is backed by recorded evidence

Before the content changes, the keyword cluster study SHALL hold a dated, measured competitor sample for `cuanto cuesta una pagina web en sevilla`, and figures that could not be measured SHALL be recorded as "sin dato" with their reason.

#### Scenario: Evidence committed first

- **WHEN** the change reaches review
- **THEN** a "Dato observado (NRD-128, <date>)" entry is committed before the content commit, with the ranking domains and page types, the People Also Ask questions, the main-content word count of the measured pages and their median, the post's body word count, a subtopic coverage table and a gap list

### Requirement: CWV are measured before and after the edit

The CWV record SHALL hold the median of three Lighthouse mobile runs of the post before the content change and after it.

#### Scenario: CWV before and after

- **WHEN** the change reaches review
- **THEN** the CWV record shows LCP, CLS, TBT and the LCP element of the post before and after the change
