import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "./dictionaries";
import { Hero } from "../../components/hero";
import { PricingSection } from "../../components/pricing-section";
import { OfficeSection } from "../../components/office-section";
import { RouteSection } from "../../components/route-section";
import { FaqSection } from "../../components/faq-section";
import { ContactSection } from "../../components/contact-section";
import { MedfileSection } from "../../components/medfile-section";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Hero title={dict.home.title} lead={dict.home.lead} />
      <MedfileSection medfile={dict.medfile} />
      <PricingSection pricing={dict.pricing} medfile={dict.medfile} />
      <OfficeSection office={dict.office} />
      <RouteSection route={dict.route} />
      <FaqSection faq={dict.faq} />
      <ContactSection contact={dict.contact} lang={lang} />
    </main>
  );
}
