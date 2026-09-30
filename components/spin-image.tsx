"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * `next/image` (domyślnie lazy) ze spinnerem do czasu załadowania. Rodzic musi być `relative`
 * (używane z `fill`). Spinner jest dekoracyjny; obraz płynnie wchodzi przez opacity.
 */
export function SpinImage({ className = "", alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="size-6 animate-spin rounded-full border-2 border-violet-300 border-t-violet-700" />
        </span>
      )}
      <Image
        alt={alt}
        {...props}
        // obraz z cache może załadować się przed hydracją — wtedy onLoad nie wystąpi
        ref={(img) => {
          if (img?.complete) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
