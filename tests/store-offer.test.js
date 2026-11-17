import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const {
  STORE_FROM,
  storeOptions,
  storeIncludes,
  storeQuotedSeparately,
  STORE_FINAL_PRICE_NOTE,
} = await import(new URL("../src/data/store-offer.ts", import.meta.url));
const { tiendaOnline } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);

const tiendaBlock = () => {
  const source = read("src/data/services.ts");
  const start = source.indexOf("export const tiendaOnline");
  const end = source.indexOf("export const ", start + 10);
  return source.slice(start, end === -1 ? undefined : end);
};

// Every string of the page data, with its JSON path.
const strings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => strings(v, out));
  return out;
};
const sentences = () =>
  strings(tiendaOnline).flatMap((s) =>
    s
      .split(/[.!?:\n]+/)
      .map((x) => x.trim())
      .filter(Boolean),
  );

test("source values: price, options, lists and note", () => {
  assert.equal(STORE_FROM, "499 €");
  assert.deepEqual(
    storeOptions.map((o) => o.name),
    ["WooCommerce", "Shopify", "Tienda a medida"],
  );
  assert.match(storeOptions[2].example, /Next\.js/);
  const [woo, shopify, custom] = storeOptions;
  assert.match(shopify.recurringCost, /cuota mensual/);
  assert.match(shopify.recurringCost, /Shopify/);
  for (const o of [woo, custom]) {
    assert.match(o.recurringCost, /hosting/);
    assert.match(o.recurringCost, /dominio/);
    assert.match(o.recurringCost, /a tu nombre/);
  }
  assert.equal(storeIncludes.length, 6);
  assert.equal(storeQuotedSeparately.length, 4);
  assert.equal(storeQuotedSeparately[3].link.href, "/automatizaciones/");
  assert.match(STORE_FINAL_PRICE_NOTE, /por escrito/);
  assert.match(STORE_FINAL_PRICE_NOTE, /antes de empezar/);
});

test('the literal "499 €" lives only in src/data/store-offer.ts', () => {
  const hits = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (
        /\.(ts|astro)$/.test(name) &&
        readFileSync(full, "utf8").includes("499 €")
      )
        hits.push(
          full.replace(fileURLToPath(new URL("../", import.meta.url)), ""),
        );
    }
  };
  walk(fileURLToPath(new URL("src", root)));
  assert.deepEqual(hits, ["src/data/store-offer.ts"]);
});

test("tiendaOnline reads the store offer source", () => {
  assert.equal(tiendaOnline.pricing.from, STORE_FROM);
  assert.deepEqual(tiendaOnline.pricing.includes, storeIncludes);
  assert.equal(tiendaOnline.pricing.note, STORE_FINAL_PRICE_NOTE);
  assert.doesNotMatch(tiendaBlock(), /€/);
  assert.equal(tiendaOnline.hero.secondaryCta.label, "Ver precio y opciones");
});

test("copy guards: no stale or third-party figures", () => {
  const all = strings(tiendaOnline).join("\n");
  assert.doesNotMatch(all, /399/);
  assert.doesNotMatch(all, /%/);
  for (const m of all.matchAll(/\d+/g)) {
    assert.ok(["499", "20"].includes(m[0]), `unexpected figure ${m[0]}`);
  }
});

test("copy guards: Redsys/Bizum are quoted separately, no free-Shopify claim", () => {
  for (const s of sentences()) {
    if (/Redsys|Bizum/.test(s)) assert.match(s, /aparte|presupuest/, s);
    assert.doesNotMatch(s, /sin (una )?cuota/i, s);
    if (/carga/.test(s) && /productos/.test(s) && /presupuest/.test(s))
      assert.match(s, /grande|masiv|muchos/, s);
  }
});

test("price FAQ and platform FAQ agree with the offer", () => {
  const price = tiendaOnline.faqs.find((f) =>
    f.q.startsWith("¿Cuánto cuesta una tienda online en Sevilla?"),
  );
  assert.ok(price.a.includes(STORE_FROM));
  assert.match(price.a, /panel/);
  assert.match(price.a, /por escrito/);
  const platform = tiendaOnline.faqs.find((f) => /Shopify/.test(f.q));
  assert.ok(platform, "FAQ de plataformas no encontrada");
  assert.match(platform.a, /WooCommerce/);
  assert.match(platform.a, /Shopify/);
  assert.match(platform.a, /a medida/);
  assert.doesNotMatch(
    platform.a,
    /no (te )?(lo )?ofrezco|no trabajo con shopify/i,
  );
});

