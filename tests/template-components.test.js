import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const design = read("DESIGN.md");
const css = read("src/styles/template.css");

function designColors() {
  const front = design.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const block = front.match(/^colors:\n((?:[ ]{2}.+\n?)+)/m)?.[1] ?? "";
  return [...block.matchAll(/^ {2}([\w-]+):\s*"(#[0-9a-fA-F]{6})"/gm)].map(
    (m) => [m[1], m[2].toLowerCase()],
  );
}

const ruleBody = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? null;
};

test("template.css defines every DESIGN.md colour token with its value", () => {
  const colors = designColors();
  assert.ok(colors.length >= 20, "DESIGN.md colour tokens parsed");
  for (const [name, hex] of colors) {
    assert.match(
      css,
      new RegExp(`--${name}:\\s*${hex}\\s*;`, "i"),
      `--${name} should be ${hex}`,
    );
  }
});

test("template.css defines the alpha channel triplets and shared values", () => {
  assert.match(css, /--sky-signal-rgb:\s*56 189 248\s*;/);
  assert.match(css, /--ink-band-rgb:\s*8 16 36\s*;/);
  assert.match(css, /--accent-size:\s*1\.12em\s*;/);
  assert.match(css, /--ease-out:\s*cubic-bezier\(0\.16, 1, 0\.3, 1\)\s*;/);
});

test("template.css carries today's ground, band and heading rules", () => {
  const ground = ruleBody(".template-ground");
  assert.ok(ground, ".template-ground exists");
  assert.match(ground, /background-color:\s*var\(--ink-ground\)/);
  assert.match(ground, /radial-gradient\(\s*ellipse 80% 30% at 50% 0%/);
  assert.match(ground, /rgb\(var\(--sky-signal-rgb\) \/ 0\.1\)/);

  const band = ruleBody(".band");
  assert.ok(band, ".band exists");
  assert.match(band, /margin-inline:\s*-1rem/);
  assert.match(band, /padding:\s*3rem 1rem/);
  assert.match(band, /border-block:\s*1px solid var\(--hairline-quiet\)/);
  assert.match(band, /rgb\(var\(--ink-band-rgb\) \/ 0\.85\)/);

  const kw = ruleBody(".tpl-kw");
  assert.ok(kw, ".tpl-kw exists");
  assert.match(kw, /font-size:\s*1\.0625rem/);
  assert.match(kw, /font-weight:\s*600/);
  assert.match(kw, /color:\s*var\(--text-secondary\)/);
  assert.doesNotMatch(kw, /uppercase|letter-spacing/);

  const display = ruleBody(".tpl-display");
  assert.ok(display, ".tpl-display exists");
  assert.match(display, /clamp\(1\.9rem, 4\.5vw, 3rem\)/);
  assert.match(display, /color:\s*var\(--text-strong\)/);
  assert.match(display, /text-wrap:\s*balance/);

  const accent = ruleBody(".tpl-accent");
  assert.ok(accent, ".tpl-accent exists");
  assert.match(accent, /color:\s*var\(--sky-accent\)/);
  assert.match(accent, /"Instrument Serif", Georgia, serif/);
  assert.match(accent, /font-style:\s*italic/);
  assert.match(accent, /font-size:\s*var\(--accent-size\)/);

  const link = ruleBody(".tpl-link");
  assert.ok(link, ".tpl-link exists");
  assert.match(link, /text-underline-offset:\s*0\.3em/);
  assert.match(css, /\.tpl-link:hover/);
  assert.match(css, /\.tpl-link:focus-visible/);
});

test("types.ts exports the shared prop types", () => {
  const types = read("src/components/seo-local/types.ts");
  for (const name of [
    "AccentTitle",
    "TextLink",
    "ProofItem",
    "Step",
    "ComparisonItem",
    "FaqItem",
    "Tier",
    "BentoArea",
  ]) {
    assert.match(types, new RegExp(`export (interface|type) ${name}\\b`));
  }
});

test("SectionHeading declares its Props and renders a single optional em", () => {
  const src = read("src/components/seo-local/SectionHeading.astro");
  assert.match(src, /import "@\/styles\/template\.css"/);
  assert.match(src, /import "@fontsource\/instrument-serif\/400-italic\.css"/);
  assert.match(src, /interface Props/);
  for (const field of ["id", "keyword", "title", "level", "class"]) {
    assert.match(src, new RegExp(`\\b${field}\\??:`), `Props.${field}`);
  }
  assert.match(src, /AccentTitle/);
  assert.equal((src.match(/<em\b/g) ?? []).length, 1);
  assert.match(src, /class="tpl-accent"/);
  assert.match(src, /tpl-kw/);
  assert.match(src, /tpl-display/);
  assert.doesNotMatch(src, /@\/data\//);
});
