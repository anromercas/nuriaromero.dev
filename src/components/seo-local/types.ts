import type { ServicePageData } from "@/data/types";

/** Display title with its single serif accent phrase. `accent` must be a substring of `text`. */
export interface AccentTitle {
  text: string;
  accent?: string;
}

/** Internal hrefs end in "/" or start with "#". */
export interface TextLink {
  label: string;
  href: string;
}

export interface ProofItem {
  stat: string;
  label: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface ComparisonItem {
  lead: string;
  text: string;
}

/** `a` uses "\n\n" between paragraphs; `links` are the owner pages shown after the answer. */
export interface FaqItem {
  q: string;
  a: string;
  links?: TextLink[];
}

export type Tier = NonNullable<ServicePageData["pricing"]["tiers"]>[number];

export type BentoArea = "a" | "b" | "c" | "d" | "e" | "f";
