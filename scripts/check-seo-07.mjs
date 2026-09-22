import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"

const root = new URL("../", import.meta.url)
const distDir = new URL("dist/", root)
const intents = await import(new URL("src/data/seo-intents.ts", root))

const errors = []
const routeFile = (route) => {
  if (route === "/") return new URL("index.html", distDir)
  return new URL(`${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`, distDir)
}
const stripHtml = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")

for (const intent of intents.intentMatrix) {
  const file = routeFile(intent.url)
  if (!existsSync(file)) {
    errors.push(`${intent.url}: rendered page does not exist`)
    continue
  }
  const html = await readFile(file, "utf8")
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? ""
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? ""
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""
  const text = stripHtml(html)
  if (!title.includes(intent.titleSignal)) errors.push(`${intent.url}: title lacks signal "${intent.titleSignal}"`)
  if (!description.includes(intent.descriptionSignal)) errors.push(`${intent.url}: description lacks signal "${intent.descriptionSignal}"`)
  if (!stripHtml(h1).includes(intent.h1Signal)) errors.push(`${intent.url}: H1 lacks signal "${intent.h1Signal}"`)
  for (const signal of intent.contentSignals) {
    if (!text.includes(signal)) errors.push(`${intent.url}: copy lacks signal "${signal}"`)
  }
}

const extractFaqs = async (route) => {
  const html = await readFile(routeFile(route), "utf8")
  const faqs = []
  for (const [, question] of html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)) {
    faqs.push({ route, question: stripHtml(question).trim() })
  }
  return faqs
}

const nicheFaqs = (await Promise.all(intents.nicheRoutes.map(extractFaqs))).flat()

const duplicateQuestions = new Map()
for (const faq of nicheFaqs) {
  const routes = duplicateQuestions.get(faq.question) ?? []
  routes.push(faq.route)
  duplicateQuestions.set(faq.question, routes)
}
for (const [question, routes] of duplicateQuestions) {
  if (new Set(routes).size > 1) errors.push(`niche FAQ is duplicated across routes: "${question}" (${routes.join(", ")})`)
}

// Near-duplicate FAQ question detection, normalizing away the "en Sevilla" /
// punctuation noise that makes two otherwise-identical questions look distinct
// as raw strings (e.g. "¿Cuánto cuesta una tienda online?" vs. "¿Cuánto cuesta
// una tienda online en Sevilla?"). Two questions are near-duplicates only when
// their normalized forms are exactly equal — a looser "one contains the other"
// rule was tried and rejected because it false-flagged legitimately distinct
// pairs that merely share a question prefix (e.g. "¿Cuánto cuesta una página
// web para un restaurante?" vs. "¿Cuánto cuesta una página web en Sevilla?",
// which diverge meaningfully after that shared opening).
const normalizeQuestion = (question) =>
  question
    .toLowerCase()
    .replace(/[¿?¡!]/g, "")
    .replace(/\ben sevilla\b/g, "")
    .replace(/\s+/g, " ")
    .trim()

const isNearDuplicateQuestion = (a, b) => {
  const normalizedA = normalizeQuestion(a)
  const normalizedB = normalizeQuestion(b)
  if (!normalizedA || !normalizedB) return false
  return normalizedA === normalizedB
}

// Word-trigram Jaccard similarity, adapted from the niche-page copy check in
// check-seo-05.mjs (see ngramSimilarity/wordNgrams/normalizedWords there).
// The exact-match check above only catches wording that becomes byte-identical
// after normalizeQuestion (lowercasing, punctuation/"en sevilla" stripping).
// It misses wording variants — extra qualifiers, synonyms, reordering — such
// as "¿Cuánto cuesta una tienda online completa?" against the real "¿Cuánto
// cuesta una tienda online en Sevilla?" FAQ, which normalize to different
// strings but are still a real cannibalization risk. This layer catches that
// class of near-duplicate on top of (not instead of) the exact-match check.
const normalizedWords = (text) =>
  text
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .match(/[\p{L}\p{N}]+/gu) ?? []

