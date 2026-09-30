"use client";

import { useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";

const Player = dynamic(() => import("./lottie-player"), { ssr: false });

/**
 * Dekoracyjna animacja Lottie. Do czasu wejścia w widok (i załadowania playera) oraz przy
 * `prefers-reduced-motion` pokazuje statyczny `fallback` (ikona Lucide) — brak pustego miejsca,
 * brak ciężkiego wasm dla osób, które nie chcą ruchu.
 */
export function Lottie({
  src,
  fallback,
  loop = false,
  className = "",
}: {
  src: string;
  fallback: ReactNode;
  loop?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [ready, setReady] = useState(false);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`relative inline-block shrink-0 ${className}`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        {fallback}
      </span>
      {inView && !reduce && (
        <span className="absolute inset-0">
          <Player src={src} loop={loop} onReady={() => setReady(true)} />
        </span>
      )}
    </span>
  );
}
