"use client";

import { Check, Link2 } from "lucide-react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Pasek postępu czytania: pozycja scrolla względem elementu artykułu → scaleX (tylko transform).
 * Liczone ręcznie w jednym passive listenerze, bez rerenderów; przy reduced motion nie renderujemy.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const reduce = useReducedMotion();
  const p = useMotionValue(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      p.set(total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId, p]);

  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-accent"
      style={{ scaleX: p }}
    />
  );
}

/**
 * Spis treści z podświetleniem sekcji, która jest przy górze ekranu (jeden IntersectionObserver).
 * Na desktopie sticky z boku, na mobile zwijany <details> — natywny, dostępny z klawiatury.
 */
export function Toc({
  items,
  title,
}: {
  items: { id: string; text: string }[];
  title: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const list = (
    <ol className="mt-3 border-l border-border-strong">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            aria-current={active === i.id ? "location" : undefined}
            className={`-ml-px flex min-h-11 items-center border-l-2 py-1 pl-4 text-sm transition-colors duration-200 ${
              active === i.id
                ? "border-accent font-semibold text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label={title}>
      <details className="rounded-md border border-border bg-surface px-4 py-2 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-foreground">
          {title}
        </summary>
        {list}
      </details>
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {list}
      </div>
    </nav>
  );
}

/** Kopiuje adres wpisu (bez zewnętrznych skryptów społecznościowych); stan „skopiowano” ogłaszany aria-live. */
export function CopyLink({ label, done }: { label: string; done: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // schowek zablokowany (np. http/iframe) — brak akcji, użytkownik skopiuje z paska adresu
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="pressable inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm font-semibold text-foreground hover:bg-accent-soft"
    >
      {copied ? (
        <Check
          className="size-4 text-success"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <Link2 className="size-4" strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}
