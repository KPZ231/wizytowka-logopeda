import "server-only";
import type { Locale } from "@/i18n/config";

export type LegalSection = {
  heading: string;
  body: string[];
  list?: string[];
  links?: { label: string; href: string }[];
};
export type LegalDoc = {
  meta: { title: string; description: string };
  title: string;
  /** Data ISO (RRRR-MM-DD) ostatniej zmiany treści. */
  updated: string;
  sections: LegalSection[];
};
export type Legal = {
  updatedLabel: string;
  binding: string;
  privacy: LegalDoc;
  cookies: LegalDoc;
};

// Teksty prawne osobno od głównego słownika — ładowane tylko na stronach polityk.
const legal: Record<Locale, () => Promise<Legal>> = {
  pl: () => import("@/dictionaries/legal/pl.json").then((m) => m.default),
  en: () => import("@/dictionaries/legal/en.json").then((m) => m.default),
  uk: () => import("@/dictionaries/legal/uk.json").then((m) => m.default),
};

export const getLegal = (locale: Locale) => legal[locale]();
