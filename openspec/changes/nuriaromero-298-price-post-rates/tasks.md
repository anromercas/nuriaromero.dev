# Tasks

## 1. Price answer and rates table from the single source

- [x] 1.1 [NRD-301 app] Answer the price question in the opening paragraph and "Respuesta corta" of `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md` with my published web design rates and their date, add the rates table under the lead with the price column right-aligned (`---:`), add the scoped no-wrap rule for `th[align="right"]`/`td[align="right"]` in `src/layouts/BlogPostLayout.astro`, rewrite any "no figures" sentence to "de mercado", set `updatedDate` to the commit date and regenerate the `check-seo-18` baseline for this post; tests: in `tests/price-post-intent.test.js` first remove the NRD-128 number and currency guards and add the rates-answer, table-equals-`disenoWeb.pricing.tiers` (with the right-aligned price column), foreign-figure and no-contradiction tests, plus the layout-rule assertion in `tests/blog-post-template.test.js` (RED against the current code), then `node --test tests/*.test.js` and `pnpm build && pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
