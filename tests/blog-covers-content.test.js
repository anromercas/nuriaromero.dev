import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

function frontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : "";
}

function field(block, name) {
  const match = block.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^"(.*)"$/s, "$1");
}

function coverOf(block) {
  const match = block.match(/^cover:\n((?:[ \t]+.*\n?)+)/m);
  if (!match) return undefined;
  const inner = match[1].replace(/^[ \t]+/gm, "");
  return { src: field(inner, "src"), alt: field(inner, "alt") };
}

const posts = readdirSync(new URL("src/content/blog/", root))
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const block = frontmatter(read(`src/content/blog/${file}`));
    return {
      slug: file.replace(/\.md$/, ""),
      title: field(block, "title"),
      draft: field(block, "draft") === "true",
      cover: coverOf(block),
    };
  })
  .filter((post) => !post.draft);

test("there are published posts to check", () => {
  assert.ok(posts.length >= 4);
});

for (const post of posts) {
  test(`${post.slug}: sourced 16:9 cover with a descriptive alt (NRD-331)`, async () => {
    assert.ok(post.cover, "the post sets cover");
    assert.equal(post.cover.src, `../../assets/blog/${post.slug}.jpg`);
    const file = new URL(`src/assets/blog/${post.slug}.jpg`, root);
    assert.ok(existsSync(file), "the cover file exists");
    const { width, height } = await sharp(file.pathname).metadata();
    assert.ok(width >= 1280, `width ${width} is at least 1280`);
    assert.equal(width * 9, height * 16, `${width}x${height} is 16:9`);

    const alt = post.cover.alt;
    assert.ok(alt && alt.trim(), "alt is not blank");
    const words = alt.trim().split(/\s+/).length;
    assert.ok(words >= 5 && words <= 20, `alt has ${words} words`);
    assert.notEqual(alt, post.title);
    assert.ok((alt.match(/,/g) ?? []).length <= 1, "alt has at most one comma");
  });
}

test("credits.json records one sourced entry per cover file (NRD-331)", () => {
  const credits = JSON.parse(read("src/assets/blog/credits.json"));
  assert.equal(credits.version, 1);
  const files = readdirSync(new URL("src/assets/blog/", root)).filter((file) =>
    file.endsWith(".jpg"),
  );
  assert.deepEqual(Object.keys(credits.files).sort(), files.sort());
  for (const [file, entries] of Object.entries(credits.files)) {
    assert.ok(existsSync(new URL(`src/assets/blog/${file}`, root)));
    assert.equal(entries.length, 1, `${file} has one entry`);
    const entry = entries[0];
    for (const key of ["origin", "libraryId", "source", "generatedAt"]) {
      assert.ok(
        typeof entry[key] === "string" && entry[key].trim(),
        `${file}.${key}`,
      );
    }
    for (const key of ["left", "top", "width", "height"]) {
      assert.ok(Number.isInteger(entry.crop?.[key]), `${file}.crop.${key}`);
    }
  }
});
