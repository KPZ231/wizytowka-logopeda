import type { Legal, LegalDoc } from "@/app/[lang]/legal";
import type { Locale } from "@/i18n/config";

const link =
  "font-semibold text-accent underline underline-offset-4 hover:text-accent-hover";

/** Strona dokumentu prawnego: długi tekst w kolumnie ≤65 znaków, bez animacji scrolla. */
export function LegalPage({
  doc,
  legal,
  lang,
}: {
  doc: LegalDoc;
  legal: Pick<Legal, "updatedLabel" | "binding">;
  lang: Locale;
}) {
  const updated = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
    new Date(doc.updated),
  );

  return (
    <main id="main" className="flex-1 bg-background pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="page-w">
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-foreground">
          {doc.title}
        </h1>
        <p className="mt-5 text-sm text-muted">
          {legal.updatedLabel}: <time dateTime={doc.updated}>{updated}</time>
        </p>

        <div className="mt-10 max-w-[65ch] space-y-10 md:mt-14">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] leading-[1.2] font-bold text-foreground">
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-[1.65] text-muted">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-[1.65] text-muted marker:text-accent">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
              {s.links && (
                <ul className="mt-3 space-y-1">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${link} inline-flex min-h-11 items-center`}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 max-w-[65ch] border-t border-border pt-6 text-sm text-muted">
          {legal.binding}
        </p>
      </div>
    </main>
  );
}
