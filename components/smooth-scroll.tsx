"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Odstęp pod sticky nagłówkiem — zgodny z `scroll-padding-top` w globals.css (6rem). */
const ANCHOR_OFFSET = -96;

/**
 * Płynny scroll (Lenis) + płynne przejścia do kotwic `#id` na bieżącej stronie.
 * Wyłączony przy prefers-reduced-motion (natywny scroll, skok do kotwicy).
 * Lenis używa natywnego scrolla, więc useScroll (hero) działa bez zmian.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Nawigacja w ukrytej karcie: przeglądarka przerywa View Transition i odrzuca jego promise.
  // Nic się nie psuje (strona i tak się przełącza), więc nie zaśmiecamy konsoli.
  useEffect(() => {
    const onReject = (e: PromiseRejectionEvent) => {
      if (e.reason?.name === "InvalidStateError" && /transition/i.test(e.reason.message)) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", onReject);
    return () => window.removeEventListener("unhandledrejection", onReject);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis();
    lenisRef.current = lenis;
    let raf = requestAnimationFrame(function tick(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    });

    // Faza capture + stopPropagation: Link z Next nie zdąży zrobić własnego, natychmiastowego skoku
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.origin !== location.origin || a.pathname !== location.pathname) return;
      const el = a.hash.length > 1 ? document.getElementById(decodeURIComponent(a.hash.slice(1))) : null;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      // Tytuł sekcji ma wylądować pod nawigacją, a nie 96 px + padding sekcji niżej
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
      lenis.scrollTo(el, { offset: ANCHOR_OFFSET + pad });
      history.pushState(null, "", a.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  // Nowa strona zawsze od góry (Lenis trzyma własną pozycję i nadpisywał reset z Next); kotwice `#id` zostawiamy przeglądarce
  useEffect(() => {
    if (location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
