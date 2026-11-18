// NRD-242: build contract of page freshness on dist/. dateModified in JSON-LD,
// the visible "Actualizado" label, blog post dates and sitemap lastmod agree.
// Zero dated pages is valid: a shallow clone publishes no dates.
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { freshnessFailures } from "./lib/freshness-contract.mjs";

const dist = process.argv[2]
  ? path.resolve(process.argv[2])
  : fileURLToPath(new URL("../dist/", import.meta.url));

async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "informes") continue;
      files.push(...(await htmlFiles(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const routeOf = (file) => {
  const rel = path.relative(dist, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return rel.endsWith("/index.html")
    ? `/${rel.slice(0, -"index.html".length)}`
    : `/${rel}`;
};

const pages = [];
for (const file of await htmlFiles(dist)) {
  pages.push({
    route: routeOf(file),
    html: await readFile(file, "utf8"),
    mtimeMs: (await stat(file)).mtimeMs,
  });
}

const sitemapXml = await readFile(path.join(dist, "sitemap-0.xml"), "utf8");
const sitemap = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  (m) => ({
    route: new URL(m[1].match(/<loc>([^<]*)<\/loc>/)[1]).pathname,
    lastmod: m[1].match(/<lastmod>([^<]*)<\/lastmod>/)?.[1],
  }),
);

const { failures, dated } = freshnessFailures({ pages, sitemap });

if (failures.length > 0) {
  for (const failure of failures) console.error(`check-seo-22: ${failure}`);
  process.exit(1);
}
console.log(
  `check-seo-22: ${dated} of ${pages.length} pages carry a build-derived dateModified; dates, labels and sitemap agree`,
);
