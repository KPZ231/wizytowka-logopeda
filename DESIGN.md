# DESIGN.md — Gabinet Logopedyczny Kinga Krajs

Źródło tokenów: `app/globals.css`. Ten plik opisuje *dlaczego* i *jak ich używać*.

## 1. Feeling strony

**Ciepły spokój z premium-wykończeniem.** Rodzic dziecka z trudnościami w mowie ma czuć: „tu jest ktoś kompetentny i życzliwy". Nie klinika (zimny błękit, biel), nie przedszkole (kolorowe kulki).

- Jasne, oddychające tło + **głęboki fiolet** jako jedyny mocny głos. Jasnoszary to tło pomocnicze, nigdy akcent.
- Strona **nie może wyglądać na pustą**. Pustkę wypełniamy *strukturą i głębią*, nie dekoracją:
  - naprzemienne tła sekcji (`background` → `surface-tint` → `surface` → `surface-strong`), żeby scroll miał rytm;
  - miękkie fioletowe poświaty (`wash-violet`) w hero i przy sekcjach CTA;
  - duże zaokrąglone „wyspy" (karty, panele) zamiast treści luzem na białym;
  - dużą typografią: nagłówki naprawdę duże, kontrast skali 4:1 między H1 a tekstem;
  - realne treści z danych klienta (godziny, ceny, adres) podane wprost, bez lania wody.
- Jedna rzecz zapamiętywalna: **hero z dużym nagłówkiem i fioletową poświatą**. Reszta cicha i konsekwentna.
- Bez: stockowych uśmiechniętych dzieci jako wypełniacza, gradientów tęczowych, etykiet WERSALIKAMI nad każdym nagłówkiem, numerowania, które nie oznacza kolejności.

## 2. Szerokość i układ

- **Treść i komponenty: 80% szerokości ekranu (`w-4/5`)**, wyśrodkowane. Klasa `page-w` (token `--page-width: 80%`).
- Tła sekcji (kolorowe pasy, poświaty) idą **edge-to-edge**; wewnątrz nich treść w `page-w`. Dzięki temu po bokach jest oddech, a strona nie wygląda jak wąska kolumna.
- Każda sekcja: `<section class="section-y">` → `<div class="page-w">…</div>`. Nie dodawaj własnych `max-w-*` i `px-*` na kontenerze.
- Siatka: mobile-first, 1 kolumna → 2 (od `md`) → 3 (od `lg`). Odstępy w skali 4/8 px (`gap-4/6/8/12`).
- Długość linii tekstu: **≤ 70 znaków** (`max-w-prose` / `max-w-[65ch]`) — nawet w szerokim kontenerze akapit nie biegnie na całą szerokość.
- Wyrównanie: treść do lewej; tylko krótkie nagłówki sekcji i CTA mogą być wyśrodkowane.
- ⚠ Przy 320 px 80% daje ~256 px. Jeśli ciasno, podnieś wartość tylko dla małych ekranów w `globals.css` (jedna zmiana `--page-width`), nie w komponentach.

## 3. Kolor

| Token | Wartość | Rola |
| --- | --- | --- |
| `background` | `#ffffff` | Tło główne |
| `surface` | `gray-50` | Naprzemienne sekcje, pola formularzy |
| `surface-tint` | `violet-50` | Sekcje „ciepłe", tła kart wyróżnionych |
| `surface-strong` | `violet-900` | Jedna ciemna sekcja na stronę (CTA/kontakt), tekst `on-strong` |
| `foreground` | `gray-900` | Tekst główny (kontrast ≈ 16:1) |
| `muted` | `gray-700` | Tekst drugorzędny (≈ 9:1) |
| `subtle` | `gray-500` | Tylko metadane, ≥ 4.5:1 na bieli — nie na `surface-tint` dla małego tekstu |
| `accent` / `accent-hover` | `violet-600` / `violet-700` | Przyciski, linki, ikony (≥ 6:1 na bieli) |
| `accent-soft` | `violet-100` | Tła plakietek, hover kart |
| `border` / `border-strong` | `gray-200` / `gray-300` | Obramowania, separatory |
| `danger`, `success` | `#b3261e`, `#1e6b3a` | Komunikaty formularza — zawsze z ikoną/tekstem |

