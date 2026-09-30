import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/blog/post-card";
import { CopyLink, ReadingProgress, Toc } from "@/components/blog/post-client";
import { PostBody } from "@/components/blog/post-body";
import {
  AuthorCard,
  BackToList,
  PostCta,
  RelatedPosts,
} from "@/components/blog/post-parts";
import { Item, Stagger } from "@/components/reveal";
import { hasLocale, locales } from "@/i18n/config";
import { getPost, getRelated, getSlugs, toCard } from "@/lib/blog/posts";
import { formatDate, toc } from "@/lib/blog/utils";
import { BUSINESS, LOGO_PATH, OG_LOCALE, SITE_URL } from "@/lib/site";
import { getDictionary } from "../../dictionaries";

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const post = await getPost(lang, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.seoDescription,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/blog/${slug}`])),
        "x-default": `/pl/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      type: "article",
      siteName: BUSINESS.name,
      locale: OG_LOCALE[lang],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.cover
        ? [{ url: post.cover.src, alt: post.cover.alt }]
        : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ blog }, post] = await Promise.all([
    getDictionary(lang),
    getPost(lang, slug),
  ]);
  if (!post) notFound();
  const related = (await getRelated(lang, post)).map(toCard);

  // JSON-LD serializowany przez JSON.stringify, `<` zastąpione — nie da się zamknąć tagu <script>.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: lang,
    mainEntityOfPage: `${SITE_URL}/${lang}/blog/${slug}`,
    image: post.cover ? `${SITE_URL}${post.cover.src}` : undefined,
    author: { "@type": "Person", name: "Kinga Krajs" },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO_PATH}` },
    },
  }).replace(/</g, "\\u003c");

  return (
    <>
      <ReadingProgress targetId="post-article" />
      <main id="main" className="flex-1 bg-background pt-32 md:pt-44">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <div className="page-w">
          <Stagger>
            <Item>
              <nav aria-label={blog.breadcrumb}>
                <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
                  <li>
                    <Link
                      href={`/${lang}/blog`}
                      className="inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      {blog.title}
                    </Link>
                  </li>
                  <li aria-hidden="true">›</li>
                  <li aria-current="page" className="line-clamp-1">
                    {post.title}
                  </li>
                </ol>
              </nav>
            </Item>
            <Item>
              <p className="mt-4">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
                  {blog.categories[post.category]}
                </span>
              </p>
              <h1 className="mt-5 max-w-[24ch] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] font-extrabold tracking-[-0.025em] text-foreground">
                {post.title}
              </h1>
            </Item>
            <Item>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
                <span>
                  {blog.by}:{" "}
                  <span className="font-semibold text-foreground">
                    {blog.authorName}
                  </span>
                </span>
                <time dateTime={post.publishedAt} className="tabular-nums">
                  {blog.published}: {formatDate(post.publishedAt, lang)}
                </time>
                <span className="tabular-nums">
                  {blog.readMin.replace("{n}", String(post.minutes))}
                </span>
                <CopyLink label={blog.copyLink} done={blog.copied} />
              </div>
            </Item>
            <Item>
              <Cover
                post={toCard(post)}
                sizes="(min-width:1024px) 80vw, 90vw"
                className="mt-10 aspect-[16/8] rounded-lg shadow-md"
              />
            </Item>
          </Stagger>

          <div className="mt-12 grid gap-10 pb-16 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16 lg:pb-24">
            <aside className="lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:self-start">
              <Toc items={toc(post.content)} title={blog.toc} />
            </aside>
            <div className="lg:col-start-1 lg:row-start-1">
              <div id="post-article">
                <PostBody blocks={post.content} />
              </div>
              <div className="mt-14 flex max-w-3xl flex-col gap-8">
                <AuthorCard blog={blog} />
                <PostCta blog={blog} />
                <BackToList lang={lang} blog={blog} />
              </div>
            </div>
          </div>
        </div>
        <RelatedPosts posts={related} lang={lang} blog={blog} />
      </main>
    </>
  );
}
