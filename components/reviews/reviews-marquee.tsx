"use client";

import { Pause, Play } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Review } from "@/lib/reviews/types";
import { ReviewCard } from "./review-card";

const SECONDS_PER_CARD = 7;
const MIN_PER_ROW = 6;

/**
 * Dwa poziome rzędy opinii jadące w przeciwne strony. Bezpieczniki dostępności:
 * pauza na hover (mysz) i fokus (klawiatura), widoczny przycisk pauzy (WCAG 2.2.2),
 * a przy prefers-reduced-motion ruch znika i rzędy stają się przewijane palcem/klawiaturą.
 * Druga kopia toru jest aria-hidden + inert, żeby czytnik i Tab nie widziały duplikatów.
 */
export function ReviewsMarquee({
  reviews,
  lang,
  dict,
}: {
  reviews: Review[];
  lang: Locale;
  dict: Dictionary["reviews"];
}) {
  const [paused, setPaused] = useState(false);
  const rows = [
    reviews.filter((_, i) => i % 2 === 0),
    reviews.filter((_, i) => i % 2 === 1),
  ];
  // Przy kilku opiniach pętla nie ma sensu (luki, powtórki) — zwykły przewijany rząd.
  const moving = rows[0].length >= MIN_PER_ROW;

  return (
    <div className="marquee-root" data-paused={paused}>
      {moving && (
        <div className="page-w mb-4 flex justify-end motion-reduce:hidden">
          <button
            type="button"
            aria-pressed={paused}
            aria-label={dict.pause}
            onClick={() => setPaused((p) => !p)}
            className="pressable inline-flex size-11 items-center justify-center rounded-full border border-border-strong bg-background text-foreground hover:bg-accent-soft"
          >
            {paused ? (
              <Play className="size-5" aria-hidden="true" />
            ) : (
              <Pause className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
      <div
        role="region"
        aria-label={dict.regionLabel}
        // tabIndex: klawiaturowy fokus wstrzymuje ruch (reguła :focus-within) i pozwala przewijać strzałkami
        tabIndex={0}
        className="marquee-region flex flex-col gap-4 overflow-hidden motion-reduce:overflow-x-auto"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        }}
      >
        {rows.map((row, r) => {
          if (row.length === 0) return null;
          const cards = row.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              lang={lang}
              ratingLabel={dict.ratingLabel}
            />
          ));
          if (!moving) {
            return (
              <ul key={r} className="flex snap-x gap-4 overflow-x-auto pb-2">
                {cards}
              </ul>
            );
          }
          const style = {
            "--marquee-duration": `${row.length * SECONDS_PER_CARD}s`,
            "--marquee-dir": r === 0 ? "normal" : "reverse",
          } as CSSProperties;
          return (
            <div key={r} className="marquee-track snap-x" style={style}>
              <ul className="flex shrink-0 gap-4 pr-4">{cards}</ul>
              <ul
                aria-hidden="true"
                inert
                className="flex shrink-0 gap-4 pr-4 motion-reduce:hidden"
              >
                {row.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    lang={lang}
                    ratingLabel={dict.ratingLabel}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
