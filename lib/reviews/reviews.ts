import "server-only";
import type { Review, ReviewsSummary } from "./types";

/**
 * Opinie z Google wklejone ręcznie (oficjalne API nie wymaga scrapingu, ale Places API zwraca tylko 5 opinii,
 * a gabinet ma ich 26+). Puste = sekcja „Opinie” się nie renderuje — nie wymyślamy opinii (CLAUDE.md). Daty to przybliżenie z
 * względnych dat Google („8 miesięcy temu”); ocena gwiazdkowa nie była w wklejonym tekście (pole `rating` opcjonalne).
 * Jak uzupełnić: skopiuj autora, ocenę, miesiąc i treść z profilu Google (lub eksport z Business Profile / Takeout).
 * Docelowo wnętrze getReviews()/getSummary() można podmienić na Google Business Profile API.
 */
const REVIEWS: Review[] = [
  {
    id: "ewa",
    author: "Ewa",
    date: "2026-01",
    text: "Pani Kinga stawia na profesjonalną pomoc logopedyczną. Ma bardzo dużą wiedzę oraz doświadczenie. Potrafi świetnie prowadzić zajęcia z dziećmi - ma mnóstwo ciekawych pomocy logopedycznych co sprawia, że dzieci chętnie chodzą na zajęcia. Pani Kinga dba też o dobrą atmosferę podczas zajęć.\nWidać wielkie efekty w terapiach u dzieci.\nZ całego serduszka polecam ❤️",
  },
  {
    id: "aleksandra",
    author: "Aleksandra",
    date: "2026-01",
    text: "Pani Kinga to najlepszy logopeda pod słońcem. Dzięki indywidualnej terapii mój syn ma coraz większe postępy w mowie. Jest ona sumienną i konkretną osobą.\nPani Kinga zawsze przychodzi przygotowana na zajęcia i moje dziecko chętnie z nią współpracuje. Atutem jest to, że Pani Kinga dojeżdża do nas do domu.\nNa koniec zajęć Pani Kinga zawsze daje mi informację zwrotną co też jest bardzo ważne 😊",
  },
  {
    id: "martyna-h",
    author: "Martyna H.",
    date: "2026-01",
    text: "Bardzo sympatyczna, miła i profesjonalna osoba. Pani Kinga ma niesamowite podejście do dzieci, syn od razu ją polubił i chętnie wykonuję każde ćwiczenia. Jestem bardzo zadowolona z zajęć, które przynoszą niesamowite efekty i postępy :)",
  },
  {
    id: "justyna",
    author: "Justyna",
    date: "2026-07",
    text: "Z całego serca polecam Panią Kingę! To niezwykle ciepła, uśmiechnięta i profesjonalna osoba. Zajęcia są zawsze ciekawe, pełne kreatywnych zabaw i dostosowane do potrzeb dziecka, dzięki czemu nauka odbywa się w miłej i swobodnej atmosferze. Widać ogromne zaangażowanie, pasję oraz indywidualne podejście do każdego małego pacjenta. Córka z radością chodzi na zajęcia, a postępy są naprawdę widoczne. Dziękujemy za serce, cierpliwość i profesjonalizm 🍀",
  },
  {
    id: "paula-e",
    author: "Paula E.",
    date: "2025-11",
    text: "Pani Kinga to profesjonalistka z doskonałym podejściem do dzieci :) zajęcia dopracowane w każdym szczególe, tak, by dziecko chętnie wykonało ćwiczenia. Po kilku miesiącach spotkań widzę postępy u mojego synka. Polecam :)",
  },
  {
    id: "agnieszka-r",
    author: "Agnieszka R.",
    date: "2025-10",
    text: "Moje dziecko uwielbia chodzić na zajęcia do Pani Kingi i to jest chyba najlepsza rekomendacja dla mnie jako matki. Mamy swoją teczkę widzę co jest przerabiane pracujemy także w domu. Pani Kinga ma naprawdę super profesjonalne podejście do dzieci a korzyści i zalety wizyt mojego dziecka u Pani Kingi słyszę w znacznej poprawie wymowy u mojej córki. Polecam i dziękuję Pani Kingo.",
  },
  {
    id: "magda-w",
    author: "Magda W.",
    date: "2025-10",
    text: "Bardzo polecam Panią Kingę. Interesujące zajęcia, dzieci chętne do współpracy . Zawsze oczekują na kolejne zajęcia. Idealne podejście do dziecka . Dzieci z chęcią wykonują w domu ćwiczenia , które mają zadane same od siebie .. I progres jakie dzieci zrobiły w czasie też się bardzo ceni. Naprawdę polecam wszystkim współpracę. Odpowiedni człowiek na odpowiednim miejscu z pasją. 😊",
  },
  {
    id: "katarzyna",
    author: "Katarzyna",
    date: "2025-10",
    text: "Serdecznie polecam zajęcia u Pani Kingi! Pełen profesjonalizm, super podejście do dzieci, fachowe przygotowanie do każdego spotkania. Efekty pracy szybko widoczne! Początkowo onieśmielenie mojej córki Pani Kinga przemieniła w oczekiwanie na kolejne spotkanie, które zawsze przebiega w przemiłej atmosferze :)",
  },
  {
    id: "justyna-k",
    author: "Justyna K.",
    date: "2026-01",
    text: "Polecam z całego serca. Profesjonalne podejście, świetny kontakt z dzieckiem i widoczne efekty terapii. Miła atmosfera i konkretne wskazówki do pracy w domu.",
  },
  {
    id: "ki-k",
    author: "Ki K.",
    date: "2026-01",
    text: "Serdecznie polecam usługi Pani Kingi. Logopeda ,który zna się na swojej pracy ,ma dużą wiedzę , a efekty pracy z dzieckiem były na prawdę bardzo szybkie. Bardzo dziękujemy ☺️ ❤️",
  },
  {
    id: "anna-t",
    author: "Anna T.",
    date: "2026-07",
    text: "Cudowny logopeda z powołania! Pani Kinga jest bardzo cierpliwa, empatyczna i zaangażowana w swoją pracę. Wizyta przebiega w miłej atmosferze, a ja jako rodzic otrzymałam jasne wskazówki do pracy w domu. Polecam z całego serca",
  },
  {
    id: "natalia-a",
    author: "Natalia A.",
    date: "2026-03",
    text: "Bardzo polecam panią Kingę. Zajęcia są zawsze ciekawe i świetnie przygotowane – wypełnione różnorodnymi grami i zabawami, które angażują dziecko i sprawiają mu dużą radość. Moja córka jest bardzo zadowolona i zawsze z niecierpliwością czeka na kolejne spotkania. Już po kilku zajęciach zauważyłam wyraźną poprawę, co jest dla mnie ogromnym plusem. Dodatkowym atutem jest to, że zajęcia odbywają się w domu, co zapewnia komfort i wygodę. Serdecznie polecam!",
  },
];

const SUMMARY: ReviewsSummary = {
  rating: 0, // brak średniej w danych od klienta — uzupełnić (np. 5.0), wtedy pojawi się wynik i gwiazdki
  count: 26, // łączna liczba opinii w Google (wklejono jej część)
  profileUrl: "https://share.google/fEpB1Hm8pHT17b3sn",
  writeReviewUrl: "",
};

/** Najnowsze pierwsze. */
export async function getReviews(): Promise<Review[]> {
  return [...REVIEWS].sort((a, b) => b.date.localeCompare(a.date));
}

/** Średnia i liczba z Google; gdy nie podano — liczone z wklejonych opinii. */
export async function getSummary(): Promise<
  ReviewsSummary & { rating: number; count: number }
> {
  const rated = REVIEWS.filter((r) => r.rating);
  const avg =
    rated.length === REVIEWS.length && rated.length
      ? rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length
      : 0;
  return {
    ...SUMMARY,
    rating: SUMMARY.rating || Math.round(avg * 10) / 10,
    count: SUMMARY.count || REVIEWS.length,
  };
}
