import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const distDir = new URL("../dist/", import.meta.url);
const astroDir = new URL("../dist/_astro/", import.meta.url);
const hasBuild = existsSync(new URL("index.html", distDir));

test(
  "no built CSS inlines a font as a data URI",
  { skip: !hasBuild && "dist/ not built" },
  () => {
    const cssFiles = readdirSync(astroDir).filter((f) => f.endsWith(".css"));
    assert.ok(cssFiles.length > 0, "expected CSS files in dist/_astro");
    const offenders = cssFiles.filter((file) => {
      const css = readFileSync(new URL(file, astroDir), "utf-8");
      return (
        /data:font\//i.test(css) || /data:application\/(x-)?font/i.test(css)
      );
    });
    assert.deepEqual(
      offenders,
      [],
      "fonts must be emitted as files (font-src 'self')",
    );
  },
);

test("CSP keeps font-src 'self' without data:", () => {
  const headers = readFileSync(
    new URL("../public/_headers", import.meta.url),
    "utf-8",
  );
  const match = headers.match(/font-src([^;\n]*)/);
  assert.ok(match, "font-src directive present");
  assert.equal(match[1].trim(), "'self'");
});
