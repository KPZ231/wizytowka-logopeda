# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Komendy

```
npm run dev      # serwer deweloperski (http://localhost:3000)
npm run build    # build produkcyjny
npm run start    # uruchomienie builda
npm run lint     # ESLint 9 (flat config: eslint.config.mjs)
npx tsc --noEmit # sprawdzenie typów
```

Brak frameworka testowego — nie ma komendy do pojedynczego testu.

## Architektura

Wielostronnicowa wizytówka (Next.js 16.3.8, App Router, React 19.2, TypeScript strict, Tailwind CSS 4 przez `@tailwindcss/postcss`). Stan: świeży szkielet z create-next-app (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`).

- Katalog `app/` leży w korzeniu repo (bez `src/`). Alias `@/*` → korzeń repo.
- React Compiler jest włączony (`reactCompiler: true` w `next.config.ts`) — nie dodawaj ręcznie `useMemo`/`useCallback`/`memo` bez powodu.
- Tailwind 4: konfiguracja w CSS (`globals.css`, `@theme`), nie w `tailwind.config.js`.
- Animacje: **framer-motion** (pakiet `motion`/`framer-motion` — sprawdź aktualną nazwę importu w dokumentacji zainstalowanej wersji). Używaj tylko w komponentach klienckich (`"use client"`), małych liściach drzewa; przejścia między stronami i animacje wejścia sekcji przez wspólne warianty w jednym module. `MotionConfig reducedMotion="user"` na poziomie layoutu.
- Struktura wielostronicowa (routing przez `app/[lang]/`): m.in. strona główna, usługi, o gabinecie, cennik, kontakt oraz blog (`/blog`, `/blog/[slug]`). Wspólny layout z nawigacją i stopką.
- Blog zarządzany przez **Payload CMS** (wersja zgodna z Next.js 16 — sprawdź dokumentację Payload przed instalacją; zwykle panel pod `app/(payload)/admin`, kolekcja `posts` z polami per język `pl/en/uk`: tytuł, slug, treść rich text, obraz, opis SEO, data publikacji, status draft/published). Zapytania do treści tylko po stronie serwera (Local API), strony bloga jako SSG/ISR z rewalidacją po publikacji; do wpisów dodaj JSON-LD `BlogPosting`, wpisy w `sitemap.ts` i canonical/hreflang. Baza: **Postgres na Neon** (przez Vercel Marketplace; adapter `@payloadcms/db-postgres`, `DATABASE_URI` = connection string Neon, najlepiej pooled). Vercel nie oferuje już własnego Postgresa, a plan Hobby jest tylko niekomercyjny — wdrożenie klienta wymaga planu Pro lub innego hostingu. Migracje Payload zatwierdzane w repo, bez `push` na produkcji. Sekrety (`PAYLOAD_SECRET`, `DATABASE_URI`) wyłącznie w `.env`; panel admina nie indeksowany (`robots`), z silnymi hasłami/2FA, a treść rich text renderowana bez `dangerouslySetInnerHTML` niezaufanego HTML.
- Ta wersja Next.js różni się od tej z danych treningowych. Przed pisaniem kodu czytaj `node_modules/next/dist/docs/` (01-app, 02-pages, 03-architecture).

## Dane klienta (źródło prawdy dla treści i schema.org)

- Nazwa: Gabinet Logopedyczny Kinga Krajs
- Telefon: +48 518 542 193
- Adres: Biernota 11, 44-230 Czerwionka (Polska)
- Profil zewnętrzny: https://www.medfile.pl/kinga-krajs/logopeda/polska/
- Godziny: wtorek i czwartek, 7:30–19:00
- Usługi i ceny:
  - Konsultacja logopedyczna (pierwsza wizyta) + plan terapii + zalecenia — 150 zł / 60 min
  - Terapia logopedyczna (kolejna wizyta) — 80 zł / 30 min
  - Terapia logopedyczna (kolejna wizyta) — 120 zł / 45 min
- Zakres: zespół Aspergera, zaburzenia połykania, zaburzenia mowy, ćwiczenia mowy, autyzm

Nie wymyślaj opinii, dyplomów, liczby pacjentów ani innych faktów, których nie ma powyżej. Brakujące dane zgłoś użytkownikowi.

## Styl i wygląd

**Przed każdą pracą nad UI przeczytaj @DESIGN.md** (feeling strony, szerokość treści 80% / `page-w`, paleta, font Manrope, zasady ruchu, checklista). Tokeny żyją w `app/globals.css`; przy konflikcie z poniższymi punktami rozstrzyga DESIGN.md.

- Kolor przewodni: fiolet (różne odcienie jako akcenty) + akcenty jasnoszare. Kolory jako tokeny/zmienne CSS w `@theme`, nie wartości rozsiane po komponentach.
- Strona ma wyglądać premium: płynny smooth scroll, eleganckie animacje przejść, wysoka jakość UX/UI.
- Animacje: transform/opacity, bez animowania layoutu; obowiązkowo respektuj `prefers-reduced-motion` (WCAG 2.3.3 / dobra praktyka).
- Mobile-first, responsywność od 320 px.

## Internacjonalizacja (PL główny, EN, UK)

- Języki: `pl` (domyślny, bez konieczności prefiksu lub z `/pl`), `en`, `uk`.
- Wszystkie teksty w słownikach per język (np. `dictionaries/{pl,en,uk}.json`) — zero tekstów na sztywno w JSX. Klucze identyczne we wszystkich językach.
- Routing przez segment `app/[lang]/` zgodnie z dokumentacją Next.js w `node_modules/next/dist/docs/` (sprawdź aktualny sposób, nie zakładaj z pamięci).
- `<html lang>` zgodne z bieżącym językiem; `hreflang` (w tym `x-default` → pl) i `alternates` w metadanych dla każdej wersji; przełącznik języka dostępny z klawiatury i z `lang` na elementach w obcym języku.
- Tłumaczenia UK i EN nie mogą być dosłowne z maszyny — terminologia logopedyczna musi być poprawna (np. uk: «логопед», «порушення мовлення», «аутизм», «синдром Аспергера»). Waluta: zł/PLN; formaty dat/godzin przez `Intl`.
- Polskie teksty zawsze z pełnymi znakami diakrytycznymi.

## Dostępność (WCAG 2.1, poziom AA)

- Semantyczny HTML (`header/nav/main/section/footer`, jeden `h1`, logiczna hierarchia nagłówków), landmarki, link „Przejdź do treści”.
- Kontrast min. 4.5:1 (tekst) i 3:1 (duże elementy/UI) — uważaj na jasnoszary na bieli i jasny fiolet.
- Pełna obsługa klawiaturą, widoczny `:focus-visible`, cele dotykowe ≥ 44×44 px, brak pułapek fokusa.
- Obrazy: sensowny `alt` (dekoracyjne `alt=""`); formularze: powiązane `<label>`, czytelne komunikaty błędów (`aria-describedby`/`aria-live`).
- Linki do telefonu `tel:+48518542193`, adresu do map; nie przekazuj informacji wyłącznie kolorem.
- Smooth scroll i parallax wyłączone przy `prefers-reduced-motion: reduce`.

## SEO i treści

- Treści czytelne, konkretne, empatyczne, bez obietnic medycznych typu „gwarantowane wyleczenie”; pisane pod intencję rodzica/pacjenta (np. „logopeda Czerwionka-Leszczyny”, „terapia autyzm”, „zaburzenia połykania”). Jedna fraza główna na sekcję, bez upychania słów kluczowych.
- Unikalne `title` (≤ ~60 zn.) i `description` (≤ ~155 zn.) per język przez Metadata API; Open Graph/Twitter, canonical, `sitemap.ts`, `robots.ts`.
- Dane strukturalne JSON-LD (`MedicalBusiness`/`LocalBusiness` + `Speech-Language Pathology` jako `medicalSpecialty`, `openingHoursSpecification`, `priceRange`, `address`, `telephone`, `sameAs` → Medfile) — wyłącznie z danych klienta powyżej.
- NAP (nazwa, adres, telefon) identyczny wszędzie. Obrazy przez `next/image` (wymiary, `priority` tylko dla LCP), fonty przez `next/font`. Cele: LCP < 2,5 s, CLS < 0,1, INP < 200 ms.

## Kod i dokumentacja

- Komponenty serwerowe domyślnie; `"use client"` tylko dla interaktywności/animacji, w możliwie małych liściach drzewa.
- Małe, jednoznaczne komponenty i funkcje; nazwy opisowe (kod i identyfikatory po angielsku, komentarze i commity po polsku lub angielsku — spójnie z otoczeniem).
- Komentarz wyjaśnia *dlaczego* (decyzje, obejścia, dostępność), nie *co*. Publiczne funkcje/komponenty z nietrywialnym API dostają krótki JSDoc. TypeScript strict — bez `any`; typy dla słowników i propsów.
- Zależności dodawaj tylko, gdy natywny CSS/platforma nie wystarcza (np. biblioteka animacji musi być uzasadniona).

## Bezpieczeństwo witryny

- Nagłówki bezpieczeństwa w `next.config.ts` (`headers()`): `Content-Security-Policy` (bez `unsafe-inline` jeśli się da, użyj nonce), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `frame-ancestors`/`X-Frame-Options`.
- Nigdy `dangerouslySetInnerHTML` z treścią niezaufaną (JSON-LD serializuj przez `JSON.stringify` i escapuj `<`).
- Formularz kontaktowy (jeśli powstanie): walidacja i sanityzacja po stronie serwera (np. zod), rate limiting, honeypot/CAPTCHA, brak ujawniania szczegółów błędów. Dane pacjentów to dane wrażliwe (RODO) — nie loguj, nie zapisuj bez potrzeby.
- Sekrety tylko w zmiennych środowiskowych (`.env*` poza gitem; do klienta wyłącznie `NEXT_PUBLIC_*`). Linki zewnętrzne `rel="noopener noreferrer"`.
- RODO: polityka prywatności i informacja o cookies; analityka i zewnętrzne skrypty dopiero po zgodzie. Regularnie `npm audit`.

## Oszczędzanie tokenów (praca z Claude Code)

- `/clear` przy zmianie zadania, `/compact` przy długiej sesji; `/cost` do kontroli zużycia.
- Trzymaj ten plik krótki (jest ładowany w każdej sesji); szczegółowe instrukcje w osobnych plikach/skillach ładowanych na żądanie.
- Czytaj fragmenty (Grep, `offset`/`limit`) zamiast całych plików; nie czytaj `node_modules`, `.next`, lockfile — wyjątek: `node_modules/next/dist/docs/` dla konkretnego tematu.
- Dobieraj model do zadania (mniejszy do prostych zmian), planuj w plan mode przed dużymi zmianami, dawaj precyzyjne prompty ze ścieżkami plików.
- Subagenty/workflowy tylko gdy naprawdę potrzebne (każdy startuje „na zimno”); skille `caveman`/`ponytail` skracają odpowiedzi i kod; graphify zastępuje wielokrotne przeszukiwanie repo.

## Agent skills

### Issue tracker

Zadania i specyfikacje w GitHub Issues (CLI `gh`; repo nie ma jeszcze remote — trzeba je dodać). Patrz `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: jeden `CONTEXT.md` i `docs/adr/` w korzeniu repo. Patrz `docs/agents/domain.md`.
