import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"

import robotsTxt from "astro-robots-txt"

// Lee `pubDate`/`updatedDate` del frontmatter de los posts del blog para poder
// asignar un `lastmod` real por URL en el sitemap (no la fecha de build).
// No se usa `astro:content` porque no está disponible en el contexto de este
// archivo de configuración: se ejecuta antes de que Astro inicialice el
// content layer, así que se parsea el frontmatter directamente.
const blogContentDir = fileURLToPath(new URL('./src/content/blog/', import.meta.url))

function getBlogLastmodBySlug() {
  const lastmodBySlug = new Map()

  for (const file of readdirSync(blogContentDir)) {
    if (!file.endsWith('.md')) continue

    const slug = file.replace(/\.md$/, '')
    const raw = readFileSync(new URL(file, `file://${blogContentDir}`), 'utf-8')
    const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) continue

    const frontmatter = frontmatterMatch[1]
    const pubDateMatch = frontmatter.match(/^pubDate:\s*(.+)$/m)
    const updatedDateMatch = frontmatter.match(/^updatedDate:\s*(.+)$/m)
    const rawDate = (updatedDateMatch?.[1] ?? pubDateMatch?.[1])?.trim().replace(/^["']|["']$/g, '')
    if (!rawDate) continue

    const date = new Date(rawDate)
    if (Number.isNaN(date.getTime())) continue

    lastmodBySlug.set(slug, date.toISOString())
  }

  return lastmodBySlug
}

const blogLastmodBySlug = getBlogLastmodBySlug()

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/components'),
      serialize(item) {
        const match = item.url.match(/\/blog\/([^/]+)\/?$/)
        const lastmod = match ? blogLastmodBySlug.get(match[1]) : undefined

        // Solo se añade `lastmod` cuando hay una fecha real del contenido
        // (posts del blog). El resto de páginas estáticas se dejan sin
        // `lastmod` en vez de rellenarlas con la fecha de build.
        return lastmod ? { ...item, lastmod } : item
      },
    }),
    robotsTxt({
      policy: [
        { userAgent: '*', allow: '/' },
        { userAgent: 'GPTBot', allow: '/' },
        { userAgent: 'OAI-SearchBot', allow: '/' },
        { userAgent: 'ClaudeBot', allow: '/' },
        { userAgent: 'Claude-Web', allow: '/' },
        { userAgent: 'anthropic-ai', allow: '/' },
        { userAgent: 'PerplexityBot', allow: '/' },
        { userAgent: 'Google-Extended', allow: '/' },
      ],
    }),
  ],
  site: 'https://nuriaromero.dev/'
})
