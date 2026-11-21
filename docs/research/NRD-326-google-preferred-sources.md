# NRD-326: Google "Preferred Sources" button for the blog

Date of analysis: 2026-11-21. Story NRD-326, subtask NRD-333. Documentation only: nothing under `src/`, `public/`, `scripts/` or `tests/` changes, and the PRD is untouched.

## 1. Summary

**Recommendation: qualified go, deeplink variant only; no-go for the JavaScript button until the owner approves a new external origin.** Google documents preferred sources for Top Stories, AI Overviews and AI Mode, in all languages and locales where those features exist (Spanish and Spain included, by that wording), but states no ranking effect beyond "more likely to appear" for users who selected the site, and says nothing about Discover. The JavaScript button needs `https://news.google.com` in `script-src`, which is a new external service (PRD section 9) and the owner's decision; the documented deeplink is a plain `<a href>` to `www.google.com`, loads nothing on our pages, needs no CSP change and sets nothing before consent. The benefit is small and unproven for a local-services blog of 4 posts (Top Stories eligibility for non-news sites is not documented), and the site still has to be confirmed in the source preferences tool, which could not be checked without a browser session. So the cost is one link and one test, and it is worth doing only if that confirmation passes; otherwise do not implement anything.

## 2. Sources

All fetched read-only with `curl` on 2026-11-21; no sign-in anywhere.

| Title                                                                                  | URL                                                                         | Publisher                 | Published / last updated                              | Date read  |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------- | ---------- |
| Help your readers find your site through preferred sources in Google Search (the guide) | https://developers.google.com/search/docs/appearance/preferred-sources      | Google Search Central     | Last updated 2026-09-18 (first added 2026-01-30)      | 2026-11-21 |
| Search Central "What's new" / documentation updates                                    | https://developers.google.com/search/updates                                | Google Search Central     | Page updated 2026-11-18; entries dated below          | 2026-11-21 |
| How to select your preferred sources in Top Stories in Search (announcement)           | https://blog.google/products-and-platforms/products/search/preferred-sources/ | Google (The Keyword)      | Published 2025-08-12 (US and India launch)            | 2026-11-21 |
| Google Discover documentation                                                          | https://developers.google.com/search/docs/appearance/google-discover        | Google Search Central     | Last updated 2026-03-09                               | 2026-11-21 |
| AI features and your website                                                           | https://developers.google.com/search/docs/appearance/ai-features            | Google Search Central     | Last updated 2025-12-10                               | 2026-11-21 |
| Library served by the embed code (`publisher.js`), read as text only, not executed     | https://news.google.com/swg/js/v1/publisher.js                              | Google                    | Not dated                                             | 2026-11-21 |

Dated milestones from the documentation updates page: 2026-01-30 preferred sources documentation added; 2026-04-30 extended to all languages where Google Search is available; 2026-05-27 extended to AI Overviews and AI Mode; 2026-08-20 "New custom button for preferred sources" (the interactive button). The story text dates the button to August 2026, which matches; the underlying feature itself dates from August 2025.

Not reached: the Google Search Help article the announcement points to as "this dedicated help center" has no URL I could verify (a guessed help URL returned 404 and was discarded), and the source preferences tool page returns no readable content to `curl` (it needs a browser session). Neither is used as evidence.

## 3. Mechanism

Three methods, per the guide. None is required to appear as a preferred source ("It's not required to do them in order to appear as a preferred source").

