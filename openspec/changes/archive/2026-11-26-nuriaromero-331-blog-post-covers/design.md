## Context

Story [NRD-331](https://nuriaromerodev.atlassian.net/browse/NRD-331), second half of NRD-328 (done).

- `src/content/blog-schema.ts` accepts `cover: { src: image(), alt }` (strict, alt non-blank). None of the four posts sets it: `como-aparecer-en-google-maps-negocio-sevilla.md`, `cuanto-cuesta-una-pagina-web-en-sevilla.md`, `pagina-web-para-restaurantes-que-necesita.md`, `que-es-geo-posicionamiento-ia-negocios-sevilla.md`.
- `src/layouts/BlogPostLayout.astro:22-24` builds the share image with `getImage({ src, format: "jpg", width: 1200, quality: 75 })`; `:87-102` renders `<Picture formats={["avif","webp"]} fallbackFormat="jpg" widths={[640,960,1280]}>` with no `quality`, so Astro's sharp service uses sharp's defaults (JPEG and WebP 80, AVIF 50).
- `scripts/check-seo-25.mjs` + `scripts/lib/blog-cover-contract.mjs` fail a post when the largest generated cover file (sources, fallback `img`, og:image) exceeds 102400 bytes.
- `social/` is not tracked: a developer worktree cut from `origin/develop` has no `social/mediateca/`. The library exists only in the main checkout, whose root every worktree can resolve with `dirname "$(git rev-parse --path-format=absolute --git-common-dir)"` (verified from the design worktree: it resolves to the main checkout's `.git`).
- Approved mediateca stills (`social/mediateca/index.jsonl`, all Flow "Nano Banana 2.1", generated 2026-11-19, 1536x2752 vertical, reviewed "no people, no text, no logos"): `busqueda-movil-manos-cafe-v-20261119-01`, `busqueda-movil-mano-calle-v-20261119-02`, `negocio-local-taller-v-20261119-01`, `negocio-local-peluqueria-v-20261119-02`, `negocio-local-barra-cafe-v-20261119-03`, `negocio-local-furgoneta-v-20261119-04` (`busqueda-movil-mano-mesa-...-03` is rejected; `navidad-sevilla` is excluded by the PO).
- Measured in a scratch directory with the repository's `sharp` 0.32.6 on 16:9 crops (KB, largest generated file per format):

| Still | JPEG 1280 q80 | JPEG 1280 q60 | Share JPEG 1200 q60 | WebP 1280 q65 |
|---|---|---|---|---|
| mano-calle | 79 | 41 | 36 | 20 |
| manos-cafe | 68 | 42 | 38 | 22 |
| barra-cafe | 119 | 77 | 70 | 47 |
| peluqueria | 138 | 91 | 83 | 63 |
| taller | 186 | 119 | 107 | 103 |
| furgoneta (3:2 crop) | 146 (q65) | 133 | 117 | 122 |

## Goals / Non-Goals

**Goals:**

- Each post has its own relevant cover from the mediateca, with a descriptive Spanish alt and a recorded source, passing the 100 KB guard.
- The developer can reach the untracked library from a worktree without the owner.

**Non-Goals:**

- New Flow generations, covers in listings or cards, a reusable cover script, versioning `social/`.

## Decisions

**Approach.** Every post maps to an approved still that fits its topic, so no generation is needed. The vertical stills are cropped to 16:9 (1536x864): a vertical cover would push the post body below the fold, and 16:9 matches the NRD-328 fixture and suits share previews; 1536 px is above the largest generated width (1280), so nothing is upscaled. Crops are made once with `sharp` (already a dependency) from the main checkout's library, read-only, and committed as `src/assets/blog/<slug>.jpg`, as the blog pipeline already prescribes. With sharp's default quality two of the four crops exceed the guard, so the layout passes `quality={60}` to `<Picture>` and `quality: 60` to the share `getImage()`: all four then fit with at least 9 KB of margin, and the visual loss at 60 is small on these soft-focus photos. `pubDate`/`updatedDate` are not touched, because adding a decorative image is not a content change (freshness rule: never bump dates without a content change).

Mapping (initial crop `top`, width 1536, height 864, `left` 0; the developer adjusts by eye so the subject is whole and nothing readable, no face and no brand enters, and records the final box):

| Post | Still | Why | Initial `top` | Alt (Spanish) |
|---|---|---|---|---|
| `como-aparecer-en-google-maps-negocio-sevilla` | `busqueda-movil-mano-calle-v-20261119-02` | someone searching on the phone in the street | 1150 | Mano que sostiene un móvil con la pantalla encendida en una calle estrecha de casas blancas al anochecer |
| `cuanto-cuesta-una-pagina-web-en-sevilla` | `busqueda-movil-manos-cafe-v-20261119-01` | planning and comparing at a table | 580 | Dos manos sostienen un móvil sobre una mesa de madera de cafetería, junto a una taza de café |
| `pagina-web-para-restaurantes-que-necesita` | `negocio-local-barra-cafe-v-20261119-03` | hospitality counter (PO's suggested fit) | 1130 | Barra de mármol de una cafetería de barrio con la cafetera humeante y bollería bajo una campana de cristal |
| `que-es-geo-posicionamiento-ia-negocios-sevilla` | `negocio-local-peluqueria-v-20261119-02` | a neighbourhood business like the post's examples; the remaining lighter still (taller and furgoneta exceed the guard even at q60) | 1270 | Peluquería de barrio vacía con dos sillones negros frente a los espejos y luz cálida del sol por la ventana |

Revised after the UI spec review, checked on scratch renders of the crops. Google Maps: `top` 1220 -> 1150, so the top edge of the phone stays in frame (and its bottom edge too). Prices: `top` 790 -> 580, which is below the 680-790 range the UI spec proposed: at 700 the rim of the cup was still cut off, while at 580 the whole cup and saucer are in frame, so "junto a una taza de café" in the alt is true; the bottom of the phone leaves the frame but both hands still clearly hold it. New weights at q60: 42 KB and 38 KB for the 1280 px fallback JPEG, 37 KB and 35 KB for the share JPEG. GEO alt: "luz cálida del sol" replaces "luz de mañana", because the photo does not show the time of day.

The owner can veto any cover in the PR (PO note); a veto means a new Flow generation in an attended session, not a blocker for this design.

**Files** (layer `app` unless stated):

- `src/layouts/BlogPostLayout.astro`: modify. `quality={60}` on the cover `<Picture>`, `quality: 60` in the share `getImage()`; update the comment above `shareImage`.
- `tests/blog-post-template.test.js`: modify. Source assertions for both qualities next to the NRD-328 test.
- `src/assets/blog/como-aparecer-en-google-maps-negocio-sevilla.jpg`, `src/assets/blog/cuanto-cuesta-una-pagina-web-en-sevilla.jpg`, `src/assets/blog/pagina-web-para-restaurantes-que-necesita.jpg`, `src/assets/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.jpg`: create (1536x864 JPEG, `quality: 82, mozjpeg: true`).
- `src/assets/blog/credits.json`: create.
- `src/content/blog/*.md` (the four posts): modify frontmatter only, adding `cover`.
- `tests/blog-covers-content.test.js`: create.
- `.claude/skills/blog-pipeline/SKILL.md`: modify step 3, item 2 (shared path routed to the `app` subtask NRD-381): "Save it as `src/assets/blog/<slug>.<jpg|png|webp>`, cropped to 16:9, at least 1280 px wide (the largest generated width) and within the weight guard of `scripts/check-seo-25.mjs`." `.claude/` guard: never remove or weaken a `permissions.deny` entry, never add an allow rule that reads `.env`, never disable the team-harness plugin or its hooks.

**Interfaces:**

```yaml
# frontmatter added to each post (path relative to src/content/blog/)
cover:
  src: "../../assets/blog/<slug>.jpg"
  alt: "<alt from the mapping table>"
```

```json
// src/assets/blog/credits.json
{
  "version": 1,
  "files": {
    "<slug>.jpg": [
      {
        "origin": "Imagen generada con Google Flow (Nano Banana 2.1) para la mediateca de nuriaromero.dev, recortada a 16:9",
        "libraryId": "busqueda-movil-mano-calle-v-20261119-02",
        "libraryFile": "social/mediateca/busqueda-movil/busqueda-movil-mano-calle-v-20261119-02.jpg",
        "source": "flow",
        "model": "Nano Banana 2.1",
        "generatedAt": "2026-11-19",
        "crop": { "left": 0, "top": 1150, "width": 1536, "height": 864 },
        "licence": "Imagen generada con IA para nuriaromero.dev"
      }
    ]
  }
}
```

One-off crop (run from the developer worktree; `MAIN` resolves the main checkout; if a file is missing or unreadable, stop and ask with `needs-tech-answer`, never substitute an image):

```sh
MAIN="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
node -e 'const s=require("sharp");const [src,out,top]=process.argv.slice(1);s(src).extract({left:0,top:+top,width:1536,height:864}).jpeg({quality:82,mozjpeg:true}).toFile(out).then(i=>console.log(out,i.size))' \
  "$MAIN/social/mediateca/busqueda-movil/busqueda-movil-mano-calle-v-20261119-02.jpg" \
  src/assets/blog/como-aparecer-en-google-maps-negocio-sevilla.jpg 1150
```

**Data:** none. No settings or storage change; four new tracked binary assets (~450 KB).

**Test plan (TDD order):**

1. NRD-380: in `tests/blog-post-template.test.js`, assert the layout source has `quality={60}` inside the cover `<Picture` and `quality: 60` in the `getImage(` call (RED today: no quality / 75). Implement; GREEN; `tests/blog-cover-render.test.js` (isolated build with a flat 1600x900 fixture) stays green. Covers "Cover encoding quality".
2. NRD-381: `tests/blog-covers-content.test.js` first (RED: no covers). Read each published post in `src/content/blog/` (frontmatter parsed as in `tests/blog-drafts.test.js` or with a small YAML-subset reader; `draft: true` posts skipped): `cover.src === "../../assets/blog/<slug>.jpg"`, the file exists, `sharp(file).metadata()` gives width >= 1280 and `width * 9 === height * 16`; alt has 5-20 words, differs from `title`, has at most one comma; `credits.json` has exactly one entry per cover file with non-empty `origin`, `libraryId`, `source`, `generatedAt` and a `crop` with four integers, and no entry for a missing file. Covers "Cover sources are recorded" and "Alt describes the image". Then crop, write credits and frontmatter; GREEN.
3. Build checks (NRD-381 "Done when"): `pnpm build && pnpm check:seo:dist`; `check-seo-25` prints `4 covers checked`; covers "Covers pass the weight guard" and "The four existing posts". `tests/blog-post-template.test.js` built-post tests and the existing check-seo suite stay green. "Dates unchanged" is verified in review (`git diff` shows no `pubDate`/`updatedDate` line); a committed test must not read history.

**Real-browser / e2e checks** (QA, dev server or built preview, dark theme, 375 px and desktop):

- Each of the four posts shows its cover between the header and the body, full width, rounded with the hairline border, no layout shift while loading, no visible compression artefacts that hurt the image.
- No recognisable face, brand, logo or readable sign in any cover at full size (the café jars' label shapes must stay unreadable).
- View source: og:image and twitter:image are the 1200 px `/_astro/*.jpg` of the cover; `Article.image` matches.
- The alt text is announced by a screen reader and describes the image.

**ADRs relied on:** 0019 (covers only through `cover` and `astro:assets`, files in `src/assets/blog/`, guard check-seo-25), 0017 (dates from content, never bumped without a content change), 0020 (blog content pipeline, whose step 3 is aligned). No new ADR.

## Risks / Trade-offs

- [Weight margin] The GEO cover measures 91 KB fallback JPEG at q60 in scratch; Astro's encoder settings could differ slightly. → `check-seo-25` decides; if it fails, move that crop to a less detailed region and record the new box (still the same still).
- [Quality 60 for future covers] The setting applies to every future post cover. → Acceptable for photographic covers; the guard still protects weight, and the pipeline skill notes the crop rule.
- [Library outside the worktree] The developer reads `social/mediateca` from the main checkout. → Read-only, path resolved from the shared git dir, stop on any missing file; nothing in `social/` is modified or committed.
- [Topic fit of the GEO cover] A generic neighbourhood business illustrates the post's "your local business" angle but not AI itself. → Owner veto in the PR leads to an attended Flow generation in a follow-up.
- [Repository size] About 450 KB of JPEG sources. → Within normal limits for content images.

## UI spec

Scope: no new markup, component or style. The cover slot built in NRD-328 (`src/layouts/BlogPostLayout.astro`, `figure.post-cover`, lines 87-102 and styles 138-153) is filled for the four posts. What this spec fixes is the art direction of each crop, the alt copy rules and the states, so the developer, `ux-review` and QA check the same thing. Mode: Read (the cover supports the article; it never competes with the title).

### Post cover (all four posts)

1. **Screens and layout.** Routes `/blog/como-aparecer-en-google-maps-negocio-sevilla/`, `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`, `/blog/pagina-web-para-restaurantes-que-necesita/`, `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`. Order inside `article` stays: breadcrumbs, `header.post-header` (title, lede, meta, hairline rule), `figure.post-cover`, `[data-post-body]`. The cover is full width of `SectionContainer` (`src/components/SectionContainer.astro`: `md:max-w-2xl`, `lg:max-w-4xl`), 16:9. No change to `/blog/` listing or cards (Non-Goal).
2. **Hierarchy.** The `h1` stays the first and strongest element; the cover sits below the header rule as a quiet establishing image, then the body. No text, badge, gradient, overlay or button over the image.
3. **States.**
   - Loading: the `img` reserves its 16:9 box from its `width`/`height` attributes, filled with `--card-surface` (`src/styles/template.css`), so nothing below moves. No skeleton, spinner or fade-in.
   - Image fails at runtime: the browser shows the alt over `--card-surface` inside the same bordered box; acceptable, no custom error UI.
   - Missing source file or oversize output: a build failure (`astro:assets`, `check-seo-25`), never a visible state.
   - Post without `cover` (future posts): markup identical to today (spec "Post without a cover").
   - Empty, partial, disabled, success: n/a (static image).
4. **Copy.** The only new copy is the four alt texts in the Decisions mapping table, used verbatim. Rules every alt (and every future cover alt) follows: Spanish, one descriptive phrase of 5-20 words, starts with the main subject, no "Imagen de"/"Foto de" prefix, no keywords, place names or brand that are not visible in the image, no final period, at most one comma, different from the title. No `figcaption` and no visible credit line. Assumption: the image is illustrative and its source is recorded in `src/assets/blog/credits.json`; a caption would add a second lede under the header.
5. **Design system reuse.** Existing tokens and styles only: `--hairline` 1px border, image radius 0.9rem (`DESIGN.md` `rounded.image`), `--card-surface` placeholder, `margin: 0 0 2.5rem` below the figure. Flat depth: no shadow, no glow, no CSS filter, no darkening or tint layer on the photos (Hairline Depth Rule). Components: Astro `Picture`/`getImage` from `astro:assets`, already wired. New component: none.
6. **Responsive.** One crop for every width, no art direction per breakpoint (no `media` sources). Rendered width: 320 px viewport -> 288 px (162 px tall); 640 px -> 640 px; 768 px -> 672 px; 1024 px and up -> 896 px, matching the existing `sizes`. Because the image can be as small as 288x162 px, each crop keeps its subject large and central (see framing below), never a small subject in a wide scene. No horizontal overflow at 320 px.
7. **Interactions.** None: the cover is not a link, not zoomable, no hover, no transition, no lightbox. Assumption: a static editorial image, consistent with the single authored motion moment allowed by `DESIGN.md`.
8. **Accessibility hand-off.** The `img` keeps the alt from frontmatter (informative image, not `alt=""`): the alt is read right after the meta line and before the body. Not focusable; focus order unchanged. Nothing async to announce.
9. **GEO-ready content.** The cover adds no section, heading or date. `pubDate`/`updatedDate` stay unchanged, so the visible "Actualizado el" line does not appear or move because of this story. The alt names no brand; nothing hidden is added.

### Crop framing per post

The crop box is `left: 0, width: 1536, height: 864` on the 1536x2752 still; only `top` changes. The `top` values are the ones decided in Decisions; the developer may fine-tune by eye within the ranges below and records the final box in `credits.json`. Framing rule for all four: what the table lists as "must be whole" is fully inside the frame; nothing the alt mentions is cut away so far that it stops being recognisable; no readable label, sign, screen text, face or logo enters the frame.

| Post | Still | Must be whole in frame | Must stay out | `top` range (original px) |
|---|---|---|---|---|
| Google Maps | `busqueda-movil-mano-calle-v-20261119-02` | the lit phone including its top and bottom edges, the hand holding it | nothing readable exists in this still | 1150 as decided (range 1120-1180); 1220 would cut the phone's top edge |
| Prices | `busqueda-movil-manos-cafe-v-20261119-01` | the whole cup with its rim and saucer, both hands clearly holding the phone; the bottom of the phone may leave the frame | none readable (notebook pages are blank) | 580 as decided (range 560-600); at 700 or more the cup rim is cut |
| Restaurant | `negocio-local-barra-cafe-v-20261119-03` | the espresso machine with its steam, the glass dome with pastries, the marble counter edge | the labelled jars on the top shelf (y about 500-690) and the machine's tiny red display legible as digits | 1050-1180 (design 1130 fits) |
| GEO | `negocio-local-peluqueria-v-20261119-02` | both black chairs' backs and seats, the mirrors, the counter with tools | no readable bottles or labels (none at full size) | 1200-1300 (design 1270 fits); chair bases may be cut at the bottom |

QA checks at 375 px and desktop are the design's "Real-browser / e2e checks"; add: at 375 px each cover shows what its row lists as "must be whole".
