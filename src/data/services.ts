// Contenido de las 4 páginas de servicio.
// Precios acordados: landing 149 €, web 5 páginas 399 €, automatización 149 €,
// chatbot IA 399 €, software a medida 999 €. E-commerce: sin precio público.
import type { ServicePageData } from "@/data/types"

export const disenoWeb: ServicePageData = {
  slug: "/diseno-web-sevilla/",
  breadcrumbName: "Diseño web en Sevilla",
  seo: {
    title: "Diseño web en Sevilla | Precio cerrado desde 149 €",
    description:
      "Diseño páginas web en Sevilla para negocios locales: rápidas, con SEO local y precio cerrado antes de empezar. Web completa desde 399 €, landing desde 149 €.",
  },
  hero: {
    h1: "Diseño web en Sevilla para negocios que quieren clientes, no solo una web bonita",
    subtitle:
      "Tu web trabaja 24 horas y es lo primero que ve un cliente antes de decidirse. Si buscan lo que ofreces en Sevilla, que te encuentren a ti.",
    secondaryCta: {
      label: "Ver precios",
      href: "#precios",
    },
  },
  sectionTitles: {
    benefits: "Diseño web en Sevilla hecho por una programadora, no con plantillas",
    process: "Así es el proceso de crear tu página web",
    pricing: "Precio de una página web en Sevilla: desde 149 €",
    faq: "Preguntas frecuentes sobre diseño web en Sevilla",
  },
  benefits: [
    {
      title: "Construida pensando en los Core Web Vitals de Google",
      text: "Los Core Web Vitals miden qué tan rápido carga tu web, qué tan estable se ve y qué tan rápido responde a un clic. Diseño y programo cada proyecto para cumplir esos tres puntos desde el primer día, sin plugins de sobra que la frenen. Te importa aunque no seas programador: Google usa esas métricas para decidir qué webs muestra antes.",
    },
    {
      title: "SEO local desde el primer día: apareces en Google y en Google Maps",
      text: "Estructura y textos con las búsquedas que hace tu cliente en Sevilla, datos técnicos correctos (velocidad, etiquetas, estructura semántica), y alta y configuración de tu ficha de Google Business Profile conectada con tu web.",
    },
    {
      title: "La web es tuya: dominio y hosting a tu nombre",
      text: "Dominio y hosting se contratan a tu nombre, no al mío. Si algún día cambias de proveedor o prefieres no depender de nadie, puedes hacerlo sin pedir permiso. Sin contratos que te atan ni cuotas mensuales que aparecen a los seis meses.",
    },
  ],
  process: [
    {
      title: "Hablamos de tu negocio",
      text: "Una llamada o un café. Me cuentas qué vendes, quién es tu cliente y qué quieres conseguir. Hablamos en tu idioma, no en el mío.",
    },
    {
      title: "Presupuesto cerrado",
      text: "Te envío una propuesta por escrito: precio, plazos y qué incluye. La apruebas y arrancamos. Si algo cambia por el camino, el precio de lo pactado no se mueve.",
    },
    {
      title: "Diseño y desarrollo",
      text: "Construyo la web con textos orientados a Google y a tus clientes reales. Ves avances durante el proceso y ajustas lo que haga falta antes de la entrega.",
    },
    {
      title: "Lanzamiento y primer mes de soporte",
      text: "Publico la web, la doy de alta en Google y Google Maps, y te enseño a cambiar tú misma un texto, una foto o un precio. El primer mes de soporte va incluido.",
    },
  ],
  pricing: {
    from: "149 €",
    note: "¿Cuál te conviene? Si necesitas estar online ya, con lo esencial: landing. Si tu negocio ya tiene definidos varios servicios y quieres posicionar cada uno por separado: web completa.",
    tiers: [
      {
        name: "Landing de una página",
        from: "149 €",
        includes: [
          "Diseño a medida adaptado a móvil",
          "Textos optimizados para SEO local en Sevilla",
          "Botón de WhatsApp y formulario de contacto",
          "Dominio y hosting el primer año",
        ],
      },
      {
        name: "Web completa (hasta 5 páginas)",
        from: "399 €",
        recommended: true,
        includes: [
          "Todo lo de la landing, más estructura completa por secciones",
          "Hasta 5 páginas (inicio, servicios, sobre mí, contacto…)",
          "Alta en Google Search Console y en Google Business Profile",
          "Un mes de soporte tras el lanzamiento",
        ],
        note: "¿Necesitas una tienda online completa? Se presupuesta aparte.",
      },
    ],
  },
  faqs: [
    {
      q: "¿Qué incluye el precio cerrado de una página web en Sevilla?",
      a: "Trabajo siempre con precio cerrado, pactado por escrito antes de empezar: una landing de una página parte de 149 €, y una web completa de hasta 5 páginas parte de 399 €. Ese precio incluye diseño a medida adaptado a móvil, textos optimizados para SEO local, dominio y hosting el primer año, y un mes de soporte tras el lanzamiento.\n\nPara un negocio local en Sevilla, una web profesional suele costar entre 500 y 3.000 €, así que estos precios se mueven dentro de ese rango pero quedan cerrados desde el primer día: sabes exactamente cuánto vas a pagar, sin letra pequeña ni cuotas que aparecen a mitad de proyecto.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener la página web lista?",
      a: "Una web de negocio local suele estar lista en 2 a 4 semanas, contando desde que tengo todos los contenidos: textos, fotos y logo. Si necesitas ayuda para redactar los textos, los escribo yo misma ya optimizados para Google, aunque eso puede sumar unos días.\n\nUna landing de una sola página suele ir más rápido que una web completa de 5 páginas, simplemente porque hay menos contenido que preparar y revisar contigo. El plazo exacto siempre se cierra en la propuesta inicial, junto con el precio, así que lo sabes desde el primer día.",
    },
    {
      q: "¿Qué diferencia hay entre una web hecha a medida y una hecha con Wix o una plantilla de WordPress?",
      a: "La diferencia está en la base: una plantilla usa el mismo diseño y el mismo código para miles de webs distintas, mientras que yo vengo del desarrollo de software y construyo cada proyecto pensando en cumplir los Core Web Vitals de Google (las métricas que miden velocidad de carga, estabilidad visual y capacidad de respuesta). Eso significa menos código de sobra, menos plugins innecesarios y una base técnica más sólida para el SEO. También significa que el dominio y el hosting se contratan a tu nombre, no al mío, así que no dependes de una plataforma de terceros para seguir teniendo tu propia web.",
    },
    {
      q: "Si contrato a un diseñador web, ¿la página queda a mi nombre o me quedo atado a esa persona o agencia?",
      a: "En mi caso, la web queda a tu nombre de verdad: el dominio y el hosting se contratan directamente a tu nombre, no al mío. Esto significa que si en algún momento decides cambiar de proveedor, continuar tú misma o contratar a otra persona, puedes hacerlo sin pedirme permiso ni depender de nadie. No es lo habitual en todas las agencias: algunas retienen el dominio o el hosting bajo su cuenta, lo que te deja atado a ellas. Antes de contratar cualquier servicio de diseño web, es una pregunta que merece la pena hacer explícitamente.",
    },
    {
      q: "¿Mi página web va a aparecer en Google?",
      a: "Sí: todas las webs que hago se entregan indexadas en Google y optimizadas para SEO local, con estructura correcta, velocidad de carga cuidada, datos estructurados y textos escritos con las búsquedas reales que hacen tus clientes en Sevilla. Eso incluye también el alta en Google Search Console y en tu ficha de Google Business Profile. Lo que no puedo prometerte es una posición concreta en el buscador ni un plazo exacto para conseguirla, porque eso depende de más factores además de la web. Lo que sí garantizo es que la base técnica queda perfecta desde el primer día.",
    },
    {
      q: "¿Necesito saber de tecnología para gestionar mi web después de que me la entregues?",
      a: "No. En el lanzamiento te enseño a hacer los cambios básicos tú misma: actualizar un texto, cambiar una foto o ajustar un precio, sin necesidad de tocar código ni depender de mí para cada pequeño ajuste. El primer mes de soporte después de la entrega va incluido, así que si algo no te queda claro usando el panel, puedes preguntarme directamente. Para cambios más grandes (añadir una página nueva, rediseñar una sección) sí que suelo encargarme yo, pero el día a día de mantener actualizado tu contenido queda en tus manos.",
    },
    {
      q: "¿Trabajas solo con negocios de Sevilla o también en remoto?",
      a: "Trabajo sobre todo con negocios de Sevilla capital y su área metropolitana, porque el trato cercano (una llamada, un café, una reunión en persona si hace falta) marca la diferencia en cómo queda la web. Dicho esto, también hago proyectos para negocios del resto de España trabajando en remoto, cuando el cliente lo prefiere así. La diferencia principal es que con los negocios de Sevilla puedo ofrecer ese trato presencial si lo necesitas, mientras que fuera de Sevilla el proceso completo se hace por videollamada y mensajería.",
    },
    {
      q: "¿Qué incluye exactamente el precio de 399 € de la web completa?",
      a: "Los 399 € de la web completa incluyen: hasta 5 páginas (inicio, servicios, sobre mí, contacto y lo que necesite tu negocio), diseño a medida adaptado a móvil, textos optimizados para SEO local y para las búsquedas de tu zona en Sevilla, botón de WhatsApp y formulario de contacto, alta en Google Search Console y en Google Business Profile, dominio y hosting durante el primer año, y un mes de soporte tras el lanzamiento.\n\nSi necesitas algo adicional, como una tienda online completa con pasarela de pago, se presupuesta aparte y siempre con precio cerrado antes de empezar.",
    },
    {
      q: "Ya tengo una página web pero no me está funcionando, ¿qué puedo hacer?",
      a: "Lo primero que hago es una auditoría de tu web actual antes de proponerte nada. A veces el problema se resuelve optimizando velocidad, textos y SEO local sobre lo que ya tienes, sin necesidad de rehacer nada desde cero. Otras veces, sobre todo si la web es muy antigua o está construida sobre una plantilla muy limitada, compensa más rediseñarla por completo. Te digo con sinceridad cuál de las dos opciones te conviene después de revisarla, no la que más me convenga a mí facturar. Esa auditoría inicial no lleva ningún compromiso de contratar el rediseño después.",
    },
    {
      q: "¿Es mejor una landing de una página o una web completa de varias páginas?",
      a: "Depende de en qué momento esté tu negocio. Si necesitas estar online ya, con lo esencial (qué ofreces, cómo contactarte) y sin mucho presupuesto, la landing desde 149 € suele ser suficiente, sobre todo para validar una idea, un evento o un servicio puntual. Si tu negocio ya tiene varios servicios definidos y quieres que cada uno pueda posicionar por separado en Google, la web completa desde 399 € da mejor resultado, porque cada página trabaja para búsquedas distintas. En la primera llamada te digo cuál encaja mejor con tu caso concreto.",
    },
  ],
  cta: {
    title: "Empecemos con tu página web en Sevilla",
    text: "Cuéntame en qué punto está tu negocio y qué necesitas conseguir. Te respondo con una propuesta clara, sin compromiso.",
  },
}

