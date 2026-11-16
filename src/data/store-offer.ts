// Online store offer (owner decisions 2026-11-16, PRD §14). Single source for the
// starting price, the three options and the scope lists; nothing else writes them.
export const STORE_FROM = "499 €";

export type StoreOptionId = "woocommerce" | "shopify" | "a-medida";

export interface StoreOption {
  id: StoreOptionId;
  name: string;
  example?: string;
  recurringCost: string;
}

export interface StoreScopeItem {
  text: string;
  link?: { label: string; href: string };
}

export const storeOptions: StoreOption[] = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    recurringCost: "El hosting y el dominio quedan a tu nombre y los pagas tú.",
  },
  {
    id: "shopify",
    name: "Shopify",
    recurringCost:
      "La cuota mensual de la plataforma la pagas tú directamente a Shopify.",
  },
  {
    id: "a-medida",
    name: "Tienda a medida",
    example: "por ejemplo, con Next.js y Supabase",
    recurringCost: "El hosting y el dominio quedan a tu nombre y los pagas tú.",
  },
];

export const storeIncludes: string[] = [
  "Tienda montada en tu web, con un diseño adaptado a tu marca",
  "Una pasarela de pago con tarjeta, como Stripe",
  "Envíos sencillos: tarifa plana y/o recogida en tienda",
  "Hasta unos 20 productos cargados por mí, con variantes simples de talla o color",
  "Una sesión de formación para subir productos y gestionar pedidos desde el panel",
  "Un mes de soporte tras el lanzamiento",
];

export const storeQuotedSeparately: StoreScopeItem[] = [
  { text: "Pagos con Redsys o Bizum" },
  { text: "Catálogos grandes o importaciones masivas de productos" },
  { text: "Envíos por peso o por zona e integraciones con transportistas" },
  {
    text: "Facturación automática o sincronización de stock con otros sistemas",
    link: { label: "Ver automatizaciones", href: "/automatizaciones/" },
  },
];

export const STORE_FINAL_PRICE_NOTE =
  "El precio final se cierra por escrito después de conocer tu proyecto, antes de empezar.";
