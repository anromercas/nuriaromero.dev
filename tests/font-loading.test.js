import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const distDir = new URL("../dist/", import.meta.url);
const astroDir = new URL("../dist/_astro/", import.meta.url);
const hasBuild =
  existsSync(new URL("index.html", distDir)) && existsSync(astroDir);

const ONEST_WOFF2 =
  "@fontsource-variable/onest/files/onest-latin-wght-normal.woff2";
const SERIF_WOFF2 =
  "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2";

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir);
    if (entry.isDirectory()) walk(url, out);
    else out.push(url);
  }
  return out;
}

test("Layout preloads the two hero woff2 files imported with ?url", () => {
  const layout = read("src/layouts/Layout.astro");
  assert.ok(layout.includes(`${ONEST_WOFF2}?url`), "Onest ?url import");
  assert.ok(
    layout.includes(`${SERIF_WOFF2}?url`),
    "Instrument Serif ?url import",
  );
  const preloads = layout.match(/<link\b[^>]*rel="preload"[^>]*>/g) ?? [];
  const fontPreloads = preloads.filter(
    (tag) =>
      /as="font"/.test(tag) &&
      /type="font\/woff2"/.test(tag) &&
      /\bcrossorigin\b/.test(tag),
  );
  assert.equal(fontPreloads.length, 2, "two font preloads");
});

test("fonts.css declares metric-adjusted local-only fallbacks, imported by Layout", () => {
  const css = read("src/styles/fonts.css");
  const faces =
    css.replace(/\/\*[\s\S]*?\*\//g, "").match(/@font-face\s*\{[^}]*\}/g) ?? [];
  for (const family of ["Onest Fallback", "Instrument Serif Fallback"]) {
    const face = faces.find((f) => f.includes(`"${family}"`));
    assert.ok(face, `${family} declared`);
    for (const d of [
      "size-adjust",
      "ascent-override",
      "descent-override",
      "line-gap-override",
    ]) {
      assert.match(face, new RegExp(`${d}\\s*:\\s*[\\d.]+%`), `${family} ${d}`);
    }
    assert.match(face, /src\s*:\s*local\(/, `${family} src is local()`);
    assert.ok(!/url\(/.test(face), `${family} has no url(`);
    assert.ok(!/data:/.test(face), `${family} has no data:`);
  }
  assert.match(
    read("src/layouts/Layout.astro"),
    /import\s+"@\/styles\/fonts\.css"|import\s+"\.\.\/styles\/fonts\.css"/,
  );
});

test("font stacks put the metric-adjusted fallback right after the web font", () => {
  assert.match(
    read("src/layouts/Layout.astro"),
    /"Onest Variable",\s*"Onest Fallback"/,
  );
  const files = walk(new URL("src/", root)).filter((u) =>
    /\.(astro|css|ts|js|mjs)$/.test(u.pathname),
  );
  let found = 0;
  for (const url of files) {
    const text = readFileSync(url, "utf8");
    for (const m of text.matchAll(/font-family:\s*([^;]+);/g)) {
      if (!m[1].includes('"Instrument Serif"')) continue;
      found++;
      assert.match(
        m[1],
        /"Instrument Serif",\s*"Instrument Serif Fallback"/,
        url.pathname,
      );
    }
  }
  assert.ok(found >= 2, "Instrument Serif stacks found");
});

test(
  "built pages preload the same hashed files their @font-face uses",
  { skip: !hasBuild && "dist/ not built (run pnpm build)" },
  () => {
    for (const page of ["index.html", "inteligencia-artificial/index.html"]) {
      const html = readFileSync(new URL(page, distDir), "utf8");
      // Page CSS is inlined by Astro or linked from dist/_astro/.
      const linked = [
        ...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g),
      ]
        .map((m) => new URL(m[1].split("/").pop(), astroDir))
        .filter((u) => existsSync(u))
        .map((u) => readFileSync(u, "utf8"));
      const css = [html, ...linked].join("\n");
      const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
      const urlsFor = (family) =>
        faces
          .filter((f) => f.includes(family))
          .flatMap((f) => [...f.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)])
          .map((m) => m[1].split("/").pop());
      const onestUrls = urlsFor("Onest Variable");
      const serifUrls = urlsFor("Instrument Serif");
      const hrefs = [
        ...html.matchAll(/<link\b[^>]*rel="preload"[^>]*as="font"[^>]*>/g),
      ].map((m) => m[0].match(/href="([^"]+)"/)?.[1]);
      assert.equal(hrefs.length, 2, `${page}: two font preloads`);
      for (const href of hrefs) {
        const file = href.split("/").pop();
        assert.ok(
          existsSync(new URL(file, astroDir)),
          `${page}: ${href} exists`,
        );
        assert.ok(
          onestUrls.includes(file) || serifUrls.includes(file),
          `${page}: ${file} matches an @font-face url()`,
        );
      }
      assert.ok(
        hrefs.some((h) => onestUrls.includes(h.split("/").pop())),
        `${page}: Onest preload`,
      );
      assert.ok(
        hrefs.some((h) => serifUrls.includes(h.split("/").pop())),
        `${page}: serif preload`,
      );
    }
  },
);
