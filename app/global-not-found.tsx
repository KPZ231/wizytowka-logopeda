import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import pl from "@/dictionaries/pl.json";
import { ErrorScreen } from "@/components/error-screen";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: `404 | ${pl.errors.notFound.title}`,
  robots: { index: false, follow: false },
};

// Adres bez prefiksu języka / spoza layoutu [lang]: PL jako język domyślny + przełącznik na EN i UK.
export default function GlobalNotFound() {
  return (
    <html lang="pl" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ErrorScreen code="404" lang="pl" text={pl.errors} showLanguages />
      </body>
    </html>
  );
}
