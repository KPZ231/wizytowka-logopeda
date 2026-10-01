import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import { getGallery } from "@/lib/gallery";
import { OfficeBoard } from "./office-board";
import { Item, Stagger } from "./reveal";

export async function OfficeSection({
  office,
  lang,
}: {
  office: Dictionary["office"];
  lang: Locale;
}) {
  const photos = await getGallery(lang);
  if (photos.length === 0) return null;

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
          <OfficeBoard office={office} photos={photos} />
        </div>
      </Stagger>
    </section>
  );
}
