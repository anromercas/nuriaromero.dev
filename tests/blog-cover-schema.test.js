import test from "node:test";
import assert from "node:assert/strict";
import { z } from "astro/zod";
import { blogSchema } from "../src/content/blog-schema.ts";

const schema = blogSchema(() => z.string());
const base = {
  title: "Titulo",
  description: "Descripcion",
  pubDate: "2026-01-01",
};

test("a post without cover passes and keeps today's keys", () => {
  const parsed = schema.parse(base);
  assert.deepEqual(Object.keys(parsed).sort(), [
    "description",
    "draft",
    "pubDate",
    "tags",
    "title",
  ]);
  assert.equal(parsed.draft, false);
  assert.deepEqual(parsed.tags, []);
});

test("updatedDate stays optional and coerced", () => {
  const parsed = schema.parse({ ...base, updatedDate: "2026-02-01" });
  assert.ok(parsed.updatedDate instanceof Date);
});

test("a cover with src and alt passes", () => {
  const parsed = schema.parse({
    ...base,
    cover: { src: "a.jpg", alt: "Mostrador de una tienda" },
  });
  assert.deepEqual(parsed.cover, {
    src: "a.jpg",
    alt: "Mostrador de una tienda",
  });
});

test("a cover without alt fails", () => {
  assert.equal(
    schema.safeParse({ ...base, cover: { src: "a.jpg" } }).success,
    false,
  );
});

test("a blank alt fails", () => {
  for (const alt of ["", "  "]) {
    assert.equal(
      schema.safeParse({ ...base, cover: { src: "a.jpg", alt } }).success,
      false,
      JSON.stringify(alt),
    );
  }
});

test("unknown keys inside cover fail", () => {
  assert.equal(
    schema.safeParse({
      ...base,
      cover: { src: "a.jpg", alt: "x", caption: "y" },
    }).success,
    false,
  );
});

test("the old image key is no longer part of the schema", () => {
  const parsed = schema.parse({ ...base, image: "/x.jpg" });
  assert.equal("image" in parsed, false);
});
