import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { locales } from "@/i18n/config";
import { CATEGORIES } from "@/lib/blog/types";

const revalidatePost = (slug?: string) => {
  for (const locale of locales) {
    revalidatePath(`/${locale}/blog`);
    if (slug) revalidatePath(`/${locale}/blog/${slug}`);
  }
};

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "publishedAt"],
  },
  versions: {
    drafts: true,
  },
  access: {
    // podgląd draftów tylko w panelu (zalogowany); publiczne strony widzą wyłącznie opublikowane.
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Wspólny dla pl/en/uk — przełącznik języka podmienia tylko prefiks." },
      validate: (value: string | null | undefined) => {
        if (!value) return "Slug jest wymagany.";
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "Slug może zawierać tylko małe litery, cyfry i myślniki.";
        }
        return true;
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [...CATEGORIES],
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      localized: true,
      admin: { description: "Krótki opis na liście wpisów." },
    },
    {
      name: "seoDescription",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Meta description (≤ ~155 znaków)." },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                slug: "callout",
                labels: { singular: "Wyróżnienie", plural: "Wyróżnienia" },
                fields: [
                  {
                    name: "text",
                    type: "textarea",
                    required: true,
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidatePost(doc.slug as string);
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidatePost(previousDoc.slug as string);
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePost(doc.slug as string);
      },
    ],
  },
};
