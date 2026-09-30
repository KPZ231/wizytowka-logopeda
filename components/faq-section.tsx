import { CircleHelp } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { FaqList } from "./faq-list";
import { Lottie } from "./lottie";
import { Item, Stagger } from "./reveal";

/** FAQ: nagłówek z animacją „przyklejony” po lewej, akordeon po prawej. */
export function FaqSection({ faq }: { faq: Dictionary["faq"] }) {
  return (
    <section className="section-y bg-background" aria-labelledby="faq-title">
      <Stagger className="page-w grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Item>
            <Lottie
              src="/lottie/faq.json"
              className="size-24 md:size-32"
              fallback={
                <CircleHelp
                  className="size-12 text-accent md:size-16"
                  strokeWidth={1.5}
                />
              }
            />
          </Item>
          <Item>
            <h2
              id="faq-title"
              className="mt-6 text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
            >
              {faq.title}
            </h2>
          </Item>
          <Item>
            <p className="mt-5 max-w-prose text-lg text-muted">{faq.lead}</p>
            <p className="mt-6 text-base text-muted">
              {faq.more}{" "}
              <a
                href="#kontakt"
                className="font-semibold text-accent underline underline-offset-4 hover:text-accent-hover"
              >
                {faq.moreLink}
              </a>
            </p>
          </Item>
        </div>

        <FaqList items={faq.items} />
      </Stagger>
    </section>
  );
}