export const desarrolloSoftware: ServicePageData = {
  slug: "/desarrollo-software-medida/",
  breadcrumbName: "Software a medida",
  seo: {
    title: "Desarrollo de software a medida en Sevilla | Aplicaciones web",
    description:
      "Desarrollo software y aplicaciones web a medida para empresas en Sevilla: gestión interna, reservas, presupuestos, portales de cliente. +10 años de experiencia.",
  },
  hero: {
    h1: "Software a medida para tu empresa en Sevilla",
    subtitle:
      "Cuando el Excel se queda corto y los programas genéricos no encajan con tu forma de trabajar, una aplicación hecha a tu medida ahorra horas cada semana. Desarrollo herramientas que se adaptan a tu negocio, y no al revés.",
  },
  sectionTitles: {
    benefits: "Qué gana tu empresa con software a medida",
    process: "Así es el proceso de desarrollar tu aplicación a medida",
    pricing: "Cuánto cuesta el software a medida en Sevilla",
    faq: "Preguntas frecuentes sobre software a medida en Sevilla",
  },
  benefits: [
    {
      title: "Adiós a las tareas repetitivas",
      text: "Gestión de pedidos, reservas, presupuestos, partes de trabajo, facturación… Lo que hoy haces a mano en papel o en Excel, automatizado en una herramienta pensada para ti.",
    },
    {
      title: "Experiencia real en empresas",
      text: "Más de 10 años desarrollando software para industria, salud y medioambiente, desde startups hasta consultoras como NTT DATA. Esa experiencia ahora al servicio de tu negocio.",
    },
    {
      title: "Empiezas pequeño, creces cuando toca",
      text: "No necesitas un proyecto enorme: empezamos por lo que más te duele y ampliamos según resultados. Pagas por lo que necesitas.",
    },
    {
      title: "Tecnología moderna y mantenible",
      text: "Aplicaciones web que funcionan en cualquier dispositivo, sin instalar nada. Código limpio y documentado que cualquier profesional podría continuar.",
    },
  ],
  process: [
    {
      title: "Analizo tu forma de trabajar",
      text: "Me cuentas tus procesos y detecto dónde se pierde tiempo o dinero. De ahí sale una propuesta concreta con prioridades.",
    },
    {
      title: "Prototipo primero",
      text: "Antes de desarrollar, ves pantallas de cómo será la herramienta. Ajustamos sobre el diseño, que es barato; no sobre el código, que es caro.",
    },
    {
      title: "Desarrollo por fases",
      text: "Entregas parciales que ya puedes usar. Cada fase tiene precio y plazo cerrados.",
    },
    {
      title: "Formación y soporte",
      text: "Te enseño a usarlo, dejo documentación y quedo disponible para mantenimiento y mejoras.",
    },
  ],
  pricing: {
    from: "999 €",
    includes: [
      "Análisis de procesos y propuesta de solución",
      "Prototipo de pantallas antes de desarrollar",
      "Aplicación web accesible desde cualquier dispositivo",
      "Formación para tu equipo",
      "Garantía y soporte tras la entrega",
    ],
    note: "Cada proyecto es distinto: tras la primera reunión te doy un presupuesto cerrado por fases.",
  },
  faqs: [
    {
      q: "¿Qué es exactamente el software a medida?",
      a: "El software a medida es una aplicación creada específicamente para la forma de trabajar de tu empresa: una herramienta de gestión de pedidos, un sistema de reservas, un portal para tus clientes, un control de presupuestos o partes de trabajo… A diferencia de un programa genérico o de una licencia estándar, no viene con funciones de sobra que nunca usas ni te obliga a adaptar tu proceso al programa. Se construye pensando en cómo trabajas hoy: qué datos manejas, quién los necesita ver y en qué momento. Es especialmente útil cuando ya usas Excel o varios programas sueltos que no se hablan entre sí, y quieres una sola herramienta que haga exactamente lo que tu negocio necesita, ni más ni menos.",
    },
    {
      q: "¿Cuánto cuesta desarrollar software a medida en Sevilla?",
      a: "El desarrollo de software a medida parte de 999 € para una herramienta interna sencilla, y los proyectos más completos se presupuestan por fases: primero analizo tu caso, y después te doy un precio cerrado para cada fase antes de empezarla, nunca una cifra global a ciegas.\n\nEsto te permite empezar por la parte que más tiempo o dinero te está haciendo perder, comprobar el resultado, y decidir después si amplías con nuevas funciones. El coste final depende de cuántas pantallas, integraciones con otras herramientas y usuarios necesita tu proyecto, algo que se concreta en la primera reunión de análisis.",
    },
    {
      q: "¿No me vale con un Excel o un programa estándar?",
      a: "A veces sí, y te lo diré con sinceridad en la primera reunión: no todo negocio necesita software a medida. Compensa claramente cuando pierdes horas semanales copiando datos entre archivos, cuando varias personas necesitan trabajar a la vez con la misma información sin pisarse los cambios, o cuando el programa estándar que usas te obliga a cambiar tu forma de trabajar en vez de adaptarse a ella. Si tu caso se resuelve con una plantilla de Excel mejor organizada o una automatización sencilla, te lo propongo así, porque te sale más barato y más rápido que un desarrollo completo.",
    },
    {
      q: "¿Qué pasa si en el futuro necesito cambios o quiero ampliar la aplicación?",
      a: "El software se entrega documentado y pensado para crecer por fases, no como un proyecto cerrado que se queda congelado el día de la entrega. Puedo encargarme yo misma del mantenimiento y de añadir nuevas funciones cuando las necesites, empezando siempre por lo que más impacto tenga en tu día a día. Y si en algún momento decides que continúe otro profesional, podrá hacerlo sin depender de mí: el código y la documentación son tuyos desde el primer día, sin cláusulas que te aten a que solo yo pueda tocar el proyecto.",
    },
    {
      q: "¿Cuánto tiempo se tarda en desarrollar una aplicación a medida?",
      a: "El plazo depende del alcance que definimos en la fase de análisis. Una herramienta sencilla, con una o dos funciones concretas (por ejemplo, un sistema de reservas o un control de pedidos), suele estar lista en unas pocas semanas.\n\nUn sistema más completo, con varios módulos y usuarios distintos, se desarrolla y entrega por fases, de forma que puedas empezar a usar cada parte según va estando terminada, en vez de esperar meses para ver el resultado. El plazo exacto de cada fase se cierra por escrito junto con el precio, antes de empezar a desarrollar esa fase.",
    },
    {
      q: "¿Qué diferencia hay entre contratar software a medida y usar un programa SaaS con licencia mensual?",
      a: "Un SaaS (un programa por el que pagas una cuota mensual, como muchos CRM o ERP genéricos) es rápido de empezar a usar, pero rara vez encaja al cien por cien con tu proceso, y la cuota se repite mes tras mes mientras sigas usándolo, subas o no de plan. El software a medida no tiene esa licencia mensual recurrente: pagas por el desarrollo, y a partir de ahí la aplicación es tuya, con mantenimiento solo si lo contratas cuando lo necesitas. A cambio, el desarrollo a medida requiere más tiempo inicial que darte de alta en un SaaS, porque primero se analiza y se construye para tu caso concreto.",
    },
    {
      q: "¿Puedo empezar solo por una parte del proyecto en vez de contratarlo todo de golpe?",
      a: "Sí, de hecho es como recomiendo empezar casi siempre. En la primera reunión detectamos juntas qué tarea te está haciendo perder más tiempo o dinero ahora mismo, y desarrollamos primero esa parte con precio y plazo cerrados. Una vez la estás usando y compruebas el resultado, decides si quieres ampliar con la siguiente fase o si con eso ya te vale. Esto reduce el riesgo de invertir en un proyecto grande antes de comprobar que la forma de trabajar propuesta encaja de verdad con tu negocio.",
    },
    {
      q: "¿Qué pasa si a mitad de desarrollo cambian los requisitos de mi negocio?",
      a: "Es algo que ocurre con frecuencia y está previsto en la forma de trabajar por fases: lo ya acordado y presupuestado para la fase en curso no cambia de precio a mitad de camino. Si surge una necesidad nueva o cambia algo importante de tu proceso, la valoramos juntas y, si afecta al alcance, se convierte en una fase adicional con su propio presupuesto cerrado, en vez de meterla sin avisar dentro de lo ya pactado. Así sabes en todo momento qué estás pagando y por qué, sin sorpresas en la factura final.",
    },
    {
      q: "¿En qué tecnologías desarrollas las aplicaciones y me quedo atada a ti como proveedora?",
      a: "Desarrollo aplicaciones web modernas, accesibles desde el navegador en cualquier dispositivo sin instalar nada, usando tecnologías estándar de la industria y no herramientas propietarias cerradas. El código queda documentado y organizado para que cualquier profesional con conocimientos pueda continuarlo si algún día decides cambiar de desarrollador o de proveedor. No hay dependencia forzada de un único formato o plataforma mía: la idea es que la herramienta sea tuya de verdad, igual que el dominio y el hosting de una web se contratan a tu nombre y no al mío.",
    },
  ],
}

