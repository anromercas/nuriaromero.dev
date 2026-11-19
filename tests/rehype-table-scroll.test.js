import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import rehypeTableScroll from "../src/lib/rehype-table-scroll.mjs";

const text = (value) => ({ type: "text", value });
const el = (tagName, properties = {}, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const table = (align) =>
  el("table", {}, [
    el("tbody", {}, [
      el("tr", {}, [
        el("td", {}, [text("Landing")]),
        el("td", align ? { align } : {}, [text("Desde 149 €")]),
      ]),
    ]),
  ]);
const root = (...children) => ({ type: "root", children });
const run = (tree) => {
  rehypeTableScroll()(tree);
  return tree;
};

test("a table with a right-aligned cell is wrapped in a focusable region", () => {
  const tree = run(
    root(el("h2", {}, [text("Respuesta corta")]), table("right")),
  );
  const wrapper = tree.children[1];
  assert.equal(wrapper.tagName, "div");
  assert.deepEqual(wrapper.properties.className, ["table-scroll"]);
  assert.equal(wrapper.properties.role, "region");
  assert.equal(wrapper.properties.tabIndex, 0);
  assert.equal(wrapper.properties.ariaLabel, "Tabla: Respuesta corta");
  assert.equal(wrapper.children.length, 1);
  assert.equal(wrapper.children[0].tagName, "table");
});

test("a table without aligned cells is left untouched", () => {
  const tree = root(el("h2", {}, [text("GEO")]), table(null));
  const before = structuredClone(tree);
  run(tree);
  assert.deepEqual(tree, before);
});

test("without a previous H2 the label is just Tabla", () => {
  const tree = run(root(table("right")));
  assert.equal(tree.children[0].properties.ariaLabel, "Tabla");
});

test("running the plugin twice does not nest wrappers", () => {
  const tree = run(
    root(el("h2", {}, [text("Respuesta corta")]), table("right")),
  );
  run(tree);
  const wrapper = tree.children[1];
  assert.equal(wrapper.children[0].tagName, "table");
  assert.equal(tree.children.length, 2);
});

test("astro.config.mjs registers the plugin", () => {
  const config = readFileSync(
    new URL("../astro.config.mjs", import.meta.url),
    "utf8",
  );
  assert.match(
    config,
    /import rehypeTableScroll from ["']\.\/src\/lib\/rehype-table-scroll\.mjs["']/,
  );
  assert.match(config, /rehypePlugins:\s*\[rehypeTableScroll\]/);
});