1. **Standard JavaScript implementation (recommended).** Two lines, quoted from the guide:

   ```html
   <script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
   <div google-add-preferred-source-btn></div>
   ```

   The `<script>` goes "preferably in the `<head>`"; the `<div>` goes where the button should appear. Optional attributes: `data-theme="light|dark"` (default light) and `data-lang="<code>"` (default: the user's browser language; a downloadable list of supported codes is linked from the guide). The guide says the button lets readers add the site and "returns them to your page".
2. **Advanced JavaScript implementation with custom design assets.** Same library, own UI: `preferred-sources-control="manual"` on the script tag, then either the global `PREFERRED_SOURCE` callback queue (needs an inline `<script>`, which our CSP forbids, unless moved to `src/scripts/*.js`) or an ES module import from `https://news.google.com/swg/js/v1/publisher.mjs`. Calls: `preferredSource.init({theme, lang})` and `preferredSource.addPreferredSource()`.
3. **Deeplink implementation.** For sites that cannot run the button. Format: `https://www.google.com/preferences/source?q=<site URL or domain>`. The guide's examples are a text link and a clickable image link (`<a href="https://www.google.com/preferences/source?q=example.com">Add as Preferred Source</a>`), and says the deeplink can also go in social posts, newsletters and promotions. Official translated button images are downloadable.

**Where it may be placed:** anywhere on the page; the guide gives no placement restriction. Only domain-level and subdomain-level sites are eligible in the source preferences tool; a subdirectory such as `https://www.example.com/blog` is not. For us the eligible unit would be `nuriaromero.dev` as a whole, not `/blog`.

## 4. Requirements and availability

| Topic | What Google states | Our case |
| ----- | ------------------ | -------- |
| Eligibility | The site must appear in the source preferences tool (check by entering it in the tool's search box). Domain or subdomain only. | Not verified: the tool needs a browser session. To check manually before any work. |
| AI surfaces | "you must make sure your site is included in Search generative AI features in Search Console". | Not checked (Search Console setting; no access here). |
| Languages and countries | Top Stories: "available globally ... in all languages where Google Search is available". AI Mode and AI Overviews: "in all languages and locales where those features are available". | Spanish and Spain are covered by that wording; no country list or Spain-specific page exists. The 2025 announcement named only the US and India for the original launch; the later documentation updates superseded that. |
| Content freshness | The announcement says selected sources appear "when those sources have published fresh and relevant content for your search". No numeric threshold or cadence. | Not documented as a number. |
| News status | The guide does not require Google News or news-publisher status; it also does not say that non-news sites get Top Stories. | Not documented. |
| Effect on ranking | Only: content is "more likely to appear" in Top Stories "highlighted with a 'preferred' badge" for users who selected the site; in AI Mode and AI Overviews content "can be highlighted" for those users. Announcement: selected sources appear "more frequently in Top Stories or in a dedicated 'From your sources' section". | The effect is per user who opted in, not a general ranking signal. Size of effect: not documented. |

## 5. Surfaces

| Surface | Status | Source |
| ------- | ------ | ------ |
| Top Stories | Confirmed, with a "preferred" badge, all languages | Guide, "Feature availability" |
| AI Overviews | Confirmed (badge for users who selected the site), all languages and locales where the feature exists | Guide; update of 2026-05-27 |
| AI Mode | Confirmed, same wording | Guide; update of 2026-05-27 |
| "From your sources" section on the results page | Confirmed (mentioned in the announcement) | The Keyword, 2025-08-12 |
| Discover | **Not documented.** The word does not occur in the preferred sources guide body, and the Discover documentation (updated 2026-03-09) does not mention preferred sources. Not confirmed and not denied. | Guide and Discover documentation, read in full on 2026-11-21 |

## 6. What it loads, and fit with the CSP and consent

Current CSP (`public/_headers`): `default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://formspree.io https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'none'; object-src 'none'`, with no `frame-src`. Analytics load only after consent (`src/scripts/analytics-consent.js`).

| Variant | Third-party load on our pages | CSP change | Consent |
| ------- | ----------------------------- | ---------- | ------- |
| Standard JS button | Script from `https://news.google.com` (static reading of `publisher.js` shows it builds elements with `createElement` and references `news.google.com` and `subscribe.google.com`). | `script-src` must add `https://news.google.com`. Any further directive (`connect-src`, `frame-src`, `img-src`, `style-src`) depends on runtime requests that I could not observe. | Unknown. Google does not document whether the library sets cookies or reads storage before the click. A first-party consent gate (load the script only after consent) would be our own decision, not Google's. |
| Advanced JS | Same origin; also needs `publisher.mjs` or the callback queue. The inline callback queue is blocked by our CSP, so it would have to live in `src/scripts/*.js`. | Same, plus `script-src` for the module if used. | Same unknown. |
| Deeplink (text or image link) | None until the reader clicks. A text link loads nothing; a clickable image would need `img-src` only if hosted off our origin (we would self-host it). | None. | Nothing runs on our page. Observation by `curl` of the target on `www.google.com`: it replies 200 and sets a Google cookie on google.com, which is Google's own origin and applies to the reader's visit to Google, not to our page. |

Limit of this analysis: the design asked for loading the official code once in a throwaway HTML file in a real browser, to list requests and cookies in DevTools. No browser was opened in this run, so the runtime behaviour of the JS button (requests, cookies, storage, whether it uses an iframe) is **not verified**. Static reading of a 140 kB minified file is not a substitute and is not used for any claim above beyond the origins it mentions.

## 7. Blog fit

- `src/content/blog/` has 4 posts: `como-aparecer-en-google-maps-negocio-sevilla` (pub 2026-07-01, updated 2026-11-18), `pagina-web-para-restaurantes-que-necesita` (2026-06-24), `cuanto-cuesta-una-pagina-web-en-sevilla` (2026-07-07, updated 2026-11-19), `que-es-geo-posicionamiento-ia-negocios-sevilla` (2026-09-21).
- No fixed cadence; the last new post is 2 months old, though two posts were refreshed this week.
- Google gives no minimum cadence, so whether this counts as "fresh and relevant" is not documented. The blog is a local-services blog, not a news site; whether it ever surfaces in Top Stories is not documented. The most plausible surfaces for us are AI Overviews and AI Mode, where the guide does not mention a news requirement either, but the effect is only for readers who already chose us.
- The domain is eligible in principle (domain-level site), but the source preferences tool lookup is pending.

## 8. Video claims

Source: https://youtube.com/shorts/75HklYG80jk. The page served to `curl` has no readable title, description or transcript, so the claims below are taken from the story text, and each is checked only against Google's own pages.

| Claim | Status | Official source |
| ----- | ------ | --------------- |
| The button exists and lets a reader add a site as a preferred source | Confirmed | Guide; update of 2026-08-20 |
| It is a short setup (the video presents "three steps") | Partly confirmed: Google documents two lines of HTML for the standard button (script tag plus `div`); the "three steps" are not an official count | Guide, standard JavaScript implementation |
| It boosts Discover | **Unconfirmed.** Not documented by Google for Discover; not denied either | Guide and Discover documentation (no mention) |
| It applies to Top Stories, AI Overviews and AI Mode | Confirmed | Guide; updates of 2026-05-27 and 2026-04-30 |
| It improves ranking in general | Unconfirmed. Google states only more likely to appear, with a badge, for users who selected the site | Guide |

## 9. Follow-up story (proposed, if the owner accepts the deeplink)

To be filed by the PO; any third-party script or CSP change is the owner's decision (PRD section 9). This story deliberately uses the deeplink, so it needs no CSP change and no new external service in the page; if the owner prefers the JS button, a separate story must first record that decision.

**Title:** [SEO] Add an "Add as Preferred Source" deeplink to blog posts

**Why:** Readers who select nuriaromero.dev as a preferred source see its content more often with a badge in Top Stories, AI Overviews and AI Mode (Google, updated 2026-09-18). The effect size is not documented, so the change must stay minimal.

**Prerequisite (manual, 2 minutes, before any code):** open the source preferences tool in a browser and confirm `nuriaromero.dev` appears when searched; confirm in Search Console that the site is included in Search generative AI features. If either fails, close the story without implementing.

**Scope**

- One plain link at the end of `src/layouts/BlogPostLayout.astro` (after the article body, before related links), with Spanish copy such as "Añádenos como fuente preferida en Google", `href="https://www.google.com/preferences/source?q=nuriaromero.dev"`, `rel="noopener"` and `target="_blank"`.
- No script, no iframe, no external image (if an image is wanted, self-host a Google asset under `public/` and add alt text).
- No change to `public/_headers`, no analytics event.

**Privacy and CSP notes:** the link loads nothing until clicked; the destination is Google's own page. No consent gating needed; no new CSP origin.

**Acceptance criteria**

1. Every blog post page contains exactly one link to `https://www.google.com/preferences/source?q=nuriaromero.dev`, visible and keyboard accessible.
2. A case in `tests/blog-post-template.test.js` fails if the link is removed from `BlogPostLayout.astro` or points to another URL.
3. A new `scripts/check-seo-25.mjs` (next free number; wire it into `pnpm check:seo`) fails the build if a built blog post lacks the link, or if any built page contains `news.google.com/swg`.
4. `public/_headers` is unchanged and `pnpm build` and `pnpm check:seo` pass.
5. Measure after 4 weeks: if no effect can be seen, remove the link.
