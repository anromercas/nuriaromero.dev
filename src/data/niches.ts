// Contenido de las 4 páginas de nicho sectorial.
// Precios: web completa de hasta 5 páginas desde 399 € (landing desde 149 €).
import type { ServicePageData } from "@/data/types"

export const restaurantes: ServicePageData = {
  slug: "/web-para-restaurantes-sevilla",
  breadcrumbName: "Web para restaurantes",
  seo: {
    title: "Página web para restaurantes en Sevilla | Carta, reservas y Google",
    description:
      "Creo páginas web para restaurantes y bares en Sevilla: carta digital, reservas, fotos que abren el apetito y SEO local para salir en Google Maps.",
  },
  hero: {
    h1: "Página web para restaurantes y bares en Sevilla",
    subtitle:
      "Cuando alguien busca dónde comer en Sevilla, decide en segundos: mira fotos, carta y reseñas desde el móvil. Creo webs para restaurantes pensadas para aparecer en esa búsqueda y ayudarte a convertir esas miradas en mesas ocupadas.",
  },
  benefits: [
    {
      title: "Carta digital siempre actualizada",
      text: "Cambias platos y precios tú misma en un minuto, sin depender de nadie ni reimprimir nada. Con QR para las mesas incluido.",
    },
    {
      title: "Reservas sin coger el teléfono",
      text: "Botón de reserva por WhatsApp o sistema de reservas online: el cliente reserva a cualquier hora y tú te enteras al momento.",
    },
    {
      title: "Aparece cuando buscan dónde comer",
      text: "SEO local para búsquedas como «restaurante en Triana» o «dónde comer cerca de la Catedral», y ficha de Google Maps optimizada y conectada con tu web.",
    },
    {
      title: "Rápida aunque el bar esté lleno",
      text: "Tus clientes la abren desde el móvil con la cobertura justa. Optimizo cada web para que cargue rápido incluso con conexión débil, sin vídeos pesados ni plugins innecesarios.",
    },
  ],
  process: [
    {
      title: "Visito tu local (o hablamos)",
      text: "Conozco tu cocina, tu cliente y qué te diferencia. De ahí sale el enfoque de la web.",
    },
    {
      title: "Presupuesto cerrado",
      text: "Precio, plazos y qué incluye, por escrito. Sin sorpresas.",
    },
    {
      title: "Diseño con tu carta y tus fotos",
      text: "Monto la web con tu carta, fotos y horarios, optimizada para las búsquedas de tu zona.",
    },
    {
      title: "Lanzamiento y Google Maps",
      text: "Publico la web, la conecto con tu ficha de Google Business y te enseño a actualizar la carta.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Web con carta digital editable + QR para mesas",
      "Botón de reservas por WhatsApp",
      "SEO local para tu zona de Sevilla",
      "Conexión con Google Maps y reseñas",
      "Dominio y hosting el primer año",
    ],
    note: "¿Necesitas reservas online con confirmación automática o pedidos para llevar? Se presupuestan aparte.",
  },
  faqs: [
    {
      q: "¿Cuánto cuesta una página web para un restaurante?",
      a: "Una web completa para restaurante con carta digital, reservas por WhatsApp y SEO local parte de 399 €, con dominio y hosting incluidos el primer año. Funcionalidades como reservas automáticas o pedidos online se presupuestan según el caso.",
    },
    {
      q: "¿Puedo actualizar la carta yo mismo?",
      a: "Sí, ese es el objetivo: cambias platos, precios y menús del día desde un panel sencillo, en un minuto y sin conocimientos técnicos. Te enseño a hacerlo en la entrega.",
    },
    {
      q: "¿De verdad necesito web si ya estoy en Google Maps y TripAdvisor?",
      a: "La ficha de Maps es imprescindible, pero es un escaparate compartido con tu competencia y con las comisiones de terceros. Tu web es el único sitio donde el cliente ve tu carta, tus fotos y reserva directamente contigo sin intermediarios. Además, web y ficha se refuerzan entre sí para posicionar mejor.",
    },
    {
      q: "¿Me ayudas también con las reseñas de Google?",
      a: "Sí: configuro tu ficha de Google Business, genero el enlace directo para pedir reseñas a tus clientes y puedo automatizar recordatorios o incluso respuestas con IA.",
    },
  ],
  cta: {
    title: "¿Hablamos de la web de tu restaurante o bar?",
    text: "Cuéntame tu carta, tu zona y cómo gestionas las reservas ahora, y te preparo una propuesta con precio cerrado.",
  },
}

