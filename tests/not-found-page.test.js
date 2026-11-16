import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const { focusServices } = await import("../src/data/services.ts");
const { bookingUrl } = await import("../src/data/site.ts");

const PAGE = "src/pages/404.astro";
const SLUGS = [
  "/seo-local-sevilla/",
  "/diseno-web-sevilla/",
  "/tienda-online-sevilla/",
  "/desarrollo-software-medida/",
  "/automatizaciones/",
  "/inteligencia-artificial/",
];

// --- Source (NRD-223) --------------------------------------------------------

test("focusServices holds exactly the six in-focus slugs, parked pages excluded", () => {
  assert.deepEqual(
    focusServices.map((s) => s.slug),
    SLUGS,
  );
  for (const s of focusServices) {
    assert.ok(!s.slug.includes("clinicas-capilares"));
  }
});

test("the 404 page exists on the template with the three sections in order", () => {
  assert.ok(existsSync(new URL(PAGE, root)), "src/pages/404.astro exists");
  const page = read(PAGE);
  assert.match(page, /<Layout[\s\S]*?\bnoindex\b/);
  assert.match(page, /<main class="template-ground[^"]*"/);
  const order = ["<SeoLocalHero", "<SeoLocalRelated", "<SeoLocalClosing"].map(
    (t) => page.indexOf(t),
  );
  assert.ok(
    order.every((i) => i > -1),
    "all three sections present",
  );
  assert.deepEqual(
    [...order].sort((a, b) => a - b),
    order,
  );
  assert.match(
    page,
    /import \{[^}]*focusServices[^}]*\} from "@\/data\/services"/,
  );
});

test("the 404 page has no container reveal, breadcrumbs, page schema or gray utilities", () => {
  const page = read(PAGE);
  for (const banned of [
    "SectionContainer",
    "Breadcrumbs",
    "Schema",
    "serviceSchema",
    "faqSchema",
    "text-gray-",
  ]) {
    assert.ok(!page.includes(banned), `404 must not use ${banned}`);
  }
});

test("the 404 passes an aria-label equal to the visible label", () => {
  const page = read(PAGE);
  const label = page.match(/label="([^"]+)"/)?.[1];
  assert.ok(label, "related label declared");
  assert.match(page, new RegExp(`ariaLabel="${label}"`));
});

test("SeoLocalRelated takes an optional ariaLabel defaulting to the old name", () => {
  const src = read("src/components/seo-local/SeoLocalRelated.astro");
  assert.match(src, /ariaLabel\?: string/);
  assert.match(src, /ariaLabel = "Contenido relacionado"/);
  assert.match(src, /aria-label=\{ariaLabel\}/);
});

test("SEO.astro renders the canonical only when the page is not noindex", () => {
  const src = read("src/components/seo/SEO.astro");
  assert.match(
    src,
    /\{!noindex && <link rel="canonical" href=\{canonical\} \/>\}/,
  );
});

test("SEO.astro renders og:url only when the page is not noindex", () => {
  const src = read("src/components/seo/SEO.astro");
  assert.match(
    src,
    /\{!noindex && <meta property="og:url" content=\{canonical\} \/>\}/,
  );
});

test("Netlify files do not mention the 404 and no netlify.toml exists", () => {
  assert.ok(!/404/.test(read("public/_redirects")));
  assert.ok(!/404/.test(read("public/_headers")));
  assert.ok(!existsSync(new URL("netlify.toml", root)));
});

test("the 404 is outside templatePages on purpose", async () => {
  const { templatePages } = await import("../scripts/lib/template-pages.mjs");
  assert.ok(!templatePages.some((p) => p.route.includes("404")));
});

test("package.json declares the check-seo-19 pair and chains it last", () => {
  const scripts = JSON.parse(read("package.json")).scripts;
  assert.equal(
    scripts["check:seo-19"],
    "pnpm build && node scripts/check-seo-19.mjs",
  );
  assert.equal(scripts["check:seo-19:dist"], "node scripts/check-seo-19.mjs");
  assert.ok(
    scripts["check:seo:dist"].endsWith(" && node scripts/check-seo-19.mjs"),
  );
  assert.ok(existsSync(new URL("scripts/check-seo-19.mjs", root)));
});

// --- Built output (skipped without dist/404.html) ------------------------------

const built = existsSync(new URL("dist/404.html", root));
const opts = { skip: built ? false : "dist/404.html not built" };

test(
  "built 404: noindex, no canonical, one H1, no Service or FAQPage",
  opts,
  () => {
    const html = read("dist/404.html");
    assert.match(html, /<meta name="robots" content="[^"]*noindex/);
    assert.ok(!/<link rel="canonical"/.test(html));
    assert.ok(!/<meta property="og:url"/.test(html));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.ok(!/"@type":\s*"(Service|FAQPage)"/.test(html));
  },
);

test(
  "built 404: exits to home and every focus service, and booking",
  opts,
  () => {
    const html = read("dist/404.html");
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    for (const href of ["/", ...SLUGS]) {
      assert.ok(main.includes(`href="${href}"`), `main links ${href}`);
    }
    assert.ok(
      main.includes(bookingUrl.replace(/&/g, "&#38;")) ||
        main.includes(bookingUrl),
    );
  },
);

test(
  "built: sitemap and llms.txt do not list the 404; indexable pages keep a canonical",
  opts,
  () => {
    const dist = new URL("dist/", root);
    for (const f of readdirSync(dist).filter((f) =>
      /^sitemap-.*\.xml$/.test(f),
    )) {
      assert.ok(!/\/404/.test(readFileSync(new URL(f, dist), "utf8")), f);
    }
    assert.ok(!/\/404/.test(read("dist/llms.txt")));
    assert.match(read("dist/index.html"), /<link rel="canonical"/);
  },
);

test(
  "built home: og:url equals its canonical",
  { skip: existsSync(new URL("dist/index.html", root)) ? false : "no dist" },
  () => {
    const html = read("dist/index.html");
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    assert.ok(canonical, "canonical present");
    assert.equal(ogUrl, canonical);
  },
);
