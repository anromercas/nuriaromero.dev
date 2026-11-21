# Blog voice guide

How blog posts of nuriaromero.dev sound and what they never say. The draft step of `.claude/skills/blog-pipeline/` reads it before writing; the review applies the checklist at the end. Instructions are in English, examples in Spanish (ADR 0008).

## Who reads the posts

A local business owner in Seville (PRD persona 1) who is not technical and searches with everyday words: "como aparecer en google maps", "cuanto cuesta una pagina web". Write for that person, not for other SEOs.

## Voice

Spanish from Spain, close and professional, always `tú` (never `usted`, never `vosotros`). Short sentences, concrete nouns, no agency tone.

- Do: "Si tienes una pastelería en Nervión, empieza por tu ficha de Google."
- Don't: "Les recomendamos optimizar su presencia digital de forma integral."

## Value before mechanism

Say what the reader gains first, then how it works.

- Do: "Que te encuentren cuando buscan 'fontanero cerca de mí'. Para eso, tu ficha debe estar completa."
- Don't: "Una ficha con NAP coherente y categorías secundarias..."

## Explain jargon

Explain a technical term in plain words the first time it appears (SEO, GEO, ficha, schema, NAP).

- Do: "Datos estructurados: código invisible para el visitante que describe qué es tu negocio."
- Don't: "Añade schema LocalBusiness." (unexplained)

## Never promise rankings

A post never promises a Google position, a guaranteed result, traffic, sales, or that ChatGPT or any other AI assistant will mention or recommend the business. Describe what improves in the information, not the outcome (invariant "No promised rankings").

- Do: "Nadie puede garantizarte una posición, pero sí mejorar la información que Google tiene de ti."
- Don't: "Saldrás el primero en Google en un mes." / "ChatGPT te recomendará."

## Real proof only

No invented figures, testimonials, clients or case results. Every figure or claim cites a source listed in the post's `esquema.md` (`## Fuentes`). Prices only come from `src/data` (single price source).

- Do: "No damos una cifra porque no podríamos sostenerla con datos verificables."
- Don't: "El 70 % de tus clientes ya busca con IA."

## Direct answer first

The first paragraph after the H1 (section `## Respuesta corta`) answers the target question on its own in 1-2 sentences. Every key H2 opens with its direct answer before the context (GEO template).

- Do: "## ¿Qué es el GEO? / El GEO es organizar la información de tu negocio para que una IA pueda entenderla."
- Don't: opening with history or context before the answer.

## One brand

The brand is always "Nuria Romero" (`SITE.name`, ADR 0016). No variants such as "Nuria Romero Dev", and the domain is not used as a name.

## Dates are real

`pubDate` is the real publication date. Set `updatedDate` only when the content really changed (ADR 0017). No hand-written "actualizado" text in the body.

## Keywords, naturally

The target question appears where a person would say it. No keyword lists, place-name lists or hidden text.

- Do: "¿Cómo aparezco en Google Maps con mi negocio en Sevilla?"
- Don't: "SEO Sevilla, SEO Triana, SEO Nervión, SEO Los Remedios..."

## Close

The body ends with a practical next step. The post layout already renders "Reserva una llamada" with the booking link, so the body adds no booking block and no second CTA.

## Checklist

Mark each item meets / does not meet on a draft or a published post.

1. Uses `tú` throughout and reads like a person, not an agency.
2. The opening answers the question by itself in 1-2 sentences.
3. Each H2 starts with a direct answer.
4. Every technical term is explained the first time.
5. No promised position, result or AI mention.
6. Every figure or claim has a source listed in `esquema.md`; no invented testimonials or clients.
7. The brand appears only as "Nuria Romero".
8. Keywords read naturally; the close points to booking a call without a duplicate CTA block.