export const clinicas: ServicePageData = {
  slug: "/web-para-clinicas-sevilla",
  breadcrumbName: "Web para clínicas",
  seo: {
    title: "Página web para clínicas en Sevilla | Dentistas, fisios, psicólogos",
    description:
      "Diseño webs para clínicas y consultas en Sevilla: dentistas, fisioterapeutas, psicólogos y estética. Cita online, SEO local y confianza para tu paciente.",
  },
  hero: {
    h1: "Página web para clínicas y consultas en Sevilla",
    subtitle:
      "Un paciente nuevo te busca en Google antes de llamar: compara webs, reseñas y cercanía. Creo webs para clínicas que transmiten la confianza de tu consulta y ayudan a convertir búsquedas como «dentista en Sevilla este» en citas reservadas.",
  },
  benefits: [
    {
      title: "Transmite la confianza de tu consulta",
      text: "Equipo, tratamientos, instalaciones y reseñas presentados con el rigor que espera un paciente que va a poner su salud en tus manos.",
    },
    {
      title: "Citas sin colapsar el teléfono",
      text: "Botón de cita por WhatsApp o integración con tu sistema de citas (Doctoralia, tu software de gestión…): el paciente reserva cuando le viene bien.",
    },
    {
      title: "Visibilidad por especialidad y zona",
      text: "SEO local por especialidad: «fisioterapeuta en Nervión», «psicólogo infantil Sevilla», «clínica dental cerca de mí». Trabajo esas búsquedas para que tu consulta tenga más opciones de aparecer cuando alguien busca en tu zona.",
    },
    {
      title: "Privacidad pensada para tu paciente",
      text: "Textos legales, consentimiento de datos y formularios preparados conforme a las buenas prácticas del RGPD, especialmente importante en el sector salud.",
    },
  ],
  process: [
    {
      title: "Hablamos de tu consulta",
      text: "Especialidades, tipo de paciente, qué te diferencia y qué búsquedas quieres ganar en tu zona.",
    },
    {
      title: "Propuesta cerrada",
      text: "Presupuesto con precio y plazos por escrito, adaptado al tamaño de tu clínica.",
    },
    {
      title: "Diseño orientado al paciente",
      text: "Estructura por tratamientos (cada uno posiciona por separado), textos claros y llamadas a la acción para pedir cita.",
    },
    {
      title: "Lanzamiento y Google",
      text: "Alta en Google y Maps, conexión con tu sistema de citas y formación para tu equipo.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Web con página por tratamiento/especialidad",
      "Botón de cita por WhatsApp o integración de citas",
      "SEO local por especialidad y zona",
      "Formularios adaptados al RGPD",
      "Dominio y hosting el primer año",
    ],
    note: "Las clínicas con muchos tratamientos o varios centros se presupuestan según alcance.",
  },
  faqs: [
    {
      q: "¿Por qué mi clínica necesita una página por cada tratamiento?",
      a: "Porque los pacientes no buscan «clínica dental», buscan «implantes dentales Sevilla» u «ortodoncia invisible precio». Cada tratamiento con su propia página posiciona por esas búsquedas específicas, que son las que traen pacientes con intención real de reservar.",
    },
    {
      q: "¿Cuánto cuesta la web de una clínica?",
      a: "Una web de consulta con sus tratamientos, cita por WhatsApp y SEO local parte de 399 €. Clínicas grandes con muchos tratamientos o integración con software de gestión se presupuestan aparte, siempre con precio cerrado.",
    },
    {
      q: "¿Puede integrarse con Doctoralia o mi programa de citas?",
      a: "Sí. Puedo integrar tu sistema actual de citas en la web o, si prefieres no depender de plataformas con comisión, montar la reserva directa por WhatsApp o formulario.",
    },
    {
      q: "¿Cómo tratáis los datos de los pacientes?",
      a: "Los formularios se configuran con consentimiento explícito, aviso de privacidad y conexión segura (HTTPS), y te entrego un resumen de qué datos se recogen y dónde se almacenan como apoyo para tu registro de actividades de tratamiento. La validación legal completa la debe revisar tu asesoría o tu DPO.",
    },
  ],
  cta: {
    title: "¿Hablamos de la web de tu consulta?",
    text: "Cuéntame tus tratamientos, tu sistema de citas actual y qué búsquedas te interesa ganar en tu zona, y te preparo una propuesta con precio cerrado.",
  },
}

