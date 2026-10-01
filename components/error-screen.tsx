"use client";

import { Settings, Unplug } from "lucide-react";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { Lottie } from "./lottie";

type ErrorText = Dictionary["errors"];

const TextContext = createContext<{ lang: Locale; text: ErrorText } | null>(null);

/**
 * Podaje teksty błędów ekranom z `error.tsx` / `not-found.tsx`. Te pliki nie dostają `params`,
 * a klient nie może importować słowników (server-only) — layout `[lang]` przekazuje tylko tę sekcję.
 */
export function ErrorTextProvider({
  lang,
  text,
  children,
}: {
  lang: Locale;
  text: ErrorText;
  children: ReactNode;
}) {
  return <TextContext value={{ lang, text }}>{children}</TextContext>;
}

const PHONE_HREF = "tel:+48518542193";
const LANG_LABEL: Record<Locale, string> = { pl: "PL", en: "EN", uk: "UK" };

const primary =
  "pressable inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-on-strong hover:bg-accent-hover";
const secondary =
  "pressable inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong px-7 text-base font-semibold text-foreground hover:bg-accent-soft";

const variants = {
  "404": { src: "/lottie/not-found.json", Icon: Unplug },
  "500": { src: "/lottie/error.json", Icon: Settings },
} as const;

/**
 * Wspólny ekran błędów (404 / 500). Linki to zwykłe `<a>`: pełne przeładowanie czyści stan
 * po awarii i działa też tam, gdzie nie ma layoutu (global-error, global-not-found).
 * Wejście w czystym CSS (`hero-rise`) — animuje się od pierwszego paintu, bez czekania na hydrację.
 */
export function ErrorScreen({
  code,
  reset,
  digest,
  lang: langProp,
  text: textProp,
  showLanguages = false,
}: {
  code: "404" | "500";
  reset?: () => void;
  digest?: string;
  /** Tylko dla ekranów bez layoutu `[lang]` — w pozostałych język i teksty idą z kontekstu. */
  lang?: Locale;
  text?: ErrorText;
  showLanguages?: boolean;
}) {
  const ctx = useContext(TextContext);
  const lang = langProp ?? ctx?.lang ?? "pl";
  const text = textProp ?? ctx?.text;
  if (!text) return null;

  const { src, Icon } = variants[code];
  const copy = code === "404" ? text.notFound : text.serverError;
  const retry = code === "500" && reset ? text.serverError.retry : null;
  const rise = (delay: number) =>
    ({ "--delay": `${delay}s`, "--rise": "20px" }) as CSSProperties;

  return (
    <main
      id="main"
      className="wash-violet relative flex min-h-[85svh] items-center overflow-x-clip bg-surface-tint pt-24 pb-14"
    >
      <div className="page-w grid items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div>
          {/* mix-blend-multiply na własnym stacking context: półprzezroczysty kod miesza się z tłem (DESIGN.md §4) */}
          <p
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, color-mix(in srgb, var(--violet-600) 80%, transparent), color-mix(in srgb, var(--violet-500) 30%, transparent))",
            }}
            className="hero-fade relative inline-block bg-clip-text pb-[0.18em] text-[clamp(4rem,14vw,8rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-transparent mix-blend-multiply tabular-nums"
          >
            {code}
          </p>

          <h1
            style={rise(0.1)}
            className="hero-rise text-[clamp(2rem,5vw,3rem)] leading-[1.15] font-bold tracking-[-0.02em] text-foreground"
          >
            <span className="sr-only">{code}: </span>
            {copy.title}
          </h1>
          <p
            style={rise(0.18)}
            className="hero-rise mt-4 max-w-[52ch] text-lg text-muted"
          >
            {copy.body}
          </p>

          <div style={rise(0.26)} className="hero-rise mt-8 flex flex-wrap gap-3">
            {retry ? (
              <>
                <button type="button" onClick={reset} className={primary}>
                  {retry}
                </button>
                <a href={`/${lang}`} className={secondary}>
                  {text.home}
                </a>
              </>
            ) : (
              <>
                <a href={`/${lang}`} className={primary}>
                  {text.home}
                </a>
                <a href={PHONE_HREF} className={secondary}>
                  {text.call}
                </a>
              </>
            )}
          </div>
          {retry && (
            <p style={rise(0.3)} className="hero-rise mt-4">
              <a
                href={PHONE_HREF}
                className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-hover"
              >
                {text.call}
              </a>
            </p>
          )}

          {digest && (
            <p className="mt-6 text-sm text-subtle tabular-nums">
              {text.serverError.reference}: {digest}
            </p>
          )}

          {showLanguages && (
            <nav aria-label={text.languages} className="mt-8 flex gap-2">
              {locales.map((l) => (
                <a
                  key={l}
                  href={`/${l}`}
                  lang={l}
                  hrefLang={l}
                  className="pressable inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-strong px-3 text-sm font-semibold text-foreground hover:bg-accent-soft"
                >
                  {LANG_LABEL[l]}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="order-first mx-auto md:order-none">
          <Lottie
            src={src}
            loop
            className="size-52 md:size-80"
            fallback={
              <Icon className="size-1/2 text-accent" strokeWidth={1.5} aria-hidden="true" />
            }
          />
        </div>
      </div>
    </main>
  );
}
