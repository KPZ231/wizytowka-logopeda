import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { Item, Stagger } from "@/components/reveal";
import { hasLocale, locales } from "@/i18n/config";
import { getPosts, toCard } from "@/lib/blog/posts";
import { BUSINESS, OG_LOCALE } from "@/lib/site";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { blog } = await getDictionary(lang);
  return {
    title: blog.meta.title,
    description: blog.meta.description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/blog`])),
        "x-default": "/pl/blog",
      },
    },
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      type: "website",
      siteName: BUSINESS.name,
      locale: OG_LOCALE[lang],
    },
  };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { blog } = await getDictionary(lang);
  const posts = (await getPosts(lang)).map(toCard);

  return (
    <main
      id="main"
      className="flex-1 bg-background pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <Stagger className="page-w">
        <Item>
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-foreground">
            {blog.title}
          </h1>
        </Item>
        <Item>
          <p className="mt-5 max-w-prose text-lg text-muted">{blog.lead}</p>
        </Item>
        <div className="mt-10 md:mt-14">
          <BlogIndex posts={posts} lang={lang} blog={blog} />
        </div>
      </Stagger>
    </main>
  );
}