Zasady:
- W komponentach **tylko tokeny** (`bg-surface-tint`, `text-muted`, `text-accent`). Zero surowych hexów.
- `violet-500` i jaśniejsze: wyłącznie elementy dekoracyjne/duże (≥ 3:1), **nigdy tekst** na bieli. Tekst na fiolecie: biały na `violet-600+`.
- Jeden wyraźny CTA na widok (wypełniony `accent`), reszta akcji jako przycisk obrysowany lub link.
- Informacja nigdy wyłącznie kolorem (linki podkreślone lub z ikoną).
- Tryb ciemny: **świadomie brak** (`color-scheme: light`). Strona gabinetu ma jeden, dopracowany wygląd; dwa motywy to podwojenie testów kontrastu bez korzyści dla klienta.
- Cienie tylko fioletowe (`shadow-sm/md/lg`), nie czarne — stąd „ciepło" zamiast szarości.

## 4. Typografia

- **Krój strony: Manrope** (jedna rodzina do nagłówków i tekstu), ładowany przez `next/font` w `app/[lang]/layout.tsx` jako `--font-manrope` → `font-sans`. Hierarchię budujemy rozmiarem, wagą (400/600/700) i kolorem, nie drugim krojem.
- Podzbiory `latin`, `latin-ext` (polskie ą ć ę ł ń ó ś ź ż) i `cyrillic` (UK) są obowiązkowe — bez `latin-ext` diakrytyki spadają na font systemowy.
- Skala (mobile → desktop, `clamp`): H1 `2.5rem → 4.5rem`, H2 `2rem → 3rem`, H3 `1.25rem → 1.5rem`, tekst `1rem`, tekst duży `1.125rem`, drobny `0.875rem` (nigdy < 14 px).
- Nagłówki: waga 600–700, `line-height` 1.1–1.2, `letter-spacing` lekko ujemny (`-0.02em`) tylko dla H1/H2. Tekst: waga 400, `line-height` 1.65.
- Jeden `h1` na stronę, hierarchia bez przeskoków.
- Ceny i godziny: `font-variant-numeric: tabular-nums`.
- Bez akcentowania jednego słowa w nagłówku innym kolorem/kursywą jako domyślnego chwytu.

## 5. Kształt i głębia

- Promienie: `radius-sm` (pola, plakietki), `radius-md` (karty), `radius-lg` (duże panele, hero), `radius-pill` (przyciski, przełącznik języka). Promień zależy od rangi elementu — nie jeden na wszystko.
- Karty: tło `surface` lub `surface-tint` + `border`, cień dopiero na hover (`shadow-md`). Nie dziel treści na identyczne karty, jeśli to lista — użyj listy z separatorami.
- Hierarchia przez tło i rozmiar, nie przez ramki wokół wszystkiego.
- Rytm sekcji: `section-y` (64–128 px, płynnie). Wewnątrz sekcji: nagłówek → 24–32 px → treść.

## 6. Ruch (framer-motion + CSS)

Filozofia: **ruch odpowiada na akcję użytkownika albo prowadzi wzrok w jednym momencie; reszta stoi**.

