import { readFile } from 'node:fs/promises'

export const source = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8')

// `from` of the "Local" tier of `seoLocal` (first match, not "Local Pro").
export function localTierFrom(servicesSrc) {
  const start = servicesSrc.indexOf('export const seoLocal')
  if (start === -1) throw new Error('no se encontró "export const seoLocal" en services.ts')
  const rest = servicesSrc.slice(start + 1)
  const next = rest.search(/\nexport const /)
  const block = next === -1 ? rest : rest.slice(0, next)
  const m = block.match(/name:\s*"Local",[\s\S]*?from:\s*"([^"]+)"/)
  if (!m) throw new Error('no se encontró el tier "Local" en seoLocal')
  return m[1]
}

// Raw template literal of `const homeDescription = \`...\`` in index.astro.
export function homeDescriptionTemplate(homeSrc) {
  return homeSrc.match(/const homeDescription = `([^`]+)`/)?.[1]
}

// Rendered home description: the tierFrom expression replaced by the data value.
export async function renderedHomeDescription() {
  const [home, servicesSrc] = await Promise.all([source('src/pages/index.astro'), source('src/data/services.ts')])
  const template = homeDescriptionTemplate(home)
  if (!template) throw new Error('no se encontró "const homeDescription = `...`" en index.astro')
  return template.replace('${tierFrom(seoLocal, "Local")}', localTierFrom(servicesSrc))
}
