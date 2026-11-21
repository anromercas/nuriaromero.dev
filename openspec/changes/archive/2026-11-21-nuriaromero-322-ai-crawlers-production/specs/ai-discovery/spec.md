## ADDED Requirements

### Requirement: Public pages carry no noindex response header

`public/_headers` SHALL NOT apply an `X-Robots-Tag` header containing the token `noindex` or `none` (case-insensitive) to the path pattern `/*` or to any path pattern other than `/informes/*`. The `/informes/*` pattern SHALL keep `X-Robots-Tag: noindex, nofollow`. A unit test SHALL enforce both rules on the real file.

#### Scenario: noindex on every path

- **WHEN** `public/_headers` contains a `/*` block with `X-Robots-Tag: noindex`
- **THEN** `node --test tests/robots-headers.test.js` fails naming the `/*` pattern

#### Scenario: none on a public section

- **WHEN** a `/blog/*` block sets `X-Robots-Tag: none`
- **THEN** the test fails naming `/blog/*`

#### Scenario: Private reports stay noindex

- **WHEN** the `/informes/*` block sets `X-Robots-Tag: noindex, nofollow` and no other block sets a noindex or none value
- **THEN** the test passes

#### Scenario: Private reports lose noindex

- **WHEN** the `/informes/*` block no longer carries `noindex`
- **THEN** the test fails naming `/informes/*`

### Requirement: AI crawlers get the real pages in production

For each user-agent GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot and Google-Extended, plus a normal browser user-agent as control, a read-only GET of `https://nuriaromero.dev/`, `/seo-para-ia/`, `/seo-local-sevilla/`, `/llms.txt`, `/robots.txt` and `/ai/summary.json` SHALL return HTTP 200 with the real content, no challenge page and no `X-Robots-Tag` noindex header. The evidence SHALL be recorded once in the pull request of this change.

#### Scenario: All agents served

- **WHEN** the developer runs the 48 GETs against production
- **THEN** every response is 200, its size matches the control response for the same URL within a few bytes, no response carries `X-Robots-Tag` with noindex, and the table (UA, URL, status, X-Robots-Tag, bytes, same as control) is in the PR body

#### Scenario: An agent is blocked

- **WHEN** any AI user-agent receives a status other than 200, a challenge page or a noindex header
- **THEN** the developer stops, posts the evidence as a comment on NRD-322 and changes nothing in Netlify, headers or robots; the fix is left to the owner
