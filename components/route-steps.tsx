"use client";

import { Camera } from "lucide-react";
import { SpinImage } from "@/components/spin-image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

type Step = { title: string; text: string; alt: string };

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// ponytail: gdy klient dośle zdjęcia, wpisać ścieżki z public/dojazd/ (brak = placeholder).
const PHOTOS: (string | undefined)[] = [undefined, undefined, undefined];

/**
 * Pionowa „trasa”: linia wypełnia się fioletem wraz ze scrollem (scaleY), a krok, który jest
 * w środku ekranu, dostaje wypełnioną plakietkę z numerem. Numeracja ma sens — to kolejność drogi.
 */
export function RouteSteps({
  steps,
  label,
  photoSoon,
}: {
  steps: Step[];
  label: string;
  photoSoon: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 55%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={listRef} aria-label={label} className="relative">
      {/* tło linii i jej wypełnienie (tylko transform) */}
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-5 w-0.5 -translate-x-1/2 bg-border-strong"
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-5 w-0.5 origin-top -translate-x-1/2 bg-accent"
        style={{ scaleY: reduce ? 1 : fill }}
      />
      {steps.map((step, i) => (
        <StepItem
          key={step.title}
          step={step}
          index={i}
          photoSoon={photoSoon}
          last={i === steps.length - 1}
        />
      ))}
    </ol>
  );
}

function StepItem({
  step,
  index,
  photoSoon,
  last,
}: {
  step: Step;
  index: number;
  photoSoon: string;
  last: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const src = PHOTOS[index];

  return (
    <motion.li
      ref={ref}
      className={`relative pl-16 ${last ? "" : "pb-12 lg:pb-16"}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border-2 text-base font-bold tabular-nums transition-[transform,background-color,color,border-color] duration-300 ease-(--ease-out) ${
          active
            ? "scale-110 border-accent bg-accent text-on-strong"
            : "border-border-strong bg-background text-muted"
        }`}
      >
        {index + 1}
      </span>
      <h3 className="text-xl font-bold text-foreground md:text-2xl">
        {step.title}
      </h3>
      <p className="mt-2 max-w-prose text-muted">{step.text}</p>
      <figure className="relative mt-5 aspect-[4/3] overflow-hidden rounded-md bg-accent-soft shadow-sm">
        {src ? (
          <SpinImage
            src={src}
            alt={step.alt}
            fill
            sizes="(min-width:1024px) 35vw, 80vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-accent">
            <Camera className="size-8" strokeWidth={1.5} aria-hidden="true" />
            <figcaption className="text-sm font-semibold">
              {photoSoon}
            </figcaption>
          </div>
        )}
      </figure>
    </motion.li>
  );
}
