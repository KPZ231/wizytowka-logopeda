"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import { resetConsent, setConsent, useConsent } from "@/lib/consent";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const button =
  "pressable inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-border-strong px-5 text-sm font-semibold text-foreground hover:bg-accent-soft";

/**
 * Baner zgody na zewnętrzne cookies (dziś: mapa Google). Odrzucenie jest tak samo łatwe jak
 * akceptacja — dwa równorzędne przyciski. Leży po lewej, bo prawy dolny róg zajmuje czat.
 */
export function CookieBanner({
  lang,
  text,
}: {
  lang: Locale;
  text: Dictionary["cookies"];
}) {
  const consent = useConsent();

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.section
          role="region"
          aria-label={text.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease: EASE_OUT } }}
          className="fixed bottom-4 left-4 z-40 w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-border bg-background p-5 shadow-lg sm:bottom-6 sm:left-6"
        >
          <p className="font-semibold text-foreground">{text.title}</p>
          <p className="mt-2 text-sm text-muted">
            {text.body}{" "}
            <Link
              href={`/${lang}/polityka-prywatnosci`}
              className="font-semibold text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              {text.policy}
            </Link>
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => setConsent("rejected")} className={button}>
              {text.reject}
            </button>
            <button type="button" onClick={() => setConsent("accepted")} className={button}>
              {text.accept}
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

/** Link w stopce, który przywraca baner (zmiana decyzji). */
export function CookieSettingsButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={resetConsent} className={className}>
      {label}
    </button>
  );
}
