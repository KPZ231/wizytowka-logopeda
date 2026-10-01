import type { Content } from "./types";

/** Usuwa diakrytyki i wielkość liter — do wyszukiwania i identyfikatorów. `ł` nie rozkłada się w NFD. */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").replace(/ł/gi, "l").toLowerCase();

export const headingId = (text: string) =>
  fold(text)
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, "-")
    .replace(/^-+|-+$/g, "");

type LexicalNode = { type?: string; text?: string; tag?: string; children?: LexicalNode[] };

/** Złącza tekst wszystkich węzłów-dzieci (np. pogrubienia w nagłówku to osobne text-node'y). */
function nodeText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(nodeText).join("");
}

/** Spis treści z nagłówków H2 (identyfikatory zgodne z renderem w PostBody). */
export const toc = (content: Content) =>
  ((content.root as unknown as { children: LexicalNode[] }).children ?? [])
    .filter((n) => n.type === "heading" && n.tag === "h2")
    .map((n) => {
      const text = nodeText(n);
      return { id: headingId(text), text };
    });

/** Data w UTC, żeby serwer i przeglądarka formatowały tak samo (brak błędu hydracji). */
export const formatDate = (iso: string, lang: string) =>
  new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(iso),
  );
