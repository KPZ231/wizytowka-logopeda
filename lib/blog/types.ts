import type { Locale } from "@/i18n/config";

export type Localized<T> = Record<Locale, T>;

/** Kategorie wpisów; etykiety są w słowniku (`blog.categories`). */
export const CATEGORIES = [
  "parents",
  "autism",
  "swallowing",
  "speech",
] as const;
export type CategoryId = (typeof CATEGORIES)[number];

/** Odpowiednik rich text z Payload: typowane bloki renderowane komponentami React (bez HTML z zewnątrz). */
export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; text: string };

/** Kształt wpisu „w bazie” — wszystkie języki naraz, tak jak zwróci go kolekcja `posts` w Payload. */
export type Post = {
  id: string;
  /** Wspólny dla pl/en/uk, bo przełącznik języka podmienia tylko prefiks (patrz plan bloga). */
  slug: string;
  category: CategoryId;
  publishedAt: string;
  updatedAt?: string;
  status: "draft" | "published";
  cover?: { src: string; alt: Localized<string> };
  title: Localized<string>;
  excerpt: Localized<string>;
  seoDescription: Localized<string>;
  content: Localized<Block[]>;
};

/** Dane karty na liście — serializowalne, bez treści artykułu. */
export type PostCardData = {
  slug: string;
  category: CategoryId;
  publishedAt: string;
  title: string;
  excerpt: string;
  minutes: number;
  cover?: { src: string; alt: string };
};

/** Wpis w jednym języku (widok dla strony). */
export type PostView = PostCardData & {
  id: string;
  updatedAt?: string;
  seoDescription: string;
  content: Block[];
};
