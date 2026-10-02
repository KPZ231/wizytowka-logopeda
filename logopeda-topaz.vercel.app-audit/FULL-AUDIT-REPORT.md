# Audyt SEO — https://logopeda-topaz.vercel.app/pl

Data: 2026-10-02 · Typ: Local Service (gabinet logopedyczny) · Zakres: strona główna PL, robots, sitemap, /blog, status EN/UK, Lighthouse mobile, trace wydajności.
Pominięto (brak danych/kluczy): GSC/GA4/CrUX (brak danych w CrUX), backlinki, geo-grid, PSI API (limit dzienny). Subagenci niewykorzystani — audyt inline.

## SEO Health Score: 73 / 100

| Kategoria | Waga | Wynik |
|---|---|---|
| Technical SEO | 22% | 78 |
| Content Quality | 23% | 62 |
| On-Page SEO | 20% | 80 |
| Schema | 10% | 70 |
| Performance | 10% | 92 |
| AI Search Readiness | 10% | 55 |
| Images | 5% | 85 |

Lighthouse mobile: A11y 100 · Best Practices 96 · SEO 100. Lab: LCP 0,40 s, CLS 0,00 (bez throttlingu, strona z cache — wartości orientacyjne).

## Krytyczne

1. **Placeholdery produkcyjne `[UZUPEŁNIJ]`** w sekcji „Jak dojechać” (Dojazd, Gdzie zaparkować, Od parkingu do gabinetu) + „Film pojawi się wkrótce” + „Miejsce na zdjęcie”. Widoczne dla Google i użytkowników. Uzupełnić albo ukryć sekcję.
2. **`/pl/polityka-prywatnosci` → 404**, a link jest w stopce. Strona z formularzem (dane dzieci, RODO) bez polityki = ryzyko prawne + broken link.
3. **Domena `*.vercel.app`**: canonical, hreflang, OG, JSON-LD i sitemap wskazują na vercel.app. Przed startem: własna domena, zmiana URL bazowego, 301 ze starego hosta.
4. **`/pl/blog` (+EN/UK) w sitemap, ale „Liczba wpisów: 0”** — cienka strona w indeksie. Do pierwszych wpisów: usunąć z sitemap albo `noindex`.

## Wysokie

5. **Meta description obiecuje „zespół Aspergera”, „zaburzenia połykania”** — w treści „Asperger” nie występuje, „połykanie” tylko w opisie terapii miofunkcyjnej. Dopasować opis do treści albo dodać sekcje (oba tematy są w danych klienta).
6. **H1 = sama nazwa firmy.** Fraza lokalna jest tylko w `title`. Wpleść „logopeda Czerwionka-Leszczyny” w H1 lub tekst hero.
7. **Sprzeczność lokalizacji**: opinie piszą „zajęcia w domu / dojeżdża do nas”, strona mówi o gabinecie. Wyjaśnić model usługi; `areaServed` w schema, jeśli jest dojazd.
8. **Treści spoza danych klienta w CLAUDE.md**: „Pedagog, Logopeda”, wykształcenie, „od 2. roku życia”, terapia miofunkcjonalna, afazja, 26 opinii Google. Potwierdzić z klientem. **Nie dodawać AggregateRating do JSON-LD** (self-serving reviews).
9. **Opinie zduplikowane w DOM** (karuzela renderuje zestaw 2×). Drugą kopię oznaczyć `aria-hidden` + `inert`.

## Średnie

10. **Schema** (MedicalBusiness+LocalBusiness, bez błędów): brak `@id`, `geo`, `areaServed`, `email`, `knowsLanguage`; `sameAs` tylko Medfile → dodać profil Google. Dwa `Offer` o tej samej nazwie „Terapia logopedyczna” — rozróżnić 30/45 min.
11. **Jedna strona**: `/pl/uslugi` itd. = 404, usługi/cennik/kontakt to kotwice. Osobne URL-e usług (autyzm, połykanie…) dadzą więcej fraz lokalnych.
12. **Sitemap**: 6 URL-i, brak `lastmod`. hreflang poprawny (pl/en/uk/x-default).
13. **GEO/AI**: brak `llms.txt` (404), blog pusty, brak treści cytowalnych. Boty AI niezablokowane (OK).
14. **Nagłówki**: `X-Powered-By: Next.js, Payload` (wyłączyć `poweredByHeader`), `Critical-Ch`/`Vary: Sec-CH-Prefers-Color-Scheme` (dodatkowy round-trip, rozdrobniony cache; strona jest light-only), CSP z `script-src 'unsafe-inline'`.
15. `/admin` zwraca 200 (Disallow w robots jest) — sprawdzić `noindex` w panelu.
16. Dwa obrazy hero z `fetchPriority=high` (Background, Clip_Center) — zostawić jeden. Wagi WebP niezmierzone (curl zwrócił 0 B) — sprawdzić w DevTools.

## Co działa

- Title/description/OG/Twitter/canonical/hreflang unikalne i poprawne; `lang="pl"`; OG image 1200×630.
- 404 → `noindex`; http→https 308; HSTS preload, nosniff, frame-ancestors, Referrer/Permissions-Policy.
- Lighthouse SEO 100, A11y 100; NAP i ceny zgodne z danymi klienta (150/80/120 zł, wt/czw 7:30–19:00).
- `alt` na wszystkich obrazach, lazy-loading, wymiary → CLS 0.
- Formularz: honeypot (`aria-hidden`), zgoda RODO, ostrzeżenie o danych wrażliwych; mapa za zgodą cookies.
- Cache: `X-Vercel-Cache: HIT`, TTFB ≈ 30 ms.

## Uwaga

Katalog audytu powstał w korzeniu repo — dopisz `*-audit/` do `.gitignore` albo przenieś poza repo.
