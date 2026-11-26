import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { mainContent, visibleText } from "../scripts/lib/main-links.mjs";
import { bookingUrl } from "../src/data/site.ts";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const layout = read("src/layouts/BlogPostLayout.astro");
const markup = layout.slice(layout.lastIndexOf("---") + 3);
const article = markup.slice(
  markup.indexOf("<article"),
  markup.indexOf("</article>"),
);

// --- Source (NRD-222 / NRD-226) ----------------------------------------------

test("legacy components and gray styles are gone", () => {
  for (const legacy of [
    "CTASection",
    "InternalLinks",
    "EntryContentStyles",
    "text-gray-",
    "bg-gray-",
    "border-gray-",
  ]) {
    assert.ok(!layout.includes(legacy), `layout still uses ${legacy}`);
  }
});

test("main uses the template ground", () => {
  assert.match(layout, /<main class="template-ground[^"]*"/);
});

test("related links come from internalLinksBySource and the closing comes after", () => {
  const related = layout.indexOf("<SeoLocalRelated");
  const closing = layout.indexOf("<SeoLocalClosing");
  assert.ok(related > -1 && closing > related);
  assert.match(layout, /internalLinksBySource\[url\]/);
});

test("exactly one H1 holding the title", () => {
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
  assert.match(markup, /<h1\b[^>]*>\s*\{title\}\s*<\/h1>/);
});

test("the body marker sits inside the article", () => {
  assert.ok(article.includes("data-post-body"));
  assert.ok(article.includes("<slot"));
});

test("header keeps the author, dates and update date condition", () => {
  assert.ok(article.includes('href="/sobre-mi/"'));
  assert.ok(article.includes("Nuria Romero Castillo"));
  assert.match(article, /Publicado el/);
  assert.match(article, /Actualizado el/);
  assert.match(article, /updatedDate &&/);
  assert.match(article, /<time datetime=\{pubDate\.toISOString\(\)\}/);
});

test("schema calls and url are kept", () => {
  assert.match(
    layout,
    /articleSchema\(\{\s*title,\s*description,\s*url,\s*pubDate,\s*updatedDate,\s*image,?\s*\}\)/,
  );
  assert.match(layout, /breadcrumbSchema\(breadcrumbs\)/);
  assert.ok(layout.includes("const url = `/blog/${post.slug}/`"));
});

test("the cover renders through astro:assets, only when set (NRD-328)", () => {
  assert.match(layout, /import \{[^}]*\bPicture\b[^}]*\} from "astro:assets"/);
  assert.match(layout, /import \{[^}]*\bgetImage\b[^}]*\} from "astro:assets"/);
  assert.match(markup, /\{cover && \(/);
  assert.match(markup, /formats=\{\["avif", "webp"\]\}/);
  assert.match(markup, /loading="eager"/);
  assert.match(markup, /fetchpriority="high"/);
  assert.match(markup, /data-post-cover/);
  const header = markup.indexOf("</header>");
  const figure = markup.indexOf('<figure class="post-cover"');
  assert.ok(header > -1 && figure > header);
  assert.ok(figure < markup.indexOf("data-post-body"));
});

test("the cover is encoded at quality 60, Picture and share image (NRD-380)", () => {
  const picture = markup.slice(markup.indexOf("<Picture"));
  assert.match(picture.slice(0, picture.indexOf("/>")), /quality=\{60\}/);
  const call = layout.slice(layout.indexOf("getImage({"));
  assert.match(call.slice(0, call.indexOf("})")), /quality: 60\b/);
});

test("the fallback img is capped at the largest generated width (NRD-381)", () => {
  const picture = markup.slice(markup.indexOf("<Picture"));
  const props = picture.slice(0, picture.indexOf("/>"));
  assert.match(props, /width=\{coverWidth\}/);
  assert.match(props, /height=\{coverHeight\}/);
  assert.match(layout, /Math\.min\(cover\.src\.width, 1280\)/);
});

test("prose rules use template tokens, not hardcoded palettes", () => {
  const css = layout.slice(layout.indexOf("<style"));
  assert.match(css, /\.post-prose :global\(h2\)/);
  assert.match(css, /var\(--text-secondary\)/);
  assert.match(css, /var\(--hairline\)/);
  assert.ok(
    !/display:\s*block/.test(
      css.match(/:global\(table\)\s*\{[^}]*\}/)?.[0] ?? "",
    ),
  );
});

// --- Built pages (skipped without dist/; CI builds first, NRD-311) ----------

const dist = new URL("dist/blog/", root);
const slugs = existsSync(dist)
  ? readdirSync(dist, { withFileTypes: true })
      .filter(
        (e) =>
          e.isDirectory() && existsSync(new URL(`${e.name}/index.html`, dist)),
      )
      .map((e) => e.name)
  : [];

