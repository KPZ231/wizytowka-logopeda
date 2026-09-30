import type { Block } from "./types";

/** Usuwa diakrytyki i wielkość liter — do wyszukiwania i identyfikatorów. `ł` nie rozkłada się w NFD. */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").replace(/ł/gi, "l").toLowerCase();

export const headingId = (text: string) =>
  fold(text)
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Spis treści z nagłówków H2 (identyfikatory zgodne z renderem w PostBody). */
export const toc = (blocks: Block[]) =>
  blocks.flatMap((b) =>
    b.type === "heading" ? [{ id: headingId(b.text), text: b.text }] : [],
  );

/** Data w UTC, żeby serwer i przeglądarka formatowały tak samo (brak błędu hydracji). */
export const formatDate = (iso: string, lang: string) =>
  new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(iso),
  );
