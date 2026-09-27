import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('logs the Google Places API error body without exposing the API key', async () => {
  const source = await readFile(new URL('../src/lib/google-reviews.ts', import.meta.url), 'utf8')

  assert.match(source, /const errorBody = await response\.text\(\)/)
  assert.match(source, /Place Details respondió \$\{response\.status\}[^\n]*\$\{errorBody/)
  assert.doesNotMatch(source, /console\.(?:warn|error)\([^\n]*apiKey/)
})