export const automatizaciones: ServicePageData = {
  slug: "/automatizaciones/",
  breadcrumbName: "Automatizaciones",
  seo: {
    title: "Automatización de procesos para negocios en Sevilla | n8n y Make",
    description:
      "Automatizo las tareas repetitivas de tu negocio en Sevilla: facturas, correos, citas, informes. Con n8n y Make, tus herramientas trabajan solas.",
  },
  hero: {
    h1: "Automatizaciones: que tu negocio trabaje solo",
    subtitle:
      "¿Cuántas horas pierdes a la semana copiando datos, enviando los mismos correos o pasando pedidos de un sitio a otro? Conecto las herramientas que ya usas (correo, Excel, WhatsApp, facturación…) para que esas tareas se hagan solas.",
  },
  sectionTitles: {
    benefits: "Qué consigue tu negocio automatizando procesos con n8n y Make",
    process: "Así es el proceso de automatizar tus tareas repetitivas",
    pricing: "Cuánto cuesta automatizar un proceso",
    faq: "Preguntas frecuentes sobre automatización de procesos",
  },
  benefits: [
    {
      title: "Recupera horas cada semana",
      text: "Confirmaciones de cita, recordatorios a clientes, facturas recurrentes, informes de ventas… Todo lo que sigue un patrón se puede automatizar. Tú dedicas ese tiempo a vender.",
    },
    {
      title: "Con las herramientas que ya usas",
      text: "No hay que cambiar de programas: n8n y Make conectan Gmail, Google Sheets, WhatsApp, Holded, tu web y cientos de aplicaciones más entre sí.",
    },
    {
      title: "Menos errores humanos",
      text: "Los datos copiados a mano se equivocan; las automatizaciones no. Cada pedido, cita o factura llega donde tiene que llegar, siempre.",
    },
    {
      title: "Inversión pequeña, retorno rápido",
      text: "Una automatización sencilla se amortiza en semanas. Es la forma más barata de ganar productividad en un negocio pequeño.",
    },
  ],
  process: [
    {
      title: "Auditoría de tareas",
      text: "Repasamos juntas tu día a día y localizo qué tareas repetitivas se pueden automatizar y cuánto tiempo te ahorrarían.",
    },
    {
      title: "Propuesta priorizada",
      text: "Te propongo las automatizaciones ordenadas por impacto: primero las que más tiempo te devuelven.",
    },
    {
      title: "Implementación y pruebas",
      text: "Monto los flujos, los pruebo con casos reales y los dejo funcionando con avisos si algo falla.",
    },
    {
      title: "Documentación y control",
      text: "Te entrego cada flujo documentado y te enseño a supervisarlo. Sin dependencia: lo entiendes y lo controlas.",
    },
  ],
  pricing: {
    from: "149 €",
    includes: [
      "Auditoría de procesos automatizables",
      "Diseño e implementación del flujo con n8n o Make",
      "Pruebas con casos reales de tu negocio",
      "Avisos automáticos si algo falla",
      "Documentación y formación",
    ],
    note: "Precio por automatización. Los packs de varias automatizaciones tienen descuento.",
  },
  faqs: [
    {
      q: "¿Qué tipo de tareas se pueden automatizar en mi negocio?",
      a: "Casi cualquier tarea repetitiva que hoy hagas igual cada vez entre distintos programas: enviar recordatorios de cita por WhatsApp o email, generar facturas al cerrar un pedido, volcar los formularios de tu web a una hoja de cálculo o a tu CRM, avisarte de reseñas nuevas en Google, crear informes semanales de ventas o gastos, o pasar datos de un pedido de tu tienda online a tu programa de facturación. La regla práctica es sencilla: si describes el proceso paso a paso y cada paso es siempre igual, casi seguro que se puede automatizar, liberándote de hacerlo a mano una y otra vez.",
    },
    {
      q: "¿Qué son n8n y Make, y por qué se usan para automatizar en vez de programar desde cero?",
      a: "n8n y Make son plataformas de automatización que conectan entre sí las aplicaciones que ya usas (Gmail, Google Sheets, WhatsApp, tu programa de facturación, tu web…) mediante flujos visuales, sin tener que programar una integración desde cero para cada herramienta. Son de las plataformas más usadas del sector, con conexiones ya preparadas para cientos de aplicaciones, lo que reduce mucho el tiempo de desarrollo frente a construir cada conexión a medida. Las uso a diario tanto en proyectos freelance como en entornos de empresa, y elijo una u otra según qué herramientas necesites conectar y qué tan compleja sea la lógica del proceso.",
    },
    {
      q: "¿Necesito conocimientos técnicos para usar las automatizaciones después de que las montes?",
      a: "No. Una vez montada, la automatización funciona sola en segundo plano: no tienes que abrir ninguna plataforma ni tocar nada para que las tareas se sigan haciendo. Te entrego cada flujo documentado con instrucciones sencillas por si en algún momento quieres entender qué hace, y configuro avisos automáticos para que te enteres si algo falla, en vez de descubrirlo semanas después porque un pedido no llegó donde debía. Si algo necesita revisión, puedes contactarme directamente en lugar de intentar arreglarlo tú misma dentro de la plataforma.",
    },
    {
      q: "¿Automatizar procesos es solo para empresas grandes?",
      a: "Al contrario: suele notarse más en negocios pequeños, precisamente porque ahí cada hora cuenta más y no hay un equipo dedicado a tareas administrativas. Una clínica que confirma citas automáticamente por WhatsApp, una tienda que genera facturas solas al cerrar cada pedido o un despacho que recibe ya ordenados los formularios de contacto en una hoja de cálculo, son casos típicos de negocios pequeños donde la automatización libera tiempo real cada semana. No hace falta tener un departamento técnico ni un volumen enorme de operaciones para que compense.",
    },
    {
      q: "¿Cuánto cuesta automatizar un proceso de mi negocio?",
      a: "El precio parte de 149 € por automatización, e incluye la auditoría de esa tarea concreta, el diseño e implementación del flujo, las pruebas con casos reales de tu negocio y la documentación. Si necesitas automatizar varias tareas a la vez, los packs de varias automatizaciones tienen descuento sobre el precio individual.\n\nEl coste final de cada automatización depende de cuántas herramientas hay que conectar y de qué tan compleja sea la lógica del proceso (por ejemplo, si hay que tomar decisiones distintas según el caso), algo que se concreta después de la auditoría inicial.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener lista una automatización?",
      a: "Depende de cuántas herramientas conecta y de qué tan compleja sea la lógica del proceso. Una automatización sencilla, como enviar un recordatorio de cita o volcar un formulario a una hoja de cálculo, suele estar lista en pocos días desde que se aprueba la propuesta.\n\nProcesos con varios pasos condicionales o que conectan tres o cuatro herramientas distintas necesitan algo más de tiempo, porque incluyen una fase de pruebas con casos reales antes de dejarlas funcionando en tu día a día. El plazo se concreta en la propuesta priorizada, junto con el precio.",
    },
    {
      q: "¿Qué pasa si una automatización falla o hay un error a mitad de proceso?",
      a: "Cada flujo se configura con avisos automáticos si algo no sale como estaba previsto, por ejemplo si una herramienta externa deja de responder o llega un dato en un formato inesperado. En vez de que el error pase desapercibido, recibes una notificación para que puedas revisarlo o contactarme. Antes de dejar cualquier automatización funcionando en tu día a día, la pruebo con casos reales de tu negocio para detectar la mayoría de los problemas antes de que afecten a un pedido o a un cliente real.",
    },
    {
      q: "¿Se pueden automatizar procesos que usan varias herramientas distintas a la vez, como WhatsApp, Excel y facturación?",
      a: "Sí, de hecho es donde más valor aporta automatizar: cuantas más aplicaciones distintas intervienen en un proceso (por ejemplo, un pedido que llega por WhatsApp, se apunta en una hoja de cálculo y termina generando una factura), más tiempo se pierde copiando datos a mano entre ellas y más fácil es que se cuele un error humano. n8n y Make están pensados precisamente para conectar varias aplicaciones dentro de un mismo flujo, así que el proceso completo se puede automatizar de principio a fin, no solo un paso suelto.",
    },
    {
      q: "¿Automatizar con n8n o Make tiene algún coste aparte de tu servicio?",
      a: "Puede tenerlo, y te lo explico con transparencia antes de proponerte la herramienta: n8n y Make tienen sus propios planes de uso según el volumen de tareas que ejecutes al mes, y para negocios pequeños suele bastar con un plan económico o incluso gratuito. Mi honorario cubre la auditoría, el diseño, la implementación y la documentación del flujo; el coste de la plataforma en sí, si lo hay, depende del volumen de tu negocio y se evalúa juntas antes de decidir qué herramienta usar, para que no haya sorpresas en tu factura mensual.",
    },
  ],
}

