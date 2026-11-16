import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const component = read("src/components/Breadcrumbs.astro");
const css = read("src/styles/template.css");
const style = component.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? "";

const token = (name) =>
  css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];

const luminance = (hex) => {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("breadcrumbs use no legacy palette", () => {
  assert.doesNotMatch(component, /gray-/);
  assert.doesNotMatch(component, /blue-/);
});

test("breadcrumb links reuse the template link with its visible focus", () => {
  assert.match(component, /import\s+["']@\/styles\/template\.css["']/);
  const anchors = component.match(/<a\b[^>]*>/g) ?? [];
  assert.ok(anchors.length > 0);
  for (const a of anchors) assert.match(a, /class="tpl-link"/);
  const focus = css.match(/\.tpl-link:focus-visible\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(focus, /outline:\s*2px solid var\(--sky-signal\)/);
});

test("breadcrumb style uses ink tokens and no colour literals", () => {
  assert.ok(style.length > 0, "component has a scoped <style>");
  assert.match(style, /var\(--text-muted\)/);
  assert.match(style, /var\(--text-secondary\)/);
  assert.doesNotMatch(style, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(style, /rgba?\(/);
});

test("breadcrumb tokens keep AA contrast on both grounds", () => {
  for (const ground of ["--ink-ground", "--site-ground"]) {
    const bg = token(ground);
    assert.ok(bg, ground);
    assert.ok(
      contrast(token("--sky-signal"), bg) >= 3,
      `sky-signal on ${ground}`,
    );
    for (const t of ["--text-body", "--text-secondary", "--text-muted"]) {
      assert.ok(contrast(token(t), bg) >= 4.5, `${t} on ${ground}`);
    }
  }
});

test("breadcrumb semantics are kept", () => {
  assert.match(component, /aria-label="Miga de pan"/);
  assert.match(component, /aria-current="page"/);
  assert.match(component, /aria-hidden="true"/);
});