for (const slug of slugs) {
  test(`built post ${slug}: one H1 equal to the title, closing with booking`, (t) => {
    const html = readFileSync(new URL(`${slug}/index.html`, dist), "utf8");
    const main = mainContent(html);
    const h1 = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    assert.equal(h1.length, 1);
    const front = read(`src/content/blog/${slug}.md`).match(
      /^title:\s*"(.*)"\s*$/m,
    );
    assert.equal(visibleText(h1[0][1]), front[1]);
    const lastSection = main.slice(main.lastIndexOf("<section"));
    assert.ok(
      lastSection.includes("closing"),
      "last section is the closing band",
    );
    assert.ok(
      lastSection.includes(bookingUrl.split("?")[0]),
      "closing holds the booking link",
    );
  });
}

const builtPost = (slug) => {
  const file = new URL(`${slug}/index.html`, dist);
  return existsSync(file) ? readFileSync(file, "utf8") : null;
};

test("built price post wraps its rates table in a scroll region (NRD-304)", (t) => {
  const html = builtPost("cuanto-cuesta-una-pagina-web-en-sevilla");
  if (!html) return t.skip("dist/ not built");
  assert.match(html, /<div class="table-scroll"[^>]*>\s*<table/);
});

test("built GEO post keeps its table unwrapped (NRD-304)", (t) => {
  const html = builtPost("que-es-geo-posicionamiento-ia-negocios-sevilla");
  if (!html) return t.skip("dist/ not built");
  assert.ok(html.includes("<table"), "GEO post table missing");
  assert.ok(!html.includes('class="table-scroll"'));
});

// --- Table borders (NRD-232) ---------------------------------------------------

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const token = (name) =>
  read("src/styles/template.css").match(
    new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`),
  )?.[1];

test("table cell borders use the hairline-strong token", () => {
  const css = layout.slice(layout.indexOf("<style"));
  const rule = css.match(
    /\.post-prose :global\(th\),\s*\.post-prose :global\(td\)\s*\{[^}]*\}/,
  )?.[0];
  assert.ok(rule, "th/td rule not found");
  assert.match(rule, /border:\s*1px solid var\(--hairline-strong\)/);
});

test("right-aligned table cells never wrap (NRD-298)", () => {
  const css = layout.slice(layout.indexOf("<style"));
  const rule = css.match(
    /\.post-prose :global\(th\[align="right"\]\),\s*\.post-prose :global\(td\[align="right"\]\)\s*\{[^}]*\}/,
  )?.[0];
  assert.ok(rule, 'rule for td[align="right"] not found');
  assert.match(rule, /white-space:\s*nowrap/);
});

test("tables with right-aligned cells scroll inside a focusable region (NRD-304)", () => {
  const css = layout.slice(layout.indexOf("<style"));
  const rule = css.match(
    /\.post-prose :global\(\.table-scroll\)\s*\{[^}]*\}/,
  )?.[0];
  assert.ok(rule, ".table-scroll rule not found");
  assert.match(rule, /overflow-x:\s*auto/);
  assert.match(rule, /max-width:\s*100%/);
  const focus = css.match(
    /\.post-prose :global\(\.table-scroll:focus-visible\)\s*\{[^}]*\}/,
  )?.[0];
  assert.ok(focus, ".table-scroll:focus-visible rule not found");
  assert.match(focus, /outline:\s*2px solid var\(--sky-signal\)/);
  assert.doesNotMatch(css, /\.table-scroll[^{]*\{[^}]*min-width/);
});

test("hairline-strong reaches 3:1 on ground and card surfaces", () => {
  const strong = token("hairline-strong");
  assert.ok(strong, "--hairline-strong missing in template.css");
  assert.ok(contrast(strong, token("ink-ground")) >= 3);
  assert.ok(contrast(strong, token("card-surface")) >= 3);
});

// --- Prose rules for quote, code, code block and image (NRD-233) -------------

const proseRule = (selector) => {
  const css = layout.slice(layout.indexOf("<style"));
  const start = css.indexOf(`.post-prose :global(${selector}) {`);
  assert.ok(start > -1, `rule for ${selector} not found`);
  return css.slice(start, css.indexOf("}", start) + 1);
};

test("Shiki uses the github-dark-dimmed theme", () => {
  assert.match(
    read("astro.config.mjs"),
    /shikiConfig:\s*\{\s*theme:\s*["']github-dark-dimmed["']/,
  );
});

test("quote, code, code block and image rules exist with their guards", () => {
  proseRule("blockquote");
  proseRule(":not(pre) > code");
  const pre = proseRule("pre");
  assert.match(pre, /overflow-x:\s*auto/);
  assert.match(pre, /max-width:\s*100%/);
  assert.match(pre, /background-color:\s*var\(--card-surface\)\s*!important/);
  proseRule("pre:focus-visible");
  const img = proseRule("img");
  assert.match(img, /max-width:\s*100%/);
  assert.match(img, /height:\s*auto/);
});

test("the new prose rules use tokens only, no loose colours", () => {
  for (const selector of [
    "blockquote",
    ":not(pre) > code",
    "pre",
    "pre:focus-visible",
    "img",
  ]) {
    const body = proseRule(selector);
    assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(body), `${selector} has a hex`);
    assert.ok(!/rgba?\((?!var\()/.test(body), `${selector} has a raw rgb`);
  }
});
