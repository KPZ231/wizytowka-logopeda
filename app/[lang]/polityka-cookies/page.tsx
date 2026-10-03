import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { hasLocale, locales } from "@/i18n/config";
import { BUSINESS, OG_LOCALE } from "@/lib/site";
import { getLegal } from "../legal";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/polityka-cookies">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = (await getLegal(lang)).cookies;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/polityka-cookies`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/polityka-cookies`])),
        "x-default": "/pl/polityka-cookies",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      siteName: BUSINESS.name,
      locale: OG_LOCALE[lang],
    },
  };
}

export default async function CookiePolicyPage({
  params,
}: PageProps<"/[lang]/polityka-cookies">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const legal = await getLegal(lang);
  return <LegalPage doc={legal.cookies} legal={legal} lang={lang} />;
}
