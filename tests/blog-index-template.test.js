import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const page = read("src/pages/blog/index.astro");
const templatePages = read("scripts/lib/template-pages.mjs");

// --- /blog/ on the template (NRD-221 / NRD-224) ------------------------------

test("/blog/ is registered as a template page without Service", () => {
  assert.match(
    templatePages,
    /route:\s*"\/blog\/",\s*words:\s*\[150,\s*350\],\s*service:\s*false/,
  );
});

test("main uses the ink ground and the sections come in order", () => {
  assert.match(page, /<main class="template-ground[^"]*"/);
  const order = [
    "<Breadcrumbs",
    "<SeoLocalHero",
    "<SectionHeading",
    "<SeoLocalClosing",
  ].map((tag) => page.indexOf(tag, page.indexOf("<main")));
  assert.ok(
    order.every((i) => i > -1),
    "all template components used",
  );
  assert.deepEqual(
    [...order].sort((a, b) => a - b),
    order,
  );
});

test("legacy blocks are removed", () => {
  assert.doesNotMatch(page, /text-gray-|bg-gray-|border-gray-/);
  assert.doesNotMatch(page, /→/);
  assert.doesNotMatch(page, /<h1/);
  for (const name of [
    "SeoLocalFaq",
    "ProofStrip",
    "SeoLocalPlans",
    "ReviewBento",
  ])
    assert.doesNotMatch(page, new RegExp(name));
});

test("schema is the breadcrumb list only", () => {
  assert.match(page, /schema=\{breadcrumbSchema\(breadcrumbs\)\}/);
  assert.doesNotMatch(page, /serviceSchema|faqSchema/);
});

test("posts render as h3 title links with their own description and date", () => {
  assert.match(
    page,
    /<h3[^>]*>\s*<a[^>]*href=\{`\/blog\/\$\{post\.slug\}\/`\}[^>]*>\s*\{post\.data\.title\}/,
  );
  assert.match(page, /post\.data\.description/);
  assert.match(page, /post\.data\.pubDate/);
});

// --- Built page (needs dist/) ------------------------------------------------

const built = existsSync(new URL("dist/blog/index.html", root));

const publishedPosts = () =>
  readdirSync(new URL("src/content/blog/", root))
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const src = read(`src/content/blog/${f}`);
      const front = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      return {
        slug: f.replace(/\.md$/, ""),
        draft: /^draft:\s*true\s*$/m.test(front),
        pubDate: new Date(
          front.match(/^pubDate:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1],
        ),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.pubDate - a.pubDate);

test(
  "built page has one H1 starting with Blog and no Service or FAQ",
  { skip: !built },
  () => {
    const html = read("dist/blog/index.html");
    const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) ?? [];
    assert.equal(h1s.length, 1);
    assert.match(h1s[0], />\s*Blog\b/);
    assert.doesNotMatch(html, /"@type":\s*"Service"|FAQPage/);
  },
);

test(
  "built page lists every non-draft post once, newest first",
  { skip: !built },
  () => {
    const html = read("dist/blog/index.html");
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    const hrefs = [...main.matchAll(/href="(\/blog\/[^"/]+\/)"/g)].map(
      (m) => m[1],
    );
    const expected = publishedPosts().map((p) => `/blog/${p.slug}/`);
    assert.ok(expected.length > 0);
    assert.deepEqual(hrefs, expected);
  },
);

test(
  "built page keeps main between 150 and 350 words",
  { skip: !built },
  async () => {
    const { mainWordCount } = await import(
      new URL("scripts/lib/page-contract.mjs", root).href
    );
    const words = mainWordCount(read("dist/blog/index.html"));
    assert.ok(words >= 150 && words <= 350, `${words} words`);
  },
);
