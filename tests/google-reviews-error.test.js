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

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('returns null without calling fetch when the Places credentials are missing', async () => {
  const source = await readSource('../src/lib/google-reviews.ts')
  const guard = source.search(/if \(!apiKey \|\| !placeId\) \{\s*return null\s*\}/)

  assert.notEqual(guard, -1)
  assert.ok(guard < source.indexOf('fetch('))
})

test('returns null when the Places response has no reviews', async () => {
  const source = await readSource('../src/lib/google-reviews.ts')

  assert.match(source, /if \(rawReviews\.length === 0\) \{[^}]*return null\s*\}/)
})

test('returns null when the request throws and never logs the API key', async () => {
  const source = await readSource('../src/lib/google-reviews.ts')
  const catchBlock = source.slice(source.indexOf('} catch'))

  assert.match(catchBlock, /console\.warn\(/)
  assert.match(catchBlock, /return null/)
  assert.doesNotMatch(catchBlock, /apiKey/)
})

test('GoogleReviews.astro renders only when there is data with at least one review', async () => {
  const source = await readSource('../src/components/GoogleReviews.astro')

  assert.match(source, /data && data\.reviews\.length > 0 && \(/)
})

test('the home adds the reviews JSON-LD only when data exists and fetches it once', async () => {
  const source = await readSource('../src/pages/index.astro')

  assert.ok(source.includes('...(reviewsData ? [reviewsSchema(reviewsData)] : [])'))
  assert.equal(source.match(/getGoogleReviews\(\)/g)?.length, 1)
})

test('package.json defines the google reviews check scripts', async () => {
  const pkg = JSON.parse(await readSource('../package.json'))

  assert.equal(pkg.scripts['check:google-reviews'], 'pnpm build && node scripts/check-google-reviews.mjs')
  assert.equal(pkg.scripts['check:google-reviews:dist'], 'node scripts/check-google-reviews.mjs')
})
