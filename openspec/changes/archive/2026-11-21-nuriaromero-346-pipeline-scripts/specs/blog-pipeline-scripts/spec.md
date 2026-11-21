## ADDED Requirements

### Requirement: The shortlist reads only known export shapes

`scripts/blog-shortlist.mjs` SHALL read one or more saved JSON exports in the project's normalized keyword-data format, a DataForSEO API response envelope or a Google Search Console search-analytics response. An export of any other shape, or a Search Console export without `--date`, SHALL fail with a non-zero exit and a message naming the file. The script SHALL NOT call any API and SHALL NOT write files.

#### Scenario: Unknown export shape

- **WHEN** an input file is JSON of no recognised shape
- **THEN** the script exits non-zero naming the file and prints no candidates

### Requirement: Shortlist candidates are real questions with dated sources

Only question-shaped topics (a People Also Ask question, a client question, or a keyword or query starting with a Spanish interrogative) SHALL become candidates. Candidates with the same normalized question SHALL be merged, keeping the highest volume and every source. Each candidate MUST carry its question, keyword, volume and difficulty when known, pillar and target page when it fits one, and at least one source with its date.

#### Scenario: Candidates from mixed exports

- **WHEN** the shortlist runs on a normalized export with "¿Cuánto cuesta una tienda online?" (volume 90) and a DataForSEO SERP response whose People Also Ask holds "¿Qué es el SEO local?"
- **THEN** both appear as candidates, each with its question, pillar, target page and a source naming the export and its date, the fitting higher-volume one first

#### Scenario: Non-question keyword

- **WHEN** an export holds the keyword "tienda online sevilla" with volume 500
- **THEN** it is not a candidate and the summary counts it as skipped for not being a question

#### Scenario: Duplicate across exports

- **WHEN** two exports hold "¿Cuánto cuesta una tienda online?" with volumes 90 and 110
- **THEN** one candidate is printed with volume 110 and both sources

### Requirement: Shortlist order is deterministic

Candidates SHALL be ordered by pillar fit, then volume (unknown last), then difficulty (unknown last), then question text, and the same inputs SHALL always produce byte-identical output.

#### Scenario: Deterministic order

- **WHEN** the shortlist runs twice on the same inputs
- **THEN** both outputs are identical

### Requirement: Topics are classified into content pillars

`classifyTopic` SHALL map a topic to the first matching rule of the ordered pillar table (`seo` with targets `/seo-para-ia/` and `/seo-local-sevilla/`, `web` with `/tienda-online-sevilla/` and `/diseno-web-sevilla/`, `ia` with `/inteligencia-artificial/`, `servicios` with `/automatizaciones/` and `/desarrollo-software-medida/`), matching whole normalized words, and SHALL return no pillar when no rule matches.

#### Scenario: GEO question

- **WHEN** the topic is "¿Cómo hago que ChatGPT recomiende mi negocio?"
- **THEN** it is classified as pillar `seo` with target `/seo-para-ia/`

#### Scenario: Unrelated question

- **WHEN** the topic is "¿Qué tiempo hace en Sevilla?"
- **THEN** it has no pillar and sorts after every fitting candidate

### Requirement: The outline lint rejects incomplete outlines

`scripts/blog-outline-lint.mjs <esquema.md>` SHALL exit non-zero and list every failure when the outline has zero or more than one H1 heading outside fenced code blocks, no `- H2: <text>` item under `## Estructura`, no positive integer `Objetivo de palabras`, no list item under `## Fuentes`, or an empty `## Respuesta directa` section. A complete outline SHALL exit zero.

#### Scenario: Valid outline

- **WHEN** the lint runs on an outline with one H1, three H2 items, `Objetivo de palabras: 900`, two sources and a direct answer
- **THEN** it exits 0

#### Scenario: Two H1

- **WHEN** the outline has two lines starting with `# `
- **THEN** it exits 1 and reports that exactly one H1 is expected

#### Scenario: No H1

- **WHEN** the outline has no H1 heading
- **THEN** it exits 1 and reports the missing H1

#### Scenario: No sources

- **WHEN** `## Fuentes` is missing or has no list item
- **THEN** it exits 1 and reports the missing sources

#### Scenario: No H2 list or word target

- **WHEN** the outline has no `- H2:` item or no valid `Objetivo de palabras`
- **THEN** it exits 1 and reports each missing element

### Requirement: The scaffold always emits draft true

`buildPostFrontmatter` SHALL return frontmatter that validates against the blog collection schema (`blogSchema` in `src/content/blog-schema.ts`), including `cover.src` pointing to `../../assets/blog/<file>` and a non-blank `cover.alt`. Its text SHALL always contain `draft: true` and never `draft: false`, and passing any `draft` value SHALL throw.

#### Scenario: Valid scaffold

- **WHEN** the scaffold is built for slug `que-es-una-ficha-de-google`, a title, a description, date 2026-11-24, tags and cover `que-es-una-ficha-de-google.jpg` with alt text
- **THEN** its data validates against `blogSchema` and its text contains `draft: true`

#### Scenario: Draft false requested

- **WHEN** the input includes `draft: false`
- **THEN** the builder throws and nothing is printed or written

### Requirement: The scaffold writes a post only on explicit request

`scripts/blog-scaffold.mjs` SHALL print the frontmatter without writing anything unless `--write` is given with an explicit `--slug`. With `--write` it SHALL create `src/content/blog/<slug>.md` under `--root` (default the current directory) and SHALL refuse when that file already exists or the cover file is missing under `src/assets/blog/`. No other pipeline script SHALL write under `src/content/blog/`.

#### Scenario: Print only

- **WHEN** the CLI runs without `--write`
- **THEN** it prints the frontmatter and creates no file

#### Scenario: Write refused over an existing post

- **WHEN** the CLI runs with `--write` for a slug whose file already exists
- **THEN** it exits 1 and the existing file is unchanged

### Requirement: The word count compares a post body with its target

`countWords` SHALL count the words of a post body excluding frontmatter, fenced code, HTML tags, link and image URLs and markdown markers, counting link text and treating accented and hyphenated words as one word. `scripts/blog-word-count.mjs <post.md>` with `--outline <esquema.md>` or `--target <n>` SHALL print the count, the target and the accepted range (target plus or minus 10 percent) and exit non-zero when the count is outside the range.

#### Scenario: Within range

- **WHEN** a post body has 812 words and the outline target is 900
- **THEN** the script reports `within` (range 810-990) and exits 0

#### Scenario: Under target

- **WHEN** a post body has 700 words and the target is 900
- **THEN** the script reports `under` and exits 1

#### Scenario: Frontmatter ignored

- **WHEN** a post has a 12-word frontmatter and a 50-word body
- **THEN** the count is 50
