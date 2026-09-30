import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getPosts } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site";

const languages = (path: string) =>
  Object.fromEntries([
    ...locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ["x-default", `${SITE_URL}/pl${path}`],
  ]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts("pl");
  return [
    ...locales.flatMap((l) => [
      { url: `${SITE_URL}/${l}`, alternates: { languages: languages("") } },
      {
        url: `${SITE_URL}/${l}/blog`,
        // ostatnia zmiana bloga = najnowszy wpis
        lastModified: posts[0]?.updatedAt ?? posts[0]?.publishedAt,
        alternates: { languages: languages("/blog") },
      },
      ...posts.map((p) => ({
        url: `${SITE_URL}/${l}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? p.publishedAt,
        alternates: { languages: languages(`/blog/${p.slug}`) },
      })),
    ]),
  ];
}
