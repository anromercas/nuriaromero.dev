---
name: nuriaromero.dev
description: Dark ink-blue service pages where single-stroke sky-blue drawings explain the work and yellow marks the one recommended choice.
colors:
  ink-ground: "#050a18"
  ink-band: "#081024"
  ink-closing: "#070e20"
  card-surface: "#080f20"
  card-surface-recommended: "#0c1428"
  drawing-surface: "#0f172a"
  site-ground: "#030712"
  hairline: "#334155"
  hairline-quiet: "#1e293b"
  sky-signal: "#38bdf8"
  sky-accent: "#7dd3fc"
  yellow-recommend: "#facc15"
  yellow-ink: "#111827"
  text-strong: "#ffffff"
  text-body: "#e2e8f0"
  text-secondary: "#cbd5e1"
  text-muted: "#94a3b8"
  drawing-soft: "#475569"
  action-blue: "#3b82f6"
  action-blue-border: "#60a5fa"
typography:
  display:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  accent:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.12em"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 650
    lineHeight: 1.25
  stat:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  card: "1.25rem"
  image: "0.9rem"
  control: "0.5rem"
  pill: "9999px"
spacing:
  section-gap: "6rem"
  band-pad: "3rem"
  closing-pad: "4rem"
  card-pad: "1.5rem"
  tile-gap: "1rem"
components:
  card:
    backgroundColor: "{colors.card-surface}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  plan-recommended:
    backgroundColor: "{colors.card-surface-recommended}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  badge-recommended:
    backgroundColor: "{colors.yellow-recommend}"
    textColor: "{colors.yellow-ink}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.7rem"
  chip:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.7rem"
  button-booking:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.text-strong}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
---

# Design System: nuriaromero.dev

## Overview

**Creative North Star: "The Annotated Storefront"**

A dark ink-blue room where a local business is explained by drawing it. Pages read as a quiet working document: confident bold sans headlines, one italic serif phrase per heading, and hand-built single-stroke SVG illustrations in sky blue that show the thing (a Google listing, a map, a review cycle) instead of describing it with icons. Cards are calm dark panels with a hairline; nothing glows except a single soft sky halo behind the hero drawing and the closing band.

Density is moderate and editorial: wide section gaps (6rem), copy capped near 65ch, asymmetric compositions instead of equal grids. Honesty is a visual rule as much as a copy rule: illustrations are labelled as examples, proof is real or absent.

This is the reference direction for new and revised pages. The system was recorded from the shipped SEO local page (`/seo-local-sevilla`).

**Key Characteristics:**
- Ink-blue grounds, sky-blue strokes, yellow only for "recommended" and real star ratings.
- Instrument Serif italic on exactly one phrase per heading, in sky-accent; everything else is Onest.
- Illustration is line work (1.5 stroke, round caps and joins, `currentColor`), never filled icon sets.
- Flat depth: hairline borders and tonal surface steps, no drop shadows.
- Completed state is the default; one authored scroll moment at most.

## Colors

Near-black navy grounds, slate text steps, one cool signal hue and one warm reserved hue.

### Primary
- **Sky Signal** (`sky-signal`): drawing strokes, check marks, accordion indicators, timeline line/dots, focus outlines, hover borders. The "this is the part that matters" stroke.
- **Sky Accent** (`sky-accent`): the single italic serif phrase in each heading, text links, link hover, and the hero storefront line.

### Secondary
- **Recommend Yellow** (`yellow-recommend`): border, badge fill and check marks of the one recommended plan; filled stars on a real Google review. Nowhere else on these pages. Badge text uses `yellow-ink`.

### Neutral
- **Ink Ground** (`ink-ground`): the page ground for the route (applied on `main`) with a faint sky radial at the top (sky-signal at 10% alpha, ellipse 80% x 30%).
- **Ink Band** (`ink-band`, at 85% alpha) and **Ink Closing** (`ink-closing`): full-bleed bands separated by `hairline-quiet` rules. Used to alternate rhythm, not to decorate.
- **Card Surface** / **Card Surface Recommended**: the panel fill for cards, tiles, quote and listing; the recommended plan steps one tone lighter.
- **Drawing Surface**: the storefront illustration header only.
- **Hairline** (`hairline`) for card and list borders; **Hairline Quiet** for band edges and internal dividers.
- **Text**: `text-strong` for headings and key figures, `text-body` section default, `text-secondary` paragraphs, `text-muted` captions and meta, `drawing-soft` for de-emphasised illustration strokes.
- **Site Ground** (`site-ground`): the global body ground from Layout (gray-950) under the page ground.
- **Action Blue** (`action-blue` fill, `action-blue-border` border): the shared booking button, inherited from the older site; the only solid-fill control.

