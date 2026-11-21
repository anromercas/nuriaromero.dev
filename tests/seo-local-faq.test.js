import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const { seoLocal, tierFrom, pricingTier } = await import(
  new URL("../src/data/services.ts", import.meta.url).href
);
const { faqSchema, faqAnswerText } = await import(
  new URL("../src/lib/schema.ts", import.meta.url).href
);

const QUESTIONS = [
  "¿Qué es el SEO local?",
  "¿Para qué tipo de negocio encaja este servicio?",
  "¿Cómo puede aparecer mi negocio en Google Maps?",
  "¿Qué diferencia hay entre Local y Local Pro?",
  "¿Cuánto cuesta el SEO local?",
  "¿Qué ocurre en la llamada?",
  "¿Qué se mide y cómo se informa?",
  "¿Necesito tener web?",
  "¿Hay una puesta en marcha separada o una permanencia?",
  "¿Qué papel tienen los sistemas de IA?",
  "¿Eres una agencia de SEO local?",
];

const answerOf = (q) => seoLocal.faqs.find((f) => f.q === q).a;
const PRICE_Q = "¿Cuánto cuesta el SEO local?";
const MAPS_Q = "¿Cómo puede aparecer mi negocio en Google Maps?";

test("seoLocal.faqs lists the 11 questions in the designed order", () => {
  assert.deepEqual(
    seoLocal.faqs.map((f) => f.q),
    QUESTIONS,
  );
});

test("the definition entry carries the spec text", () => {
  assert.equal(
    answerOf("¿Qué es el SEO local?"),
    "Es el trabajo para que tu negocio aparezca en Google y en Google Maps cuando alguien cerca de ti busca lo que ofreces. Incluye tu ficha de Google, tus reseñas y, según el plan, tu web.",
  );
});

test("the price answer renders both plan prices from the pricing source", () => {
  const expected =
    "El plan Local cuesta 300 €/mes + IVA y el Local Pro, 500 €/mes + IVA. Se facturan mes a mes y no hay cuota de puesta en marcha aparte.";
  assert.equal(answerOf(PRICE_Q), expected);
  assert.equal(
    answerOf(PRICE_Q),
    `El plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}. Se facturan mes a mes y no hay cuota de puesta en marcha aparte.`,
  );
});

test("the price answer reads the pricing source when it is read", () => {
  const tier = pricingTier(seoLocal, "Local");
  const original = tier.from;
  try {
    tier.from = "123 €/mes + IVA";
    assert.ok(answerOf(PRICE_Q).includes("123 €/mes + IVA"));
  } finally {
    tier.from = original;
  }
});

test("the price entry source types no price", () => {
  const source = read("src/data/services.ts");
  const start = source.indexOf(`"${PRICE_Q}"`);
  assert.ok(start > -1);
  const rest = source.slice(start + PRICE_Q.length);
  const end = rest.search(/\bq:/);
  const slice = rest.slice(0, end === -1 ? undefined : end);
  assert.ok(slice.includes('${tierFrom(seoLocal, "Local")}'));
  assert.ok(slice.includes('${tierFrom(seoLocal, "Local Pro")}'));
  assert.ok(!slice.includes("€"));
});

test("serialization and faqSchema keep the prices and the 11 questions", () => {
  const copy = JSON.parse(JSON.stringify(seoLocal.faqs));
  const priced = copy.find((f) => f.q === PRICE_Q);
  assert.ok(priced.a.includes("300 €/mes + IVA"));
  assert.ok(priced.a.includes("500 €/mes + IVA"));
  const schema = faqSchema(seoLocal.faqs);
  assert.equal(schema.mainEntity.length, 11);
  schema.mainEntity.forEach((entity, i) => {
    assert.equal(entity.name, seoLocal.faqs[i].q);
    assert.equal(entity.acceptedAnswer.text, faqAnswerText(seoLocal.faqs[i].a));
  });
});

test("the Google Maps answer merges the plan sentence and keeps no digit", () => {
  const a = answerOf(MAPS_Q);
  assert.ok(
    a.startsWith(
      "Con una ficha de Google Business Profile completa y coherente",
    ),
  );
  assert.ok(
    a.includes(
      "Esa ficha es la base del SEO local: el plan Local la mantiene al día y Local Pro suma el trabajo en la web.",
    ),
  );
  assert.ok(a.endsWith("así que nadie puede prometer la primera posición."));
  assert.doesNotMatch(a, /\d/);
});

test("the new and changed answers promise nothing", () => {
  const promise =
    /garantiz|primera posici|primeros puestos|top ?\d|en \d+ (?:d[ií]as|semanas|meses)|chatgpt|te recomendar|te citar/i;
  const maps = answerOf(MAPS_Q).replace(
    "nadie puede prometer la primera posición",
    "",
  );
  for (const a of [
    answerOf("¿Qué es el SEO local?"),
    answerOf(PRICE_Q),
    maps,
  ]) {
    assert.doesNotMatch(a, promise);
  }
});

test("the check-seo-16 baseline lists the same 11 FAQPage questions", () => {
  const baseline = JSON.parse(
    read("tests/fixtures/seo-local-sevilla.baseline.json"),
  );
  const found = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === "object") {
      if (node["@type"] === "FAQPage") {
        found.push(node.mainEntity.map((e) => e.name));
      }
      Object.values(node).forEach(walk);
    }
  };
  walk(baseline);
  assert.equal(found.length, 1);
  assert.deepEqual(found[0], QUESTIONS);
});
