import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Minimal parser for the Netlify `_headers` format: an unindented line starts a
// block, indented `Name: value` lines belong to it, `#` lines are ignored.
function parseHeaders(text) {
  const blocks = [];
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (/^\s/.test(raw)) {
      const block = blocks[blocks.length - 1];
      const idx = raw.indexOf(":");
      if (!block || idx === -1) continue;
      block.headers.push({
        name: raw.slice(0, idx).trim(),
        value: raw.slice(idx + 1).trim(),
      });
    } else {
      blocks.push({ pattern: raw.trim(), headers: [] });
    }
  }
  return blocks;
}

function hasNoindexToken(block) {
  return block.headers.some(
    (h) =>
      h.name.toLowerCase() === "x-robots-tag" &&
      h.value
        .toLowerCase()
        .split(/[,\s]+/)
        .some((token) => token === "noindex" || token === "none"),
  );
}

// One message per non-private block that carries a noindex/none token.
function noindexViolations(blocks) {
  return blocks
    .filter((b) => b.pattern !== "/informes/*" && hasNoindexToken(b))
    .map((b) => `${b.pattern} sets X-Robots-Tag noindex/none on public paths`);
}

test("a /* block with noindex is a violation naming /*", () => {
  const blocks = parseHeaders("/*\n  X-Robots-Tag: noindex\n");
  const violations = noindexViolations(blocks);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /\/\*/);
});

test("a /blog/* block with none is a violation naming /blog/*", () => {
  const blocks = parseHeaders("/blog/*\n  x-robots-tag: None\n");
  const violations = noindexViolations(blocks);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /\/blog\/\*/);
});

test("only /informes/* with noindex passes", () => {
  const blocks = parseHeaders(
    "# comment\n/*\n  X-Frame-Options: DENY\n\n/informes/*\n  X-Robots-Tag: noindex, nofollow\n",
  );
  assert.deepEqual(noindexViolations(blocks), []);
});

test("token match is exact: nonexistent is not noindex", () => {
  const blocks = parseHeaders("/*\n  X-Robots-Tag: nonexistent\n");
  assert.deepEqual(noindexViolations(blocks), []);
});

const real = parseHeaders(readFileSync("public/_headers", "utf8"));

test("real public/_headers has no noindex outside /informes/*", () => {
  assert.deepEqual(noindexViolations(real), []);
});

test("real /informes/* block keeps a noindex token", () => {
  const informes = real.find((b) => b.pattern === "/informes/*");
  assert.ok(informes, "missing /informes/* block");
  assert.ok(hasNoindexToken(informes), "/informes/* lost noindex");
});
