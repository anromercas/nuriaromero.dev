import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const workflowPath = '.github/workflows/ci.yml'

test('CI workflow file exists and is named CI', async () => {
  const yml = await readSource(workflowPath)
  assert.match(yml, /^name: CI$/m)
})

test('runs on pull requests to develop and pushes to develop and main', async () => {
  const yml = await readSource(workflowPath)
  assert.match(yml, /pull_request:\s*\n\s+branches: \[develop\]/)
  assert.match(yml, /push:\s*\n\s+branches: \[develop, main\]/)
})

test('defines the verify job on ubuntu-latest', async () => {
  const yml = await readSource(workflowPath)
  assert.match(yml, /^jobs:\s*\n\s+verify:/m)
  assert.match(yml, /^\s+name: verify$/m)
  assert.match(yml, /^\s+runs-on: ubuntu-latest$/m)
})

test('verify steps run in the required order', async () => {
  const yml = await readSource(workflowPath)
  const markers = [
    'actions/checkout@v4',
    'pnpm/action-setup@v4',
    'version: 11',
    'actions/setup-node@v4',
    'node-version: 24',
    'cache: pnpm',
    'pnpm install --frozen-lockfile',
    'node --test tests/*.test.js',
    'pnpm build',
  ]
  const positions = markers.map((marker) => {
    const index = yml.indexOf(marker)
    assert.notEqual(index, -1, `missing step marker: ${marker}`)
    return index
  })
  const sorted = [...positions].sort((a, b) => a - b)
  assert.deepEqual(positions, sorted, 'steps are out of order')
})

test('token permissions are read-only', async () => {
  const yml = await readSource(workflowPath)
  assert.match(yml, /^permissions:\s*\n\s+contents: read$/m)
})

test('does not reference secrets, netlify or deploy', async () => {
  const yml = await readSource(workflowPath)
  assert.doesNotMatch(yml, /secrets\./i)
  assert.doesNotMatch(yml, /netlify/i)
  assert.doesNotMatch(yml, /deploy/i)
})
