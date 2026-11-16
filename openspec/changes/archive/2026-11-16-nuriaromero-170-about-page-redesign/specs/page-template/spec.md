## ADDED Requirements

### Requirement: Project cards can render in the ink world

The real proof section SHALL accept an opt-in ink variant for its project cards that shows the same published projects (title, description, technologies, real screenshot and link) in the ink world: screenshots with 0.9rem corners, no shadows, hairline borders and an asymmetric layout. Without the option, the project cards SHALL render exactly as before.

#### Scenario: Ink cards on request

- **WHEN** a page renders the real proof section with the ink variant
- **THEN** the project cards use the ink surfaces and hairlines, the screenshots have 0.9rem corners and no shadow, and the cards do not form a grid of identical tiles

#### Scenario: Default unchanged

- **WHEN** a page renders the real proof section without the option
- **THEN** its project cards markup is the same as before the variant existed

#### Scenario: Same content in both variants

- **WHEN** the same projects render in both variants
- **THEN** both show the same project titles as h3, descriptions, screenshot alternative texts and links
