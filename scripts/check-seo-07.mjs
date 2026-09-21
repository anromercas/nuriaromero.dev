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

const nicheFaqs = []
for (const route of intents.nicheRoutes) {
  const html = await readFile(routeFile(route), "utf8")
  for (const [, question] of html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)) {
    nicheFaqs.push({ route, question: stripHtml(question).trim() })
  }
}
const duplicateQuestions = new Map()
for (const faq of nicheFaqs) {
  const routes = duplicateQuestions.get(faq.question) ?? []
  routes.push(faq.route)
  duplicateQuestions.set(faq.question, routes)
}
for (const [question, routes] of duplicateQuestions) {
  if (new Set(routes).size > 1) errors.push(`niche FAQ is duplicated across routes: "${question}" (${routes.join(", ")})`)
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

console.log(`SEO-07 intent check passed: ${intents.intentMatrix.length} intent rows, ${nicheFaqs.length} niche FAQs and ${intents.reciprocalLinks.length} reciprocal link pairs checked`)
