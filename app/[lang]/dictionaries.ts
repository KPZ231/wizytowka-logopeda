import "server-only";
import type { Locale } from "@/i18n/config";
import pl from "@/dictionaries/pl.json";

// Typ słownika wynika z pl.json; en/uk muszą mieć identyczne klucze (błąd kompilacji, jeśli nie).
export type Dictionary = typeof pl;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pl: async () => pl,
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  uk: () => import("@/dictionaries/uk.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
