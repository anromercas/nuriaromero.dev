import test from "node:test"
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const seoLocalData = async () => {
  const services = await source("src/data/services.ts")
  return services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))
}

const phrase = /posicionamiento web en Sevilla/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

test("exactly one H2 of /seo-local-sevilla/ names the phrase", async () => {
  const dir = "src/components/seo-local"
  const files = (await readdir(new URL(`../${dir}`, import.meta.url))).filter((name) => name.endsWith(".astro"))
  const headings = []
  for (const file of files) {
    const text = await source(`${dir}/${file}`)
    for (const [, inner] of text.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) headings.push(inner)
  }

  assert.equal(headings.filter((heading) => phrase.test(heading)).length, 1)
})

test("hero subtitle names the phrase and keeps the existing rules", async () => {
  const data = await seoLocalData()
  const subtitle = data.match(/subtitle:\s*\n?\s*"([^"]+)"/)?.[1]

  assert.ok(subtitle, "seoLocal.hero.subtitle not found")
  assert.match(subtitle, phrase)
  assert.ok(subtitle.length <= 200, `subtitle is ${subtitle.length} chars`)
  assert.match(subtitle, /^Tus clientes te buscan en Google/)
  assert.match(subtitle, /cada mes/)
})

test("exactly one FAQ answer names the phrase together with consultora SEO", async () => {
  const data = await seoLocalData()
  const answers = [...data.matchAll(/\n\s*a:\s*\n?\s*"([^"]+)"/g)].map(([, answer]) => answer)
  const matching = answers.filter((answer) => phrase.test(answer))

  assert.equal(matching.length, 1)
  assert.match(matching[0], /consultora SEO/)
})

test("copy stays honest: no agencia outside the negated question, no promises", async () => {
  const data = await seoLocalData()
  const withoutQuestion = data.replace("¿Eres una agencia de SEO local?", "")

  assert.doesNotMatch(withoutQuestion, /agencia/i)
  assert.doesNotMatch(data, positivePromise)
})

test("the home gains no new posicionamiento web mentions", async () => {
  const home = await source("src/pages/index.astro")

  assert.ok((home.match(/posicionamiento web/gi) ?? []).length <= 3)
})