// Task 1.2: page, component and built <main>. Assertions name no component on
// purpose: the page recomposition replaces StoreOffer.astro and keeps them green.
test("the store page reads the lists from the source and writes none of them", () => {
  const page = read("src/pages/tienda-online-sevilla.astro").replace(
    /\s+/g,
    " ",
  );
  for (const name of [
    "storeOptions",
    "storeIncludes",
    "storeQuotedSeparately",
  ]) {
    assert.match(page, new RegExp(`\\b${name}\\b`));
  }
  assert.match(page, /data\/store-offer/);
  const texts = [
    ...storeIncludes,
    ...storeQuotedSeparately.map((i) => i.text),
    ...storeOptions.flatMap((o) =>
      [o.recurringCost, o.example].filter(Boolean),
    ),
  ];
  for (const text of texts)
    assert.ok(!page.includes(text), `hand-written: ${text}`);
  assert.doesNotMatch(page, /no dependes de una plataforma/);
  assert.match(page, /vendes con tu marca, no dentro de un marketplace/);
});

test("components under tienda-online are props only", () => {
  const dir = new URL("src/components/tienda-online/", root);
  const files = readdirSync(fileURLToPath(dir)).filter((f) =>
    f.endsWith(".astro"),
  );
  assert.ok(files.length > 0);
  for (const f of files) {
    assert.doesNotMatch(
      readFileSync(new URL(f, dir), "utf8"),
      /from\s+["']@\/data/,
      f,
    );
  }
});

const distPage = new URL("dist/tienda-online-sevilla/index.html", root);
test(
  "built store page shows the offer in <main>",
  { skip: !existsSync(distPage) },
  () => {
    const html = readFileSync(distPage, "utf8");
    const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? "";
    const text = main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    assert.ok(text.includes(STORE_FROM), "price");
    assert.match(text, /Desde 499 €/);
    for (const o of storeOptions) {
      assert.ok(text.includes(o.name), o.name);
      assert.ok(text.includes(o.recurringCost), o.recurringCost);
    }
    for (const item of storeIncludes) assert.ok(text.includes(item), item);
    for (const item of storeQuotedSeparately)
      assert.ok(text.includes(item.text), item.text);
    assert.match(main, /<a\b[^>]*href="\/automatizaciones\/"/);
    assert.ok(text.includes(STORE_FINAL_PRICE_NOTE), "note");
  },
);

// Task 1.3: other store mentions read the source.
const { disenoWeb } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { comercios } = await import(
  new URL("../src/data/niches.ts", import.meta.url)
);

test("design-web full-website plan note gives the store price from the source", () => {
  const note = disenoWeb.pricing.tiers.find((t) =>
    /Web completa/.test(t.name),
  )?.note;
  assert.ok(note, "nota del plan Web completa no encontrada");
  assert.ok(note.includes(STORE_FROM));
  assert.match(note, /tienda online/);
  assert.doesNotMatch(note, /presupuesta aparte/);
  assert.doesNotMatch(note, /panel/);
});

test("commerce niche gives the store price from the source", () => {
  assert.ok(comercios.pricing.note.includes(STORE_FROM));
  assert.match(comercios.pricing.note, /tienda online/);
  const faq = comercios.faqs.find((f) =>
    f.q.startsWith("Catálogo o tienda online completa"),
  );
  assert.ok(faq, "FAQ de precio de comercios no encontrada");
  const second = faq.a.split("\n\n")[1];
  assert.ok(second.includes(STORE_FROM));
  assert.match(second, /\/tienda-online-sevilla\//);
  for (const s of strings(comercios)) {
    assert.doesNotMatch(s, /tienda online[^.]*se presupuesta (aparte|según)/i);
  }
});

test("niches.ts keeps its ten panel sentences untouched", () => {
  assert.equal(read("src/data/niches.ts").match(/panel/g).length, 10);
});
