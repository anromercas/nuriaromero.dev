## Context

- Schema: `src/content/config.ts` defines the `blog` collection inline with `image: z.string().optional()` (line 10). No post sets `image` (checked: `rg "image:" src/content/blog` is empty).
- Layout: `src/layouts/BlogPostLayout.astro` destructures `image` (line 18) and passes it to `Layout` as `ogImage` (line 43) and to `articleSchema` (line 48). `SEO.astro:18-23` resolves `ogImage` (default `SITE.defaultOgImage`) against `Astro.site` and uses it for `og:image` and `twitter:image`. `articleSchema` (`src/lib/schema.ts:226-247`) resolves `image ?? SITE.defaultOgImage` against `SITE.url`.
- Image pipeline: `astro:assets` `<Image>` is already used (`src/components/Projects.astro`, `Header.astro`, `sobre-mi.astro`, `SeoLocalProcess.astro`) with sources in `src/assets/`; `sharp` 0.32.6 is a dependency. Astro 4.4.5 ships `<Picture>` (`formats`, `fallbackFormat`, `widths`, `sizes`), `getImage()` and the content-collection `image()` schema helper. Output goes to `dist/_astro/` (same origin: CSP `img-src 'self'` already allows it).
- Guards follow the pattern pure contract in `scripts/lib/*.mjs` (tested with fixture HTML) plus a thin `scripts/check-seo-NN.mjs` over `dist/`; the last one is `check-seo-24`. `tests/package-scripts.test.js:46` pins `check:seo:dist` to every `check-seo-NN` file in numeric order.
- Existing tests to keep green: `tests/blog-post-template.test.js:62` pins `articleSchema({ title, description, url, pubDate, updatedDate, image })`; the post contract and baseline (`scripts/lib/post-contract.mjs`, `tests/fixtures/blog-posts.baseline.json`) pin each post's metadata.
- Unit tests run under Node 24 type stripping and import `.ts` from `src/` directly, but cannot import `astro:*` modules or render `.astro` files (Astro 4.4 has no container API).

## Goals / Non-Goals

**Goals:** a cover contract that cannot ship without alt; a cover rendered without layout shift, in modern formats, as the LCP candidate; share and structured-data images from the cover; a build guard on alt, dimensions and weight; the layout output tested with and without a cover.

**Non-Goals:** images for the existing posts (NRD-331); covers on the blog index, RSS or `/ai/*`; art direction; a new dependency or CSP change.

## Decisions

**Approach.** The schema moves into a pure builder `blogSchema(image)` so the alt rule is unit-tested with a stub for the `image()` helper; `config.ts` passes the real helper. `cover` is an object (`{ src, alt }`, `.strict()`), which makes alt structurally inseparable from the image, and it replaces the unused `image` string so there is one way to set a post image. The layout computes one 1200 px JPEG with `getImage()` for og:image, twitter:image and Article `image` (JPEG because not every social preview supports AVIF/WebP), and renders the visible cover with `<Picture>` (AVIF + WebP, JPEG fallback, 640/960/1280 widths). The cover sits between the header and the body, so on mobile and desktop it is the LCP candidate: `loading="eager"`, `fetchpriority="high"`, intrinsic `width`/`height` from the image metadata. Without a cover nothing changes in the markup. Because a fixture post with a cover must not be published, the render is tested by building a temporary copy of the site with fixture posts (`tests/helpers/isolated-build.mjs`); the same helper serves NRD-327 (draft safety), so it is recorded in ADR 0019.

**Files (all layer `app`).**

- Create `src/content/blog-schema.ts`: `blogSchema(image)` (see Interfaces); identical fields to today except `image` removed and `cover` added. Imports `z` from `astro/zod` (no `astro:*` import, so node tests can load it).
- Modify `src/content/config.ts`: `schema: ({ image }) => blogSchema(image)`.
- Modify `src/layouts/BlogPostLayout.astro`:
  - `import { Picture, getImage } from "astro:assets";`
  - `const { title, description, pubDate, updatedDate, cover } = post.data;`
  - `const shareImage = cover ? await getImage({ src: cover.src, format: "jpg", width: 1200, quality: 75 }) : undefined;` and `const image = shareImage?.src;` (keeps the `articleSchema({ ..., image })` call and `ogImage={image}` unchanged, so the fallback path is byte-identical).
  - After `</header>` and before `<div class="post-prose" data-post-body>`: `{cover && (<figure class="post-cover"><Picture src={cover.src} alt={cover.alt} formats={["avif", "webp"]} fallbackFormat="jpg" widths={[640, 960, 1280]} sizes="(min-width: 1024px) 896px, (min-width: 768px) 672px, (min-width: 640px) 640px, calc(100vw - 2rem)" loading="eager" fetchpriority="high" decoding="async" data-post-cover /></figure>)}`.
  - Scoped styles: `.post-cover { margin: 0 0 2.5rem; }` and `.post-cover :global(img) { display: block; width: 100%; height: auto; border-radius: 0.9rem; border: 1px solid var(--hairline); background: var(--card-surface); }` (tokens already used in this file; the UI spec section from the ux-designer may refine them).
