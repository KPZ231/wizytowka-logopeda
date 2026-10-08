"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Film dojazdu: `preload="none"` + poster (nic z filmu nie leci, dopóki nie klikniesz play),
 * spinner przy buforowaniu. Plik jest bez ścieżki audio, więc brak napisów jest OK.
 */
export function RouteVideo({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-strong shadow-lg">
      <Image
        src="/dojazd/film-poster.webp"
        alt=""
        fill
        sizes="(min-width:1024px) 45vw, 90vw"
        className="object-cover"
      />
      <video
        controls
        playsInline
        preload="none"
        poster="/dojazd/film-poster.webp"
        aria-label={label}
        className="absolute inset-0 size-full object-cover"
        onWaiting={() => setBusy(true)}
        onPlaying={() => setBusy(false)}
        onPause={() => setBusy(false)}
        onCanPlay={() => setBusy(false)}
      >
        <source src="/dojazd/film.mp4" type="video/mp4" />
      </video>
      {busy && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <span className="size-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-700" />
        </span>
      )}
    </div>
  );
}
