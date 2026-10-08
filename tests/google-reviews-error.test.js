import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('logs the Google Places API error body without exposing the API key', async () => {
  const source = await readFile(new URL('../src/lib/google-reviews.ts', import.meta.url), 'utf8')

  assert.match(source, /const errorBody = await response\.text\(\)/)
  assert.match(source, /Place Details respondió \$\{response\.status\}[^\n]*\$\{errorBody/)
  assert.doesNotMatch(source, /console\.(?:warn|error)\([^\n]*apiKey/)
})

test('prefers the review text in its original language', async () => {
  const source = await readFile(new URL('../src/lib/google-reviews.ts', import.meta.url), 'utf8')

  assert.ok(source.includes('text: review.originalText?.text ?? review.text?.text ?? ""'))
})

test('shows review dates in Spanish computed from publishTime, falling back to the API string', async () => {
  const source = await readFile(new URL('../src/lib/google-reviews.ts', import.meta.url), 'utf8')

  assert.match(source, /"X-Goog-FieldMask": "reviews,rating,userRatingCount"/)
  assert.match(source, /publishTime\?:\s*string/)
  assert.match(source, /new Intl\.RelativeTimeFormat\("es"/)
  assert.match(source, /relativeTime:\s*formatRelativeTimeEs\(review\.publishTime\)\s*\|\|\s*\(review\.relativePublishTimeDescription \?\? ""\)/)
})
