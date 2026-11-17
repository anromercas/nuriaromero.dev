// NRD-244: dist/rss.xml lists every published post and every page declares the feed.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const blogDir = fileURLToPath(new URL("../src/content/blog/", import.meta.url));
const ORIGIN = "https://nuriaromero.dev";
const ALTERNATE =
  '<link rel="alternate" type="application/rss+xml" title="Blog de Nuria Romero" href="/rss.xml"';

const errors = [];
const fail = (msg) => errors.push(msg);

async function walk(dir, ext) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, ext)));
    else if (e.name.endsWith(ext)) out.push(p);
  }
  return out;
}

// Published posts from frontmatter (same approach as astro.config.mjs).
const published = [];
const drafts = [];
for (const file of (await readdir(blogDir)).filter((f) => f.endsWith(".md"))) {
  const raw = await readFile(path.join(blogDir, file), "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const slug = file.replace(/\.md$/, "");
  (/^draft:\s*true\s*$/m.test(fm) ? drafts : published).push(slug);
}

const feed = await readFile(path.join(dist, "rss.xml"), "utf8").catch(
  () => null,
);
if (feed === null) {
  fail("dist/rss.xml is missing");
} else {
  if (!feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
    fail("rss.xml does not start with the XML declaration");
  if ((feed.match(/<rss version="2\.0"/g) ?? []).length !== 1)
    fail('rss.xml must have exactly one <rss version="2.0">');
  if ((feed.match(/<channel>/g) ?? []).length !== 1)
    fail("rss.xml must have exactly one <channel>");

  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
    (m) => m[1],
  );
  const tag = (block, name) =>
    block.match(new RegExp(`<${name}[^>]*>([^<]*)</${name}>`))?.[1]?.trim() ??
    "";

  for (const slug of published) {
    const link = `${ORIGIN}/blog/${slug}/`;
    const matches = items.filter((i) => tag(i, "link") === link);
    if (matches.length !== 1) {
      fail(
        `post "${slug}" has ${matches.length} items in rss.xml (expected 1)`,
      );
      continue;
    }
    for (const field of ["title", "description", "pubDate"]) {
      if (!tag(matches[0], field)) fail(`item of "${slug}" has empty ${field}`);
    }
  }
  for (const slug of drafts) {
    if (feed.includes(`/blog/${slug}/`))
      fail(`draft "${slug}" appears in rss.xml`);
  }
  const dates = items.map((i) => Date.parse(tag(i, "pubDate")));
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] > dates[i - 1]) fail("rss.xml items are not newest first");
  }
}

const pages = (await walk(dist, ".html")).filter(
  (f) => !path.relative(dist, f).startsWith("informes" + path.sep),
);
for (const f of pages.sort()) {
  const html = await readFile(f, "utf8");
  const count = html.split(ALTERNATE).length - 1;
  if (count !== 1)
    fail(
      `${path.relative(dist, f)}: feed alternate link found ${count} times (expected 1)`,
    );
}

for (const f of (await walk(dist, ".xml")).filter((p) =>
  path.basename(p).startsWith("sitemap-"),
)) {
  if ((await readFile(f, "utf8")).includes("rss.xml"))
    fail(`${path.relative(dist, f)} lists rss.xml`);
}

const robots = await readFile(path.join(dist, "robots.txt"), "utf8").catch(
  () => "",
);
for (const line of robots.split("\n")) {
  const m = line.match(/^\s*Disallow:\s*(\S+)/i);
  if (m && "/rss.xml".startsWith(m[1]))
    fail(`robots.txt disallows /rss.xml (${line.trim()})`);
}

if (errors.length) {
  for (const e of errors) console.error(`check-seo-23: ${e}`);
  process.exit(1);
}
console.log(
  `check-seo-23: rss.xml lists ${published.length} posts, alternate link ok on ${pages.length} pages`,
);
