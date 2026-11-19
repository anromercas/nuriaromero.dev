import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const design = read("DESIGN.md");

/** font-family value (without the semicolon) of the first `selector {` rule. */
function cssStack(source, selector) {
  const start = source.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `${selector} rule not found`);
  const match = source.slice(start).match(/font-family:\s*([^;]+);/);
  assert.ok(match, `${selector} has no font-family`);
  return match[1].trim();
}

function unquote(raw) {
  const value = raw.trim();
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value);
  }
  return value;
}

/** typography.<name>.fontFamily tokens of the DESIGN.md front matter. */
function designFontTokens(source) {
  const front = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const block = front.match(/^typography:\n((?: {2,}.*\n?|\n)*)/m)?.[1] ?? "";
  const tokens = {};
  let current = null;
  for (const line of block.split("\n")) {
    const name = line.match(/^ {2}([\w-]+):\s*$/);
    if (name) {
      current = name[1];
      continue;
    }
    const family = line.match(/^ {4}fontFamily:\s*(.+)$/);
    if (family && current) tokens[current] = unquote(family[1]);
  }
  return tokens;
}

const onest = cssStack(read("src/layouts/Layout.astro"), "html");
const serif = cssStack(read("src/styles/template.css"), ".tpl-accent");

const typography = design.slice(
  design.indexOf("## Typography"),
  design.indexOf("### ", design.indexOf("## Typography")),
);

test("DESIGN.md font tokens equal the published stacks", () => {
  assert.ok(onest.includes('"Onest Fallback"'));
  assert.ok(serif.includes('"Instrument Serif Fallback"'));
  const tokens = designFontTokens(design);
  assert.deepEqual(Object.keys(tokens).sort(), [
    "accent",
    "body",
    "display",
    "headline",
    "label",
    "stat",
    "title",
  ]);
  for (const [name, stack] of Object.entries(tokens)) {
    assert.equal(stack, name === "accent" ? serif : onest, name);
  }
});

test("Typography lines show the published stacks", () => {
  const line = (label) =>
    typography.split("\n").find((l) => l.startsWith(`**${label}:**`)) ?? "";
  assert.ok(line("Display / Body Font").includes(onest));
  assert.ok(line("Accent Font").includes(serif));
});

test("DESIGN.md explains the fallback faces", () => {
  assert.match(typography, /src\/styles\/fonts\.css/);
  assert.match(typography, /NRD-310/);
  assert.match(typography, /CLS|layout shift/);
  assert.match(typography, /keep|do not remove|never remove/i);
});
