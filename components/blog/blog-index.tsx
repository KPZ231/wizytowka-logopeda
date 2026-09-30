"use client";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  CATEGORIES,
  type CategoryId,
  type PostCardData,
} from "@/lib/blog/types";
import { fold } from "@/lib/blog/utils";
import { PostCard } from "./post-card";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PAGE = 6;

/**
 * Lista bloga: wyszukiwarka po tytule/zajawce, chipy kategorii (pigułka ślizga się przez layoutId),
 * wyróżniony najnowszy wpis + siatka, „Pokaż więcej”. Zmiana kategorii to fade + translateY całego wyniku.
 */
export function BlogIndex({
  posts,
  lang,
  blog,
}: {
  posts: PostCardData[];
  lang: Locale;
  blog: Dictionary["blog"];
}) {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);

  // Chipy tylko dla kategorii, w których są wpisy.
  const present = CATEGORIES.filter((c) => posts.some((p) => p.category === c));
  const q = fold(query.trim());
  const filtered = posts.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!q || fold(`${p.title} ${p.excerpt}`).includes(q)),
  );
  const [featured, ...rest] = filtered;
  const shown = rest.slice(0, visible);
  const filtering = category !== "all" || q !== "";

  const reset = () => {
    setCategory("all");
    setQuery("");
    setVisible(PAGE);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label={blog.filterLabel}
          className="flex flex-wrap gap-2"
        >
          {(["all", ...present] as const).map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCategory(c);
                  setVisible(PAGE);
                }}
                className={`pressable relative inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? "border-accent text-on-strong"
                    : "border-border-strong text-foreground hover:bg-accent-soft"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="blog-chip"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                  />
                )}
                <span className="relative">
                  {c === "all" ? blog.all : blog.categories[c]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="blog-search" className="sr-only">
            {blog.searchLabel}
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-subtle"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE);
            }}
            placeholder={blog.searchPlaceholder}
            autoComplete="off"
            className="min-h-12 w-full rounded-full border border-border-strong bg-surface pr-12 pl-12 text-base text-foreground transition-colors duration-200 placeholder:text-subtle hover:border-accent focus:border-accent [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label={blog.clearSearch}
              onClick={() => setQuery("")}
              className="pressable absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-accent-soft"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {blog.results.replace("{n}", String(filtered.length))}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={category}
          className="mt-10 md:mt-14"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {featured ? (
            <>
              <PostCard post={featured} lang={lang} blog={blog} featured />
              {shown.length > 0 && (
                <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {shown.map((p) => (
                    <li key={p.slug}>
                      <PostCard post={p} lang={lang} blog={blog} />
                    </li>
                  ))}
                </ul>
              )}
              {rest.length > visible && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE)}
                    className="pressable inline-flex min-h-12 items-center rounded-full border border-border-strong px-7 font-semibold text-foreground hover:bg-accent-soft"
                  >
                    {blog.more}
                  </button>
                </div>
              )}
              {!filtering && rest.length === 0 && (
                <p className="mt-8 text-center text-muted">{blog.soon}</p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
              <p className="text-xl font-bold text-foreground">
                {blog.emptyTitle}
              </p>
              <p className="mt-2 text-muted">{blog.emptyText}</p>
              <button
                type="button"
                onClick={reset}
                className="pressable mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-strong hover:bg-accent-hover"
              >
                {blog.clearFilters}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
