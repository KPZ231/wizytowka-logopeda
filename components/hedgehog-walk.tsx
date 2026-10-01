"use client";

import { PawPrint } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/**
 * Jeż przechodzi przez cały ekran w pętli. GIF sam „tupie” nogami; dodatkowo podskakuje (transform),
 * żeby ruch w bok nie wyglądał jak ślizganie. Przy `prefers-reduced-motion` stoi w miejscu.
 * Pozioma pętla w vw, bo kontener ma `overflow-x-clip` (brak poziomego scrolla).
 */
export function HedgehogWalk({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const [broken, setBroken] = useState(false);

  const hedgehog = broken ? (
    // do czasu dostarczenia public/easter/hedgehog.gif
    <PawPrint className="size-20 text-accent" strokeWidth={1.5} role="img" aria-label={alt} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- animowany GIF: next/image go nie animuje po optymalizacji
    <img
      src="/easter/hedgehog.gif"
      alt={alt}
      width={160}
      height={160}
      onError={() => setBroken(true)}
      // błąd ładowania z SSR zdarza się przed hydracją, więc onError go nie złapie
      ref={(el) => {
        if (el?.complete && el.naturalWidth === 0) setBroken(true);
      }}
      className="size-32 object-contain md:size-40"
    />
  );

  if (reduce) {
    return <div className="mt-12 flex justify-center">{hedgehog}</div>;
  }

  return (
    <div className="relative mt-12 h-36 overflow-x-clip md:h-44">
      <motion.div
        initial={{ x: "-25vw" }}
        animate={{ x: "105vw" }}
        transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        className="absolute bottom-0 left-0"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.4, ease: "easeInOut", repeat: Infinity }}
        >
          {hedgehog}
        </motion.div>
      </motion.div>
    </div>
  );
}
