import { Star } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Review } from "@/lib/reviews/types";

export function Stars({
  rating,
  className = "size-5",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${className} ${i <= Math.round(rating) ? "fill-accent text-accent" : "text-border-strong"}`}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * Karta opinii o stałej szerokości. Cała treść jest w DOM (line-clamp to tylko CSS), więc czytnik ekranu
 * czyta całość. Tekst zostaje w oryginale (po polsku) — na stronach EN/UK oznaczony `lang="pl"`.
 */
export function ReviewCard({
  review,
  lang,
  ratingLabel,
}: {
  review: Review;
  lang: Locale;
  ratingLabel: Dictionary["reviews"]["ratingLabel"];
}) {
  const month = new Intl.DateTimeFormat(lang, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${review.date}-01`));
  return (
    <li className="w-80 shrink-0 snap-start sm:w-96">
      <figure className="flex h-full flex-col rounded-md border border-border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {review.rating ? (
            <>
              <Stars rating={review.rating} />
              <span className="sr-only">
                {ratingLabel.replace("{r}", String(review.rating))}
              </span>
            </>
          ) : (
            <span />
          )}
          <time dateTime={review.date} className="text-sm text-muted">
            {month}
          </time>
        </div>
        <blockquote
          lang={lang === "pl" ? undefined : "pl"}
          className="mt-4 line-clamp-6 whitespace-pre-line text-base leading-[1.65] text-foreground"
        >
          {review.text}
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3 pt-1">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent"
          >
            {initials(review.author)}
          </span>
          <span className="font-semibold text-foreground">{review.author}</span>
        </figcaption>
      </figure>
    </li>
  );
}
