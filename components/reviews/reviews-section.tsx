import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Review, ReviewsSummary } from "@/lib/reviews/types";
import { Item, Stagger } from "../reveal";
import { Stars } from "./review-card";
import { ReviewsMarquee } from "./reviews-marquee";

const btn =
  "pressable inline-flex min-h-12 items-center rounded-full px-7 font-semibold";

/**
 * Opinie z Google. Bez wklejonych opinii sekcja się nie renderuje (nie wymyślamy opinii).
 * Celowo bez JSON-LD AggregateRating/Review — Google nie honoruje opinii „własnych” dla LocalBusiness.
 */
export function ReviewsSection({
  reviews,
  summary,
  dict,
  lang,
}: {
  reviews: Review[];
  summary: ReviewsSummary;
  dict: Dictionary["reviews"];
  lang: Locale;
}) {
  if (reviews.length === 0) return null;
  const score = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(summary.rating);

  return (
    <section
      id="opinie"
      className="section-y overflow-hidden bg-surface-tint"
      aria-labelledby="reviews-title"
    >
      <Stagger className="page-w">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Item>
              <h2
                id="reviews-title"
                className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
              >
                {dict.title}
              </h2>
            </Item>
            <Item>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                {summary.rating > 0 ? (
                  <>
                    <p className="text-6xl leading-none font-extrabold tracking-[-0.03em] text-foreground tabular-nums md:text-7xl">
                      {score}
                    </p>
                    <div>
                      <Stars rating={summary.rating} className="size-6" />
                      <span className="sr-only">
                        {dict.ratingLabel.replace("{r}", score)}
                      </span>
                      <p className="mt-1 text-muted">
                        {dict.based.replace("{n}", String(summary.count))}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-6xl leading-none font-extrabold tracking-[-0.03em] text-foreground tabular-nums md:text-7xl">
                      {summary.count}
                    </p>
                    <p className="text-lg text-muted">{dict.countLabel}</p>
                  </>
                )}
              </div>
              <p className="mt-4 max-w-prose text-sm text-muted">
                {dict.sourceNote}
              </p>
            </Item>
          </div>
          {(summary.profileUrl || summary.writeReviewUrl) && (
            <Item>
              <div className="flex flex-wrap gap-3">
                {summary.profileUrl && (
                  <a
                    href={summary.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btn} bg-accent text-on-strong hover:bg-accent-hover`}
                  >
                    {dict.viewAll}
                    <span className="sr-only">{dict.newTab}</span>
                  </a>
                )}
                {summary.writeReviewUrl && (
                  <a
                    href={summary.writeReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btn} border border-border-strong bg-background text-foreground hover:bg-accent-soft`}
                  >
                    {dict.writeReview}
                    <span className="sr-only">{dict.newTab}</span>
                  </a>
                )}
              </div>
            </Item>
          )}
        </div>
      </Stagger>

      <div className="mt-10 md:mt-14">
        <ReviewsMarquee reviews={reviews} lang={lang} dict={dict} />
      </div>
    </section>
  );
}
