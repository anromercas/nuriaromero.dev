// Fuente única de verdad de los datos del negocio (NAP + constantes).
// La dirección no incluye calle a propósito: el negocio opera desde casa,
// solo se publica la ciudad (Sevilla).

export const SITE = {
  // Public brand: use this exact name for entity/schema/metadata surfaces.
  // Allowed variants: the domain and the legal name below where context requires it.
  name: "Nuria Romero",
  shortName: "nuriaromero.dev",
  url: "https://nuriaromero.dev",
  description:
    "Diseño de páginas web, software a medida, automatizaciones e IA para negocios en Sevilla. Webs rápidas, optimizadas para Google y pensadas para conseguir clientes.",
  email: "nuriaromero.dev@gmail.com",
  phone: "611 812 431",
  // Número en formato internacional sin "+" para enlaces wa.me
  whatsapp: "34611812431",
  whatsappMessage: "Hola Nuria, tengo un negocio y me gustaría hablar sobre mi página web",
  address: {
    locality: "Sevilla",
    region: "Andalucía",
    country: "ES",
  },
  // Datos fiscales: SOLO se usan en las páginas legales (aviso legal y
  // privacidad). No se muestran en el footer, la web ni el JSON-LD.
  // ⚠️ Falta el NIF: sustituir {NIF} por el real antes de publicar.
  legal: {
    titular: "Nuria Romero Castillo",
    nif: "28843406A",
    domicilio: "Camino Andalucía 426, 41309 La Rinconada, Sevilla",
    actividad: "Diseño y desarrollo de páginas web, software y servicios digitales",
  },
  sameAs: [
    "https://linkedin.com/in/nuria-romero-castillo",
    "https://github.com/anromercas",
  ],
  defaultOgImage: "/og/og-default.png",
} as const

export const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`
