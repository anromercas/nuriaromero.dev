import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { isolatedBuild } from "./helpers/isolated-build.mjs";

const DRAFT = "borrador-de-prueba";
const CONTROL = "publicado-de-prueba";
const BODY = "## Seccion\n\nTexto neutro del post de prueba.";
const base = {
  description: "Descripcion de prueba",
  pubDate: "2026-11-20",
  tags: [],
};

let site;
let sitemaps;
let rss;
let listing;
let llms;

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );
const url = (slug) => `/blog/${slug}/`;

before(
  async () => {
    site = await isolatedBuild({
      posts: [
        {
          slug: DRAFT,
          frontmatter: {
            ...base,
            title: "Borrador de prueba",
            pubDate: "2026-11-21",
            draft: true,
          },
          body: BODY,
        },
        {
          slug: CONTROL,
          frontmatter: { ...base, title: "Publicado de prueba", draft: false },
          body: BODY,
        },
      ],
    });
    const names = (await readdir(site.dist)).filter((n) =>
      /^sitemap-.*\.xml$/.test(n),
    );
    sitemaps = (
      await Promise.all(names.map((n) => readFile(join(site.dist, n), "utf8")))
    ).join("\n");
    rss = await readFile(join(site.dist, "rss.xml"), "utf8");
    listing = await readFile(join(site.dist, "blog/index.html"), "utf8");
    llms = await readFile(join(site.dist, "llms.txt"), "utf8");
  },
  { timeout: 240_000 },
);

after(async () => {
  await site?.cleanup();
});

describe("draft post (draft: true) never publishes", () => {
  test("no page is built", async () => {
    assert.equal(
      await exists(join(site.dist, "blog", DRAFT, "index.html")),
      false,
    );
  });
  test("not in any sitemap file", () => {
    assert.ok(!sitemaps.includes(url(DRAFT)));
  });
  test("not in rss.xml", () => {
    assert.ok(!rss.includes(url(DRAFT)), "rss.xml lists the draft");
  });
  test("not in the blog listing", () => {
    assert.ok(!listing.includes(`href="${url(DRAFT)}"`));
  });
  test("not in llms.txt", () => {
    assert.ok(!llms.includes(url(DRAFT)));
  });
});

describe("published control reaches the outputs", () => {
  test("page is built", async () => {
    assert.equal(
      await exists(join(site.dist, "blog", CONTROL, "index.html")),
      true,
    );
  });
  test("in a sitemap file", () => {
    assert.ok(sitemaps.includes(url(CONTROL)));
  });
  test("in rss.xml", () => {
    assert.ok(rss.includes(url(CONTROL)));
  });
  test("in the blog listing", () => {
    assert.ok(listing.includes(`href="${url(CONTROL)}"`));
  });
});

describe("/blog/ dateModified (NRD-344)", () => {
  test("is the newest published post, never a draft", () => {
    const ld = [
      ...listing.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ].map((m) => JSON.parse(m[1]));
    const nodes = ld.flatMap((d) => d["@graph"] ?? [d]);
    const page = nodes.find((n) => n["@type"] === "WebPage");
    assert.equal(page?.dateModified, new Date("2026-11-20").toISOString());
  });
});

describe("hand-kept public/llms.txt", () => {
  test("links no slug whose frontmatter has draft: true", async () => {
    const dir = new URL("../src/content/blog/", import.meta.url);
    const llmsTxt = await readFile(
      new URL("../public/llms.txt", import.meta.url),
      "utf8",
    );
    const files = (await readdir(dir)).filter((n) => /\.mdx?$/.test(n));
    for (const file of files) {
      const source = await readFile(new URL(file, dir), "utf8");
      const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? "";
      if (!/^draft:\s*true\s*$/m.test(front)) continue;
      const slug = file.replace(/\.mdx?$/, "");
      assert.ok(!llmsTxt.includes(url(slug)), `llms.txt links draft ${slug}`);
    }
  });
});
