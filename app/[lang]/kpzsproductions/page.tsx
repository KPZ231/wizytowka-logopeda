import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HedgehogWalk } from "@/components/hedgehog-walk";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "../dictionaries";

// Easter egg: poza indeksem i sitemapą.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EasterEgg({ params }: PageProps<"/[lang]/kpzsproductions">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { easter } = await getDictionary(lang);

  return (
    <main
      id="main"
      className="wash-violet flex min-h-[85svh] flex-1 flex-col justify-center overflow-x-clip bg-surface-tint pt-32 pb-16"
    >
      <div className="page-w">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] font-bold tracking-[-0.02em] text-foreground">
          {easter.title}
        </h1>
        <p className="mt-4 max-w-[52ch] text-lg text-muted">{easter.body}</p>
        <a
          href={`/${lang}`}
          className="pressable mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-on-strong hover:bg-accent-hover"
        >
          {easter.back}
        </a>
      </div>
      <div className="page-w">
        <HedgehogWalk alt={easter.alt} />
      </div>
    </main>
  );
}
