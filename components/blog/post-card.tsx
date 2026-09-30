import {
  ArrowUpRight,
  Droplets,
  HeartHandshake,
  MessageCircle,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/blog/utils";
import type { CategoryId, PostCardData } from "@/lib/blog/types";

const ICONS: Record<CategoryId, LucideIcon> = {
  parents: HeartHandshake,
  autism: Puzzle,
  swallowing: Droplets,
  speech: MessageCircle,
};

/** Okładka: zdjęcie z CMS albo placeholder (gradient w palecie + ikona kategorii). */
export function Cover({
  post,
  sizes,
  className = "",
}: {
  post: PostCardData;
  sizes: string;
  className?: string;
}) {
  const Icon = ICONS[post.category];
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br from-violet-200 via-violet-100 to-violet-50 ${className}`}
    >
      {post.cover ? (
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-(--ease-out) group-hover/card:scale-[1.03]"
        />
      ) : (
        <div
          className="flex size-full items-center justify-center"
          aria-hidden="true"
        >
          <Icon
            className="size-1/4 text-violet-600/60 transition-transform duration-500 ease-(--ease-out) group-hover/card:scale-105"
            strokeWidth={1.25}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Karta wpisu — cała jest linkiem. Hover (tylko myszą) powiększa okładkę i przesuwa strzałkę;
 * wariant `featured` jest szeroki, dwukolumnowy od `lg`.
 */
export function PostCard({
  post,
  lang,
  blog,
  featured = false,
}: {
  post: PostCardData;
  lang: Locale;
  blog: Dictionary["blog"];
  featured?: boolean;
}) {
  return (
    <article className="group/card h-full">
      <Link
        href={`/${lang}/blog/${post.slug}`}
        className={`pressable flex h-full rounded-lg border border-border bg-background shadow-sm transition-shadow duration-200 hover:shadow-md ${
          featured
            ? "flex-col overflow-hidden bg-surface-tint lg:flex-row"
            : "flex-col overflow-hidden"
        }`}
      >
        <Cover
          post={post}
          sizes={
            featured
              ? "(min-width:1024px) 40vw, 90vw"
              : "(min-width:1024px) 26vw, (min-width:768px) 40vw, 90vw"
          }
          className={
            featured
              ? "aspect-[16/10] lg:aspect-auto lg:min-h-80 lg:w-1/2"
              : "aspect-[16/10]"
          }
        />
        <div
          className={`flex flex-1 flex-col p-6 ${featured ? "md:p-10 lg:w-1/2 lg:justify-center" : ""}`}
        >
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-accent">
              {blog.categories[post.category]}
            </span>
            <time dateTime={post.publishedAt} className="tabular-nums">
              {formatDate(post.publishedAt, lang)}
            </time>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {blog.readMin.replace("{n}", String(post.minutes))}
            </span>
          </p>
          <h3
            className={`mt-4 font-bold tracking-[-0.01em] text-foreground ${
              featured
                ? "text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15]"
                : "text-xl leading-snug"
            }`}
          >
            {post.title}
          </h3>
          <p
            className={`mt-3 text-muted ${featured ? "text-lg" : "line-clamp-3"}`}
          >
            {post.excerpt}
          </p>
          <span className="mt-auto flex items-center gap-2 pt-6 font-semibold text-accent">
            {blog.read}
            <ArrowUpRight
              className="size-5 transition-transform duration-200 ease-(--ease-out) group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
