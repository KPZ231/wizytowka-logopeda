import { MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import { ContactForm } from "./contact-form";
import { HoursCard } from "./hours-card";
import { MapEmbed } from "./map-embed";
import { Lottie } from "./lottie";
import { Item, Stagger } from "./reveal";

// Dane klienta (NAP) — identyczne wszędzie; źródło: CLAUDE.md.
const ADDRESS = "Biernota 11, 44-230 Czerwionka";
const PHONE_DISPLAY = "+48 518 542 193";
const PHONE_HREF = "tel:+48518542193";
const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS}, Polska`)}`;

// Na ciemnym tle globalny fokus (fiolet) ma za mały kontrast — biały obrys.
const link =
  "font-semibold underline underline-offset-4 hover:text-violet-200 focus-visible:outline-white";

/** Kontakt: jedyna ciemna sekcja strony — dane po lewej, formularz na białej wyspie po prawej. */
/** Nazwy dni (pn–nd) w języku strony; 1 stycznia 2024 to poniedziałek. */
export const dayNames = (lang: Locale) =>
  Array.from({ length: 7 }, (_, i) => {
    const name = new Intl.DateTimeFormat(lang, {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2024, 0, 1 + i)));
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

export function ContactSection({
  contact,
  lang,
}: {
  contact: Dictionary["contact"];
  lang: Locale;
}) {
  return (
    <section
      id="kontakt"
      className="section-y bg-surface-strong text-on-strong"
      aria-labelledby="contact-title"
    >
      <Stagger className="page-w grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <Item>
            <h2
              id="contact-title"
              className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em]"
            >
              {contact.title}
            </h2>
          </Item>
          <Item>
            <p className="mt-5 max-w-prose text-lg text-violet-200">
              {contact.lead}
            </p>
          </Item>
          <Item>
            <div className="mt-10 grid gap-8">
              <div className="flex items-start gap-4">
                <Lottie
                  src="/lottie/phone.json"
                  className="size-14"
                  fallback={
                    <Phone
                      className="size-8 text-violet-200"
                      strokeWidth={1.5}
                    />
                  }
                />
                <dl>
                  <dt className="text-sm font-semibold text-violet-200">
                    {contact.phoneLabel}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums">
                    <a href={PHONE_HREF} className={link}>
                      {PHONE_DISPLAY}
                    </a>
                  </dd>
                </dl>
              </div>
              <div className="flex items-start gap-4">
                <Lottie
                  src="/lottie/pin.json"
                  className="size-14"
                  fallback={
                    <MapPin
                      className="size-8 text-violet-200"
                      strokeWidth={1.5}
                    />
                  }
                />
                <dl>
                  <dt className="text-sm font-semibold text-violet-200">
                    {contact.addressLabel}
                  </dt>
                  <dd className="mt-1 text-lg">
                    <address className="not-italic">{ADDRESS}</address>
                    <a
                      href={MAP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${link} mt-1 inline-block text-base`}
                    >
                      {contact.map}
                    </a>
                  </dd>
                </dl>
              </div>
            </div>
          </Item>
          <Item>
            <MapEmbed
              lang={lang}
              query={`${ADDRESS}, Polska`}
              text={contact.mapEmbed}
            />
          </Item>
        </div>

        <Item>
          <div className="rounded-lg bg-background p-6 text-foreground shadow-lg md:p-10">
            <HoursCard hours={contact.hours} dayNames={dayNames(lang)} />
            <hr className="my-8 border-border" />
            <ContactForm form={contact.form} />
          </div>
        </Item>
      </Stagger>
    </section>
  );
}
