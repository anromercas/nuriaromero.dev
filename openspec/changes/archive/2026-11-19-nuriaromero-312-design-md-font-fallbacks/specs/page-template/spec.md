## MODIFIED Requirements

### Requirement: Ink tokens live in one place

The ink grounds, card surfaces, hairlines, sky signal and accent, recommend yellow, the band, the keyword heading, the display title and the serif accent style SHALL be defined once, with the values recorded in `DESIGN.md`, and every template section SHALL use those definitions instead of its own copy. The font stacks recorded in `DESIGN.md` (the `typography.*.fontFamily` tokens and the "Display / Body Font" and "Accent Font" lines) SHALL be the published stacks verbatim, including the metric-matched fallback faces "Onest Fallback" and "Instrument Serif Fallback", and `DESIGN.md` SHALL state why the fallback faces exist, where they are defined and that they are kept when the font is used on another page.

#### Scenario: Token values match the design system

- **WHEN** the shared token definitions are compared with the `DESIGN.md` colour and typography tokens
- **THEN** every shared token carries the `DESIGN.md` value

#### Scenario: Sections stop copying token values

- **WHEN** the section component styles are inspected
- **THEN** none redefines the band, the display title or the serif accent style

#### Scenario: Font tokens carry the published stacks

- **WHEN** the `typography.*.fontFamily` tokens of `DESIGN.md` are compared with the `html` font-family in `src/layouts/Layout.astro` and the `.tpl-accent` font-family in `src/styles/template.css`
- **THEN** the display, headline, title, stat, body and label tokens equal `"Onest Variable", "Onest Fallback", system-ui, sans-serif` and the accent token equals `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif`, both identical to the CSS

#### Scenario: Typography lines show the published stacks

- **WHEN** a reader opens the "Typography" section of `DESIGN.md`
- **THEN** the "Display / Body Font" line shows the Onest stack and the "Accent Font" line shows the Instrument Serif stack, each with its fallback face

#### Scenario: The fallback faces are explained

- **WHEN** a reader looks for why the fallback faces are in the stacks
- **THEN** one sentence in the "Typography" section says they avoid layout shift (CLS) on the web-font swap (NRD-310), are defined in `src/styles/fonts.css`, and are not removed when the font is used on another page

#### Scenario: Documentation-only change

- **WHEN** the story's diff is listed
- **THEN** no file under `src/` changes and the built HTML is unchanged
