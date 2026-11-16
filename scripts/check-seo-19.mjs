// NRD-223: contract of the custom 404 page (dist/404.html).
// The 404 is outside templatePages (scripts/lib/template-pages.mjs) on purpose:
// it is noindex, its path is 404.html and it has no word target. This check
// owns its contract instead.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const { focusServices } = await import("../src/data/services.ts");
const { bookingUrl } = await import("../src/data/site.ts");

const dist = new URL("../dist/", import.meta.url);
const failures = [];
const fail = (msg) => failures.push(msg);

const html = await readFile(new URL("404.html", dist), "utf8").catch(
  () => null,
);
if (html === null) {
  console.error("check-seo-19: dist/404.html does not exist");
  process.exit(1);
}

if (!/<meta name="robots" content="[^"]*noindex/.test(html))
  fail("404: missing robots noindex");
if (/<link rel="canonical"/.test(html))
  fail("404: must not declare a canonical");
const h1 = (html.match(/<h1[\s>]/g) || []).length;
if (h1 !== 1) fail(`404: expected exactly one H1, found ${h1}`);
if (/"@type":\s*"(Service|FAQPage)"/.test(html))
  fail("404: must not emit Service or FAQPage");

const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
for (const href of ["/", ...focusServices.map((s) => s.slug)]) {
  if (!main.includes(`href="${href}"`))
    fail(`404: main does not link to ${href}`);
}
if (
  !main.includes(bookingUrl) &&
  !main.includes(bookingUrl.replace(/&/g, "&#38;"))
) {
  fail("404: main does not link to the booking schedule");
}

const files = await readdir(dist);
for (const f of files.filter((f) => /^sitemap-.*\.xml$/.test(f))) {
  if (/\/404/.test(await readFile(new URL(f, dist), "utf8")))
    fail(`${f} lists the 404`);
}
if (/\/404/.test(await readFile(new URL("llms.txt", dist), "utf8")))
  fail("llms.txt lists the 404");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name === "index.html") yield p;
  }
}
let indexable = 0;
for await (const file of walk(new URL(".", dist).pathname)) {
  const page = await readFile(file, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/.test(page)) continue;
  indexable++;
  if (!/<link rel="canonical"/.test(page))
    fail(
      `${path.relative(dist.pathname, file)}: indexable page lost its canonical`,
    );
}

if (failures.length) {
  for (const f of failures) console.error(`check-seo-19: ${f}`);
  process.exit(1);
}
console.log(
  `check-seo-19: 404 contract ok, ${indexable} indexable pages keep their canonical`,
);
