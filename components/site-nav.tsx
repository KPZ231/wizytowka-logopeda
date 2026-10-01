"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
// Po przekroczeniu tego progu (px) użytkownik „opuścił” hero → pasek się pokazuje.
const SHOW_AFTER = 48;
//
// Kotwice na stronie głównej (z prefiksem języka, działają też z podstron); blog to przyszła osobna podstrona (teraz 404).
const links = [       
  ["services", "#uslugi"],
  ["about", "#gabinet"],
  ["pricing", "#cennik"],
  ["blog", "/blog"],
  ["contact", "#kontakt"],
] as const;

const linkClass =
  "pressable inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted hover:text-accent hover:bg-accent-soft aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent";

/**
 * Pływający pasek: ukryty na górze strony (hero), wysuwa się po pierwszym scrollu i zostaje,
 * dopóki użytkownik nie wróci na samą górę. Animowane tylko transform/opacity.
 */
export function SiteNav({
  lang,
  nav,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  // Fokus z klawiatury wymusza pokazanie paska — inaczej Tab trafiałby w niewidoczny element.
  const [focused, setFocused] = useState(false);
  const pathname = usePathname();
  // Ukrywanie po scrollu dotyczy tylko strony głównej (hero); na podstronach (blog) pasek jest stale widoczny.
  const onHome = pathname === `/${lang}`;
  const visible = !onHome || scrolled || focused;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > SHOW_AFTER));

  const rest = pathname.split("/").slice(2).join("/");
  const switcher = (
    <ul className="flex items-center" aria-label={nav.language}>
      {locales.map((l) => (
        <li key={l}>
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            lang={l}
            hrefLang={l}
            aria-current={l === lang ? "true" : undefined}
            className={`pressable inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold uppercase ${
              l === lang
                ? "bg-accent text-on-strong"
                : "text-muted hover:bg-accent-soft hover:text-accent"
            }`}
          >
            {l}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50 flex justify-center"
      initial={false}
      animate={{ y: visible ? 0 : "-130%", opacity: visible ? 1 : 0 }}
      transition={{ duration: visible ? 0.5 : 0.3, ease: EASE_OUT }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <nav
        aria-label={nav.label}
        className="page-w flex items-center justify-between gap-2 rounded-full border border-border bg-background/80 py-1.5 pr-1.5 pl-1.5 shadow-md backdrop-blur-md"
      >
        <Link
          href={`/${lang}`}
          className="pressable flex min-h-11 items-center gap-3 rounded-full pr-2 text-sm font-bold whitespace-nowrap text-foreground"
        >
          {/* alt="" — nazwę linku daje tekst obok */}
          <Image
            src="/logo_round.png"
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0"
          />
          <span className="md:hidden">{nav.brandShort}</span>
          <span className="hidden md:inline">{nav.brand}</span>
        </Link>

        <ul className="hidden items-center lg:flex">
          {links.map(([key, path]) => (
            <li key={key}>
              <Link
                href={`/${lang}${path}`}
                aria-current={
                  path === "/blog" && pathname.startsWith(`/${lang}/blog`)
                    ? "page"
                    : undefined
                }
                className={linkClass}
              >
                {nav[key]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">{switcher}</div>
          <a
            href="tel:+48518542193"
            aria-label={nav.callLabel}
            className="pressable inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-strong hover:bg-accent-hover"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            <span className="hidden sm:inline">{nav.call}</span>
          </a>

          {/* Menu mobilne: natywne <details> — dostępne z klawiatury bez JS */}
          <details className="group relative lg:hidden">
            <summary
              aria-label={nav.menu}
              className="pressable flex size-11 cursor-pointer list-none items-center justify-center rounded-full text-foreground hover:bg-accent-soft [&::-webkit-details-marker]:hidden"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="absolute top-full right-0 mt-3 w-64 origin-top-right rounded-lg border border-border bg-background p-2 shadow-lg">
              <ul>
                {links.map(([key, path]) => (
                  <li key={key}>
                    <Link
                      href={`/${lang}${path}`}
                      aria-current={
                        path === "/blog" && pathname.startsWith(`/${lang}/blog`)
                          ? "page"
                          : undefined
                      }
                      className={`${linkClass} w-full`}
                    >
                      {nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex justify-center border-t border-border pt-2 md:hidden">
                {switcher}
              </div>
            </div>
          </details>
        </div>
      </nav>
    </motion.header>
  );
}
