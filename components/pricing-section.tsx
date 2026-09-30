import { MEDFILE_URL } from "./medfile-section";
import { Item, ItemLi, Stagger, StaggerList } from "./reveal";
import type { Dictionary } from "@/app/[lang]/dictionaries";

/** Cennik jako poziome rzędy: opis po lewej, czas i cena po prawej (separatory zamiast identycznych kart). */
export function PricingSection({
  pricing,
  medfile,
}: {
  pricing: Dictionary["pricing"];
  medfile: Dictionary["medfile"];
}) {
  return (
    <section
      id="uslugi"
      className="section-y bg-background"
      aria-labelledby="pricing-title"
    >
      <Stagger className="page-w">
        <Item>
          <h2
            id="pricing-title"
            className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
          >
            {pricing.title}
          </h2>
        </Item>
        <StaggerList
          id="cennik"
          className="mt-8 divide-y divide-border border-y border-border md:mt-12"
        >
          {pricing.items.map((item) => (
            <ItemLi key={item.duration}>
              <a
                href={MEDFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-x-8 gap-y-2 py-6 transition-colors duration-200 md:grid-cols-[1fr_auto_auto_auto] md:items-center md:py-8 md:hover:bg-surface-tint"
              >
                <div className="max-w-prose md:pl-4">
                  <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-muted">{item.description}</p>
                </div>
                <p className="font-semibold text-muted tabular-nums md:min-w-24 md:text-right">
                  {item.duration}
                </p>
                <p className="text-3xl font-bold text-accent tabular-nums md:min-w-32 md:pr-4 md:text-right md:text-4xl">
                  {item.price}
                </p>
                <span className="sr-only">{medfile.newTab}</span>
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
                  className="hidden text-accent transition-transform duration-200 ease-out md:mr-4 md:block md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </ItemLi>
          ))}
        </StaggerList>
        <Item className="mt-8">
          <a
            href={MEDFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 font-semibold text-on-strong hover:bg-accent-hover"
          >
            {medfile.cta}
            <span className="sr-only">{medfile.newTab}</span>
          </a>
        </Item>
      </Stagger>
    </section>
  );
}
