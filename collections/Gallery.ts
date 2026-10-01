import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";

const GALLERY_LIMIT = 5;

/** Zdjęcia tablicy w sekcji „Gabinet” na stronie głównej (components/office-board.tsx). Max 5 — tyle miejsc ma układ. */
export const Gallery: CollectionConfig = {
  slug: "gallery",
  upload: {
    mimeTypes: ["image/*"],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "order"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "caption",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Podpis widoczny po powiększeniu zdjęcia." },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Kolejność na tablicy (rosnąco)." },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ req, operation, data }) => {
        // ponytail: liczba miejsc na tablicy jest stała w layoucie (OfficeBoard.spots) — limit twardy.
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "gallery" });
          if (totalDocs >= GALLERY_LIMIT) {
            throw new Error(`Galeria mieści maksymalnie ${GALLERY_LIMIT} zdjęć. Usuń jedno, aby dodać nowe.`);
          }
        }
        return data;
      },
    ],
    afterChange: [
      () => {
        for (const locale of locales) revalidatePath(`/${locale}`);
      },
    ],
    afterDelete: [
      () => {
        for (const locale of locales) revalidatePath(`/${locale}`);
      },
    ],
  },
};
