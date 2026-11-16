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

// --- Built pages (skipped without dist/, as in CI before the build) ----------

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
