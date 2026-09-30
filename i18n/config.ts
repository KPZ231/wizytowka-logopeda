export const locales = ["pl", "en", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
