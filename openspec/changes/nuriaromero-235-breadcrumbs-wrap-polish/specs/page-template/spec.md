## MODIFIED Requirements

### Requirement: Breadcrumbs render in the ink world with a visible focus

The shared breadcrumbs SHALL style their text, separator, links and current item only with the shared ink tokens, MUST NOT use any gray or blue Tailwind palette class, SHALL give every link a `:focus-visible` indicator of at least 3:1 contrast against the ink grounds and the purple radial backdrop, SHALL keep link and current-item text at WCAG AA contrast (4.5:1) on the ink ground, the site ground and the lightest colour of the purple radial backdrop, SHALL show the default cursor on the current item, SHALL keep the vertical gap between wrapped rows at least the focus ring extent (outline width plus outline offset), and SHALL keep their accessible name "Miga de pan", the `aria-current="page"` current item, the trailing-slash URLs and the BreadcrumbList JSON-LD unchanged.

#### Scenario: No legacy palette

- **WHEN** the breadcrumbs component source is inspected
- **THEN** it contains no `gray-` or `blue-` class and imports the shared ink tokens

#### Scenario: Visible focus on the ink ground

- **WHEN** a keyboard user tabs onto a breadcrumb link on `/blog/` or a post
- **THEN** the link shows a sky outline whose colour has at least 3:1 contrast against the ink ground and the site ground

#### Scenario: AA text contrast

- **WHEN** the token values used for link, current item and separator text are compared with the ink ground and the site ground
- **THEN** each pair reaches at least 4.5:1

#### Scenario: AA text contrast on the purple radial

- **WHEN** the muted, secondary and link text tokens are compared with the lightest colour of the purple radial backdrop of `Layout.astro`, composited over the site ground
- **THEN** each pair reaches at least 4.5:1 and the sky focus colour reaches at least 3:1

#### Scenario: Current item does not look clickable

- **WHEN** the pointer hovers the item with `aria-current="page"`
- **THEN** the cursor is the default arrow, not a text or pointer cursor

#### Scenario: Focus ring clears the other row at 375 px

- **WHEN** the trail wraps onto two rows at 375 px and a keyboard user focuses a link
- **THEN** the row gap is at least the outline width plus the outline offset, so the ring does not overlap the text of the other row

#### Scenario: Single-line trail unchanged

- **WHEN** a trail fits on one line
- **THEN** its spacing and look are the same as before

#### Scenario: Semantics and structured data unchanged

- **WHEN** a built page with breadcrumbs is read
- **THEN** the trail is a `nav` named "Miga de pan" whose last item carries `aria-current="page"`, every link ends in a trailing slash and the BreadcrumbList entity is identical to before

#### Scenario: Usable at 320 px

- **WHEN** a post with a long title is viewed at 320 px
- **THEN** the breadcrumbs wrap and the page has no horizontal overflow