- Create `scripts/lib/blog-cover-contract.mjs`: `blogCoverFailures(...)` (see Interfaces). Regex/string parsing like the other contracts; no new dependency.
- Create `scripts/check-seo-25.mjs`: walks `dist/blog/*/index.html`, builds `fileSize(url)` from `stat` of `dist/<pathname>` (undefined when missing), prints `check-seo-25: ...` failures and exits 1, or `check-seo-25: N covers checked` and exits 0.
- Modify `package.json` (scripts only): append `&& node scripts/check-seo-25.mjs` to `check:seo:dist`; add `check:seo-25` (`pnpm build && node scripts/check-seo-25.mjs`) and `check:seo-25:dist`.
- Create `tests/blog-cover-schema.test.js`, `tests/check-seo-25.test.js`, `tests/blog-cover-render.test.js`; modify `tests/blog-post-template.test.js` (source cases).
- Create `tests/helpers/isolated-build.mjs` and `tests/helpers/isolated-build-child.mjs`.
- Create `docs/adr/0019-blog-covers-and-isolated-fixture-builds.md` and add its row to `docs/adr/README.md` (written by the Tech Lead in this design branch).

**Interfaces.**

```ts
// src/content/blog-schema.ts
import { z } from "astro/zod";
export function blogSchema(image: () => z.ZodTypeAny): z.ZodObject<{
  title: z.ZodString; description: z.ZodString; pubDate: z.ZodDate;
  updatedDate: z.ZodOptional<z.ZodDate>;
  cover: z.ZodOptional<z.ZodObject<{ src: z.ZodTypeAny; alt: z.ZodString }>>;
  tags: z.ZodDefault<z.ZodArray<z.ZodString>>; draft: z.ZodDefault<z.ZodBoolean>;
}>;
// cover: z.object({ src: image(), alt: z.string().trim().min(1) }).strict().optional()
```

```js
// scripts/lib/blog-cover-contract.mjs
/**
 * @param {{ pages: { route: string, html: string }[],
 *           fileSize: (url: string) => number | undefined,
 *           maxBytes?: number }} input   // maxBytes defaults to 102400
 * @returns {{ failures: string[], covers: number }}
 */
export function blogCoverFailures(input);
```

Rules per page: find `<figure class="post-cover"...>...</figure>`; no figure: skip. Inside it, exactly one `<img ... data-post-cover ...>` (else failure "empty cover figure"); `alt` present and non-blank; `width` and `height` present and positive integers. Collect URLs from every `srcset` (sources and img; take the URL before the width descriptor), the img `src`, and the page `og:image` when its pathname starts with `/_astro/`; each must have a size (else "missing file"); the largest must be at most `maxBytes` (else failure naming route, file and size).

```js
// tests/helpers/isolated-build.mjs
/**
 * Builds a temporary copy of the site with extra posts and files.
 * @param {{ posts?: { slug: string, frontmatter: Record<string, unknown> | string, body: string }[],
 *           files?: { path: string, contents: string | Buffer }[] }} input
 *   posts are written to src/content/blog/<slug>.md; files paths are relative to the temp root.
 * @returns {Promise<{ root: string, dist: string, cleanup: () => Promise<void> }>}
 */
export async function isolatedBuild(input);
```

Implementation contract: `mkdtemp(join(os.tmpdir(), "nrd-isolated-build-"))`; copy `src/`, `public/`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `package.json` (an explicit allow-list: never `.env*`, `.git`, `dist`); symlink `node_modules` to the repo's; write posts and files; run `spawnSync(process.execPath, [childScript, root])` where `isolated-build-child.mjs` does `import { build } from "astro"; await build({ root, cacheDir: join(root, ".astro-cache"), logLevel: "error" })` (no `astro check`; cache inside the temp root so the real build cache is untouched); child env = `process.env` without `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` (so `getGoogleReviews` returns null and nothing hits the network); throw with the child stderr on a non-zero exit. `cleanup` removes the temp root. Callers use one build per test file (`before`), `{ timeout: 240_000 }`.

**Data.** Content schema change only: `image` (unused) removed, optional `cover` added. No migration (no post sets either). No storage or settings impact.

**Test plan (TDD order).**

