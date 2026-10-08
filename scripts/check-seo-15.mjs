import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const html = await readFile("dist/seo-local-sevilla/index.html", "utf8")
const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
const legacyOrUnsafe = /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|pacientes|tratamientos/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

assert.equal((html.match(/<h1\b/gi) ?? []).length, 1)
assert.match(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "", /SEO local Sevilla/)
assert.match(text, /300 €\/mes \+ IVA/)
assert.match(text, /500 €\/mes \+ IVA/)
assert.match(text, /Recomendado/)
assert.match(text, /Reservar una llamada/)
assert.match(text, /Los dos planes se facturan mes a mes/)
assert.doesNotMatch(text, legacyOrUnsafe)
assert.doesNotMatch(text, positivePromise)

const payloads = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  .map(([, payload]) => JSON.parse(payload))
const entities = payloads.flatMap((payload) => payload["@graph"] ?? [payload])
const service = entities.find((entity) => entity["@type"] === "Service")

assert.ok(service, "Expected a Service entity in JSON-LD")
assert.equal(service.offers?.price, "300")
assert.equal(service.offers?.priceCurrency, "EUR")
assert.match(service.offers?.url ?? "", /\/seo-local-sevilla\/$/)
assert.doesNotMatch(JSON.stringify(service), legacyOrUnsafe)

console.log("SEO-15 OK: seo-local-sevilla commercial and schema checks passed")
