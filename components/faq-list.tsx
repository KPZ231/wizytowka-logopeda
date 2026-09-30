"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ItemLi, StaggerList } from "./reveal";

type FaqItem = { q: string; a: string };

/**
 * Akordeon: dowolna liczba otwartych pozycji. Wysokość animowana sztuczką `grid-template-rows: 0fr → 1fr`
 * (bez pomiaru DOM), treść dodatkowo gaśnie opacity; ikona „+” obraca się w „×” (transform).
 * Zamknięty panel ma `inert`, więc jego treść nie jest w kolejności Tab ani czytana przez czytniki.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });

  return (
    <StaggerList className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <ItemLi key={item.q}>
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => toggle(i)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-foreground transition-colors duration-200 hover:text-accent md:text-xl"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-300 ease-(--ease-out) ${
                    isOpen
                      ? "rotate-45 bg-accent text-on-strong"
                      : "bg-accent-soft text-accent group-hover:bg-violet-200"
                  }`}
                >
                  <Plus className="size-5" strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-(--ease-out) ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose pb-6 text-base leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </ItemLi>
        );
      })}
    </StaggerList>
  );
}
