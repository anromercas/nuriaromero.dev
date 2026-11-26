import test from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

const contract = () => import("../scripts/lib/google-reviews-contract.mjs")

const rating = (over = {}) => ({
  "@type": ["ProfessionalService", "Organization"],
  "@id": "https://nuriaromero.dev/#business",
  aggregateRating: { "@type": "AggregateRating", ratingValue: 4.8, reviewCount: 7, bestRating: 5, worstRating: 1 },
  ...over,
})
const review = (over = {}) => ({
  "@type": "Review",
  author: { "@type": "Person", name: "Ana" },
  reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
  reviewBody: "Muy buen trabajo",
  ...over,
})

function page({ nodes, stat = "4,8 en Google", label = "7 opiniones", quote = { text: "Muy buen trabajo", author: "Ana", rating: 5 } } = {}) {
  const ld = nodes === undefined ? "" : `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": nodes })}</script>`
  const strip = stat ? `<ul><li><strong>${stat}</strong><span>${label}</span></li></ul>` : ""
  const figure = quote
    ? `<figure class="quote"><blockquote data-review-quote><p>${quote.text}</p></blockquote><figcaption><div class="stars" data-review-rating="${quote.rating}"></div><span class="author" data-review-author>${quote.author}</span></figcaption></figure>`
    : ""
  return `<html><head>${ld}</head><body>${strip}${figure}</body></html>`
}

const failuresOf = async (html) => (await contract()).googleReviewsFailures(html).failures

test("passes when the JSON-LD declares the visible rating and the quoted review", async () => {
  assert.deepEqual(await failuresOf(page({ nodes: [rating({ review: [review()] })] })), [])
})

test("passes when the JSON-LD has no reviews schema", async () => {
  const result = (await contract()).googleReviewsFailures(page({ nodes: [{ "@type": "WebSite" }], stat: "", quote: null }))
  assert.deepEqual(result.failures, [])
})

test("passes with only the aggregate rating", async () => {
  assert.deepEqual(await failuresOf(page({ nodes: [rating()] })), [])
})

test("fails on a review that is not visible", async () => {
  const extra = review({ author: { "@type": "Person", name: "Luis" }, reviewBody: "Otra" })
  const failures = await failuresOf(page({ nodes: [rating({ review: [review(), extra] })] }))
  assert.deepEqual(failures, ['review by "Luis" is not visible on the page'])
})

test("fails when the review text differs", async () => {
  const failures = await failuresOf(page({ nodes: [rating({ review: [review({ reviewBody: "Distinto" })] })] }))
  assert.ok(failures.some((f) => /review by "Ana" is not visible/.test(f)))
})

test("fails when the review rating differs from the visible one", async () => {
  const bad = review({ reviewRating: { "@type": "Rating", ratingValue: 3, bestRating: 5, worstRating: 1 } })
  const failures = await failuresOf(page({ nodes: [rating({ review: [bad] })] }))
  assert.ok(failures.some((f) => /review by "Ana" has rating 3 but the page shows 5/.test(f)))
})

test("fails when ratingValue differs from the visible rating", async () => {
  const node = rating()
  node.aggregateRating.ratingValue = 4.5
  const failures = await failuresOf(page({ nodes: [node] }))
  assert.ok(failures.some((f) => /ratingValue 4\.5 does not match the visible rating 4,8/.test(f)))
})

test("fails when reviewCount differs from the visible count", async () => {
  const node = rating()
  node.aggregateRating.reviewCount = 9
  const failures = await failuresOf(page({ nodes: [node] }))
  assert.ok(failures.some((f) => /reviewCount 9 does not match the visible count 7/.test(f)))
})

test("fails when aggregateRating is declared but the stat is not visible", async () => {
  const failures = await failuresOf(page({ nodes: [rating()], stat: "" }))
  assert.ok(failures.some((f) => /aggregateRating is declared but the rating stat is not visible/.test(f)))
})

test("fails with two nodes carrying aggregateRating", async () => {
  const failures = await failuresOf(page({ nodes: [rating(), rating({ "@id": "x" })] }))
  assert.ok(failures.some((f) => /expected at most one node with aggregateRating, found 2/.test(f)))
})

test("decodes HTML entities and collapses whitespace before comparing", async () => {
  const body = `Dijo "bien" y it's A&B`
  const html = page({
    nodes: [rating({ review: [review({ reviewBody: body, author: { "@type": "Person", name: "Ana  María" } })] })],
    quote: { text: "Dijo &quot;bien&quot; y it&#39;s A&amp;B", author: "Ana\n  María", rating: 5 },
  })
  assert.deepEqual(await failuresOf(html), [])
})

test("fails when there is no JSON-LD", async () => {
  assert.deepEqual(await failuresOf(page({})), ["no JSON-LD found"])
})

test("CLI exits 0 on an agreeing page and 1 with the GOOGLE-REVIEWS prefix otherwise", async () => {
  const dir = await mkdtemp(join(tmpdir(), "check-google-reviews-"))
  const ok = join(dir, "ok.html")
  const bad = join(dir, "bad.html")
  await writeFile(ok, page({ nodes: [rating({ review: [review()] })] }))
  await writeFile(bad, page({ nodes: [rating({ review: [review(), review({ author: "Luis", reviewBody: "x" })] })] }))
  const run = (file) => spawnSync(process.execPath, ["scripts/check-google-reviews.mjs", file], { encoding: "utf8" })

  const good = run(ok)
  assert.equal(good.status, 0)
  assert.match(good.stdout, /GOOGLE-REVIEWS OK: /)
  const failed = run(bad)
  assert.equal(failed.status, 1)
  assert.match(failed.stderr, /GOOGLE-REVIEWS: review by "Luis" is not visible on the page/)
})
