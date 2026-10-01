import type { CollectionConfig } from "payload";

/** Okładki wpisów i obrazy w treści bloga. Pliki trzymane w Vercel Blob (patrz payload.config.ts). */
export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*"],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Tekst alternatywny obrazu (dostępność, SEO)." },
    },
  ],
};
