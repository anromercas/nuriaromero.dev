import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");

const channel = {
  title: "Blog de Nuria Romero",
  link: "https://nuriaromero.dev/blog/",
  description: "Descripción",
  language: "es-ES",
  selfUrl: "https://nuriaromero.dev/rss.xml",
};
const item = (slug, date, extra = {}) => ({
  title: `Post ${slug}`,
  link: `https://nuriaromero.dev/blog/${slug}/`,
  description: `Desc ${slug}`,
  pubDate: new Date(date),
  ...extra,
});

test("buildRssFeed orders items newest first", async () => {
  const { buildRssFeed } = await import("../src/lib/rss.ts");
  const xml = buildRssFeed(channel, [
    item("old", "2026-03-01"),
    item("new", "2026-06-01"),
  ]);
  assert.ok(xml.indexOf("/blog/new/") < xml.indexOf("/blog/old/"));
});

test("buildRssFeed shape: declaration, atom self link, guid, no lastBuildDate", async () => {
  const { buildRssFeed } = await import("../src/lib/rss.ts");
  const xml = buildRssFeed(channel, [item("a", "2026-09-21")]);
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.match(
    xml,
    /<rss version="2\.0" xmlns:atom="http:\/\/www\.w3\.org\/2005\/Atom">/,
  );
  assert.match(
    xml,
    /<atom:link href="https:\/\/nuriaromero\.dev\/rss\.xml" rel="self" type="application\/rss\+xml"\/>/,
  );
  assert.match(
    xml,
    /<guid isPermaLink="true">https:\/\/nuriaromero\.dev\/blog\/a\/<\/guid>/,
  );
  assert.match(xml, /<pubDate>Mon, 21 Sep 2026 00:00:00 GMT<\/pubDate>/);
  assert.ok(!xml.includes("lastBuildDate"));
  assert.match(xml, /<language>es-ES<\/language>/);
});

test("escapeXml escapes special characters", async () => {
  const { escapeXml, buildRssFeed } = await import("../src/lib/rss.ts");
  assert.equal(
    escapeXml(`A & B <c> "d" 'e'`),
    "A &amp; B &lt;c&gt; &quot;d&quot; &apos;e&apos;",
  );
  const xml = buildRssFeed(channel, [
    item("x", "2026-01-01", { title: "SEO & GEO <local>" }),
  ]);
  assert.ok(xml.includes("<title>SEO &amp; GEO &lt;local&gt;</title>"));
});

test("endpoint source filters drafts and stays prerendered", () => {
  const src = read("src/pages/rss.xml.ts");
  assert.match(src, /getCollection\("blog", \(\{ data \}\) => !data\.draft\)/);
  assert.ok(!/prerender\s*=\s*false/.test(src));
  assert.match(src, /application\/rss\+xml; charset=utf-8/);
});

test("sitemap filter excludes rss.xml", () => {
  assert.match(read("astro.config.mjs"), /rss\.xml/);
});

test("SEO.astro declares the feed alternate link once, after the canonical", () => {
  const src = read("src/components/seo/SEO.astro");
  const link =
    '<link rel="alternate" type="application/rss+xml" title="Blog de Nuria Romero" href="/rss.xml" />';
  assert.equal(src.split(link).length - 1, 1);
  assert.ok(src.indexOf(link) > src.indexOf('rel="canonical"'));
});
