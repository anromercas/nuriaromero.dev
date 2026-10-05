import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

const legacyOrUnsafe = /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|permanencia obligatoria|pacientes|tratamientos/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

test("seo local data exposes only the approved recurring offer", async () => {
  const services = await source("src/data/services.ts")
  const seoLocal = services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))

  assert.match(seoLocal, /from:\s*"300 € \+ IVA"/)
  assert.match(seoLocal, /name:\s*"Local"[\s\S]*?from:\s*"300 €\/mes \+ IVA"/)
  assert.match(seoLocal, /name:\s*"Local Pro"[\s\S]*?from:\s*"500 €\/mes \+ IVA"[\s\S]*?recommended:\s*true/)
  assert.doesNotMatch(seoLocal, /initial:\s*\{/)
  assert.doesNotMatch(seoLocal, legacyOrUnsafe)
  assert.doesNotMatch(seoLocal, positivePromise)
})

test("seo local composition is diagnostic-led and books a call", async () => {
  const [route, audit, services] = await Promise.all([
    source("src/pages/seo-local-sevilla.astro"),
    source("src/components/seo-local/VisibilityAudit.astro"),
    source("src/data/services.ts"),
  ])
  const seoLocal = services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))

  assert.match(route, /<ServiceLayout page=\{seoLocal\}>/)
  assert.match(route, /<VisibilityAudit \/>/)
  assert.match(audit, /<section[\s\S]*?<h2/)
  assert.match(audit, /aria-labelledby=/)
  assert.match(audit, /<ul/)
  assert.match(audit, /Qué recibirás|Trabajo que podrás revisar/)
  assert.match(seoLocal, /primaryCtaLabel:\s*"Reservar una llamada"/)
  assert.match(seoLocal, /ctaLabel:\s*"Reservar una llamada"/)
})

test("booking button supports a page-specific call label without changing its safe default", async () => {
  const button = await source("src/components/BookingButton.astro")

  assert.match(button, /label\?:\s*string/)
  assert.match(button, /ariaLabel\?:\s*string/)
  assert.match(button, /label\s*=\s*"Reserva una primera sesión"/)
  assert.match(button, /ariaLabel\s*=\s*label/)
})
