import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { isolatedBuild } from "./helpers/isolated-build.mjs";
import { blogCoverFailures } from "../scripts/lib/blog-cover-contract.mjs";
import { SITE } from "../src/data/site.ts";

const ALT = "Mostrador de una tienda en Sevilla";
const base = { description: "Descripcion de prueba", pubDate: "2026-01-01" };

let site;
let withCover;
let withoutCover;

const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
const meta = (html, key, value) => {
  const tag = (html.match(/<meta\b[^>]*>/g) ?? []).find(
    (t) => attr(t, key) === value,
  );
  return tag && attr(tag, "content");
};
const articleImage = (html) => {
  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    const data = JSON.parse(json);
    const nodes = Array.isArray(data) ? data : (data["@graph"] ?? [data]);
    const article = nodes.find((n) => n["@type"] === "Article");
    if (article) return article.image;
  }
};

before(
  async () => {
    const cover = await sharp({
      create: {
        width: 1600,
        height: 900,
        channels: 3,
        background: { r: 30, g: 90, b: 160 },
      },
    })
      .jpeg()
      .toBuffer();
    site = await isolatedBuild({
      files: [{ path: "src/assets/blog/fixture-cover.jpg", contents: cover }],
      posts: [
        {
          slug: "portada-de-prueba",
          frontmatter: {
            ...base,
            title: "Portada de prueba",
            cover: { src: "../../assets/blog/fixture-cover.jpg", alt: ALT },
          },
          body: "## Seccion\n\nTexto del post.",
        },
        {
          slug: "sin-portada-de-prueba",
          frontmatter: { ...base, title: "Sin portada de prueba" },
          body: "## Seccion\n\nTexto del post.",
        },
      ],
    });
    withCover = await readFile(
      join(site.dist, "blog/portada-de-prueba/index.html"),
      "utf8",
    );
    withoutCover = await readFile(
      join(site.dist, "blog/sin-portada-de-prueba/index.html"),
      "utf8",
    );
  },
  { timeout: 240_000 },
);

after(async () => {
  await site?.cleanup();
});

describe("post with a cover", () => {
  test("figure sits after the header and before the body", () => {
    const header = withCover.indexOf("</header>");
    const figure = withCover.indexOf('<figure class="post-cover"');
    const body = withCover.indexOf("data-post-body");
    assert.ok(header > -1 && figure > header && body > figure);
  });

  test("picture offers AVIF and WebP with a JPEG img", () => {
    const figure = withCover.match(
      /<figure class="post-cover"[\s\S]*?<\/figure>/,
    )[0];
    assert.match(figure, /<picture/);
    assert.match(figure, /<source[^>]*type="image\/avif"/);
    assert.match(figure, /<source[^>]*type="image\/webp"/);
    const img = figure.match(/<img\b[^>]*>/)[0];
    assert.equal(attr(img, "alt"), ALT);
    assert.match(attr(img, "width"), /^[1-9]\d*$/);
    assert.match(attr(img, "height"), /^[1-9]\d*$/);
    assert.equal(attr(img, "loading"), "eager");
    assert.equal(attr(img, "fetchpriority"), "high");
    assert.ok(img.includes("data-post-cover"));
    assert.match(attr(img, "src"), /\/_astro\/.*\.jpg$/);
  });

  test("og:image, twitter:image and Article image are the same absolute JPEG", () => {
    const og = meta(withCover, "property", "og:image");
    assert.match(og, /^https:\/\/nuriaromero\.dev\/_astro\/.+\.jpg$/);
    assert.equal(meta(withCover, "name", "twitter:image"), og);
    assert.equal(articleImage(withCover), og);
  });

  test("the cover guard finds no failures on real file sizes", async () => {
    const urls = new Set(
      [...withCover.matchAll(/\/_astro\/[^"\s,)]+/g)].map((m) => m[0]),
    );
    const sizes = new Map();
    for (const url of urls) {
      sizes.set(url, (await stat(join(site.dist, url))).size);
    }
    const { failures, covers } = blogCoverFailures({
      pages: [{ route: "/blog/portada-de-prueba/", html: withCover }],
      fileSize: (url) => sizes.get(url),
    });
    assert.deepEqual(failures, []);
    assert.equal(covers, 1);
  });
});

describe("post without a cover", () => {
  test("renders no cover markup", () => {
    for (const marker of ["post-cover", "<picture", "data-post-cover"]) {
      assert.ok(!withoutCover.includes(marker), marker);
    }
  });

  test("keeps the default share image", () => {
    const fallback = new URL(SITE.defaultOgImage, SITE.url).href;
    assert.equal(meta(withoutCover, "property", "og:image"), fallback);
    assert.equal(articleImage(withoutCover), fallback);
  });
});
