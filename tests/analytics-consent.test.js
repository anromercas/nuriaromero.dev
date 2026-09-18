import test from 'node:test'
import assert from 'node:assert/strict'
import { createConsentController } from '../src/scripts/analytics-consent.js'

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
  assert.deepEqual(calls, [])
})

test('acceptance persists consent and loads GA with advertising consent denied', () => {
  const { controller, store, calls, scripts } = setup()
  controller.accept()
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
  controller.accept()
  controller.reject()
  controller.trackPageView()
  assert.ok(calls.some((args) => args[0] === 'consent' && args[1] === 'update' && args[2].analytics_storage === 'denied'))
  assert.equal(calls.some((args) => args[0] === 'event' && args[1] === 'page_view'), false)
})
