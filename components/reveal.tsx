"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Wspólne warianty wejścia sekcji: fade + translateY(16px), stagger 70 ms dla dzieci.
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

// Stałe referencje: nowy obiekt wariantów przy każdym renderze restartował animację dzieci.
const makeContainer = (rise: boolean): Variants => ({
  hidden: rise ? item.hidden : {},
  show: {
    ...(rise ? (item.show as object) : {}),
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
});

const containerFlat = makeContainer(false);
const containerRise = makeContainer(true);

type Props = { children: ReactNode; className?: string };

const viewport = { once: true, amount: 0.25 } as const;

/** Kontener wejścia: po wjechaniu w ekran uruchamia kaskadę dzieci (`Item`). `rise` — sam też wjeżdża. */
export function Stagger({
  children,
  className,
  rise = false,
}: Props & { rise?: boolean }) {
  return (
    <motion.div
      className={className}
      variants={rise ? containerRise : containerFlat}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function StaggerList({
  children,
  className,
  id,
}: Props & { id?: string }) {
  return (
    <motion.ul
      id={id}
      className={className}
      variants={containerFlat}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.ul>
  );
}

export function Item({ children, className }: Props) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

export function ItemLi({ children, className }: Props) {
  return (
    <motion.li className={className} variants={item}>
      {children}
    </motion.li>
  );
}
