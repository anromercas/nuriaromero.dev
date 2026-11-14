import test from 'node:test'
import assert from 'node:assert/strict'
import { createConsentController, createGtag } from '../src/scripts/analytics-consent.js'

const tag = (value) => Object.prototype.toString.call(value)

function withWindow(run) {
  const previous = globalThis.window
  globalThis.window = { location: { pathname: '/' } }
  try {
    return run()
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
}

function setupReal(initial = null) {
  const store = new Map(initial ? [['site-analytics-consent', initial]] : [])
  const target = {}
  const scripts = []
  const controller = createConsentController({
    storage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    gtag: createGtag(target),
    appendScript: (src) => scripts.push({ src, queued: target.dataLayer.length }),
    measurementId: 'G-NCV98R3HW7',
  })
  return { controller, target, scripts }
}

function setup(initial = null) {
  const store = new Map(initial ? [['site-analytics-consent', initial]] : [])
  const calls = []
  const scripts = []
  const controller = createConsentController({
    storage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    gtag: (...args) => calls.push(args),
    appendScript: (src) => scripts.push(src),
    measurementId: 'G-NCV98R3HW7',
  })
  return { controller, store, calls, scripts }
}

test('does not load analytics before affirmative consent', () => {
  const { controller, scripts, calls } = setup()
  controller.initialize()
  assert.deepEqual(scripts, [])
  assert.deepEqual(calls, [
    [
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ],
  ])
})

test('acceptance persists consent and loads GA with advertising consent denied', () => {
  const { controller, store, calls, scripts } = setup()
  withWindow(() => controller.accept())
  assert.equal(store.get('site-analytics-consent'), 'accepted')
  assert.deepEqual(scripts, ['https://www.googletagmanager.com/gtag/js?id=G-NCV98R3HW7'])
  assert.ok(calls.some((args) => args[0] === 'consent' && args[1] === 'update' && args[2].analytics_storage === 'granted'))
  assert.equal(calls.some((args) => args[0] === 'consent' && args[2]?.ad_storage === 'granted'), false)
})

test('stored rejection does not load GA', () => {
  const { controller, scripts } = setup('rejected')
  controller.initialize()
  assert.deepEqual(scripts, [])
})

test('revocation prevents further page views and denies analytics consent', () => {
  const { controller, calls } = setup()
  withWindow(() => controller.accept())
  const viewsBeforeRevoke = calls.filter((args) => args[0] === 'event' && args[1] === 'page_view').length
  controller.reject()
  controller.trackPageView()
  assert.ok(calls.some((args) => args[0] === 'consent' && args[1] === 'update' && args[2].analytics_storage === 'denied'))
  assert.equal(calls.filter((args) => args[0] === 'event' && args[1] === 'page_view').length, viewsBeforeRevoke)
})

test('createGtag pushes an Arguments object, not an Array', () => {
  const target = {}
  const gtag = createGtag(target)
  gtag('consent', 'default', { analytics_storage: 'denied' })
  const entry = target.dataLayer[0]
  assert.equal(Array.isArray(entry), false)
  assert.equal(tag(entry), '[object Arguments]')
  assert.deepEqual(Array.from(entry), ['consent', 'default', { analytics_storage: 'denied' }])
  assert.equal(target.gtag, gtag)
})

test('createGtag keeps an existing dataLayer and its entries', () => {
  const existing = ['previous']
  const target = { dataLayer: existing }
  createGtag(target)('js', 1)
  assert.equal(target.dataLayer, existing)
  assert.equal(target.dataLayer[0], 'previous')
  assert.equal(target.dataLayer.length, 2)
})

test('consent default is queued before gtag.js is requested', () => {
  withWindow(() => {
    const { controller, target, scripts } = setupReal()
    controller.initialize()
    controller.accept()
    assert.deepEqual(Array.from(target.dataLayer[0]), [
      'consent',
      'default',
      { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
    ])
    assert.equal(scripts.length, 1)
    const before = target.dataLayer.slice(0, scripts[0].queued).map((entry) => Array.from(entry))
    assert.ok(before.some((a) => a[0] === 'consent' && a[1] === 'update' && a[2].analytics_storage === 'granted'))
    assert.ok(before.some((a) => a[0] === 'js'))
    assert.ok(before.some((a) => a[0] === 'config' && a[1] === 'G-NCV98R3HW7'))
    assert.ok(target.dataLayer.every((entry) => tag(entry) === '[object Arguments]'))
  })
})

test('accepting sends a page_view for the current page once', () => {
  withWindow(() => {
    const { controller, target } = setupReal()
    controller.initialize()
    controller.accept()
    controller.accept()
    const views = target.dataLayer.map((entry) => Array.from(entry)).filter((a) => a[0] === 'event' && a[1] === 'page_view')
    assert.equal(views.length, 1)
    assert.deepEqual(views[0][2], { page_path: '/' })
  })
})

test('stored consent on initialize does not send an extra page_view', () => {
  withWindow(() => {
    const { controller, target } = setupReal('accepted')
    controller.initialize()
    const events = target.dataLayer.map((entry) => Array.from(entry)).filter((a) => a[0] === 'event')
    assert.equal(events.length, 0)
  })
})

test('AnalyticsConsent.astro uses createGtag instead of an Array-pushing wrapper', async () => {
  const { readFile } = await import('node:fs/promises')
  const source = await readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8')
  assert.match(source, /import\s*\{[^}]*\bcreateGtag\b[^}]*\}\s*from\s*["']\.\.\/scripts\/analytics-consent\.js["']/)
  assert.match(source, /createGtag\(window\)/)
  assert.doesNotMatch(source, /dataLayer\.push\(args\)/)
})

test('homepage related links include the contextual resources page', async () => {
  const { readFile } = await import('node:fs/promises')
  const links = await readFile(new URL('../src/data/internal-links.ts', import.meta.url), 'utf8')
  const homepageLinks = links.match(/"\/": \[([\s\S]*?)\n  \],/)?.[1] ?? ''
  assert.match(homepageLinks, /path: "\/recursos\/".*kind: "contextual"/)
})

test('cookie policy links use the canonical trailing-slash path', async () => {
  const { readFile } = await import('node:fs/promises')
  const [consent, privacy] = await Promise.all([
    readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/privacidad.astro', import.meta.url), 'utf8'),
  ])
  assert.match(consent, /href="\/cookies\/"/)
  assert.match(privacy, /href="\/cookies\/"/)
})

test('about portrait imports and renders the Astro WebP asset', async () => {
  const { access, readFile } = await import('node:fs/promises')
  const about = await readFile(new URL('../src/components/AboutMe.astro', import.meta.url), 'utf8')
  assert.match(about, /import\s+portrait\s+from\s+['"]@\/assets\/me\.webp['"]/)
  assert.match(about, /<Image[\s\S]*?src=\{portrait\}/)
  await access(new URL('../src/assets/me.webp', import.meta.url))
})

test('every import.meta.env variable read in src is declared in env.d.ts', async () => {
  const { readFile, readdir } = await import('node:fs/promises')
  const envTypes = await readFile(new URL('../src/env.d.ts', import.meta.url), 'utf8')
  const declared = envTypes.match(/interface ImportMetaEnv\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
  assert.match(declared, /readonly PUBLIC_GA4_MEASUREMENT_ID\?: string/)

  const srcDir = new URL('../src/', import.meta.url)
  const entries = await readdir(srcDir, { recursive: true })
  const used = new Set()
  for (const entry of entries.filter((name) => /\.(astro|ts)$/.test(name) && !name.endsWith('env.d.ts'))) {
    const source = await readFile(new URL(entry, srcDir), 'utf8')
    for (const match of source.matchAll(/import\.meta\.env\.(\w+)/g)) used.add(match[1])
  }
  for (const name of used) {
    assert.match(declared, new RegExp(`readonly ${name}\\??: `), `${name} is not declared in src/env.d.ts`)
  }
})
