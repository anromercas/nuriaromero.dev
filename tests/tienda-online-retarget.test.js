import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const PHRASE = 'Diseño de tienda online en Sevilla'
const promise =
  /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos|ventas)|aumenta(?:r|rás)? tus ventas)/i

const services = await source('src/data/services.ts')
const block = services.slice(services.indexOf('export const tiendaOnline'))
const field = (re) => block.match(re)?.[1]

const title = field(/seo:\s*\{\s*title:\s*"((?:\\.|[^"\\])*)"/)
const description = field(/description:\s*\n?\s*"((?:\\.|[^"\\])*)"/)
const h1 = field(/h1:\s*"((?:\\.|[^"\\])*)"/)
const subtitle = field(/subtitle:\s*\n?\s*"((?:\\.|[^"\\])*)"/)

const { intentMatrix, keywordOwners } = await import(
  new URL('../src/data/seo-intents.ts', import.meta.url)
)
const intent = intentMatrix.find((row) => row.url === '/tienda-online-sevilla/')

test('title and H1 lead with the build intent', () => {
  assert.ok(title?.startsWith(PHRASE), `title: ${title}`)
  assert.ok(title.length <= 65, `title mide ${title.length}`)
  assert.ok(h1?.startsWith(PHRASE), `h1: ${h1}`)
})

test('description is 140-160 chars, speaks of tienda online and promises nothing', () => {
  assert.ok(description, 'description no encontrada')
  assert.ok(
    description.length >= 140 && description.length <= 160,
    `description mide ${description.length}`
  )
  for (const text of [description, subtitle]) {
    assert.match(text, /tienda online|tiendas online/i)
    assert.doesNotMatch(text, promise)
  }
})

test('price logic is unchanged', async () => {
  const faq = block.match(/q:\s*"¿Cuánto cuesta una tienda online en Sevilla\?",\s*a:\s*"((?:\\.|[^"\\])*)"/)?.[1]
  assert.ok(faq, 'FAQ de precio no encontrada')
  assert.match(faq, /399 €/)
  assert.match(faq, /presupuest/)
  const llms = await source('public/llms.txt')
  const line = llms.split('\n').find((l) => l.includes('/tienda-online-sevilla/'))
  assert.ok(line.startsWith(`- [${PHRASE}]`), line)
  assert.match(line, /se presupuesta según el catálogo/)
})

test('intent signals follow the new copy', () => {
  assert.ok(intent, 'fila de intención no encontrada')
  assert.ok(title.includes(intent.titleSignal))
  assert.ok(h1.includes(intent.h1Signal))
  assert.ok(description.includes(intent.descriptionSignal))
  assert.equal(intent.titleSignal, PHRASE)
  assert.equal(intent.h1Signal, PHRASE)
})

test('keywordOwners maps the new term to the page', () => {
  assert.ok(
    keywordOwners.some(
      (o) => o.keyword === 'diseño tienda online sevilla' && o.url === '/tienda-online-sevilla/'
    )
  )
})
