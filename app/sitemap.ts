import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getPosts } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site";

// Strona główna nie ma własnej daty zmiany; sitemap powstaje przy buildzie, a treść zmienia się tylko
// z wdrożeniem, więc data builda jest prawdziwym „lastmod” (nie doklejamy new Date() przy każdym żądaniu).
const buildDate = new Date();

const languages = (path: string) =>
  Object.fromEntries([
    ...locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ["x-default", `${SITE_URL}/pl${path}`],
  ]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts("pl");
  return [
    ...locales.flatMap((l) => [
      { url: `${SITE_URL}/${l}`, lastModified: buildDate, alternates: { languages: languages("") } },
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
