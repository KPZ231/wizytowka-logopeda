import { FileText } from "lucide-react";
import Image from "next/image";
import { Lottie } from "./lottie";
import { Item, Stagger } from "./reveal";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export const MEDFILE_URL =
  "https://www.medfile.pl/kinga-krajs/logopeda/polska/";

/**
 * Blok kierujący do profilu gabinetu na Medfile.
 */
export function MedfileSection({
  medfile,
}: {
  medfile: Dictionary["medfile"];
}) {
  return (
    <section
      className="section-y bg-surface-tint wash-violet"
      aria-labelledby="medfile-title"
    >
      <div className="page-w">
        <Stagger
          rise
          className="flex flex-col gap-8 rounded-lg border border-border bg-background p-8 shadow-md md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div className="max-w-prose">
            {/* logo ma duże marginesy w pliku 400×400 — object-cover w proporcji 7:3 przycina puste pole */}
            <Item className="relative mb-6 aspect-[7/3] w-40 overflow-hidden">
              <Image
                src="/medfile_logo.png"
                alt="Medfile"
                fill
                sizes="160px"
                className="object-cover"
              />
            </Item>
            <Item>
              <h2
                id="medfile-title"
                className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
              >
                {medfile.title}
              </h2>
            </Item>
            <Item>
              <p className="mt-5 text-lg text-muted">{medfile.lead}</p>
            </Item>
            <Item>
              <p className="mt-3 text-base font-semibold text-foreground tabular-nums">
                {medfile.hours}
              </p>
            </Item>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-center">
            <div className="hidden md:block">
              <Lottie
                src="/lottie/doc.json"
                className="size-28"
                fallback={
                  <FileText className="size-14 text-accent" strokeWidth={1.5} />
                }
              />
            </div>
            <Item className="self-start md:self-auto">
              <a
                href={MEDFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable group inline-flex min-h-12 shrink-0 whitespace-nowrap items-center justify-center gap-2 self-start rounded-full bg-accent px-7 font-semibold text-on-strong hover:bg-accent-hover md:self-auto"
              >
                {medfile.cta}
                <span className="sr-only">{medfile.newTab}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </Item>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
