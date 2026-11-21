import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { z } from "astro/zod";
import { blogSchema } from "../src/content/blog-schema.ts";
import {
  buildPostFrontmatter,
  COVER_EXTENSIONS,
} from "../scripts/lib/post-frontmatter.mjs";

const schema = blogSchema(() => z.string());
const input = {
  slug: "que-es-una-ficha-de-google",
  title: '¿Qué es una ficha de Google: guía "completa"?',
  description: "Qué es, para qué sirve y cómo se completa.",
  pubDate: "2026-11-24",
  tags: ["seo local", "google"],
  cover: {
    file: "que-es-una-ficha-de-google.jpg",
    alt: "Ficha de Google en un móvil",
  },
};

test("data validates against blogSchema and cover points to assets/blog", () => {
  const { data } = buildPostFrontmatter(input);
  const parsed = schema.parse(data);
  assert.equal(parsed.draft, true);
  assert.equal(
    parsed.cover.src,
    "../../assets/blog/que-es-una-ficha-de-google.jpg",
  );
  assert.deepEqual(parsed.tags, ["seo local", "google"]);
});

test("text always has draft true and never draft false", () => {
  const { text } = buildPostFrontmatter(input);
  assert.match(text, /^draft: true$/m);
  assert.doesNotMatch(text, /draft:\s*false/);
  assert.ok(text.startsWith("---\n") && text.endsWith("---\n"));
  assert.match(
    text,
    /^cover:\n {2}src: "\.\.\/\.\.\/assets\/blog\/.+"\n {2}alt: ".+"$/m,
  );
});

test("titles with quotes and colons stay valid double-quoted scalars", () => {
  const { text } = buildPostFrontmatter(input);
  assert.ok(text.includes(`title: ${JSON.stringify(input.title)}`));
});

test("tags default to an empty list", () => {
  const { data, text } = buildPostFrontmatter({ ...input, tags: undefined });
  assert.deepEqual(data.tags, []);
  assert.match(text, /^tags: \[\]$/m);
});

test("any draft key throws", () => {
  assert.throws(
    () => buildPostFrontmatter({ ...input, draft: false }),
    /draft/,
  );
  assert.throws(() => buildPostFrontmatter({ ...input, draft: true }), /draft/);
});

test("invalid inputs throw", () => {
  const bad = [
    { slug: "Slug Malo" },
    { slug: "-a" },
    { title: "  " },
    { description: "" },
    { pubDate: "24/11/2026" },
    { pubDate: "2026-02-30" },
    { cover: undefined },
    { cover: { file: "a.gif", alt: "x" } },
    { cover: { file: "sub/a.jpg", alt: "x" } },
    { cover: { file: "a.jpg", alt: " " } },
  ];
  for (const override of bad) {
    assert.throws(
      () => buildPostFrontmatter({ ...input, ...override }),
      Error,
      JSON.stringify(override),
    );
  }
});

test("supported cover extensions", () => {
  assert.deepEqual(
    [...COVER_EXTENSIONS],
    ["jpg", "jpeg", "png", "webp", "avif"],
  );
});

let root;
test.before(async () => {
  root = await mkdtemp(join(tmpdir(), "nrd-blog-"));
  await mkdir(join(root, "src/assets/blog"), { recursive: true });
  await mkdir(join(root, "src/content/blog"), { recursive: true });
});
test.after(async () => {
  await rm(root, { recursive: true, force: true });
});

const cli = (extra = []) =>
  spawnSync(process.execPath, [
    "scripts/blog-scaffold.mjs",
    "--slug",
    input.slug,
    "--title",
    input.title,
    "--description",
    input.description,
    "--date",
    input.pubDate,
    "--cover",
    input.cover.file,
    "--alt",
    input.cover.alt,
    "--tags",
    "seo local,google",
    "--root",
    root,
    ...extra,
  ]);
const postPath = () => join(root, "src/content/blog", `${input.slug}.md`);

test("CLI without --write prints the frontmatter and writes nothing", () => {
  const r = cli();
  assert.equal(r.status, 0);
  assert.equal(r.stdout.toString(), buildPostFrontmatter(input).text + "\n");
  assert.equal(existsSync(postPath()), false);
});

test("CLI --write fails when the cover is missing", () => {
  const r = cli(["--write"]);
  assert.equal(r.status, 1);
  assert.equal(existsSync(postPath()), false);
});

test("CLI --write creates the post, then refuses to overwrite it", async () => {
  await writeFile(join(root, "src/assets/blog", input.cover.file), "x");
  const first = cli(["--write"]);
  assert.equal(first.status, 0);
  assert.equal(
    first.stdout.toString().trim(),
    `blog-scaffold: wrote src/content/blog/${input.slug}.md`,
  );
  const written = readFileSync(postPath(), "utf8");
  assert.equal(written, buildPostFrontmatter(input).text + "\n");
  const second = cli(["--write"]);
  assert.equal(second.status, 1);
  assert.equal(readFileSync(postPath(), "utf8"), written);
});

test("CLI rejects --draft", () => {
  const r = cli(["--draft", "false"]);
  assert.equal(r.status, 1);
});
