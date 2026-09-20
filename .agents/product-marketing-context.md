# Contexto de negocio / avatar — nuriaromero.dev

Usado por las skills `copywriting` y `seo-page-pipeline` (y cualquier otra
que necesite contexto de negocio) para no tener que redefinir avatar,
servicios o restricciones en cada página nueva. Fuente de verdad de datos
duros: `src/data/site.ts`, `src/data/services.ts`, `src/data/niches.ts` —
si este archivo y el código no coinciden, gana el código.

## Negocio
- **Quién**: Nuria Romero Castillo — desarrolladora freelance, +10 años de
  experiencia en desarrollo de software (industria, salud, medioambiente,
  desde startups hasta consultoras como NTT DATA).
- **Dónde**: Sevilla capital y área metropolitana; también proyectos en
  remoto para el resto de España.
- **Qué vende** (precios reales, no inventar otros):
  - Diseño web: landing 149 €, web completa hasta 5 páginas 399 €.
  - Software a medida: desde 999 €, presupuesto por fases.
  - Automatizaciones (n8n/Make): desde 149 € por automatización.
  - IA / chatbots: desde 399 €, con prueba piloto previa.
  - E-commerce: sin precio público, se presupuesta según alcance.
  - **SEO local + GEO** (nuevo, 2026-09-20, validado por la usuaria — ver
    `odd/tasks/seo-local-sevilla.md` cuando exista): proyecto inicial
    (auditoría SEO/GEO + configuración de Google Business Profile + datos
    estructurados + FAQs para buscadores con IA) precio cerrado 299 €.
    Servicio recurrente mensual en 2 niveles: Básico desde 199 €/mes (poca
    competencia local) y Competitivo desde 349 €/mes (sectores disputados).
    Compromiso mínimo sugerido de 3 meses en el recurrente. Es el primer
    servicio con precio "desde X €/mes" en vez de precio único por
    proyecto — tenerlo en cuenta al reutilizar componentes de precio.
- **Diferenciadores reales** (verificables, no aspiracionales):
  - Viene del desarrollo de software, no de plantillas — construye pensando
    en cumplir los Core Web Vitals de Google (no prometas una cifra exacta
    de carga: es un objetivo de diseño, no una garantía por proyecto).
  - Dominio y hosting se contratan a nombre del cliente, no de Nuria — sin
    cuotas ocultas ni vendor lock-in.
  - Precio cerrado antes de empezar, siempre.
  - Trato directo: la misma persona diseña, programa y entrega.
  - Casos reales con consentimiento de mención: Arkady Celebraciones y Adf
    Sevilla (negocio familiar).

## Avatar objetivo
- **Perfil**: dueño/a de pequeño negocio local en Sevilla, 35-55 años,
  autónomo o empresa de 1-10 empleados. Factura modesta-media: 400-1000 €
  en una web es una inversión seria, no un gasto menor. No es nativo
  digital (usa WhatsApp/Instagram a diario, no sabe qué es Search Console).
  Sectores: hostelería, salud/clínicas, comercio de barrio, despachos
  profesionales (abogacía, gestoría).
- **Deseos**: que le llamen/escriban por WhatsApp, no "una web bonita".
  Dejar de depender solo del boca a boca o de plataformas de terceros que
  cobran comisión (TripAdvisor, marketplaces, Doctoralia). Aparecer cuando
  alguien busca "su cosa + su barrio" en Google. Controlar él mismo lo
  básico de la web sin llamar a nadie cada vez.
- **Miedos/objeciones**: miedo a que le timen (agencias caras, lentas o que
  dejan atado con cuotas ocultas). Desconfianza en el precio sin presupuesto
  cerrado por escrito. Miedo a no entender nada técnico y no poder mantener
  la web después. Duda de fondo: "¿de verdad necesito web si ya estoy en
  Maps/Instagram?". No quiere un proyecto eterno ni reuniones interminables.
  En sectores regulados (clínicas, despachos): preocupación por RGPD.
- **Cómo busca** (lenguaje real, no jerga SEO): "cuánto cuesta una página
  web en Sevilla", "diseño web para [sector] Sevilla", "página web
  económica para negocio", "[mi sector] cerca de mí", "quiero que mi
  negocio salga en Google". Rara vez busca "diseñador web freelance" como
  término exacto.
- **Qué le hace elegir a Nuria**: trato directo sin intermediarios, precio
  cerrado desde el principio, ser programadora (no "monta plantillas") pero
  explicado en resultado no en jerga, que la web quede a su nombre, que
  entienda su sector concreto (de ahí las páginas de nicho), prueba social
  local verificable.

## Restricciones de contenido (no negociable)
- Nunca prometer una cifra exacta de velocidad de carga, una posición
  concreta en Google, ni "primera en tu especialidad/zona" — son claims ya
  corregidos antes en este sitio por no estar soportados. Usar framing de
  compromiso/proceso: "diseñada pensando en cumplir los Core Web Vitals",
  no "carga en X segundos".
- No prometer garantías (devolución, resultados) que Nuria no haya
  confirmado explícitamente que puede sostener.
- Tono: cercano y profesional, tú (no vosotros ni usted), español de
  España neutro/profesional en todo el contenido público — sin jerga
  técnica salvo que se explique en la misma frase.

## Arquitectura de keywords/URLs ya decidida
Ver `odd/tasks/servicios-a-raiz.md` (mueve las páginas de servicio de
`/servicios/<slug>` a raíz `/<slug>`) y el árbol de arquitectura acordado:
servicios en raíz (diseño web, tienda online, software a medida,
automatizaciones, IA) + páginas de nicho en raíz (`/web-para-*-sevilla`) +
blog para todo lo informacional/consideración (nunca mezclar con las
páginas transaccionales, para no canibalizar). No regenerar esta
arquitectura desde cero en páginas nuevas — encajar cada página nueva
dentro de ella.

**Actualización 2026-09-20 — la home es un hub de marca, sin keyword
transaccional propia.** La home (`/`) dejó de competir por "diseño web
Sevilla" (canibalizaba con `/diseno-web-sevilla`). Decisión: la home NO
ataca ninguna keyword transaccional específica — funciona como hub de
marca (rankea por nombre propio, recibe tráfico de redes/WhatsApp/
referidos/Google Business Profile) que enlaza a cada página de servicio.
Toda keyword comercial de alto volumen se lleva a una página dedicada:
- `diseño web Sevilla` (500 búsquedas/mes) → `/diseno-web-sevilla` (sin
  cambios).
- `agencia SEO Sevilla` (5.000/mes) + clúster de `SEO local/posicionamiento
  Sevilla` (500/mes cada término) → nueva página `/seo-local-sevilla`
  (pendiente de crear, mismo pipeline que diseño web: jerarquía H1-H3 vs
  competidores, copy, FAQ GEO, diseño). H1 recomendado sin usar la palabra
  "agencia" literal (Nuria es freelance, no agencia): algo del eje "SEO
  local en Sevilla" / "Posicionamiento SEO en Sevilla", con
  "experta/consultora SEO" como vocabulario de apoyo en el cuerpo.
- Mensaje aprobado para la home: "Ayudo a negocios locales a conseguir más
  oportunidades desde Google y buscadores con IA mediante SEO local y GEO.
  Si necesitan una web, también la creo o mejoro como parte de la
  infraestructura necesaria." H1 borrador: "Más oportunidades para tu
  negocio en Google y en las búsquedas con inteligencia artificial".