export const inteligenciaArtificial: ServicePageData = {
  slug: "/inteligencia-artificial/",
  breadcrumbName: "Inteligencia artificial",
  seo: {
    title: "IA para negocios en Sevilla | Chatbots y asistentes con IA",
    description:
      "Llevo la inteligencia artificial a tu negocio en Sevilla: chatbots que atienden clientes, asistentes que redactan y clasifican, IA integrada en tus procesos.",
  },
  hero: {
    h1: "Inteligencia artificial aplicada a tu negocio",
    subtitle:
      "La IA ya no es cosa de grandes empresas. Un chatbot que responde a tus clientes a las 11 de la noche, un asistente que redacta respuestas a reseñas o clasifica tus correos: soluciones concretas, con retorno medible y sin humo.",
  },
  sectionTitles: {
    benefits: "Qué consigue tu negocio con IA aplicada, sin humo",
    process: "Así es el proceso de implantar IA en tu negocio",
    pricing: "Cuánto cuesta implementar IA en tu negocio",
    faq: "Preguntas frecuentes sobre inteligencia artificial para negocios",
  },
  benefits: [
    {
      title: "Atención al cliente 24/7",
      text: "Un chatbot entrenado con la información de tu negocio responde dudas frecuentes, toma datos de contacto y agenda citas mientras duermes. Tú solo atiendes lo importante.",
    },
    {
      title: "IA integrada en tus procesos",
      text: "Combinada con automatizaciones: clasificar correos, resumir documentos, redactar respuestas a reseñas de Google, extraer datos de facturas… La IA como empleado incansable.",
    },
    {
      title: "Sin humo: casos con retorno",
      text: "Solo propongo IA donde aporta valor real y medible. Si tu caso se resuelve mejor con una automatización simple, te lo diré y te costará menos.",
    },
    {
      title: "Tus datos, protegidos",
      text: "Configuro las soluciones cuidando la privacidad y el RGPD: qué datos se envían, a qué proveedor y con qué garantías. Todo explicado con claridad.",
    },
  ],
  process: [
    {
      title: "Detectamos el caso de uso",
      text: "Analizo dónde la IA puede ahorrarte tiempo o mejorar tu atención al cliente, y te propongo el caso con mejor retorno.",
    },
    {
      title: "Prueba piloto",
      text: "Monto una versión inicial con tus datos reales para que compruebes cómo responde antes de decidir.",
    },
    {
      title: "Ajuste y puesta en marcha",
      text: "Refino las respuestas, conecto la IA con tu web o WhatsApp y la dejo funcionando con supervisión.",
    },
    {
      title: "Medición y mejora",
      text: "Revisamos qué está resolviendo y qué no, y la vamos mejorando con casos reales.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Análisis del caso de uso con mejor retorno",
      "Prueba piloto con datos reales de tu negocio",
      "Integración con tu web, WhatsApp o herramientas",
      "Configuración respetuosa con el RGPD",
      "Supervisión y ajustes el primer mes",
    ],
    note: "El coste depende del caso de uso. La prueba piloto te permite decidir sin arriesgar.",
  },
  faqs: [
    {
      q: "¿Para qué puede usar la IA un negocio pequeño?",
      a: "Los casos con mejor retorno para un negocio pequeño son: un chatbot que atiende dudas frecuentes y recoge datos de contacto en tu web o WhatsApp, asistentes que redactan respuestas a reseñas de Google o a correos habituales, clasificación automática de mensajes según su urgencia o tipo, y extracción de datos de documentos como facturas o pedidos para no teclearlos a mano. La clave para elegir bien no es usar IA porque esté de moda, sino identificar en qué tarea concreta de tu día a día te ahorra horas reales, algo que reviso contigo en la primera reunión antes de proponerte nada.",
    },
    {
      q: "¿El chatbot con IA va a decir cosas raras o inventadas a mis clientes?",
      a: "El chatbot se entrena únicamente con la información real de tu negocio (servicios, precios, horarios, políticas de tu empresa) y se configura para que, ante una pregunta que no sabe responder con esa información, derive el contacto hacia ti en lugar de inventar una respuesta. Antes de publicarlo, lo pruebas tú misma con preguntas reales de tus clientes durante la fase de prueba piloto, así que nada llega a producción sin que lo hayas revisado antes. Esta configuración reduce mucho el riesgo de respuestas inventadas, aunque como con cualquier sistema de IA no existe una garantía absoluta del cien por cien.",
    },
    {
      q: "¿Qué pasa con la privacidad de mis clientes y el RGPD al usar IA?",
      a: "Antes de poner en marcha cualquier solución, defino con claridad qué datos se envían al proveedor de IA, con qué finalidad y bajo qué garantías, priorizando proveedores que ofrecen acuerdos de tratamiento de datos conformes con la normativa europea. Te entrego esa configuración documentada para que puedas incorporarla a tu registro de actividades de tratamiento si lo necesitas. No configuro ninguna solución que envíe datos personales de tus clientes sin que sepas exactamente a dónde van y por qué, porque en sectores como salud o servicios profesionales esto es especialmente delicado.",
    },
    {
      q: "¿Cuánto cuesta implantar IA en mi negocio?",
      a: "Un chatbot para web o WhatsApp parte de 399 €, incluyendo el análisis del caso de uso, la prueba piloto con tus datos reales, la integración con tu web o WhatsApp y la configuración respetuosa con el RGPD.\n\nLos proyectos que combinan IA con automatizaciones (por ejemplo, un chatbot que además genera un pedido o una cita automáticamente) se presupuestan según el caso concreto, porque el coste depende de cuántas herramientas hay que conectar. En todos los casos, la prueba piloto previa te permite ver cómo responde la IA con tu información real antes de decidir si sigues adelante.",
    },
    {
      q: "¿Qué diferencia hay entre un chatbot con IA y los chatbots clásicos de \"elige una opción\"?",
      a: "Un chatbot clásico solo puede seguir un guion cerrado de botones y respuestas predefinidas: si la pregunta del cliente no encaja exactamente en una de esas opciones, se queda bloqueado. Un chatbot con IA entiende preguntas escritas con lenguaje natural, como las escribiría un cliente real, y puede responder combinando la información de tu negocio aunque la pregunta no esté formulada exactamente igual que en su base de datos. Esto se traduce en menos clientes frustrados por no encontrar la opción correcta y más consultas resueltas sin que tengas que intervenir tú misma.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener un chatbot con IA funcionando?",
      a: "El proceso empieza con el análisis del caso de uso y sigue con una prueba piloto montada con la información real de tu negocio, algo que suele tardar entre una y dos semanas según cuánta información haya que preparar (servicios, precios, horarios, preguntas frecuentes).\n\nA partir de ahí, ajustamos las respuestas con casos reales antes de conectarlo a tu web o WhatsApp de forma definitiva. El plazo exacto depende de si la información de tu negocio ya está organizada o hay que recopilarla primero, algo que se aclara en la primera reunión.",
    },
    {
      q: "¿Puedo probar el chatbot antes de decidir si lo contrato de verdad?",
      a: "Sí, y es justo el paso que recomiendo antes de comprometerte con nada: monto una prueba piloto con la información real de tu negocio para que compruebes cómo responde a preguntas de verdad, no a un ejemplo genérico de demostración. Con esa prueba delante decides si el resultado te convence y quieres seguir adelante con la integración definitiva en tu web o WhatsApp, o si prefieres ajustar el enfoque antes de continuar. Esto reduce el riesgo de pagar por una solución de IA que luego no encaja con cómo hablan realmente tus clientes.",
    },
    {
      q: "¿Necesito tener ya una web para poner un chatbot con IA en mi negocio?",
      a: "No es imprescindible: un chatbot con IA se puede integrar directamente en WhatsApp Business, que es donde ya habla contigo la mayoría de tus clientes, sin depender de que tengas una web previa. Si además tienes o vas a tener una web, también se puede integrar ahí como un widget de chat visible en cualquier página. En la primera reunión analizamos por dónde te contactan más tus clientes hoy en día, para proponerte el canal donde realmente va a tener uso, en vez de añadirlo en un sitio donde nadie lo va a encontrar.",
    },
    {
      q: "¿La IA sustituye a mi equipo o a mí atendiendo a los clientes?",
      a: "No está pensada para eso, sino para quitarte de encima las consultas repetitivas (horarios, precios, disponibilidad, dudas frecuentes) y dejarte a ti el tiempo para lo que de verdad necesita trato personal: cerrar una venta importante, resolver un caso delicado o atender a un cliente habitual. El chatbot se configura para reconocer cuándo una consulta necesita intervención humana y derivarla, en lugar de intentar resolverlo todo por su cuenta. La IA funciona mejor como un filtro que se encarga de lo rutinario, no como un reemplazo de la atención personal que diferencia a un negocio pequeño de uno grande.",
    },
  ],
}

