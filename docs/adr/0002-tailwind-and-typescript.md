# 0002. Tailwind CSS 3 and strict TypeScript

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

A small static site maintained by one person and by agents needs styling without a custom CSS framework and typed data shared by pages, layouts and structured data.

## Decision

- Styling uses Tailwind CSS 3 through `@astrojs/tailwind`, with utilities in markup. Component-scoped `<style>` blocks are allowed for page-specific design tokens. No Tailwind plugins are registered: they land in the single CSS chunk every page loads (the typography plugin was removed for that reason; long-form content uses `.entry-content`).
- The site is dark-only: `<html class="dark">` and `color-scheme: dark` are fixed in `Layout.astro`; `darkMode: 'class'` is still configured.
- TypeScript extends `astro/tsconfigs/strict`, with the `@/*` alias to `src/*`. `astro check` is the typecheck and runs inside `pnpm build`; there is no separate linter.
- Fonts are self-hosted through Fontsource packages (no external font origin).
- Formatting: Prettier with `prettier-plugin-astro`, applied only to edited files (`pnpm format <file>`).

## Consequences

- New shared design tokens currently have no home (`theme.extend` is empty); DESIGN.md records this drift. Adding them to the Tailwind theme is a cross-cutting decision that deserves its own ADR.
- A new Tailwind plugin must justify its weight on every page.
- Type errors fail the build, so `pnpm build` is the gate, not only the unit tests.

## Evidence

- `tailwind.config.mjs`: `darkMode: 'class'`, empty `theme.extend`, `plugins: []` with the comment on removing `@tailwindcss/typography`.
- `src/components/EntryContentStyles.astro`; `src/layouts/Layout.astro` (`<html lang="es" class="dark">`, `color-scheme: dark`).
- `tsconfig.json` (`astro/tsconfigs/strict`, `@/*` paths).
- `package.json`: `tailwindcss` 3.4.1, `@astrojs/tailwind` 5.1.0, `typescript` 5.3.3, `@astrojs/check`, `@fontsource-variable/onest`, `@fontsource/instrument-serif`, scripts `build` (`astro check && astro build`) and `format`.
- `.prettierrc.json`, `.prettierignore`.
