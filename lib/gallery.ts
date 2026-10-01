import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/config";

export type GalleryPhoto = { src: string; alt: string; caption: string };

/** Zdjęcia tablicy w sekcji „Gabinet" (components/office-board.tsx) — max 5, patrz collections/Gallery.ts. */
export async function getGallery(lang: Locale): Promise<GalleryPhoto[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "gallery",
    locale: lang,
    fallbackLocale: false,
    sort: "order",
    limit: 5,
  });
  return docs
    .filter((d) => d.url)
    .map((d) => ({ src: d.url as string, alt: d.alt, caption: d.caption }));
}