export const seoLocal: ServicePageData = {
  slug: "/seo-local-sevilla/",
  breadcrumbName: "SEO local en Sevilla",
  seo: {
    title: "SEO local en Sevilla | Proyecto inicial desde 299 € + IVA",
    description:
      "SEO local en Sevilla para negocios: proyecto inicial de alcance acotado por 299 € + IVA y opciones de crecimiento desde 199 €/mes + IVA.",
  },
  hero: {
    h1: "SEO local en Sevilla para negocios que quieren una base clara en Google",
    subtitle:
      "Empezamos por una puesta a punto con alcance, precio y plazo definidos. Después decides si te interesa continuar: no hay obligación de contratar mantenimiento.",
    secondaryCta: { label: "Ver el proyecto inicial", href: "#precios" },
  },
  sectionTitles: {
    benefits: "SEO local en Sevilla explicado con alcance real",
    process: "Así es el proceso de trabajar tu SEO local",
    pricing: "Proyecto inicial y opciones de crecimiento",
    faq: "Preguntas frecuentes sobre SEO local en Sevilla",
  },
  benefits: [
    {
      title: "Visibilidad local con una base técnica revisada",
      text: "Reviso la presencia local, la indexación básica y la ficha de Google Business Profile para detectar prioridades concretas. No prometo posiciones: el objetivo es dejar una base coherente con tu negocio, tu zona y tu web.",
    },
    {
      title: "Contenido claro y datos estructurados cuando encajan",
      text: "Trabajamos una página estratégica, sus FAQs aprobadas por tu negocio y el enlazado interno básico. Los datos estructurados se aplican solo cuando son técnicamente viables y coherentes con el contenido real.",
    },
    {
      title: "Medición básica sin datos personales sensibles",
      text: "Compruebo Search Console, GA4 y acciones de contacto medibles sin enviar información identificable ni datos sensibles a analítica. El informe explica el trabajo realizado y las prioridades, no resultados inventados.",
    },
  ],
  process: [
    { title: "Diagnóstico breve", text: "Reviso web, indexación básica, SEO local, Google Business Profile y tres competidores de Sevilla para ordenar entre cinco y diez prioridades." },
    { title: "Puesta a punto", text: "Ajusto la ficha de Google Business Profile, una página estratégica, cinco FAQs aprobadas y el enlazado interno básico. Los datos estructurados se valoran según la plataforma y el contenido real." },
    { title: "Entrega en 10 días hábiles", text: "El proyecto se entrega en 10 días hábiles desde que están disponibles los accesos y materiales necesarios, con un informe corto y una hoja de ruta de 90 días." },
    { title: "Revisión acotada a los 30 días", text: "Incluye una comprobación rápida a los 30 días. Es un bonus puntual, no mantenimiento ni gestión mensual de reseñas." },
  ],
  pricing: {
    from: "299 € + IVA",
    note: "La puesta a punto inicial es un proyecto cerrado. Los planes recurrentes solo se valoran después si encajan con tu situación; tres meses es un mínimo sugerido para dar continuidad al trabajo, no una permanencia obligatoria.",
    initial: {
      from: "299 € + IVA",
      includes: [
        "Diagnóstico breve: web, indexación básica, SEO local, Google Business Profile y 3 competidores",
        "Revisión de Google Business Profile: categoría, servicios, descripción, contacto, enlace y fotos existentes",
        "Optimización de una página estratégica y enlazado interno básico",
        "Datos estructurados básicos cuando sean técnicamente viables",
        "5 FAQs con información aprobada por tu negocio",
        "Medición básica segura, hoja de ruta de 90 días y comprobación a los 30 días",
      ],
      note: "Pago único, entrega en 10 días hábiles y sin obligación de continuar. No incluye gestión mensual de reseñas, SEO completo de toda la web, rediseño integral ni varias páginas optimizadas.",
      ctaLabel: "Solicitar proyecto inicial",
    },
    tiers: [
      {
        name: "Crecimiento básico",
        from: "199 €/mes + IVA",
        includes: ["Una pieza de contenido optimizada al mes", "Ajustes y seguimiento de prioridades locales", "Informe mensual de trabajo y próximos pasos"],
        note: "Sugerencia de continuidad: 3 meses para evaluar el trabajo mensual; se concreta por escrito antes de empezar.",
        ctaLabel: "Hablar sobre crecimiento",
      },
      {
        name: "Crecimiento competitivo",
        from: "349 €/mes + IVA",
        recommended: true,
        includes: ["Dos o tres piezas de contenido optimizadas al mes", "Ajustes más frecuentes de web y presencia local", "Informe mensual de trabajo y oportunidades observadas"],
        note: "Sugerencia de continuidad: 3 meses para evaluar el trabajo mensual; se concreta por escrito antes de empezar.",
        ctaLabel: "Hablar sobre crecimiento",
      },
    ],
  },
  faqs: [
    { q: "¿Qué incluye el proyecto inicial de 299 € + IVA?", a: "Es una puesta a punto de alcance acotado: diagnóstico breve, revisión de Google Business Profile, tres competidores de Sevilla, una página estratégica, datos estructurados básicos cuando sean viables, cinco FAQs aprobadas por tu negocio, medición básica segura, hoja de ruta de 90 días y comprobación a los 30 días. No es SEO completo de toda la web ni mantenimiento mensual." },
    { q: "¿Cuándo se entrega?", a: "El plazo es de 10 días hábiles desde que están disponibles los accesos y materiales necesarios. Si faltan datos, fotos o aprobaciones, el calendario se ajusta para poder trabajar con información real." },
    { q: "¿Tengo que contratar un plan mensual después?", a: "No. El proyecto inicial es un pago único de 299 € + IVA y no obliga a continuar. Si después tiene sentido mantener un ritmo de contenido y mejoras, existen opciones desde 199 €/mes + IVA y 349 €/mes + IVA; tres meses es una sugerencia razonada, no una permanencia inventada." },
    { q: "¿Incluye gestión de reseñas?", a: "No incluye gestión mensual de reseñas ni respuestas en nombre de tu negocio. La revisión de la ficha puede señalar buenas prácticas para solicitar reseñas auténticas, pero la gestión continua se valora aparte." },
    { q: "¿Garantizas posiciones o contactos?", a: "No. Nadie puede garantizar una posición concreta, un número de contactos ni cómo mostrará un buscador un negocio. El compromiso es con el alcance acordado, la transparencia del trabajo y una base técnica y editorial coherente." },
    { q: "¿Qué pasa con los asistentes de IA?", a: "Un contenido claro, estructurado y fiel a tu negocio puede facilitar su comprensión y citabilidad, pero no se garantiza que un asistente de IA lo cite o recomiende. Se evita convertir esa posibilidad en una promesa comercial." },
  ],
  cta: { title: "Hablemos de la presencia local de tu negocio", text: "Cuéntame qué servicio ofreces y en qué punto está tu web. Te respondo con una propuesta clara y sin compromiso." },
}

