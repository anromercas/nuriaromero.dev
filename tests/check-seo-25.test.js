import test from "node:test";
import assert from "node:assert/strict";
import { blogCoverFailures } from "../scripts/lib/blog-cover-contract.mjs";

const ROUTE = "/blog/portada-de-prueba/";
const OG = "https://nuriaromero.dev/_astro/cover.AAA.jpg";

function page({
  alt = ' alt="Mostrador de una tienda"',
  width = ' width="1280"',
  height = ' height="720"',
  figure,
  og = OG,
} = {}) {
  const fig =
    figure ??
    `<figure class="post-cover"><picture>` +
      `<source srcset="/_astro/cover.AAA_1.avif 640w, /_astro/cover.AAA_2.avif 960w" type="image/avif">` +
      `<source srcset="/_astro/cover.AAA_1.webp 640w, /_astro/cover.AAA_2.webp 960w" type="image/webp">` +
      `<img src="/_astro/cover.AAA_2.jpg" srcset="/_astro/cover.AAA_1.jpg 640w, /_astro/cover.AAA_2.jpg 960w"${alt}${width}${height} loading="eager" fetchpriority="high" data-post-cover>` +
      `</picture></figure>`;
  return {
    route: ROUTE,
    html: `<html><head><meta property="og:image" content="${og}"></head><body><article><header></header>${fig}<div data-post-body></div></article></body></html>`,
  };
}

const sizes =
  (n = 50_000, overrides = {}) =>
  (url) => {
    if (url in overrides) return overrides[url];
    return url.startsWith("/_astro/") ? n : undefined;
  };

test("a page without cover passes and counts no cover", () => {
  const out = blogCoverFailures({
    pages: [
      { route: ROUTE, html: "<html><body><article></article></body></html>" },
    ],
    fileSize: sizes(),
  });
  assert.deepEqual(out, { failures: [], covers: 0 });
});

test("a valid cover passes", () => {
  const out = blogCoverFailures({ pages: [page()], fileSize: sizes() });
  assert.deepEqual(out, { failures: [], covers: 1 });
});

test("an img without alt or with blank alt fails", () => {
  for (const alt of ["", ' alt=""', ' alt="  "']) {
    const { failures } = blogCoverFailures({
      pages: [page({ alt })],
      fileSize: sizes(),
    });
    assert.ok(
      failures.some((f) => f.includes(ROUTE) && /alt/.test(f)),
      JSON.stringify(alt),
    );
  }
});

test("missing width or height fails", () => {
  for (const attr of ["width", "height"]) {
    const { failures } = blogCoverFailures({
      pages: [page({ [attr]: "" })],
      fileSize: sizes(),
    });
    assert.ok(
      failures.some((f) => f.includes(attr)),
      attr,
    );
  }
  const bad = blogCoverFailures({
    pages: [page({ width: ' width="0"' })],
    fileSize: sizes(),
  });
  assert.ok(bad.failures.some((f) => f.includes("width")));
});

test("a figure without img is an empty cover figure", () => {
  const { failures } = blogCoverFailures({
    pages: [page({ figure: '<figure class="post-cover"></figure>' })],
    fileSize: sizes(),
  });
  assert.ok(failures.some((f) => f.includes("empty cover figure")));
});

test("a srcset file that does not exist fails", () => {
  const { failures } = blogCoverFailures({
    pages: [page()],
    fileSize: sizes(50_000, { "/_astro/cover.AAA_1.webp": undefined }),
  });
  assert.ok(
    failures.some(
      (f) => f.includes("missing file") && f.includes("cover.AAA_1.webp"),
    ),
  );
});

test("an og:image under /_astro/ that does not exist fails", () => {
  const { failures } = blogCoverFailures({
    pages: [page()],
    fileSize: sizes(50_000, { "/_astro/cover.AAA.jpg": undefined }),
  });
  assert.ok(
    failures.some(
      (f) => f.includes("missing file") && f.includes("cover.AAA.jpg"),
    ),
  );
});

test("an og:image outside /_astro/ is not measured", () => {
  const out = blogCoverFailures({
    pages: [page({ og: "https://nuriaromero.dev/og-default.png" })],
    fileSize: sizes(),
  });
  assert.deepEqual(out, { failures: [], covers: 1 });
});

test("the largest file over the limit fails naming route, file and size", () => {
  const { failures } = blogCoverFailures({
    pages: [page()],
    fileSize: sizes(50_000, { "/_astro/cover.AAA_2.jpg": 150_000 }),
  });
  const hit = failures.find((f) => f.includes("150000"));
  assert.ok(hit);
  assert.ok(hit.includes(ROUTE) && hit.includes("cover.AAA_2.jpg"));
});

test("maxBytes boundary: 102400 passes, 102401 fails, custom limit honoured", () => {
  const at = (n, maxBytes) =>
    blogCoverFailures({ pages: [page()], fileSize: sizes(n), maxBytes })
      .failures;
  assert.deepEqual(at(102_400), []);
  assert.equal(at(102_401).length > 0, true);
  assert.deepEqual(at(5_000, 5_000), []);
  assert.equal(at(5_001, 5_000).length > 0, true);
});
