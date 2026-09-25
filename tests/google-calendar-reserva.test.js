import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const bookingUrl =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3MCaXahzt3LtR0JLmotWCaTlTd2NAYgMsbewkRE-Kd7Zl-AuRcaI9gb8x1u_CGhGgEiTNQ0Xaq?gv=true'

const commercialSources = [
  'src/pages/index.astro',
  'src/pages/contacto.astro',
  'src/pages/seo-para-clinicas-capilares-sevilla.astro',
  'src/components/services/ServiceHero.astro',
  'src/components/services/CTASection.astro',
  'src/components/services/PricingCard.astro',
]

test('centralizes the official booking URL in site data', async () => {
  const site = await readSource('src/data/site.ts')
  const sourceFiles = await Promise.all(commercialSources.map(readSource))

  assert.match(site, new RegExp(`bookingUrl\\s*=\\s*['"]${bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`))
  assert.equal(sourceFiles.join('\n').includes(bookingUrl), false)
})

test('booking CTAs open the official schedule in a new tab accessibly', async () => {
  const [button, homepage, contact, header, serviceHero] = await Promise.all([
    readSource('src/components/BookingButton.astro'),
    readSource('src/pages/index.astro'),
    readSource('src/pages/contacto.astro'),
    readSource('src/components/Header.astro'),
    readSource('src/components/services/ServiceHero.astro'),
  ])

  assert.match(button, /bookingUrl/)
  assert.match(button, /target="_blank"/)
  assert.match(button, /rel="noopener noreferrer"/)
  assert.match(button, /CalendarIcon[\s\S]*aria-hidden="true"/)
  assert.match(button, /Reserva una primera sesión/)
  for (const source of [homepage, contact, header, serviceHero]) {
    assert.match(source, /BookingButton/)
  }
})

test('commercial blocks remove inline WhatsApp and contact conversion alternatives', async () => {
  const sources = await Promise.all(commercialSources.map(readSource))

  for (const source of sources) {
    assert.doesNotMatch(source, /whatsappUrl|Escríbeme por WhatsApp|Formulario de contacto|Pedir presupuesto exacto/)
  }

  const [footer, floating] = await Promise.all([
    readSource('src/components/Footer.astro'),
    readSource('src/components/WhatsAppButton.astro'),
  ])
  assert.doesNotMatch(footer, /wa\.me|whatsappUrl/)
  assert.match(floating, /id="whatsapp-floating-button"/)
  assert.match(floating, /href={whatsappUrl}/)
})

test('mobile navigation keeps the booking CTA and floating WhatsApp guard available', async () => {
  const [header, floating] = await Promise.all([
    readSource('src/components/Header.astro'),
    readSource('src/components/WhatsAppButton.astro'),
  ])

  assert.match(header, /id="mobile-menu"[\s\S]*BookingButton/)
  assert.match(floating, /data-seo12-whatsapp/)
  await assert.rejects(readSource('src/scripts/whatsapp-button.js'))
  assert.doesNotMatch(floating, /is-hero-cta-visible/)
})

test('iframe route and iframe-only privacy/CSP residue are removed', async () => {
  const [headers, privacy, cookies, testFiles] = await Promise.all([
    readSource('public/_headers'),
    readSource('src/pages/privacidad.astro'),
    readSource('src/pages/cookies.astro'),
    Promise.all(['src/pages/index.astro', 'src/pages/contacto.astro'].map(readSource)),
  ])

  await assert.rejects(readSource('src/pages/reserva.astro'))
  assert.doesNotMatch(headers, /frame-src|calendar\.google\.com/)
  assert.doesNotMatch(privacy, /Google Calendar|calendario de citas alojado por Google/)
  assert.doesNotMatch(cookies, /página de reserva incorpora|calendario de Google Calendar|NID/)
  assert.equal(testFiles.some((source) => source.includes('/reserva/')), false)
})