export const capilarLocal: ServicePageData = {
  slug: "/seo-para-clinicas-capilares-sevilla/",
  breadcrumbName: "SEO para clínicas capilares en Sevilla",
  seo: {
    title: "SEO para clínicas capilares en Sevilla | CAPILAR LOCAL, 299 € + IVA",
    description: "CAPILAR LOCAL es una puesta a punto de Google y web para clínicas de injerto capilar en Sevilla: 299 € + IVA, alcance cerrado y entrega en 10 días hábiles.",
  },
  hero: {
    h1: "CAPILAR LOCAL: puesta a punto de Google y web para clínicas de injerto capilar en Sevilla",
    subtitle: "Para propietarias y responsables de clínica que necesitan ordenar su presencia local y sus puntos de contacto sin promesas de pacientes, posiciones ni resultados médicos.",
    secondaryCta: { label: "Ver alcance y precio", href: "#precios" },
  },
  sectionTitles: { benefits: "Visibilidad, confianza y contacto: una base comercial clara", process: "Proceso de 10 días hábiles", pricing: "CAPILAR LOCAL: alcance y precio cerrados", faq: "Preguntas frecuentes para clínicas" },
  benefits: [
    { title: "Visibilidad", text: "Diagnóstico breve de web, indexación básica, SEO local, Google Business Profile y tres competidores de Sevilla para priorizar qué corregir primero." },
    { title: "Confianza", text: "Revisión de la información pública de la ficha y una página estratégica con cinco FAQs. Las afirmaciones médicas, tratamientos y precios los proporciona y aprueba la clínica; no se inventan claims clínicos." },
    { title: "Contacto", text: "Reviso acciones de formulario, teléfono y WhatsApp como contactos medibles. La medición se plantea sin datos clínicos, mensajes, nombres ni teléfonos enviados a analítica." },
  ],
  process: [
    { title: "Día 1: accesos y contexto", text: "Confirmamos propiedad de los activos, servicios, materiales disponibles y quién valida la información médica y comercial." },
    { title: "Días 2–4: diagnóstico", text: "Reviso la presencia local y tres competidores de Sevilla para preparar una lista de prioridades realista." },
    { title: "Días 5–8: puesta a punto", text: "Trabajo la ficha, una página estratégica, FAQs aprobadas, enlazado interno y datos estructurados básicos solo si son viables." },
    { title: "Días 9–10: entrega y siguiente paso", text: "Entrego un informe corto, la hoja de ruta de 90 días y la propuesta de comprobación a los 30 días. El mantenimiento es opcional." },
  ],
  pricing: {
    from: "299 € + IVA",
    note: "CAPILAR LOCAL es un pago único, con entrega en 10 días hábiles desde accesos y materiales. No obliga a continuar con un plan mensual.",
    initial: {
      from: "299 € + IVA",
      includes: ["Diagnóstico breve de visibilidad, Google Business Profile y 3 competidores", "Revisión de ficha y optimización de una página estratégica", "Datos estructurados básicos cuando sean técnicamente viables", "5 FAQs con información aprobada por la clínica", "Medición básica segura, hoja de ruta de 90 días y comprobación a los 30 días"],
      note: "Pago único y alcance acotado. No incluye gestión mensual de reseñas, SEO completo de toda la web, rediseño integral, varias páginas optimizadas, publicidad ni garantías de posiciones, solicitudes o resultados médicos.",
      ctaLabel: "Solicitar proyecto inicial",
    },
    tiers: [
      { name: "Crecimiento básico", from: "199 €/mes + IVA", includes: ["Una pieza de contenido optimizada al mes", "Seguimiento de prioridades acordadas", "Informe mensual de trabajo"], note: "Tres meses es una sugerencia mínima para evaluar continuidad, no una permanencia obligatoria.", ctaLabel: "Hablar sobre crecimiento" },
      { name: "Crecimiento competitivo", from: "349 €/mes + IVA", recommended: true, includes: ["Dos o tres piezas de contenido optimizadas al mes", "Ajustes más frecuentes de presencia local y web", "Informe mensual de trabajo y prioridades"], note: "Tres meses es una sugerencia mínima para evaluar continuidad, no una permanencia obligatoria.", ctaLabel: "Hablar sobre crecimiento" },
    ],
  },
  faqs: [
    { q: "¿CAPILAR LOCAL está dirigido a pacientes?", a: "No. Es un servicio B2B para propietarias y responsables de clínicas de injerto capilar que quieren revisar su presencia local y los puntos de contacto de su propia clínica." },
    { q: "¿Qué no incluye el proyecto?", a: "No incluye gestión mensual de reseñas, SEO completo de toda la web, rediseño integral, varias páginas optimizadas, publicidad ni garantías de posiciones, solicitudes de valoración o resultados médicos." },
    { q: "¿Quién valida las FAQs y el contenido médico?", a: "La clínica debe aportar y aprobar la información médica, los tratamientos, los precios y cualquier afirmación clínica antes de publicar. El servicio no inventa ni valida contenido sanitario." },
    { q: "¿Se pueden medir los contactos sin tratar datos de salud?", a: "Sí. Se revisan de forma básica los clics de WhatsApp, teléfono, formulario y CTA sin enviar datos clínicos, nombres, teléfonos ni mensajes a analítica." },
    { q: "¿Garantiza CAPILAR LOCAL más solicitudes?", a: "No. La entrega es una puesta a punto acotada y transparente; no se garantizan posiciones, volumen de contactos, citas, pacientes, menciones en asistentes de IA ni resultados médicos." },
  ],
  cta: { title: "Solicita el proyecto inicial CAPILAR LOCAL", text: "Cuéntame qué activos tiene hoy tu clínica y quién puede validar la información. El primer contacto no necesita datos clínicos de pacientes." },
}

