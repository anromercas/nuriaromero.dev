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
