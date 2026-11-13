import test from 'node:test'
import assert from 'node:assert/strict'
import { source, localTierFrom, homeDescriptionTemplate, renderedHomeDescription } from './helpers/home-description.js'

const EXPRESSION = '${tierFrom(seoLocal, "Local")}'
const EXPECTED_DESCRIPTION =
  'Consultor SEO en Sevilla para negocios locales: aparece en Google, Maps y en las respuestas de IA. SEO local desde 300 €/mes + IVA y trato directo.'

test('services.ts exports the tierFrom helper', async () => {
  const servicesSrc = await source('src/data/services.ts')
  assert.match(servicesSrc, /export function tierFrom\(/)
})

test('home description is a template built from the Local tier of seoLocal', async () => {
  const home = await source('src/pages/index.astro')
  const template = homeDescriptionTemplate(home)
  assert.ok(template, 'no se encontró "const homeDescription = `...`" en index.astro')
  assert.ok(template.includes(EXPRESSION), `la plantilla debe contener ${EXPRESSION}`)
  assert.doesNotMatch(template.replace(EXPRESSION, ''), /€/, 'la plantilla no debe llevar importes en € literales')
  assert.match(home, /import\s*\{[^}]*\btierFrom\b[^}]*\}\s*from\s*"@\/data\/services"/)
})

test('home description renders identical to the published text and stays within 160 chars', async () => {
  const description = await renderedHomeDescription()
  assert.equal(description, EXPECTED_DESCRIPTION)
  assert.ok(description.length <= 160, `la description mide ${description.length} caracteres`)
})

test('home Layout receives homeDescription', async () => {
  const home = await source('src/pages/index.astro')
  assert.match(home, /<Layout\s+title="[^"]+"\s+description=\{homeDescription\}/)
})

test('Local tier value is read from data (not Local Pro)', async () => {
  const servicesSrc = await source('src/data/services.ts')
  assert.equal(localTierFrom(servicesSrc), '300 €/mes + IVA')
})
