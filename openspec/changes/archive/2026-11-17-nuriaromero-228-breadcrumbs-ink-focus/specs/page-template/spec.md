## ADDED Requirements

### Requirement: Breadcrumbs render in the ink world with a visible focus

The shared breadcrumbs SHALL style their text, separator, links and current item only with the shared ink tokens, MUST NOT use any gray or blue Tailwind palette class, SHALL give every link a `:focus-visible` indicator of at least 3:1 contrast against the ink grounds, SHALL keep link and current-item text at WCAG AA contrast (4.5:1), and SHALL keep their accessible name "Miga de pan", the `aria-current="page"` current item, the trailing-slash URLs and the BreadcrumbList JSON-LD unchanged.

#### Scenario: No legacy palette

- **WHEN** the breadcrumbs component source is inspected
- **THEN** it contains no `gray-` or `blue-` class and imports the shared ink tokens

#### Scenario: Visible focus on the ink ground

- **WHEN** a keyboard user tabs onto a breadcrumb link on `/blog/` or a post
- **THEN** the link shows a sky outline whose colour has at least 3:1 contrast against the ink ground and the site ground

#### Scenario: AA text contrast

- **WHEN** the token values used for link, current item and separator text are compared with the ink ground and the site ground
- **THEN** each pair reaches at least 4.5:1

#### Scenario: Semantics and structured data unchanged

- **WHEN** a built page with breadcrumbs is read
- **THEN** the trail is a `nav` named "Miga de pan" whose last item carries `aria-current="page"`, every link ends in a trailing slash and the BreadcrumbList entity is identical to before

#### Scenario: Usable at 320 px

- **WHEN** a post with a long title is viewed at 320 px
- **THEN** the breadcrumbs wrap and the page has no horizontal overflow
