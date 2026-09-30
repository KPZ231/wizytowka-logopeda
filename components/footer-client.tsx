"use client";

import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Wielki napis: litery wysuwają się z maski jedna po drugiej (transform), dekoracyjny — czytnik go pomija. */
export function Wordmark({ text }: { text: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className="overflow-hidden pb-[0.24em] text-center select-none"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.035 }}
    >
      <span
        style={{
          backgroundImage:
            "linear-gradient(180deg, color-mix(in srgb, var(--violet-500) 75%, transparent), color-mix(in srgb, var(--violet-500) 6%, transparent))",
        }}
        className="inline-block bg-clip-text text-[clamp(3.25rem,13.5vw,15rem)] leading-[0.9] font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent"
      >
        {[...text].map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { y: "105%" },
              show: { y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </motion.div>
  );
}

/** Okrągły przycisk „w górę”: smooth scroll dziedziczy z CSS (wyłączony przy reduced motion). */
export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0 })}
      className="pressable group inline-flex size-12 items-center justify-center rounded-full bg-background text-foreground hover:bg-accent-soft focus-visible:outline-white"
    >
      <ArrowUp
        className="size-5 transition-transform duration-200 ease-(--ease-out) group-hover:-translate-y-0.5"
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}

/** Przełącznik języka zachowujący bieżącą podstronę. */
export function FooterLanguages({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const rest = usePathname().split("/").slice(2).join("/");
  return (
    <ul className="flex items-center gap-1" aria-label={label}>
      {locales.map((l) => (
        <li key={l}>
          <a
            href={`/${l}${rest ? `/${rest}` : ""}`}
            lang={l}
            hrefLang={l}
            aria-current={l === lang ? "true" : undefined}
            className={`pressable inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold uppercase focus-visible:outline-white ${
              l === lang
                ? "bg-background text-foreground"
                : "text-violet-200 hover:bg-violet-800"
            }`}
          >
            {l}
          </a>
        </li>
      ))}
    </ul>
  );
}
