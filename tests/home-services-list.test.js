import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('home groups services by problem as compact, accessible linked rows without changing pricing cards', async () => {
  const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8')
  const servicesSection = home.split('<SectionContainer id="servicios">')[1]?.split('<SectionContainer id="precios">')[0] ?? ''
  const pricingSection = home.split('<SectionContainer id="precios">')[1]?.split('<SectionContainer id="proceso">')[0] ?? ''

  assert.match(servicesSection, /serviceGroups\.map\(\(group\) => \(/)
  assert.match(servicesSection, /\{group\.title\}/)
  assert.match(servicesSection, /<ul class="grid[^\"]*md:grid-cols-2/)
  assert.match(servicesSection, /services\s*\.filter\(\(service\) => group\.slugs\.includes\(service\.slug\)\)\s*\.map\(\(service\) => \(/)
  assert.match(servicesSection, /href=\{service\.slug\}/)
  assert.match(servicesSection, /\{service\.breadcrumbName\}/)
  assert.match(servicesSection, /\{serviceOutcomes\[service\.slug\]\}/)
  assert.match(servicesSection, /focus-visible:/)
  assert.match(servicesSection, /border-b/)
  assert.doesNotMatch(servicesSection, /hover:shadow|bg-gray-100\/50 p-6|Ver servicio/)
  assert.match(pricingSection, /services\.map\(\(service\) => \(/)
  assert.match(pricingSection, /\{service\.pricing\.from\}/)
})
