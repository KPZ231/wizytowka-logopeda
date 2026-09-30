import { ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import type { PostCardData } from "@/lib/blog/types";
import { MEDFILE_URL } from "../medfile-section";
import { Item, Stagger } from "../reveal";
import { PostCard } from "./post-card";

/** Autor: inicjały zamiast zdjęcia (zdjęcia nie mamy); treść wyłącznie z faktów podanych przez klienta. */
export function AuthorCard({ blog }: { blog: Dictionary["blog"] }) {
  return (
    <div className="flex gap-5 rounded-lg border border-border bg-surface p-6 md:p-8">
      <span
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-on-strong"
      >
        KK
      </span>
      <div>
        <p className="text-sm font-semibold text-muted">{blog.by}</p>
        <p className="text-xl font-bold text-foreground">{blog.authorName}</p>
        <p className="text-sm font-semibold text-accent">{blog.authorRole}</p>
        <p className="mt-3 max-w-prose text-muted">{blog.authorBio}</p>
      </div>
    </div>
  );
}

/** Wezwanie do kontaktu: jeden wyraźny CTA (Medfile) + telefon jako przycisk wtórny. */
export function PostCta({ blog }: { blog: Dictionary["blog"] }) {
  return (
    <div className="rounded-lg bg-surface-tint p-8 md:p-12">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-bold text-foreground">
        {blog.ctaTitle}
      </h2>
      <p className="mt-3 max-w-prose text-lg text-muted">{blog.ctaText}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={MEDFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-strong hover:bg-accent-hover"
        >
          {blog.ctaButton}
          <span className="sr-only">{blog.newTab}</span>
        </a>
        <a
          href="tel:+48518542193"
          className="pressable inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong bg-background px-7 font-semibold text-foreground hover:bg-accent-soft"
        >
          <Phone className="size-5" strokeWidth={1.75} aria-hidden="true" />
          {blog.ctaPhone}
        </a>
      </div>
    </div>
  );
}

/** Powiązane wpisy; bez nich sekcja w ogóle się nie renderuje. */
export function RelatedPosts({
  posts,
  lang,
  blog,
}: {
  posts: PostCardData[];
  lang: Locale;
  blog: Dictionary["blog"];
}) {
  if (posts.length === 0) return null;
  return (
    <section className="section-y bg-surface" aria-labelledby="related-title">
      <Stagger className="page-w">
        <Item>
          <h2
            id="related-title"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-bold text-foreground"
          >
            {blog.related}
          </h2>
        </Item>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} lang={lang} blog={blog} />
            </li>
          ))}
        </ul>
      </Stagger>
    </section>
  );
}

export function BackToList({
  lang,
  blog,
}: {
  lang: Locale;
  blog: Dictionary["blog"];
}) {
  return (
    <Link
      href={`/${lang}/blog`}
      className="pressable group inline-flex min-h-11 items-center gap-2 font-semibold text-accent hover:text-accent-hover"
    >
      <ArrowLeft
        className="size-5 transition-transform duration-200 ease-(--ease-out) group-hover:-translate-x-0.5"
        strokeWidth={2}
        aria-hidden="true"
      />
      {blog.backToList}
    </Link>
  );
}
