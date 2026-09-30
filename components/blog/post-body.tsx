import { Info } from "lucide-react";
import type { Block } from "@/lib/blog/types";
import { headingId } from "@/lib/blog/utils";

/** Renderuje bloki treści jako zwykłe elementy React — brak `dangerouslySetInnerHTML`, więc treść nie wstrzyknie HTML. */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-[65ch]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2
                key={i}
                id={headingId(b.text)}
                className="mt-12 mb-4 scroll-mt-28 text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-bold tracking-[-0.01em] text-foreground first:mt-0"
              >
                {b.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={i}
                className="mt-5 text-lg leading-[1.7] text-foreground first:mt-0"
              >
                {b.text}
              </p>
            );
          case "list":
            return (
              <ul
                key={i}
                className="mt-5 list-disc space-y-2 pl-6 text-lg leading-[1.7] text-foreground marker:text-accent"
              >
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="mt-8 border-l-4 border-accent pl-6 text-xl leading-[1.6] font-semibold text-foreground"
              >
                {b.text}
              </blockquote>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="mt-8 flex gap-4 rounded-md border border-border bg-accent-soft p-5"
              >
                <Info
                  className="mt-0.5 size-6 shrink-0 text-accent"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="text-base leading-[1.7] text-foreground">
                  {b.text}
                </p>
              </aside>
            );
        }
      })}
    </div>
  );
}
