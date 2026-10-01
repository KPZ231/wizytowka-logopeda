"use client";

import { MapPin } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { setConsent, useConsent } from "@/lib/consent";

/**
 * Mapa Google (iframe `output=embed`, bez API i klucza) ładowana dopiero po zgodzie na cookies —
 * Google ustawia własne cookies. Bez zgody ten sam kontener pokazuje placeholder: stała proporcja,
 * więc brak CLS. `loading="lazy"` odracza pobranie do zbliżenia się do widoku.
 */
export function MapEmbed({
  lang,
  query,
  externalHref,
  text,
}: {
  lang: string;
  query: string;
  externalHref: string;
  text: Dictionary["contact"]["mapEmbed"];
}) {
  const consent = useConsent();
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=${lang}&z=15&output=embed`;

  return (
    <div className="relative mt-10 aspect-[4/3] w-full max-w-lg overflow-hidden rounded-lg border border-violet-700 bg-violet-800/50">
      {consent === "accepted" ? (
        <>
          {/* spinner leży pod iframe — widać go, dopóki mapa się nie wyrenderuje */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 size-8 -translate-1/2 animate-spin rounded-full border-2 border-violet-300/40 border-t-violet-100"
          />
          <iframe
            src={src}
            title={text.iframeTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="relative size-full border-0"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin className="size-8 text-violet-200" strokeWidth={1.75} aria-hidden="true" />
          <p className="max-w-[34ch] text-sm text-violet-100">{text.consentText}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => setConsent("accepted")}
              className="pressable inline-flex min-h-12 items-center rounded-full bg-background px-6 text-sm font-semibold text-accent hover:bg-accent-soft focus-visible:outline-white"
            >
              {text.show}
            </button>
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-100 underline underline-offset-4 hover:text-on-strong focus-visible:outline-white"
            >
              {text.openExternal}
              <span className="sr-only">{text.newTab}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
