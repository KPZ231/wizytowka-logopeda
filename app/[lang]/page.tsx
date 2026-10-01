import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { hasLocale } from "@/i18n/config";
import { getReviews, getSummary } from "@/lib/reviews/reviews";
import { BUSINESS, LOGO_PATH, SITE_URL } from "@/lib/site";
import { getDictionary } from "./dictionaries";
import { Hero } from "../../components/hero";
import { ServicesSection } from "../../components/services-section";
import { ReviewsSection } from "../../components/reviews/reviews-section";
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
  const [reviews, summary] = await Promise.all([getReviews(), getSummary()]);

  // JSON-LD tylko z danych klienta; `<` escapowane, by nie dało się zamknąć tagu <script>.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: BUSINESS.name,
    url: `${SITE_URL}/${lang}`,
    telephone: BUSINESS.telephone,
    logo: `${SITE_URL}${LOGO_PATH}`,
    image: `${SITE_URL}${LOGO_PATH}`,
    medicalSpecialty: "SpeechPathology",
    inLanguage: lang,
    priceRange: "80–150 PLN",
    currenciesAccepted: "PLN",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressCountry: BUSINESS.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Thursday"],
      opens: "07:30",
      closes: "19:00",
    },
    makesOffer: dict.pricing.items.map((item) => ({
      "@type": "Offer",
      priceCurrency: "PLN",
      price: parseInt(item.price, 10),
      itemOffered: { "@type": "Service", name: item.name },
    })),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${BUSINESS.street}, ${BUSINESS.postalCode} ${BUSINESS.city}, Polska`,
    )}`,
    sameAs: [BUSINESS.medfile],
  }).replace(/</g, "\\u003c");

  return (
    <ViewTransition default="page">
<main id="main" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Hero title={dict.home.title} role={dict.home.role} lead={dict.home.lead} />
      <MedfileSection medfile={dict.medfile} />
      <ServicesSection services={dict.services} />
      <PricingSection pricing={dict.pricing} medfile={dict.medfile} />
      <ReviewsSection
        reviews={reviews}
        summary={summary}
        dict={dict.reviews}
        lang={lang}
      />
      <OfficeSection office={dict.office} lang={lang} />
      <RouteSection route={dict.route} />
      <FaqSection faq={dict.faq} />
      <ContactSection contact={dict.contact} lang={lang} />
    </main>
</ViewTransition>
  );
}
