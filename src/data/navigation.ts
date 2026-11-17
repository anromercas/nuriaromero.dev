// Navigation classification: Header and Footer only render these lists.
// Relative imports with the .ts extension so `node --test` can load the module.
import type { ServicePageData } from "./types.ts";
import {
  seoLocal,
  seoParaIa,
  disenoWeb,
  tiendaOnline,
  desarrolloSoftware,
  automatizaciones,
  inteligenciaArtificial,
  capilarLocal,
} from "./services.ts";
import { niches } from "./niches.ts";

export interface NavLink {
  title: string; // page.breadcrumbName
  url: string; // page.slug, trailing slash
}

export interface ServiceMenuGroup {
  heading: string;
  items: NavLink[];
}

const toLink = (page: ServicePageData): NavLink => ({
  title: page.breadcrumbName,
  url: page.slug,
});

export const serviceMenuGroups: ServiceMenuGroup[] = [
  {
    heading: "Visibilidad",
    items: [seoLocal, seoParaIa].map(toLink),
  },
  {
    heading: "Webs y desarrollo",
    items: [
      disenoWeb,
      tiendaOnline,
      desarrolloSoftware,
      automatizaciones,
      inteligenciaArtificial,
    ].map(toLink),
  },
];

export const serviceMenuLinks: NavLink[] = serviceMenuGroups.flatMap(
  (g) => g.items,
);

export const sectorLinks: NavLink[] = [...niches, capilarLocal].map(toLink);
