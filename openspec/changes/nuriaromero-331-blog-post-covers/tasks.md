## 1. Blog post covers

- [ ] 1.1 [NRD-380 app] `BlogPostLayout` encodes the cover `<Picture>` and the share `getImage()` JPEG at quality 60; tests: source assertions in `tests/blog-post-template.test.js` first (RED), then GREEN with `tests/blog-cover-render.test.js` still green
- [ ] 1.2 [NRD-381 app] Four 16:9 covers cropped from the mediateca into `src/assets/blog/<slug>.jpg`, `src/assets/blog/credits.json`, `cover` frontmatter with the design's alt texts (dates untouched), blog-pipeline skill step 3 line; tests: `tests/blog-covers-content.test.js` first (RED), then GREEN; `pnpm build` and `pnpm check:seo:dist` green with 4 covers checked
