"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

// Runtime .wasm serwujemy z własnej domeny (public/lottie), nie z domyślnego CDN — mniej zależności zewnętrznych i prostszy CSP.
setWasmUrl("/lottie/dotlottie-player.wasm");

/** Ładowany leniwie przez `Lottie` — razem z ~1,2 MB wasm trafia do przeglądarki dopiero, gdy animacja wejdzie w widok. */
export default function LottiePlayer({
  src,
  loop,
  onReady,
}: {
  src: string;
  loop: boolean;
  onReady: () => void;
}) {
  return (
    <DotLottieReact
      src={src}
      autoplay
      loop={loop}
      renderConfig={{ autoResize: true }}
      className="size-full"
      dotLottieRefCallback={(dl) => dl?.addEventListener("load", onReady)}
    />
  );
}
