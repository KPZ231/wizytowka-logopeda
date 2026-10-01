import type { SerializedEditorState } from "lexical";
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

/** Treść wpisu edytowana w Payload (Lexical rich text), renderowana przez PostBody bez dangerouslySetInnerHTML. */
export type Content = SerializedEditorState;

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
  content: Content;
};
