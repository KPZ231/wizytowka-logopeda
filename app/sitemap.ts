import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getPosts } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site";

// Strona główna nie ma własnej daty zmiany; sitemap powstaje przy buildzie, a treść zmienia się tylko
// z wdrożeniem, więc data builda jest prawdziwym „lastmod” (nie doklejamy new Date() przy każdym żądaniu).
const buildDate = new Date();

/** hreflang tylko dla wersji, które istnieją (wpis bez tłumaczenia nie może wskazywać na 404). */
const languages = (path: string, available: readonly Locale[] = locales) =>
  Object.fromEntries([
    ...available.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ...(available.includes("pl") ? [["x-default", `${SITE_URL}/pl${path}`]] : []),
  ]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (l) => [
        l,
        // fallbackLocale: false → nieprzetłumaczony wpis ma pusty tytuł; takiego nie ma w sitemap
        (await getPosts(l)).filter((p) => p.title),
      ]),
    ),
  ) as Record<Locale, Awaited<ReturnType<typeof getPosts>>>;

  // wersje językowe danego wpisu (slug wspólny dla pl/en/uk)
  const translations = (slug: string) =>
    locales.filter((l) => postsByLocale[l].some((p) => p.slug === slug));

  return locales.flatMap((l) => {
    const posts = postsByLocale[l];
    return [
      { url: `${SITE_URL}/${l}`, lastModified: buildDate, alternates: { languages: languages("") } },
      // pusty blog to cienka strona — wchodzi do sitemap dopiero z pierwszym wpisem
      ...(posts.length
        ? [
            {
              url: `${SITE_URL}/${l}/blog`,
              // ostatnia zmiana bloga = najnowszy wpis
              lastModified: posts[0].updatedAt ?? posts[0].publishedAt,
              alternates: {
                languages: languages(
                  "/blog",
                  locales.filter((x) => postsByLocale[x].length),
                ),
              },
            },
          ]
        : []),
      ...["/polityka-prywatnosci", "/polityka-cookies"].map((path) => ({
        url: `${SITE_URL}/${l}${path}`,
        lastModified: buildDate,
        alternates: { languages: languages(path) },
      })),
      ...posts.map((p) => ({
        url: `${SITE_URL}/${l}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? p.publishedAt,
        alternates: { languages: languages(`/blog/${p.slug}`, translations(p.slug)) },
      })),
    ];
  });
}
