import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/i18n/config";
import { BUSINESS } from "@/lib/site";
import { dayNames } from "./contact-section";
import { BackToTop, FooterLanguages, Wordmark } from "./footer-client";
import { Item, Stagger } from "./reveal";

// Dane klienta (NAP) — identyczne jak w sekcji kontaktu; źródło: CLAUDE.md.
const NAME = "Gabinet Logopedyczny Kinga Krajs";
const ADDRESS = ["Biernota 11", "44-230 Czerwionka"];
const PHONE_DISPLAY = "+48 518 542 193";
const PHONE_HREF = "tel:+48518542193";
const MEDFILE_URL = BUSINESS.medfile;
const OPEN_DAYS = [1, 3] as const;
const CREDIT_URL = "https://www.kpzsproductions.pl";

// Kotwice na stronie głównej (z prefiksem języka, działają też z podstron); blog to przyszła osobna podstrona (teraz 404).
const links = [
  ["services", "#uslugi"],
  ["about", "#gabinet"],
  ["pricing", "#cennik"],
  ["blog", "/blog"],
  ["contact", "#kontakt"],
] as const;

// Na ciemnym tle globalny fokus (fiolet) ma za mały kontrast — biały obrys.
const link =
  "inline-flex min-h-11 items-center text-violet-200 underline-offset-4 transition-colors duration-200 hover:text-on-strong hover:underline focus-visible:outline-white";
const heading = "text-sm font-semibold text-violet-200";

/** Stopka: ciąg dalszy ciemnej sekcji kontaktu — kolumny z NAP i nawigacją, wielki napis, pasek prawny. */
export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { nav, footer, contact } = dict;
  const days = dayNames(lang);

  return (
    <footer className="overflow-hidden bg-surface-strong text-on-strong">
      <div className="page-w pt-14 md:pt-20">
        <Stagger className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <Item>
            <Image
              src="/logo_round.png"
              alt=""
              width={80}
              height={80}
              className="mb-4 size-20"
            />
            <p className="text-xl font-bold">{NAME}</p>
            <p className="mt-3 max-w-[32ch] text-violet-200">
              {footer.tagline}
            </p>
          </Item>

          <Item>
            <nav aria-label={nav.label}>
              <p className={heading}>{footer.navTitle}</p>
              <ul className="mt-3">
                {links.map(([key, path]) => (
                  <li key={key}>
                    <Link href={`/${lang}${path}`} className={link}>
                      {nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Item>

          <Item>
            <p className={heading}>{footer.contactTitle}</p>
            <address className="mt-3 text-violet-200 not-italic">
              {ADDRESS.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={PHONE_HREF}
              className={`${link} !block mt-3 text-lg font-semibold tabular-nums text-on-strong`}
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href={MEDFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link} !block mt-2`}
            >
              {footer.medfile}
              <span className="sr-only">{footer.newTab}</span>
            </a>
          </Item>

          <Item>
            <p className={heading}>{contact.hours.title}</p>
            <ul className="mt-3 text-violet-200 tabular-nums">
              {OPEN_DAYS.map((d) => (
                <li
                  key={d}
                  className="flex min-h-8 items-baseline justify-between gap-4 sm:max-w-56"
                >
                  <span>{days[d]}</span>
                  <span className="font-semibold text-on-strong">
                    7:30–19:00
                  </span>
                </li>
              ))}
            </ul>
          </Item>
        </Stagger>

        <div className="mt-16 md:mt-20">
          <Wordmark text="Kinga Krajs" />
        </div>

        <div className="flex flex-col gap-4 border-t border-violet-800 py-6 text-sm text-violet-200 md:flex-row md:items-center md:justify-between">
          <div>
            <p>
              © {new Date().getFullYear()} {NAME}. {footer.rights}
            </p>
            <p>
              {footer.credit}{" "}
              <a
                href={CREDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link} font-semibold text-on-strong`}
              >
                KPZsProductions
                <span className="sr-only">{footer.newTab}</span>
              </a>
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <Link href={`/${lang}/polityka-prywatnosci`} className={link}>
                {footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/cookies`} className={link}>
                {footer.cookies}
              </Link>
            </li>
          </ul>
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <FooterLanguages lang={lang} label={footer.languages} />
            <BackToTop label={footer.backToTop} />
          </div>
        </div>
      </div>
    </footer>
  );
}
