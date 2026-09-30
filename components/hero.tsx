"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const clipEnter = (delay: number) => ({
  initial: { opacity: 0, y: "40%" },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
});

const textEnter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE_OUT },
});

/**
 * Znikanie clipboardu przy scrollu: opada w dół, lekko się zmniejsza i gaśnie.
 * Każdy ma własne okno [from, to] postępu scrolla (kolejność jak przy wejściu: L, P, Ś)
 * i własną głębię (`sink`) — boczne „bliższe" opadają szybciej.
 */
function useClipExit(p: MotionValue<number>, from: number, to: number, sink: number) {
  const y = useTransform(p, [0, from, to], ["0%", "0%", `${sink}%`]);
  const opacity = useTransform(p, [from, to], [1, 0]);
  const scale = useTransform(p, [from, to], [1, 0.94]);
  return { y, opacity, scale };
}

/**
 * Hero: wejście (chmury → clipboardy L, P, Ś → tekst), potem scroll z głębią.
 * Sekcja jest wyższa od ekranu, a zawartość „przyklejona" (sticky), więc postęp scrolla
 * 0→1 steruje warstwami o różnych prędkościach. Wejście i scroll mają osobne elementy
 * (wrapper ze scrollem, w środku element z animacją wejścia), żeby nie nadpisywały transformów.
 */
export function Hero({ title, lead }: { title: string; lead: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Pośredni motion value wyłącza natywny ScrollTimeline, który dla opacity przy sticky
  // zostawiał wartość 1 — wszystko liczone przez JS jest przewidywalne.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));

  // Chmury najwolniejsze (najdalej), miękko gasną od dołu, a potem całe
  const cloudY = useTransform(p, [0, 1], ["0%", "-8%"]);
  const cloudScale = useTransform(p, [0, 1], [1, 1.08]);
  const cloudOpacity = useTransform(p, [0.7, 1], [1, 0]);
  const fadeStart = useTransform(p, [0, 0.8], [100, 35]);
  const cloudMask = useMotionTemplate`linear-gradient(to bottom, #000 ${fadeStart}%, transparent 100%)`;

  // Tekst najbliżej widza: ucieka w górę szybciej niż tło i gaśnie
  const textY = useTransform(p, [0, 0.6], ["0vh", "-14vh"]);
  const textOpacity = useTransform(p, [0.1, 0.5], [1, 0]);

  const left = useClipExit(p, 0.1, 0.4, 35);
  const right = useClipExit(p, 0.16, 0.46, 35);
  const center = useClipExit(p, 0.22, 0.52, 22);

  // Przy prefers-reduced-motion brak parallaxy i znikania — statyczny układ
  const s = <T extends object>(v: T) => (reduce ? undefined : v);

  return (
    <section ref={ref} className="relative h-[230svh] bg-background">
      <div className="sticky top-0 isolate flex h-svh flex-col overflow-hidden">
        <motion.div
          className="absolute inset-0 -z-10 will-change-transform"
          style={s({
            y: cloudY,
            scale: cloudScale,
            opacity: cloudOpacity,
            maskImage: cloudMask,
            WebkitMaskImage: cloudMask,
          })}
        >
          <motion.img
            src="/hero/Background.webp"
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            className="size-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          />
        </motion.div>

        {/* mix-blend-multiply na kontenerze (ma własny stacking context): litery są półprzezroczyste
            i mnożą się z chmurami, więc tło prześwituje przez tekst */}
        <motion.div
          className="page-w relative z-20 pt-[clamp(6rem,18vh,10rem)] text-center mix-blend-multiply"
          style={s({ y: textY, opacity: textOpacity })}
        >
          <motion.h1
            style={{
              backgroundImage:
                "linear-gradient(180deg, color-mix(in srgb, var(--violet-500) 80%, transparent), color-mix(in srgb, var(--violet-800) 80%, transparent))",
            }}
            className="bg-clip-text pb-[0.18em] text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE_OUT }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-[60ch] text-lg font-semibold text-muted"
            {...textEnter(1.18)}
          >
            {lead}
          </motion.p>
        </motion.div>

        <div className="pointer-events-none mt-auto flex items-end justify-center">
          <motion.div
            className="-mr-[9%] -mb-[24%] w-[38%] max-w-[640px]"
            style={s(left)}
          >
            <motion.img
              src="/hero/Clip_Left.webp"
              alt=""
              width={640}
              height={650}
              className="w-full"
              {...clipEnter(0.3)}
            />
          </motion.div>
          <motion.div
            className="relative z-10 -mb-[15%] w-[38%] max-w-[640px]"
            style={s(center)}
          >
            <motion.img
              src="/hero/Clip_Center.webp"
              fetchPriority="high"
              alt=""
              width={640}
              height={650}
              className="w-full"
              {...clipEnter(0.54)}
            />
          </motion.div>
          <motion.div
            className="-ml-[9%] -mb-[24%] w-[38%] max-w-[640px]"
            style={s(right)}
          >
            <motion.img
              src="/hero/Clip_RIght.webp"
              alt=""
              width={640}
              height={650}
              className="w-full"
              {...clipEnter(0.42)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