export const comercios: ServicePageData = {
  slug: "/web-para-comercios-sevilla",
  breadcrumbName: "Web para comercios",
  seo: {
    title: "Página web para comercios y tiendas en Sevilla | Vende online",
    description:
      "Webs y tiendas online para comercios de Sevilla: catálogo de productos, venta online y SEO local para que te encuentren los clientes de tu barrio.",
  },
  hero: {
    h1: "Página web para comercios y tiendas en Sevilla",
    subtitle:
      "Tus clientes miran en Google antes de salir de casa: horarios, productos y si estás cerca. Creo webs para comercios que te ponen en ese mapa, y si quieres vender online, tiendas que compiten de verdad.",
  },
  benefits: [
    {
      title: "Que te encuentren los del barrio",
      text: "SEO local para búsquedas como «zapatería en Los Remedios» o «tienda de bicis Sevilla», conectado con tu ficha de Google Maps.",
    },
    {
      title: "Tu escaparate abierto 24 horas",
      text: "Catálogo de productos con fotos y precios: el cliente comprueba que tienes lo que busca antes de acercarse, o te lo encarga por WhatsApp.",
    },
    {
      title: "Venta online sin comisión de marketplace",
      text: "Si quieres dar el salto, tienda online propia (WooCommerce o similar): no pagas comisión por venta a un marketplace, aunque sí la comisión habitual de la pasarela de pago que elijas (Stripe, Redsys...).",
    },
    {
      title: "Gestión sencilla",
      text: "Subes productos, cambias precios y marcas agotados desde un panel pensado para ti, no para un informático.",
    },
  ],
  process: [
    {
      title: "Conozco tu comercio",
      text: "Qué vendes, quién te compra y si quieres solo presencia local o también venta online.",
    },
    {
      title: "Propuesta a tu medida",
      text: "Web de catálogo o tienda online completa: te propongo la opción que encaja con tu momento, con precio cerrado.",
    },
    {
      title: "Montaje del catálogo",
      text: "Estructura por categorías optimizada para Google, fotos y descripciones que venden.",
    },
    {
      title: "Lanzamiento y formación",
      text: "Te enseño a gestionar productos y pedidos, y dejo tu ficha de Google conectada.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Web con catálogo de productos editable",
      "Encargos por WhatsApp",
      "SEO local para tu barrio y ciudad",
      "Conexión con Google Maps",
      "Dominio y hosting el primer año",
    ],
    note: "La tienda online completa con pago y envíos se presupuesta según el número de productos.",
  },
  faqs: [
    {
      q: "¿Necesito una tienda online o me basta con un catálogo?",
      a: "Depende de tu momento. Un catálogo con encargos por WhatsApp es más barato y suele ser el mejor primer paso: tus clientes ven lo que tienes y te lo reservan. Si ya tienes demanda fuera de tu barrio, la tienda online con pago y envío es el siguiente nivel. Te aconsejo con sinceridad según tu caso.",
    },
    {
      q: "¿Cuánto cuesta una tienda online?",
      a: "Una web de catálogo parte de 399 € y una tienda online completa con pasarela de pago y gestión de envíos se presupuesta según el número de productos y necesidades. En ambos casos, con dominio y hosting incluidos el primer año.",
    },
    {
      q: "¿Podré gestionar los productos yo mismo?",
      a: "Sí. Te dejo un panel sencillo para subir productos, cambiar precios y marcar agotados, y una guía en vídeo para consultarla cuando quieras.",
    },
    {
      q: "¿Y si vendo en Amazon o Wallapop, para qué quiero web?",
      a: "Los marketplaces te cobran comisión por venta y se quedan con los datos de tus clientes. Tu propia tienda solo paga la comisión estándar de la pasarela de pago, no la del marketplace, fideliza a tu clientela y refuerza tu posicionamiento local para el cliente del barrio.",
    },
  ],
  cta: {
    title: "¿Hablamos de la web de tu comercio?",
    text: "Cuéntame qué vendes, si buscas solo presencia local o también venta online, y te preparo una propuesta con precio cerrado.",
  },
}

