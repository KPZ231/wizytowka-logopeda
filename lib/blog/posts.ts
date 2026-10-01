import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/config";
import type { Post } from "@/payload-types";
import type { Content, PostCardData, PostView } from "./types";

const WORDS_PER_MINUTE = 200;

/** Zlicza słowa w tekstowych węzłach Lexical, pomijając strukturę (bloki, formatowanie). */
function countWords(node: unknown): number {
  if (!node || typeof node !== "object") return 0;
  const n = node as { text?: unknown; children?: unknown };
  let words = 0;
  if (typeof n.text === "string") {
    words += n.text.split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(n.children)) {
    words += n.children.reduce((sum: number, c) => sum + countWords(c), 0);
  }
  return words;
}

function readingMinutes(content: Content): number {
  const words = countWords(content.root);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function toView(p: Post): PostView {
  const content = p.content as unknown as Content;
  const cover =
    p.cover && typeof p.cover === "object"
      ? { src: p.cover.url ?? "", alt: p.cover.alt }
      : undefined;
  return {
    id: String(p.id),
    slug: p.slug,
    category: p.category,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    title: p.title,
    excerpt: p.excerpt,
    seoDescription: p.seoDescription,
    cover,
    content,
    minutes: readingMinutes(content),
  };
}

/** Wpisy opublikowane, od najnowszego. */
export async function getPosts(lang: Locale): Promise<PostView[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    locale: lang,
    fallbackLocale: false,
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    depth: 1,
    limit: 0,
  });
  return docs.map(toView);
}

export async function getPost(
  lang: Locale,
  slug: string,
): Promise<PostView | null> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    locale: lang,
    fallbackLocale: false,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
    depth: 1,
    limit: 1,
  });
  return docs[0] ? toView(docs[0]) : null;
}

export async function getSlugs(): Promise<string[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    depth: 0,
    limit: 0,
    select: { slug: true },
  });
  return docs.map((d) => d.slug);
}

/** Powiązane: ta sama kategoria, potem najnowsze. */
export async function getRelated(
  lang: Locale,
  current: PostView,
  limit = 3,
): Promise<PostView[]> {
  const others = (await getPosts(lang)).filter((p) => p.slug !== current.slug);
  return [
    ...others.filter((p) => p.category === current.category),
    ...others.filter((p) => p.category !== current.category),
  ].slice(0, limit);
}

/** Dane karty (bez treści) — to trafia do komponentów klienckich. */
export const toCard = ({
  slug,
  category,
  publishedAt,
  title,
  excerpt,
  minutes,
  cover,
}: PostView): PostCardData => ({
  slug,
  category,
  publishedAt,
  title,
  excerpt,
  minutes,
  cover,
});
