"use client";

import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

declare global {
  interface Window {
    tidioChatApi?: { open: () => void };
  }
  interface Document {
    tidioChatLang?: string;
  }
}

const TIDIO_KEY = process.env.NEXT_PUBLIC_TIDIO_KEY;

/**
 * Pływający przycisk czatu. Skrypt Tidio (firma trzecia, przetwarza dane poza stroną)
 * ładuje się dopiero po zgodzie w panelu — nie wcześniej, zgodnie z RODO.
 * Bez NEXT_PUBLIC_TIDIO_KEY (lokalnie / przed podłączeniem konta) komponent się nie renderuje.
 */
export function ChatLauncher({
  lang,
  text,
}: {
  lang: Locale;
  text: Dictionary["chat"];
}) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);

  if (!TIDIO_KEY) return null;

  const startChat = () => {
    setStarted(true);
    document.tidioChatLang = lang;
    document.addEventListener(
      "tidioChat-ready",
      () => window.tidioChatApi?.open(),
      { once: true },
    );
    const script = document.createElement("script");
    script.src = `https://code.tidio.co/${TIDIO_KEY}.js`;
    script.async = true;
    document.body.append(script);
    setOpen(false);
  };

  const closePanel = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // Po starcie Tidio dostarcza własny pływający bąbel — nasz przycisk już nie jest potrzebny.
  if (started) return null;

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={text.title}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            onKeyDown={(e) => e.key === "Escape" && closePanel()}
            className="mb-3 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-background p-5 shadow-lg"
          >
            <p className="font-semibold text-foreground">{text.title}</p>
            <p className="mt-2 text-sm text-muted">{text.notice}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closePanel}
                className="pressable inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-foreground hover:bg-accent-soft"
              >
                {text.close}
              </button>
              <button
                type="button"
                onClick={startChat}
                className="pressable inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-strong hover:bg-accent-hover"
              >
                {text.start}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? text.close : text.open}
        onClick={() => setOpen((v) => !v)}
        className="pressable flex size-14 items-center justify-center rounded-full bg-accent text-on-strong shadow-md hover:bg-accent-hover"
      >
        {open ? (
          <X className="size-6" strokeWidth={2} aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
