import {
  Brain,
  CalendarCheck,
  ClipboardList,
  Droplets,
  Mic,
  MessageCircle,
  Puzzle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Item, Stagger } from "./reveal";

// Kolejność jak w słowniku: mowa, ćwiczenia, połykanie, autyzm, Asperger.
const AREA_ICONS: LucideIcon[] = [MessageCircle, Mic, Droplets, Puzzle, Brain];
const STEP_ICONS: LucideIcon[] = [ClipboardList, CalendarCheck];

// Układ bento: pierwsza karta szeroka (2 kolumny od lg), pozostałe po jednej — nie pięć identycznych kart.
const AREA_SPAN = ["lg:col-span-2", "", "", "", ""];

/**
 * Usługi: zakres pracy (z danych klienta) w siatce bento + krótki proces „konsultacja → terapia”.
 * Opisy celowo bez obietnic efektów i bez metod, których klient nie podał.
 */
export function ServicesSection({
  services,
}: {
  services: Dictionary["services"];
}) {
  return (
    <section
      id="uslugi"
      className="section-y bg-surface"
      aria-labelledby="services-title"
    >
      <Stagger className="page-w">
        <Item>
          <h2
            id="services-title"
            className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
          >
            {services.title}
          </h2>
        </Item>
        <Item>
          <p className="mt-5 max-w-prose text-lg text-muted">{services.lead}</p>
        </Item>

        <Stagger className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.areas.map((area, i) => {
            const Icon = AREA_ICONS[i];
            const wide = i === 0;
            return (
              <Item key={area.title} className={AREA_SPAN[i]}>
                <article
                  className={`group h-full rounded-lg border border-border p-6 transition-shadow duration-200 hover:shadow-md md:p-8 ${
                    wide ? "bg-surface-tint" : "bg-background"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-14 items-center justify-center rounded-md transition-transform duration-300 ease-(--ease-out) group-hover:-translate-y-1 group-hover:scale-105 ${
                      wide
                        ? "bg-accent text-on-strong"
                        : "bg-accent-soft text-accent"
                    }`}
                  >
                    <Icon className="size-7" strokeWidth={1.5} />
                  </span>
                  <h3
                    className={`mt-6 font-bold text-foreground ${wide ? "text-2xl md:text-3xl" : "text-xl"}`}
                  >
                    {area.title}
                  </h3>
                  <p
                    className={`mt-2 max-w-[40ch] ${wide ? "text-lg text-muted" : "text-muted"}`}
                  >
                    {area.text}
                  </p>
                </article>
              </Item>
            );
          })}
        </Stagger>

        <Item>
          <h3 className="mt-16 text-xl font-bold text-foreground md:mt-20 md:text-2xl">
            {services.processTitle}
          </h3>
        </Item>
        <Stagger className="mt-6 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          {services.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div key={step.title} className="contents">
                {i > 0 && (
                  <Item className="hidden items-center justify-center md:flex">
                    <ArrowRight
                      className="size-7 text-accent"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </Item>
                )}
                <Item>
                  <div className="flex h-full gap-4 rounded-lg bg-surface-tint p-6">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-on-strong tabular-nums"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-lg font-bold text-foreground">
                        <Icon
                          className="size-5 text-accent"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {step.title}
                      </p>
                      <p className="mt-1 text-muted">{step.text}</p>
                    </div>
                  </div>
                </Item>
              </div>
            );
          })}
        </Stagger>
      </Stagger>
    </section>
  );
}
