import { MapPinned, Play } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { RouteSteps } from "./route-steps";
import { Item, Stagger } from "./reveal";

// Dane klienta (NAP). Link bez API: Google Maps Directions URL.
const DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Biernota 11, 44-230 Czerwionka, Polska")}`;

/**
 * Poradnik dojazdu: film przyklejony po lewej, po prawej „trasa” — pionowa linia z krokami i zdjęciami.
 * ponytail: film to placeholder; gdy będzie plik, podmienić blok na <video controls poster=… preload="none">.
 */
export function RouteSection({ route }: { route: Dictionary["route"] }) {
  return (
    <section
      className="section-y bg-surface-tint"
      aria-labelledby="route-title"
    >
      <Stagger className="page-w">
        <Item>
          <h2
            id="route-title"
            className="max-w-[20ch] text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
          >
            {route.title}
          </h2>
        </Item>
        <Item>
          <p className="mt-5 max-w-prose text-lg text-muted">{route.lead}</p>
          <a
            href={DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 font-semibold text-on-strong hover:bg-accent-hover"
          >
            <MapPinned
              className="size-5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {route.navigate}
            <span className="sr-only">{route.newTab}</span>
          </a>
        </Item>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Item className="lg:sticky lg:top-28 lg:self-start">
            <div
              role="img"
              aria-label={`${route.videoLabel}. ${route.videoSoon}`}
              className="relative flex aspect-video flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-surface-strong text-on-strong shadow-lg"
            >
              <span
                aria-hidden="true"
                className="absolute -top-1/3 -right-1/4 size-3/4 rounded-full bg-violet-600/40 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="relative flex size-20 items-center justify-center rounded-full bg-background text-accent shadow-md"
              >
                <Play
                  className="ml-1 size-8"
                  strokeWidth={1.75}
                  fill="currentColor"
                />
              </span>
              <p className="relative px-6 text-center font-semibold">
                {route.videoLabel}
              </p>
              <p className="relative px-6 text-center text-sm text-violet-200">
                {route.videoSoon}
              </p>
            </div>
          </Item>

          <RouteSteps
            steps={route.steps}
            label={route.stepsLabel}
            photoSoon={route.photoSoon}
          />
        </div>
      </Stagger>
    </section>
  );
}