- Animuj tylko `transform` i `opacity`. Nigdy `width/height/top/left`, nigdy `transition: all`.
- Easing: wejścia `--ease-out` (`cubic-bezier(0.23,1,0.32,1)`), ruch na ekranie `--ease-in-out`. Nie używaj `ease-in`.
- Czasy: wciśnięcie 140 ms, hover/UI 200 ms, menu/panele ≤ 300 ms, wejście sekcji do 600 ms. Wyjście krótsze niż wejście.
- Wciśnięcie: klasa `pressable` (`scale(0.97)` na `:active`) na każdym przycisku/linku-przycisku.
- Nigdy start od `scale(0)` — min. `0.95` z `opacity: 0`.
- Wejście sekcji: wspólne warianty w jednym module (`fade + translateY(16px)`, stagger 50–80 ms dla dzieci), `once: true`, **tylko treść poniżej zgięcia**. Hero: jedna zorkiestrowana sekwencja przy ładowaniu. Nie animuj każdej karty osobno.
- Hover tylko za `@media (hover: hover) and (pointer: fine)`.
- Akcje z klawiatury (nawigacja, skip link, przełącznik języka) bez animacji.
- Przejścia stron: krótki fade (≤ 200 ms), bez przesuwania układu.
- `MotionConfig reducedMotion="user"` w layoucie + reguła globalna w CSS. Smooth scroll i parallax wyłączone przy `prefers-reduced-motion: reduce`.

## 7. Komponenty — minimum spójności

- **Przycisk główny**: `bg-accent text-on-strong`, `radius-pill`, wysokość ≥ 48 px, `px-7`, hover `accent-hover`, `pressable`. Wtórny: obrys `border-strong`, tekst `foreground`, hover `accent-soft`.
- **Cele dotykowe ≥ 44×44 px**, odstęp między nimi ≥ 8 px.
- **Focus**: globalny `:focus-visible` (3 px, `focus-ring`) — nie usuwaj; na ciemnym tle zmień obrys na biały.
- **Pola formularza**: widoczny `<label>` nad polem, tło `surface`, `border`, focus `accent`; błąd pod polem z ikoną + `aria-describedby`, region `aria-live="polite"`.
- **Nawigacja**: sticky, półprzezroczyste tło z `backdrop-blur` (tylko jako tło nawigacji), aktywna pozycja oznaczona wagą + podkreśleniem. Link „Przejdź do treści” pierwszy w DOM.
- **Przełącznik języka** (PL/EN/UK): natywne linki z `lang` i `hreflang`, dostępny z klawiatury.
- **Ikony**: jeden zestaw SVG (np. Lucide), jedna grubość kreski (1.5–2 px), rozmiary z tokenów (20/24). Bez emoji jako ikon.
- **Obrazy**: `next/image`, stałe proporcje (brak CLS), sensowny `alt`, `priority` tylko dla LCP.

## 8. Treść i ton

- Empatycznie, konkretnie, bez obietnic medycznych („gwarantowany efekt"). Piszemy do rodzica: co się dzieje na pierwszej wizycie, ile trwa, ile kosztuje.
- Przyciski nazywają akcję: „Zadzwoń: 518 542 193”, „Umów konsultację” — nie „Wyślij”, „Dowiedz się więcej”.
- Tylko fakty z `CLAUDE.md` (dane klienta). Brak opinii, dyplomów i liczb pacjentów, dopóki klient ich nie poda.
- Teksty w słownikach per język, PL z pełnymi diakrytykami; UK/EN nie dosłowne z tłumacza.

## 9. Checklista przed scaleniem zmiany UI

- [ ] Tylko tokeny kolorów i promieni, brak surowych hexów
- [ ] Treść w `page-w`, tła sekcji edge-to-edge
- [ ] Kontrast ≥ 4.5:1 (tekst) / 3:1 (UI); test na `surface-tint`
- [ ] Focus widoczny, pełna obsługa klawiaturą, cele ≥ 44 px
- [ ] Animacje: tylko transform/opacity, `prefers-reduced-motion` działa
- [ ] Sprawdzone przy 320, 375, 768, 1280 px — bez poziomego scrolla
- [ ] CLS < 0.1; obrazy z wymiarami
- [ ] Sekcja nie wygląda pusto: tło, rytm, hierarchia rozmiaru
