"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

// Dane klienta: wtorek i czwartek, 7:30–19:00. Indeksy 0 = poniedziałek … 6 = niedziela.
const OPEN_DAYS = [1, 3] as const;
const OPEN_FROM = 7 * 60 + 30;
const OPEN_TO = 19 * 60;
const HOURS = "7:30–19:00";
const SHORT_DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Aktualny dzień tygodnia i minuta doby w Polsce — niezależnie od strefy przeglądarki. */
function warsawNow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    day: SHORT_DAY.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** Najbliższy dzień przyjęć (0–6), licząc od „teraz”; dziś tylko jeśli jeszcze przed otwarciem. */
function nextOpenDay(day: number, minutes: number) {
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    if (
      (OPEN_DAYS as readonly number[]).includes(d) &&
      (i > 0 || minutes < OPEN_FROM)
    )
      return d;
  }
  return OPEN_DAYS[0];
}

/**
 * Godziny przyjęć: dwa dni z godzinami + status „teraz otwarte/zamknięte”.
 * Status liczony po stronie klienta (po hydracji), żeby statyczna strona nie pokazywała nieaktualnego stanu.
 */
export function HoursCard({
  hours,
  dayNames,
}: {
  hours: Dictionary["contact"]["hours"];
  dayNames: string[];
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const current = now ? warsawNow(now) : null;
  const isOpen =
    !!current &&
    (OPEN_DAYS as readonly number[]).includes(current.day) &&
    current.minutes >= OPEN_FROM &&
    current.minutes < OPEN_TO;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="text-xl font-bold text-foreground">{hours.title}</h3>
        {/* stała wysokość: status pojawia się po hydracji bez przesuwania układu */}
        <p
          aria-live="polite"
          className="flex min-h-6 items-center gap-2 text-sm font-semibold text-muted"
        >
          {current && (
            <>
              <span aria-hidden="true" className="relative flex size-2.5">
                {isOpen && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                )}
                <span
                  className={`relative inline-flex size-2.5 rounded-full ${isOpen ? "bg-success" : "bg-subtle"}`}
                />
              </span>
              {isOpen ? hours.openNow : hours.closedNow}
            </>
          )}
        </p>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {OPEN_DAYS.map((d) => {
          const today = current?.day === d;
          return (
            <li
              key={d}
              className={`rounded-md border p-4 transition-colors duration-200 ${
                today
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface"
              }`}
            >
              <p className="flex items-center justify-between gap-2 font-semibold text-foreground">
                {dayNames[d]}
                {today && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-strong">
                    {hours.today}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xl font-bold text-accent tabular-nums">
                {HOURS}
              </p>
            </li>
          );
        })}
      </ul>

      {current && !isOpen && (
        <p className="mt-3 text-sm text-muted">
          {hours.next.replace(
            "{day}",
            dayNames[nextOpenDay(current.day, current.minutes)],
          )}
        </p>
      )}
    </div>
  );
}
