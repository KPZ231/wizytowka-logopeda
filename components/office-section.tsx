import type { Dictionary } from "@/app/[lang]/dictionaries";
import { OfficeBoard } from "./office-board";
import { Item, Stagger } from "./reveal";

export function OfficeSection({ office }: { office: Dictionary["office"] }) {
  return (
    <section
      id="gabinet"
      className="section-y bg-surface"
      aria-labelledby="office-title"
    >
      <Stagger className="page-w">
        <Item>
          <h2
            id="office-title"
            className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-foreground"
          >
            {office.title}
          </h2>
        </Item>
        <div className="mt-8 md:mt-12">
          <OfficeBoard office={office} />
        </div>
      </Stagger>
    </section>
  );
}
