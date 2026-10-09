import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const intentBlock = (intents, url) => {
  const start = intents.indexOf(`url: "${url}"`)
  assert.ok(start >= 0, `intent for ${url} exists`)
  const end = intents.indexOf('url: "', start + 1)
  return intents.slice(start, end === -1 ? undefined : end)
}
const signal = (block, key) => block.match(new RegExp(`${key}: "([^"]+)"`))?.[1]

test('capilar intent signals mirror the real copy in services.ts', async () => {
  const [intents, services] = await Promise.all([source('src/data/seo-intents.ts'), source('src/data/services.ts')])
  const block = intentBlock(intents, '/seo-para-clinicas-capilares-sevilla/')
  const description = signal(block, 'descriptionSignal')
  assert.ok(services.includes(description), `description signal "${description}" is in the real description`)
  assert.match(services, /description: "CAPILAR LOCAL optimiza/, 'real description leads with the CAPILAR LOCAL keyword')
  assert.match(description, /300 €\/mes \+ IVA/)
  const signals = block.match(/contentSignals: \[([^\]]*)\]/)[1].match(/"([^"]+)"/g).map((s) => s.slice(1, -1))
  for (const s of signals) assert.ok(services.includes(s), `content signal "${s}" is in the real copy`)
})

test('comercios intent description signal mirrors the real niche description', async () => {
  const [intents, niches] = await Promise.all([source('src/data/seo-intents.ts'), source('src/data/niches.ts')])
  const description = signal(intentBlock(intents, '/web-para-comercios-sevilla/'), 'descriptionSignal')
  assert.ok(niches.includes(description), `description signal "${description}" is in the real description`)
})
