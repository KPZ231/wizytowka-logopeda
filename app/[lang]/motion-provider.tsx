"use client";

import { MotionConfig } from "motion/react";

/** Respektuje prefers-reduced-motion dla wszystkich animacji motion w aplikacji. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
