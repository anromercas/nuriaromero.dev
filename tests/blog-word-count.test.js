import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  stripFrontmatter,
  countWords,
  compareToTarget,
} from "../scripts/lib/word-count.mjs";

const dir = new URL("./fixtures/blog-pipeline/", import.meta.url);
const path = (name) => new URL(name, dir).pathname;
const words = (n) => Array.from({ length: n }, () => "palabra").join(" ");

let tmp;
test.before(async () => {
  tmp = await mkdtemp(join(tmpdir(), "nrd-blog-"));
});
test.after(async () => {
  await rm(tmp, { recursive: true, force: true });
});

test("frontmatter is ignored", () => {
  const md = `---\ntitle: "uno dos tres cuatro cinco seis"\ndescription: siete ocho nueve diez once doce\n---\n\n${words(50)}\n`;
  assert.equal(countWords(md), 50);
  assert.equal(stripFrontmatter(md).trim(), words(50));
});

test("text without frontmatter is returned unchanged", () => {
  assert.equal(stripFrontmatter("hola mundo"), "hola mundo");
});

test("sample post: code, link URL, image and markers are excluded", () => {
  assert.equal(countWords(readFileSync(path("post-sample.md"), "utf8")), 15);
});

test("link text counts, its URL does not", () => {
  assert.equal(countWords("[uno dos](https://example.com/tres-cuatro)"), 2);
});

test("bare URLs and HTML tags are excluded", () => {
  assert.equal(
    countWords('<a href="https://x.com/y">uno</a> https://z.es/a'),
    1,
  );
});

test("accented and hyphenated words count once", () => {
  assert.equal(countWords("página-web información"), 2);
  assert.equal(countWords("niño"), 1);
});

test("compareToTarget within, under and over", () => {
  assert.deepEqual(compareToTarget(812, 900), {
    count: 812,
    target: 900,
    min: 810,
    max: 990,
    status: "within",
  });
  assert.equal(compareToTarget(700, 900).status, "under");
  assert.equal(compareToTarget(1000, 900).status, "over");
  assert.equal(compareToTarget(810, 900).status, "within");
  assert.equal(compareToTarget(990, 900).status, "within");
});

function run(args) {
  return spawnSync(process.execPath, ["scripts/blog-word-count.mjs", ...args]);
}

test("CLI with --outline reports within and exits 0", async () => {
  const post = join(tmp, "within.md");
  await writeFile(post, `---\ntitle: x\n---\n\n${words(812)}\n`);
  const r = run([post, "--outline", path("esquema-ok.md")]);
  assert.equal(r.status, 0);
  assert.equal(
    r.stdout.toString().trim(),
    "blog-word-count: 812 words, target 900 (810-990): within",
  );
});

test("CLI with --target reports under and exits 1", async () => {
  const post = join(tmp, "under.md");
  await writeFile(post, words(700));
  const r = run([post, "--target", "900"]);
  assert.equal(r.status, 1);
  assert.match(r.stdout.toString(), /700 words, target 900 \(810-990\): under/);
});

test("CLI exits 2 on usage errors", async () => {
  const post = join(tmp, "x.md");
  await writeFile(post, "hola");
  assert.equal(run([]).status, 2);
  assert.equal(run([post]).status, 2);
  assert.equal(run([post, "--target", "abc"]).status, 2);
  assert.equal(run([post, "--target", "9", "--outline", "x"]).status, 2);
  assert.equal(run([join(tmp, "missing.md"), "--target", "9"]).status, 2);
});
