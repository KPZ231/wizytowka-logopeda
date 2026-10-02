# Plan działań — logopeda-topaz.vercel.app

## Krytyczne (od razu)
- [ ] Uzupełnić/ukryć `[UZUPEŁNIJ]` x3, „Film pojawi się wkrótce”, „Miejsce na zdjęcie” (treść od klienta).
- [ ] Utworzyć `/[lang]/polityka-prywatnosci` (PL/EN/UK) — dziś 404 z linku w stopce.
- [ ] Docelowa domena; zaktualizować URL bazowy (canonical, hreflang, OG, JSON-LD, sitemap, robots).
- [ ] Blog: usunąć z sitemap lub `noindex`, dopóki brak wpisów.

## Wysokie (tydzień 1)
- [ ] Meta description zgodna z treścią (Asperger, połykanie) lub dodać te sekcje.
- [ ] H1/hero: „logopeda Czerwionka-Leszczyny”.
- [ ] Wyjaśnić gabinet vs wizyty domowe; `areaServed` jeśli dojazd.
- [ ] Potwierdzić z klientem: wykształcenie, wiek od 2 lat, zakres terapii, zgoda na opinie.
- [ ] Opinie: ukryć zduplikowany zestaw karuzeli (`aria-hidden`, `inert`).

## Średnie (tygodnie 2–3)
- [ ] Schema: `@id`, `geo`, `areaServed`, `email`, `knowsLanguage`, `sameAs` + Google; rozróżnić Offer 30/45 min.
- [ ] Podstrony usług + wpisy w sitemap z `lastmod`.
- [ ] `poweredByHeader: false`; usunąć `Accept-Ch/Critical-Ch`; CSP na nonce.
- [ ] Jeden `fetchPriority=high` w hero; zmierzyć wagę WebP.

## Treść i autorytet (miesiąc 2)
- [ ] 4–6 wpisów bloga (pierwsza wizyta, autyzm, połykanie) + JSON-LD `BlogPosting`.
- [ ] `llms.txt`; katalogi (Medfile, Google Business Profile) z identycznym NAP.

## Monitoring
- [ ] GSC + sitemap, CrUX po 28 dniach ruchu, ponowny audyt po wdrożeniu domeny.
