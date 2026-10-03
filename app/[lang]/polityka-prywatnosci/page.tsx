import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { hasLocale, locales } from "@/i18n/config";
import { BUSINESS, OG_LOCALE } from "@/lib/site";
import { getLegal } from "../legal";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/polityka-prywatnosci">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = (await getLegal(lang)).privacy;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/polityka-prywatnosci`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/polityka-prywatnosci`])),
        "x-default": "/pl/polityka-prywatnosci",
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

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/polityka-prywatnosci">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const legal = await getLegal(lang);
  return <LegalPage doc={legal.privacy} legal={legal} lang={lang} />;
}
