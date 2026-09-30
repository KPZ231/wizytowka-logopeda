"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Item, Stagger } from "./reveal";

type Spot = { x: number; y: number; w: number; rot: number };
// tall = wysokość polaroida / jego szerokość (na telefonie podpis zajmuje relatywnie więcej miejsca)
type Layout = { spots: Spot[]; ratio: number; tall: number };

// Pineska (x, y) — środek górnej krawędzi zdjęcia — i szerokość (w) w % tablicy.
// Zakotwiczenie za pineskę: jej pozycja nie zależy od wysokości polaroida (ta zmienia się z szerokością
// ekranu, bo podpis ma stały rozmiar w px), a zdjęcie obraca się wokół pineski.
// ratio = szerokość/wysokość tablicy. `tall` służy tylko do wyśrodkowania kamery (przybliżenie).
const MOBILE: Layout = {
  ratio: 3 / 4,
  tall: 1.1,
  spots: [
    { x: 29, y: 4, w: 34, rot: -4 },
    { x: 71, y: 21.5, w: 34, rot: 3 },
    { x: 29, y: 39, w: 34, rot: 2 },
    { x: 71, y: 56.5, w: 34, rot: -3 },
    { x: 29, y: 74, w: 34, rot: 4 },
  ],
};
const DESKTOP: Layout = {
  ratio: 16 / 10,
  tall: 0.97,
  spots: [
    { x: 13, y: 14, w: 20, rot: -4 },
    { x: 31, y: 52, w: 20, rot: 3 },
    { x: 50, y: 14, w: 20, rot: -2 },
    { x: 69, y: 52, w: 20, rot: 4 },
    { x: 87, y: 14, w: 20, rot: -3 },
  ],
};

// ponytail: gdy klient dośle zdjęcia, wpisać ścieżki z public/ tutaj (brak = placeholder).
const SRC: (string | undefined)[] = [undefined, undefined, undefined, undefined, undefined];

const FILL = 0.72; // miejsce pod zdjęciem na przyciski
const TARGET_Y = 45; // środek kadru w % wysokości tablicy (nieco wyżej, nad przyciskami)
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring", duration: 0.7, bounce: 0.12 } as const;

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsDesktop = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );

/**
 * Nitka między pineskami (górny środek zdjęć) z lekkim zwisem. Współrzędne x mnożone przez
 * proporcje tablicy, bo viewBox ma jej realny kształt — inaczej SVG rozciągałby kreskę.
 */
function threadPath(layout: Layout, a: number, b: number) {
  const pin = (s: Spot) => ({ x: s.x * layout.ratio, y: s.y });
  const p = pin(layout.spots[a]);
  const q = pin(layout.spots[b]);
  return `M${p.x} ${p.y} Q${(p.x + q.x) / 2} ${(p.y + q.y) / 2 + 7} ${q.x} ${q.y}`;
}

const pathVariants: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.7, delay: 0.5, ease: EASE_OUT } },
};

const pill =
  "pressable inline-flex size-11 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md hover:bg-accent-soft";

/**
 * Tablica korkowa: klik w zdjęcie przesuwa i przybliża „kamerę” (cały świat tablicy)
 * do wybranego zdjęcia. Pozycje w % — zoom nie wymaga mierzenia DOM.
 */
export function OfficeBoard({ office }: { office: Dictionary["office"] }) {
  const desktop = useIsDesktop();
  const [active, setActive] = useState<number | null>(null);
  const layout = desktop ? DESKTOP : MOBILE;
  const count = office.photos.length;

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? i : (i + count - 1) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, count]);

  let camera = { x: "0%", y: "0%", scale: 1 };
  if (active !== null) {
    const s = layout.spots[active];
    const h = s.w * layout.ratio * layout.tall;
    const scale = Math.min((FILL * 100) / s.w, (FILL * 100) / h);
    const cy = s.y + h / 2;
    camera = { x: `${(50 - s.x) * scale}%`, y: `${(TARGET_Y - cy) * scale}%`, scale };
  }

  const threads = (l: Layout, cls: string) => (
    <svg
      viewBox={`0 0 ${l.ratio * 100} 100`}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full drop-shadow-[0_1px_1px_rgb(42_23_72/0.35)] ${cls}`}
    >
      {l.spots.slice(1).map((_, i) => (
        <motion.path
          key={i}
          d={threadPath(l, i, i + 1)}
          fill="none"
          stroke="var(--violet-600)"
          strokeWidth={l.ratio > 1 ? 0.32 : 0.45}
          strokeLinecap="round"
          variants={pathVariants}
        />
      ))}
    </svg>
  );

  return (
    <Stagger className="cork relative aspect-[3/4] overflow-hidden rounded-lg border border-border-strong md:aspect-[16/10]">
      <motion.div
        className="cork absolute inset-0"
        animate={camera}
        transition={SPRING}
        onClick={() => setActive(null)}
      >
        {office.photos.map((photo, i) => {
          const m = MOBILE.spots[i];
          const d = DESKTOP.spots[i];
          const spotVars = {
            "--x": `${m.x}%`,
            "--y": `${m.y}%`,
            "--w": `${m.w}%`,
            "--xd": `${d.x}%`,
            "--yd": `${d.y}%`,
            "--wd": `${d.w}%`,
          } as CSSProperties;
          const dimmed = active !== null && active !== i;
          return (
            <div
              key={photo.caption}
              style={spotVars}
              className="absolute top-(--y) left-(--x) w-(--w) -translate-x-1/2 md:top-(--yd) md:left-(--xd) md:w-(--wd)"
            >
              <Item>
                <motion.div
                  className="origin-top"
                  animate={{ rotate: active === i ? 0 : (desktop ? d : m).rot, opacity: dimmed ? 0.35 : 1 }}
                  transition={SPRING}
                >
                  <button
                    type="button"
                    aria-label={`${office.zoom}: ${photo.caption}`}
                    aria-pressed={active === i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(active === i ? null : i);
                    }}
                    className="relative block w-full cursor-zoom-in rounded-sm bg-background p-[4%] pb-[3%] text-left shadow-md"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 left-1/2 z-10 size-3 -translate-x-1/2 rounded-full md:-top-2 bg-[radial-gradient(circle_at_35%_30%,var(--violet-300),var(--violet-600)_60%,var(--violet-800))] shadow-sm md:size-4"
                    />
                    <span className="relative block aspect-[4/3] overflow-hidden bg-accent-soft">
                      {SRC[i] && (
                        <Image
                          src={SRC[i]}
                          alt={photo.alt}
                          fill
                          sizes="(min-width:768px) 20vw, 40vw"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="mt-[6%] block truncate text-[10px] font-semibold text-foreground md:text-sm">
                      {photo.caption}
                    </span>
                  </button>
                </motion.div>
              </Item>
            </div>
          );
        })}

        {/* nitki nad zdjęciami: są przywiązane do pinesek, więc leżą na polaroidach */}
        {threads(MOBILE, "md:hidden")}
        {threads(DESKTOP, "hidden md:block")}
      </motion.div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={pill} aria-label={office.prev} onClick={() => setActive((active + count - 1) % count)}>
              <Arrow d="M15 6l-6 6 6 6" />
            </button>
            <button type="button" className={pill} aria-label={office.close} onClick={() => setActive(null)}>
              <Arrow d="M6 6l12 12M18 6L6 18" />
            </button>
            <button type="button" className={pill} aria-label={office.next} onClick={() => setActive((active + 1) % count)}>
              <Arrow d="M9 6l6 6-6 6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {active !== null ? office.photos[active].caption : ""}
      </p>
    </Stagger>
  );
}

function Arrow({ d }: { d: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
