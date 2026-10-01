import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";
import { hasLocale, locales } from "@/i18n/config";
import { BUSINESS, CREATOR, IS_INDEXABLE, OG_LOCALE, SITE_URL } from "@/lib/site";
import { getDictionary } from "./dictionaries";
import { MotionProvider } from "./motion-provider";
import { SmoothScroll } from "../../components/smooth-scroll";
import { SiteFooter } from "../../components/site-footer";
import { SiteNav } from "../../components/site-nav";
import "../globals.css";

// latin-ext: polskie diakrytyki; cyrillic: wersja ukraińska
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    authors: [{ name: CREATOR.name, url: CREATOR.url }],
    creator: CREATOR.name,
    publisher: BUSINESS.name,
    // lokal i preview nie są indeksowane
    robots: IS_INDEXABLE ? undefined : { index: false, follow: false },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/pl",
      },
    },
    openGraph: {
      type: "website",
      siteName: BUSINESS.name,
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { nav } = dict;

  return (
    <html lang={lang} className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <SmoothScroll />
          <SiteNav lang={lang} nav={nav} />
          {children}
          <SiteFooter lang={lang} dict={dict} />
        </MotionProvider>
      </body>
    </html>
  );
}