const wordNgrams = (words, size = 3) => {
  const grams = new Set()
  for (let index = 0; index <= words.length - size; index += 1) {
    grams.add(words.slice(index, index + size).join(" "))
  }
  return grams
}

const ngramSimilarity = (left, right) => {
  const leftGrams = wordNgrams(normalizedWords(left))
  const rightGrams = wordNgrams(normalizedWords(right))
  const intersection = [...leftGrams].filter((gram) => rightGrams.has(gram)).length
  const union = new Set([...leftGrams, ...rightGrams]).size
  return union === 0 ? 0 : intersection / union
}

// Calibrated against the real niche-vs-service FAQ corpus (60 service FAQs x
// 33 niche FAQs): the highest real-content similarity found was 0.100
// ("¿Cuánto cuesta una página web para un restaurante?" vs. "¿Cuánto cuesta
// una tienda online en Sevilla?"), and the protected restaurantes/diseño-web
// pair from the previous SEO-19 fix sits at 0.071. A plausible wording
// variant of a real near-duplicate ("¿Cuánto cuesta una tienda online
// completa?" vs. the real tienda-online FAQ) scores 0.5. 0.35 sits well
// below that signal and with a wide (3.5x) margin above the highest
// legitimate real-content score, so it flags wording variants without
// false-flagging distinct FAQs that merely share an opening phrase.
const NICHE_SERVICE_SIMILARITY_THRESHOLD = 0.35

// Niche-vs-service near-duplicate check: the loop above only ever compares
// niche routes against each other (intents.nicheRoutes), so a niche FAQ that
// near-duplicates a *service* page's FAQ (different route family) was
// previously invisible to this checker.
const serviceFaqs = (await Promise.all(intents.serviceRoutes.map(extractFaqs))).flat()
for (const nicheFaq of nicheFaqs) {
  for (const serviceFaq of serviceFaqs) {
    if (isNearDuplicateQuestion(nicheFaq.question, serviceFaq.question)) {
      errors.push(
        `niche FAQ near-duplicates a service FAQ: "${nicheFaq.question}" (${nicheFaq.route}) ~= "${serviceFaq.question}" (${serviceFaq.route})`,
      )
      continue
    }
    const similarity = ngramSimilarity(nicheFaq.question, serviceFaq.question)
    if (similarity >= NICHE_SERVICE_SIMILARITY_THRESHOLD) {
      errors.push(
        `niche FAQ is a near-duplicate (${(similarity * 100).toFixed(1)}% word-trigram similarity) of a service FAQ: "${nicheFaq.question}" (${nicheFaq.route}) ~= "${serviceFaq.question}" (${serviceFaq.route})`,
      )
    }
  }
}

for (const linkCheck of intents.reciprocalLinks) {
  const source = await readFile(routeFile(linkCheck.source), "utf8")
  const target = await readFile(routeFile(linkCheck.target), "utf8")
  if (!source.includes(`href="${linkCheck.target}"`) || !source.includes(linkCheck.sourceAnchor)) {
    errors.push(`${linkCheck.source}: missing reciprocal anchor "${linkCheck.sourceAnchor}" to ${linkCheck.target}`)
  }
  if (!target.includes(`href="${linkCheck.source}"`) || !target.includes(linkCheck.targetAnchor)) {
    errors.push(`${linkCheck.target}: missing reciprocal anchor "${linkCheck.targetAnchor}" to ${linkCheck.source}`)
  }
}

if (errors.length) {
  console.error(`SEO-07 intent check failed (${errors.length} error${errors.length === 1 ? "" : "s"})`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(
  `SEO-07 intent check passed: ${intents.intentMatrix.length} intent rows, ${nicheFaqs.length} niche FAQs (incl. niche-vs-service near-duplicate check against ${serviceFaqs.length} service FAQs) and ${intents.reciprocalLinks.length} reciprocal link pairs checked`,
)
