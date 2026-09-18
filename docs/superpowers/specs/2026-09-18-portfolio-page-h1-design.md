# Portfolio Page H1 Design

## Objective

Add one visible, descriptive H1 to `/portfolio/` without changing the page's layout or unrelated copy.

## Current State

The page title is rendered through the shared `TitleSection` component, which outputs an H2. The page's introductory paragraph describes web projects for local businesses in Seville as well as personal projects. The SEO audit backlog identifies the missing H1 as a high-priority task.

## Design

Replace the portfolio page's `TitleSection` usage with a page-local H1 reading **“Proyectos web para negocios de Sevilla”**. Preserve the current icon, typography, spacing, and dark-mode styles so the visual appearance stays consistent. Keep the existing paragraph, projects list, metadata, and shared `TitleSection` component unchanged.

This is preferred over adding a separate H1 above the existing “Portfolio” heading, which would create a redundant visible title, or changing `TitleSection` globally, which would expand the scope to unrelated pages.

## Acceptance Criteria

- `/portfolio/` renders exactly one visible H1 with the approved wording.
- The H1 preserves the current title's visual treatment on mobile and desktop.
- The remaining content and page hierarchy are unchanged.
- The production build and a rendered-page heading check pass.

## Verification

- Run the focused project checks and production build.
- Inspect rendered `/portfolio/` output to confirm one H1 with the approved text.
- Check the page at mobile and desktop widths for legibility and layout regressions.

## Scope

Implementation is limited to `src/pages/portfolio.astro` and the corresponding completion status in `docs/seo-audit/portfolio-heading.md`. No push or deployment is included in this task.