export const tiendaOnline: ServicePageData = {
  slug: "/tienda-online-sevilla/",
  breadcrumbName: "Tienda online en Sevilla",
  seo: {
    title: "Tienda online en Sevilla | Ecommerce con pasarela de pago",
    description:
      "Creo tiendas online en Sevilla con pasarela de pago propia, sin comisión de marketplace. Presupuesto cerrado según tu número de productos y necesidades.",
  },
  hero: {
    h1: "Tienda online en Sevilla para negocios que quieren vender, no solo tener una web",
    subtitle:
      "Una tienda online no es una web más: necesitas pasarela de pago, gestión de productos y stock, y que te encuentren cuando alguien busca lo que vendes. Te la construyo a medida, sin comisión de marketplace y con precio cerrado antes de empezar.",
    secondaryCta: {
      label: "Ver cómo se presupuesta",
      href: "#precios",
    },
  },
  sectionTitles: {
    benefits: "Tienda online en Sevilla hecha por una programadora, no con plantillas de marketplace",
    process: "Así es el proceso de crear tu tienda online",
    pricing: "Cuánto cuesta una tienda online en Sevilla",
    faq: "Preguntas frecuentes sobre tiendas online en Sevilla",
  },
  benefits: [
    {
      title: "Tienda propia, sin comisión de marketplace",
      text: "Vender en un marketplace o en una plataforma de terceros suele significar pagar una comisión por cada venta o una cuota mensual por seguir estando ahí. Con una tienda propia, el dominio y el hosting se contratan a tu nombre y no dependes de las reglas de una plataforma externa. Sí pagarás la comisión propia de la pasarela de pago que elijas (Stripe, PayPal, Redsys…), la misma que pagarías en cualquier tienda online, pero sin una comisión adicional por vender en un espacio que no es tuyo.",
    },
    {
      title: "Gestión sencilla de tus productos, sin depender de mí para cada cambio",
      text: "Te entrego un panel donde puedes añadir productos nuevos, cambiar precios, actualizar fotos o marcar algo como agotado tú misma, sin escribir código ni llamarme para cada actualización pequeña. Te enseño a usarlo en el lanzamiento. Para cambios más grandes, como reorganizar categorías o añadir una función nueva de venta, sí que suelo encargarme yo, pero el día a día de mantener tu catálogo actualizado queda en tus manos.",
    },
    {
      title: "SEO para que te encuentren buscando tus productos, no solo tu marca",
      text: "Cada ficha de producto y cada categoría se estructura y se redacta pensando en las búsquedas reales que hace alguien cuando quiere comprar lo que tú vendes, no solo cuando ya conoce el nombre de tu negocio. Aplico el mismo criterio técnico de SEO local que uso en el resto de mis proyectos: estructura correcta, datos técnicos cuidados y textos orientados a Google, para que tu tienda tenga una base sólida desde el primer día.",
    },
  ],
  process: [
    {
      title: "Auditoría de qué necesitas vender",
      text: "Hablamos de tu catálogo: cuántos productos tienes, si son físicos o digitales, si necesitas gestionar stock, variantes (talla, color…) o envíos, y qué pasarela de pago encaja mejor con tu negocio. De ahí sale el alcance real de tu proyecto.",
    },
    {
      title: "Propuesta con presupuesto cerrado",
      text: "Con el alcance claro, te envío una propuesta por escrito: qué incluye, plazos y precio cerrado antes de empezar. La apruebas y arrancamos, sin sorpresas a mitad de camino.",
    },
    {
      title: "Desarrollo con pasarela de pago",
      text: "Construyo tu tienda, integro la pasarela de pago elegida y pruebo todo el proceso de compra de principio a fin (desde que alguien añade un producto al carrito hasta que recibe la confirmación del pedido) antes de publicarla.",
    },
    {
      title: "Lanzamiento y formación para gestionar productos",
      text: "Publico la tienda y te enseño a añadir productos, gestionar pedidos y hacer los cambios básicos tú misma. El primer mes de soporte tras el lanzamiento va incluido.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Web completa con estructura de tienda: categorías y fichas de producto",
      "Textos optimizados para que te encuentren buscando tus productos",
      "Dominio y hosting el primer año",
      "Un mes de soporte tras el lanzamiento",
    ],
    note: "399 € es el precio de partida de la web completa sobre la que se construye la tienda. La integración de la pasarela de pago, la gestión de stock, variantes o envíos se presupuestan aparte, según tu número de productos y necesidades concretas: no existe un precio único de tienda online, pero sí un presupuesto cerrado por escrito antes de empezar, sin cifras a ciegas.",
  },
  faqs: [
    {
      q: "¿Cuánto cuesta una tienda online en Sevilla?",
      a: "No existe un precio único de tienda online, porque el coste depende directamente de cuántos productos vas a vender, si necesitas variantes (talla, color, modelo…), gestión de stock y qué pasarela de pago quieres usar.\n\nEl punto de partida es la web completa desde 399 €, sobre la que se construye la estructura de categorías y fichas de producto; la integración de la pasarela de pago y las funciones específicas de venta online se presupuestan aparte, siempre con precio cerrado por escrito después de conocer tu catálogo, antes de que empieces a pagar nada.",
    },
    {
      q: "¿Qué pasarelas de pago se pueden integrar en mi tienda online?",
      a: "Las pasarelas más habituales para un negocio en España son Stripe, PayPal y Redsys (la pasarela de los bancos españoles, típica para pagos con tarjeta nacional). Cada una tiene su propia comisión por transacción, que pagas directamente a la pasarela y no a mí, igual que pagarías en cualquier tienda online del sector. En la fase de auditoría te ayudo a elegir la que mejor encaje con tu negocio según el tipo de cliente que tengas y si necesitas cobrar también con otros métodos, como transferencia o contrareembolso.",
    },
    {
      q: "¿Qué diferencia hay entre una tienda online a medida y usar Shopify o Wix?",
      a: "Shopify y Wix son plataformas SaaS: te dan una tienda funcionando rápido, pero pagas una cuota mensual mientras sigas usando la plataforma, y tu tienda vive dentro de su sistema, con las limitaciones de diseño y funciones que ellos deciden. Una tienda a medida se construye para tu caso concreto, con el dominio y el hosting a tu nombre, sin una cuota de plataforma mensual obligatoria (el mantenimiento, si lo quieres, lo contratas solo si lo necesitas). A cambio, requiere más tiempo de desarrollo inicial que darte de alta en una plataforma ya hecha, porque se construye para tu catálogo concreto en vez de partir de una plantilla genérica.",
    },
    {
      q: "¿Necesito tener ya una web para montar la tienda online, o se puede hacer desde cero?",
      a: "Se puede hacer de las dos formas. Si ya tienes una web, valoro en la auditoría si su base técnica permite añadir la tienda o si conviene construirla de nuevo para evitar arrastrar problemas de la web anterior. Si todavía no tienes ninguna web, la tienda se construye desde cero como una web completa con estructura de venta desde el primer día, sin tener que integrar después una tienda sobre una base que no se pensó para eso. En ambos casos, el punto de partida es conocer tu catálogo antes de decidir el enfoque técnico.",
    },
    {
      q: "¿Puedo vender online si no tengo tienda física?",
      a: "Sí, sin ningún problema: muchos de los negocios que montan una tienda online no tienen local físico o venden solo por internet. Lo importante para la tienda online es tener claro qué productos vas a vender, cómo los vas a gestionar (stock propio, bajo pedido, con proveedor externo…) y cómo vas a hacer llegar el pedido al cliente, no si tienes un local a pie de calle. Si además tienes tienda física y quieres combinar venta online con venta presencial, también se puede plantear la gestión de stock para que ambos canales estén coordinados.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener la tienda online lista?",
      a: "Una tienda online suele necesitar algo más de tiempo que una web informativa, porque hay que cargar y revisar cada ficha de producto además de construir la estructura general. El plazo concreto depende de cuántos productos tengas y de si tu catálogo ya está preparado (fotos, descripciones, precios) o hay que organizarlo primero.\n\nEl plazo exacto, igual que el precio, se cierra por escrito en la propuesta inicial después de conocer el alcance de tu catálogo, así que lo sabes desde el primer día y no a mitad de proyecto.",
    },
    {
      q: "¿Quién sube los productos a la tienda una vez está lista, tú o yo?",
      a: "Después del lanzamiento, tú misma puedes añadir productos nuevos, cambiar precios, actualizar fotos o marcar algo como agotado desde un panel de gestión, sin necesidad de escribir código ni depender de mí para cada actualización. Te enseño a usarlo durante el lanzamiento, y el primer mes de soporte va incluido por si algo no te queda claro. Para la carga inicial del catálogo, si tienes muchos productos y prefieres que me encargue yo de subirlos la primera vez, también se puede acordar como parte del presupuesto cerrado.",
    },
    {
      q: "¿Qué pasa con el IVA, la facturación y los aspectos legales de vender online?",
      a: "La tienda se construye preparada para trabajar con los requisitos habituales de una venta online en España: aviso legal, política de cookies, condiciones de venta y proceso de compra transparente sobre precios e IVA. Dicho esto, no soy asesora fiscal ni gestoría, así que para decidir cómo declarar el IVA de tus ventas online o qué régimen fiscal te conviene, te recomiendo confirmarlo con tu gestoría o asesor fiscal antes de lanzar la tienda, para que la parte legal y la parte técnica estén alineadas desde el principio.",
    },
    {
      q: "¿Puedo vender productos digitales, como cursos o ebooks, además de productos físicos?",
      a: "Sí, es algo que se valora en la fase de auditoría inicial, porque los productos digitales tienen necesidades distintas a los físicos: no requieren gestión de stock ni envío, pero sí una entrega automática segura del archivo o del acceso al curso tras el pago. Si tu catálogo combina productos físicos y digitales, o si de momento solo quieres vender digitales, lo tengo en cuenta al plantear la estructura de la tienda y al elegir la pasarela de pago más adecuada para ese tipo de venta.",
    },
    {
      q: "¿Qué pasa si más adelante quiero añadir más productos o nuevas funciones a la tienda?",
      a: "La tienda se construye pensada para crecer: puedes seguir añadiendo productos tú misma sin límite desde el panel de gestión, y si más adelante quieres una función nueva (como descuentos automáticos, una zona de clientes registrados o integrarla con tu programa de facturación), se presupuesta como una ampliación aparte, con su propio precio cerrado. No hace falta acertar con todo el alcance desde el primer día: empiezas con lo esencial para vender y amplías según lo vaya pidiendo tu negocio.",
    },
    {
      q: "¿La tienda gestiona el envío y el stock sola, o eso lo tengo que hacer yo?",
      a: "La tienda lleva el control de qué productos tienes disponibles y puede avisar automáticamente cuando algo se queda sin stock, para que no vendas algo que ya no tienes. La logística del envío en sí (empaquetar, llevarlo a la agencia de transporte, elegir la mensajería) sigue siendo una gestión tuya o de tu proveedor logístico, porque es una parte operativa del negocio, no técnica de la web. Si usas un servicio externo de gestión de envíos, valoro en la auditoría si tiene sentido conectarlo con la tienda para automatizar ese paso también.",
    },
  ],
  cta: {
    title: "Empecemos con tu tienda online en Sevilla",
    text: "Cuéntame qué quieres vender y cuántos productos tienes en mente. Te respondo con una propuesta clara y un presupuesto cerrado, sin compromiso.",
  },
}

export const services = [
  seoLocal,
  capilarLocal,
  disenoWeb,
  desarrolloSoftware,
  automatizaciones,
  inteligenciaArtificial,
  tiendaOnline,
]
