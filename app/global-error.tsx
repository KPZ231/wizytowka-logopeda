"use client";

import { Manrope } from "next/font/google";
import pl from "@/dictionaries/pl.json";
import { ErrorScreen } from "@/components/error-screen";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

// Awaria samego layoutu: brak kontekstu i języka, więc zawsze PL (ten sam słownik co reszta strony).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pl" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ErrorScreen
          code="500"
          lang="pl"
          text={pl.errors}
          reset={reset}
          digest={error.digest}
        />
      </body>
    </html>
  );
}