export const profesionales: ServicePageData = {
  slug: "/web-para-abogados-gestorias-sevilla",
  breadcrumbName: "Web para despachos y gestorías",
  seo: {
    title: "Página web para abogados y gestorías en Sevilla | Capta clientes",
    description:
      "Webs para abogados, gestorías, asesorías y despachos profesionales en Sevilla: imagen seria, SEO local por especialidad y captación de consultas.",
  },
  hero: {
    h1: "Página web para abogados, gestorías y asesorías en Sevilla",
    subtitle:
      "Quien necesita un abogado o una gestoría busca en Google y compara: experiencia, especialidad y confianza. Creo webs para despachos que transmiten solvencia y ayudan a convertir búsquedas como «abogado laboralista Sevilla» en consultas.",
  },
  benefits: [
    {
      title: "Imagen a la altura de tu despacho",
      text: "Diseño sobrio y profesional que transmite lo que un cliente busca en quien va a llevar sus asuntos: seriedad, experiencia y claridad.",
    },
    {
      title: "Posiciona por tu especialidad",
      text: "Página por área de práctica: laboral, civil, herencias, extranjería, autónomos… cada una optimizada para captar las búsquedas de esa especialidad en Sevilla.",
    },
    {
      title: "Contenido que demuestra autoridad",
      text: "Blog con artículos que responden las dudas típicas de tus clientes: contenido que ayuda a posicionar en Google y que los buscadores con IA suelen citar cuando responden ese tipo de preguntas.",
    },
    {
      title: "Consultas filtradas",
      text: "Formularios que recogen la información clave del caso antes de la primera llamada: menos consultas perdidas, mejor uso de tu tiempo.",
    },
  ],
  process: [
    {
      title: "Hablamos de tu despacho",
      text: "Áreas de práctica, tipo de cliente que quieres atraer y qué búsquedas te interesa ganar.",
    },
    {
      title: "Propuesta cerrada",
      text: "Estructura, precio y plazos por escrito. Confidencialidad desde el primer contacto.",
    },
    {
      title: "Redacción especializada",
      text: "Textos por área de práctica, claros para el cliente y optimizados para Google, revisados contigo para el rigor jurídico.",
    },
    {
      title: "Lanzamiento y visibilidad",
      text: "Alta en Google y Maps, y plan de contenidos si quieres seguir creciendo con el blog.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Web con página por área de práctica",
      "Formulario de consulta con filtrado previo",
      "SEO local por especialidad",
      "Perfil de Google Business optimizado",
      "Dominio y hosting el primer año",
    ],
    note: "Despachos con muchas áreas o varios socios se presupuestan según alcance.",
  },
  faqs: [
    {
      q: "¿Por qué necesita web mi despacho si los clientes llegan por recomendación?",
      a: "Porque la recomendación hoy pasa por Google: cuando alguien recibe tu nombre, te busca antes de llamar. Si no encuentra nada (o encuentra algo pobre), la recomendación se enfría. Y las búsquedas directas como «gestoría cerca de mí» son clientes nuevos que hoy se lleva quien aparece primero.",
    },
    {
      q: "¿Cuánto cuesta la web de un despacho o gestoría?",
      a: "Una web profesional con páginas por área de práctica, formulario de consulta y SEO local parte de 399 €, con dominio y hosting el primer año incluidos y presupuesto cerrado antes de empezar.",
    },
    {
      q: "¿Quién escribe los textos legales de la web?",
      a: "Yo redacto la base optimizada para Google y para que el cliente la entienda, y tú revisas el rigor jurídico. El aviso legal, privacidad y cookies de la propia web van incluidos.",
    },
    {
      q: "¿Merece la pena un blog jurídico?",
      a: "Suele ser rentable en este sector: artículos que responden dudas frecuentes («cuánto tarda una herencia», «qué hacer ante un despido») ayudan a posicionar en Google, demuestran autoridad y son el tipo de contenido que los buscadores con IA suelen citar al responder esas preguntas. Puedo dejarte la estructura y un plan de contenidos.",
    },
  ],
  cta: {
    title: "¿Hablamos de la web de tu despacho?",
    text: "Cuéntame tus áreas de práctica y qué búsquedas te interesa ganar en tu zona, y te preparo una propuesta con precio cerrado.",
  },
}

export const niches = [restaurantes, clinicas, comercios, profesionales]
