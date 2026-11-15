# Plantilla para pedir una reseña en Google

Enlace de reseña de la ficha de Google Business Profile de Nuria Romero (el mismo que usa la web en `localTrust.gbp.writeReviewUrl`, `src/data/local-trust.ts`):

https://search.google.com/local/writereview?placeid=ChIJ8Uv-vM9f0CoR8J75dj4I0HM

Pedir reseñas es una tarea manual de Nuria: la web no envía nada a nadie. Si cambia el `placeId`, hay que actualizar este documento (lo comprueba `tests/review-template-sync.test.js`).

## Cuándo enviarla

- Después de entregar el proyecto y cuando el cliente ya haya podido usar el resultado.
- Una sola vez por cliente. Sin recordatorios insistentes.
- Se envía a todos los clientes con proyecto entregado, no solo a los que parezcan contentos.

## Plantilla de email

**Asunto:** ¿Me ayudas con una reseña en Google?

Hola [nombre]:

Gracias por haber confiado en mí para [proyecto]. Ha sido un gusto trabajar contigo.

Si te apetece, me ayudaría mucho que contaras tu experiencia en mi ficha de Google. A otras personas y negocios de Sevilla les sirve para saber cómo es trabajar conmigo. Es tu opinión y puedes escribirla con tus palabras; no hace falta que sea larga.

Puedes dejarla aquí, solo te llevará un par de minutos:

https://search.google.com/local/writereview?placeid=ChIJ8Uv-vM9f0CoR8J75dj4I0HM

Y si prefieres no hacerlo, no pasa nada. Seguimos en contacto igualmente.

Un abrazo,
Nuria Romero
nuriaromero.dev

## Plantilla de WhatsApp

Hola [nombre], soy Nuria. Gracias por haber confiado en mí para [proyecto], ha sido un placer trabajar contigo.

Si te apetece, me ayudaría que contaras tu experiencia en mi ficha de Google, con tus palabras y sin prisa. Aquí tienes el enlace: https://search.google.com/local/writereview?placeid=ChIJ8Uv-vM9f0CoR8J75dj4I0HM

Y si prefieres no hacerlo, no pasa nada. ¡Gracias!

## Reglas de Google

1. Sin incentivos: nunca se ofrece nada a cambio de la reseña (ni descuento, ni regalo, ni sorteo, ni un servicio extra). Tampoco se condiciona ningún trabajo a que el cliente la deje.
2. Sin filtrar: se pide a todos los clientes por igual. No se pregunta antes quién está contento para enviar el enlace solo a esos.
3. Nunca se escribe ni se edita la reseña por el cliente: ni redactarla, ni dictarla, ni corregirla. Las palabras son suyas.

Además: no se inventan reseñas, valoraciones ni cifras en la web. Solo se publica lo que Google muestra de reseñas reales.
