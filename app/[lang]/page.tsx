import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "./dictionaries";
import { Hero } from "../../components/hero";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Hero title={dict.home.title} lead={dict.home.lead} />
    </main>
  );
}
