import type { Dictionary } from "@/app/[lang]/dictionaries";

/**
 * Mapa Google bez API i klucza (iframe `output=embed`), wczytywana od razu; `loading="lazy"`
 * odracza pobranie do zbliżenia się do widoku. Stała proporcja kontenera — brak CLS.
 */
export function MapEmbed({
  lang,
  query,
  text,
}: {
  lang: string;
  query: string;
  text: Dictionary["contact"]["mapEmbed"];
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=${lang}&z=15&output=embed`;

  return (
    <div className="mt-10 aspect-[4/3] w-full max-w-lg overflow-hidden rounded-lg border border-violet-700 bg-violet-800/50">
      <iframe
        src={src}
        title={text.iframeTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="size-full border-0"
      />
    </div>
  );
}