1. Task 1.1 (NRD-338): `tests/blog-cover-schema.test.js` against `blogSchema(() => z.string())`: no cover passes; cover with src and alt passes; missing alt, blank alt (`""`, `"  "`) and an unknown key in `cover` fail; the parsed object of a post without cover has the same keys as today (no `image`). RED: module missing. Then `blog-schema.ts`, `config.ts`, minimal layout change (`cover` destructured, `image` undefined): GREEN; `pnpm build` green and the 4 posts unchanged (post contract and baseline).
2. Task 1.2 (NRD-339): `tests/check-seo-25.test.js` with inline fixture HTML and a fake `fileSize`: page without figure (0 covers, no failure); valid cover; blank alt; no width; no height; empty figure; missing srcset file; missing og file under `/_astro/`; largest file 150000 bytes fails naming the file; `maxBytes` boundary (102400 passes). `tests/package-scripts.test.js` fails once `check-seo-25.mjs` exists until `package.json` is wired. RED, then contract, script, wiring: GREEN; `pnpm build && pnpm check:seo:dist` reports 0 covers.
3. Task 1.3 (NRD-340): `tests/blog-cover-render.test.js`: `before` generates a 1600x900 JPEG with `sharp` into `files` at `src/assets/blog/fixture-cover.jpg`, and builds two fixture posts with `isolatedBuild`: `portada-de-prueba` (`cover: { src: "../../assets/blog/fixture-cover.jpg", alt: "Mostrador de una tienda en Sevilla" }`) and `sin-portada-de-prueba`. Assertions (scenarios "Post with a cover", "Post without a cover", "Cover drives the share image", "Fallback share image"): figure position (after `</header>`, before `data-post-body`), AVIF and WebP sources, img alt, numeric width/height, `loading="eager"`, `fetchpriority="high"`, og:image = twitter:image = Article image = absolute `/_astro/*.jpg`; `blogCoverFailures` on the built page returns no failure (real file sizes from the temp dist); the post without cover has no `post-cover`, `<picture` or `data-post-cover` and its og/Article image is `new URL(SITE.defaultOgImage, SITE.url).href`. Add source cases to `tests/blog-post-template.test.js`: `astro:assets` import of `Picture` and `getImage`, `{cover && (` guard, `formats={["avif", "webp"]}`, `loading="eager"`, `fetchpriority="high"`. RED, then the layout: GREEN.
4. Whole suite: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist`.

**Real-browser / e2e checks (QA).** Real covers arrive with NRD-331, so QA runs on a local build with a temporary cover (not committed): add a cover to one post locally, `pnpm dev`, open the post at 375 px and 1280 px: the cover sits under the header, no layout shift while it loads (DevTools Performance CLS 0 for the post), the image is the LCP element and is requested with high priority, the browser picks the AVIF (or WebP) source, the rounded edge and hairline match the template cards; then remove the cover and confirm the post looks exactly like production. Also check that the 4 real posts look unchanged.

**ADRs relied on.** ADR 0004 (SEO head through `SEO.astro`, JSON-LD through `schema.ts`), ADR 0005 (build-time SEO checks), ADR 0006 (node:test, TDD), ADR 0014 (template tokens), ADR 0019 (new: blog covers through `astro:assets`, isolated fixture builds).

## Risks / Trade-offs

- Build time of the unit suite grows by one isolated site build (tens of seconds; CI timeout is 15 minutes). Accepted for a real render test; one build per test file, shared by its cases.
- The 1200 px JPEG share image at quality 75 may exceed 100 KB for detailed photos; the guard will then fail on NRD-331, which can lower quality or pick a simpler image. The limit is the PO's.
- `fetchpriority` passthrough on `<Picture>` in Astro 4.4.5: the render test asserts it; if the component drops it, the developer passes it through `pictureAttributes`/img attributes as supported and records the choice.
- Removing `image` from the schema: a stale `image:` key in a future post is silently stripped by zod. Accepted (one way to set images); the pipeline (NRD-327) uses `cover`.

## UI spec

Surface mode: Read (the visitor is reading an article). The cover supports the article; it never competes with the title. Visual world: the ink template (`src/styles/template.css`, DESIGN.md "SEO local" direction), already loaded by `src/layouts/BlogPostLayout.astro`.

### Post cover (`figure.post-cover` in `src/layouts/BlogPostLayout.astro`)

1. **Screens and layout.** Only the blog post page (`/blog/<slug>/`) changes, and only when the post sets `cover`. Reading order inside `<article>`: breadcrumbs (outside article, unchanged), `header.post-header` (title, lede, meta, hairline bottom rule), then `figure.post-cover`, then `div.post-prose`. The figure spans the full width of the `SectionContainer` (`src/components/SectionContainer.astro`: 100% minus the `main` `px-4` gutters below 640 px, 640 px at sm, 672 px at md, 896 px from lg), the same width as the header hairline above it, so the rule and the image edges align. The prose keeps its own 68ch measure, so the image is intentionally wider than the text column. No caption: `Assumption:` the frontmatter only carries `src` and `alt`, and repeating the alt as visible text would duplicate the title context; a caption field is out of this story's data.
2. **Hierarchy.** Primary information stays the `h1` and lede; the cover is secondary and sits after them, so the title is read first on every width. There is no action on the cover (not a link, not zoomable). `Assumption:` no click-to-enlarge or lightbox; it would add a client script the design does not include.
3. **States.**
   - No cover: nothing rendered (no figure, no placeholder, no reserved space); the page is byte-identical to today, including the header `margin-bottom: 2.5rem` before the prose.
   - Loading: the box is reserved from the first paint by the intrinsic `width`/`height` attributes plus `height: auto`, so the aspect ratio holds and nothing below moves (CLS 0). Until pixels arrive the box shows `background: var(--card-surface)` inside the `--hairline` border and `0.9rem` radius: a quiet tonal block of the same shape, no spinner, no shimmer.
   - Error (file fails to load): the browser shows the alt text on the same `--card-surface` block; the box keeps its size, so the layout does not collapse. No custom error copy. `Assumption:` a broken image in a static build is a build defect caught by `check-seo-25`, so no runtime recovery UI.
   - Success: the image fills the box edge to edge.
   - Partial, disabled: n/a.
4. **Copy.** The only new text is the `alt`, written per post in the frontmatter (`cover.alt`, Spanish). Authoring rule for NRD-331 and the pipeline: describe what the image shows in one sentence in Spanish, without "Imagen de"/"Foto de" prefixes and without stuffing the post keyword, for example "Mostrador de una tienda en Sevilla". No other new copy.
5. **Design system reuse.**
   - Tokens (`src/styles/template.css`): `--hairline` (1px border, DESIGN.md "card and list borders"), `--card-surface` (loading/error fill, the same surface as `pre` and table headers in this file).
   - Radius: `0.9rem`, DESIGN.md `rounded.image` ("portraits 0.9rem"), the same value as `.post-prose :global(img)` and `pre` in this layout and the portrait in `src/components/seo-local/SeoLocalProcess.astro`.
   - Spacing: `margin: 0 0 2.5rem` (figure resets the UA figure margin; 2.5rem below matches the header's 2.5rem gap, so header rule, image and prose sit on one rhythm: rule, 2.5rem, image, 2.5rem, prose).
   - Component: `Picture` from `astro:assets` (pattern already used with `Image` in `SeoLocalProcess.astro`, `Projects.astro`, `sobre-mi.astro`). No new component.
   - Depth: no shadow, no overlay, no gradient, no filter (DESIGN.md "Hairline Depth Rule").
   - Final styles, refining the design's scoped styles:
     - `.post-cover { margin: 0 0 2.5rem; }`
     - `.post-cover :global(picture) { display: block; }`
     - `.post-cover :global(img) { display: block; width: 100%; height: auto; border: 1px solid var(--hairline); border-radius: 0.9rem; background: var(--card-surface); }`
6. **Responsive.** One layout from 320 px up; nothing stacks or hides. The image always takes 100% of the container width and scales its height from the intrinsic ratio. `sizes` must match the real rendered width: `sizes="(min-width: 1024px) 896px, (min-width: 768px) 672px, (min-width: 640px) 640px, calc(100vw - 2rem)"` with `widths={[640, 960, 1280]}`. `Assumption:` this replaces the design's `(min-width: 1024px) 960px, 100vw` because the container is 896 px at lg and 100vw minus the 2rem gutter below 640 px; same attribute, same file, only a more accurate value. At 320 px the cover renders at 288 px wide with no horizontal scroll. Aspect guidance for NRD-331 (not enforced in code): landscape, close to 16:9 or 1.91:1; `Assumption:` a tall portrait image would push the first paragraph below the fold on mobile, and art direction is a non-goal, so the image is never cropped by CSS (no `object-fit`, no `max-height`).
7. **Interactions.** None: no hover, focus, pressed or transition state, because the cover is not interactive. It must not receive the `SectionContainer` reveal animation separately (it lives inside the existing section, which already handles it) and must not get its own fade-in: `Assumption:` an entrance animation on the LCP element delays the perceived LCP and DESIGN.md allows only one authored motion moment.
8. **Accessibility hand-off.** The `img` carries the non-empty `alt` from `cover.alt` (the schema rejects blank alt); not decorative, so never `alt=""` and no `role="presentation"`. Not focusable, so the tab order is unchanged (header link "Nuria Romero Castillo", then the first link in the prose). No live announcements. `<figure>` without `<figcaption>` is fine; do not add `aria-label` to the figure (it would duplicate the alt).
9. **GEO-ready content.** The cover adds context but no answer text; it does not change the post's opening answer, the "Actualizado el" date (still from `updatedDate`) or the brand string "Nuria Romero Castillo" in the meta. The alt follows the no-stuffing rule in item 4. Structured data and og:image are the design's (Decisions) and `seo-review`'s.