### Named Rules
**The Reserved Yellow Rule.** Yellow means "recommended" or "a real star rating". It never decorates, highlights copy, or appears as a second accent on this world.
**The One Serif Phrase Rule.** Exactly one phrase per heading is set in Instrument Serif italic in `sky-accent`. Never gradient text, never a second accent phrase, never body copy.

## Typography

**Display / Body Font:** Onest Variable (fallback system-ui, sans-serif), set globally in Layout at 106.25% root size.
**Accent Font:** Instrument Serif, italic 400 only (fallback Georgia, serif), imported where used.

**Character:** a confident geometric sans with tight tracking for headlines, and one editorial italic voice that makes the key phrase feel spoken.

### Hierarchy
- **Display** (700, clamp 2.25-3.5rem, 1.04, -0.03em): the single h1, max 16ch, balanced wrap.
- **Headline** (700, clamp 1.9-3rem, 1.06, -0.03em): section h2s, 14-20ch max width; the closing band scales up to 3.75rem.
- **Accent** (400 italic Instrument Serif, 1.12em, -0.01em): the one phrase inside a headline; also the "cada mes" label in the cycle diagram.
- **Title** (650, 1.125-1.25rem): tile, step and plan names.
- **Stat** (650, 1.375rem): proof band figures; plan price at 1.75rem/700.
- **Body** (400, 0.95-1.125rem, 1.6-1.7): paragraphs, max 65ch (48-52ch for lead copy).
- **Label** (0.78-0.9rem, `text-muted`): captions, meta lines, "Ejemplo ilustrativo". Sentence case, no tracking, no uppercase.

### Named Rules
**The Keyword Heading Rule.** Every section opens with a small sentence-case keyword heading (Onest 600, about 1rem, colour slate-300, no uppercase, no letter-spacing, no icon) set directly above the display title. The keyword heading is the real h2 (h1 in the hero) and carries the aria-labelledby id; the display title, with its single serif-italic accent phrase, is a paragraph. Decorative tracked uppercase eyebrows, overlines and 01/02 numbering stay banned.

## Layout

Single-column mobile-first inside the site `SectionContainer`; `main` has 1rem side padding and sections are separated by 6rem (`space-y-24` in ServiceLayout). Breakpoints in use: 640 (proof band goes horizontal), 768 (hero two-column 1.05fr/0.95fr, two-column plans and bento), 1024 (6-column asymmetric bento, process 20rem portrait + fluid column, FAQ 0.8fr/1.2fr with sticky intro).

Alternation: plain sections on `ink-ground`, then full-bleed `.band` sections (`margin-inline: -1rem`, 3rem vertical padding, hairline-quiet top and bottom) for process and plans, and a taller closing band (4rem). Gaps inside compositions: 1rem for tiles, 1.25rem for plans, 2.5-4rem between columns.

### Named Rules
**The Asymmetry Rule.** Groups of peers use unequal spans (bento areas 4+2, 2+4, 2+4, full row; hero 1.05/0.95; FAQ 0.8/1.2), never a grid of identical cards.

## Elevation & Depth

Flat. Depth comes from tonal steps (ground, band, card, recommended card) and 1px hairlines. There are no box-shadows on this world's surfaces. The only light is a blurred sky radial (`sky-signal` at 16-18% alpha) behind the hero drawing and in the closing band, plus the 10% top-of-page wash; it is clipped so it never causes horizontal overflow.

### Named Rules
**The Hairline Depth Rule.** A surface is separated by a tone step and a 1px border, never a shadow. The recommended plan lifts by position (-0.75rem top margin on desktop) and a yellow border, not by shadow.

## Shapes

Soft, rounded containers drawn with a thin line. Cards, tiles, the listing and the quote use 1.25rem corners; portraits 0.9rem; interactive rows 0.5rem; chips, badges, buttons and link pills are fully round. All borders are 1px `hairline`. Illustration geometry uses 1.5 stroke, round caps/joins, rounded rects (rx 3-20), and pill-shaped bars standing in for text.

## Components

### Hero with drawn listing
Left: h1 with the serif phrase, 52ch subtitle, booking button plus an underlined secondary text link (`sky-signal` underline at 70%, `sky-accent` on hover). Right: the Listing mock, a card holding a storefront line drawing, rating row, hours, service chips, three photo thumbnails and a four-item check list, captioned "Ejemplo ilustrativo". Sky halo behind.

### Proof band (three cells)
A row of three figure-plus-label cells between hairlines (no cards, no icons): stat in `text-strong`, label in `text-secondary`. Stacked with top rules on mobile, columns with left rules from 640px. Figures must be true and sourced (e.g. the live Google rating); a cell is omitted when its data is absent.

### Asymmetric bento
Six tiles on a 6-column area map: card surface, 1.25rem corners, 1.25rem padding, an illustration on top (`signal` strokes in sky, `soft` strokes in `drawing-soft`, labels in `text-secondary`), then title and one 65ch sentence. One "Ejemplo ilustrativo" caption with a rule runs under the whole bento rather than per tile.

