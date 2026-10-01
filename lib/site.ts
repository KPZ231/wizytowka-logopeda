import type { Locale } from "@/i18n/config";

// Host bez protokołu; po podpięciu domeny klienta Vercel sam podmienia go na tę domenę (po redeployu).
const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/**
 * Adres produkcyjny (canonical, sitemap, JSON-LD). Kolejność: NEXT_PUBLIC_SITE_URL (nadpisanie),
 * domena produkcyjna z Vercela, lokalny fallback.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProd ? `https://${vercelProd}` : "http://localhost:3000")
).replace(/\/$/, "");

/** Na Vercelu indeksuje tylko środowisko production (preview nigdy); poza Vercelem — gdy ustawiono domenę. */
export const IS_INDEXABLE = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : Boolean(process.env.NEXT_PUBLIC_SITE_URL);

/** NAP — jedno źródło dla JSON-LD (dane klienta z CLAUDE.md). */
export const BUSINESS = {
  name: "Gabinet Logopedyczny Kinga Krajs",
  telephone: "+48518542193",
  street: "Biernota 11",
  postalCode: "44-230",
  city: "Czerwionka",
  country: "PL",
  medfile: "https://www.medfile.pl/kinga-krajs/logopeda/polska/",
} as const;

/** Wykonawca strony (meta author, stopka). */
export const CREATOR = {
  name: "KPZsProductions",
  url: "https://www.kpzsproductions.pl",
} as const;

/** Logo gabinetu (public/) — JSON-LD i ikona. */
export const LOGO_PATH = "/logo_logopeda.jpg";

/** og:locale wymaga formatu język_KRAJ. */
export const OG_LOCALE: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_US",
  uk: "uk_UA",
};