### Process timeline with portrait and cycle
Portrait (real photo of the owner) in a card beside a vertical 1px sky line with ring dots (`sky-signal` border, ground-filled), then a cycle diagram card: dotted `drawing-soft` ring, sky arcs with arrowheads, ring nodes, labels in `text-body`, an italic serif centre word. The diagram has a visually hidden ordered list equivalent.

### Pull-quote proof
One real review in a card: large `text-strong` quote (1.15-1.5rem), five stars drawn as outlines with yellow fill for the rating, author, relative date and a sky text link to all reviews. Followed by an honest note about not publishing unconfirmed figures, then real project cards. Never invented testimonials or logos.

### Plan cards (two)
Equal-height cards on `card-surface`: name, price at 1.75rem, a hairline, drawn check list (sky checks). The recommended plan swaps to a yellow border, `card-surface-recommended`, yellow checks, a "Recomendado" yellow pill badge, and lifts 0.75rem on desktop. Buttons share one baseline via `margin-top: auto`.

### FAQ (two columns, drawn accordions)
Intro (h2, one line, booking button) sticks left from 1024px; right is a hairline-ruled list of native `details`. Summary is white 600; indicator is a 1.5-stroke drawn plus in `sky-signal` whose vertical stroke disappears when open. Answer opens with a bold lead sentence, then context at 65ch.

### Related links
A top-ruled row of pill links (hairline border, `text-body`; hover turns border to `sky-signal` and text to `sky-accent`).

### Closing band
Full-bleed `ink-closing` band with hairline-quiet edges: large headline with serif phrase, 48ch copy, booking button, a muted meta line, and a static (non-animated) listing mock at right over a 16% sky radial.

### Buttons and focus
The booking button is the site-wide pill: `action-blue` fill, `action-blue-border` border, white text, hover one blue step lighter, ring focus. It stays the single filled control. Text links are underlined. Focus on this world is a 2px `sky-signal` outline with 2-4px offset.

### Motion
One authored scroll-driven moment: the hero listing fills in (stars, photos, checks drawing in) using `animation-timeline: scroll(root)` inside `prefers-reduced-motion: no-preference` and `@supports`. The completed state is the default CSS; a timed fallback exists for browsers without scroll timelines; the closing copy of the mock is `animate={false}`. State transitions are 0.2s with `cubic-bezier(0.16, 1, 0.3, 1)`. No other entrance animation.

## Do's and Don'ts

### Do:
- **Do** draw explanatory visuals as single-stroke SVG (1.5 stroke, round caps/joins, `currentColor`, sky `signal` plus slate `soft` strokes) and label any illustration of a hypothetical result "Ejemplo ilustrativo".
- **Do** set exactly one phrase per heading in Instrument Serif italic, `sky-accent`, 1.12em.
- **Do** reserve yellow for the recommended plan and for real star ratings.
- **Do** make every section default to its completed state; animation only enhances, and respects reduced motion.
- **Do** keep copy honest: real reviews, real client sites, true figures with a visible source, plain business language.
- **Do** vary spans and sizes in groups of peers; end sections with the single next action (booking call).

### Don't:
- **Don't** add decorative tracked uppercase eyebrows, overlines, step numbers or numbered lists. A small sentence-case keyword heading above the display title is required, not a kicker.
- **Don't** use gradient text, glassmorphism, or drop shadows on surfaces.
- **Don't** build grids of equal icon-plus-title-plus-text cards, or nest a card inside a card.
- **Don't** invent metrics, testimonials, client logos, rankings or guarantees of rankings, traffic or leads.
- **Don't** use glyph or icon-font icons in this world; draw them.
- **Don't** introduce a second accent hue or use yellow as general emphasis.

## Known Drift

- **Two styling worlds coexist.** Home, Hero, GoogleReviews and most other pages still use the older Tailwind gray/yellow/blue styling: gray-950 ground with a violet radial (Layout), `bg-gray-900/60` + `border-gray-800` cards, yellow-200/500 bold emphasis in the hero copy, blue-400/600 icons and links, Lucide-style filled/glyph icon components, rounded-2xl cards. This document describes the SEO local page as the reference direction; the rest of the site is not yet migrated and should not be assumed to follow these rules.
- **Shared pieces cross both worlds.** The booking button (blue pill), Header, Footer, WhatsApp button, Breadcrumbs and the `Projects` cards are old-world components rendered inside this page. The gray-950 site ground sits under the ink-blue `main` ground, and the timeline dot fill uses gray-950 rather than an ink token.
- **Page-scoped tokens.** The ink grounds, `.band`, and the serif accent are defined per component and in the route's global style block; there is no shared CSS variable or Tailwind theme (`theme.extend` is empty). Reusing them elsewhere currently means copying values.
- **Sub-token drift inside the page.** Heading `em` styles are copy-pasted per component; label text sizes vary (0.78-0.9rem).
