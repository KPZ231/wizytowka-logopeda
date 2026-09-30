export type Review = {
  id: string;
  /** Imię + inicjał nazwiska (np. „Anna K.”) — bez zdjęć profilowych, mniej danych osobowych. */
  author: string;
  /** Gwiazdki 1–5; brak = nie znamy (karta nie pokazuje gwiazdek). */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Miesiąc publikacji, „YYYY-MM” (z dat względnych Google, np. „8 miesięcy temu” — przybliżony). */
  date: string;
  /** Treść w oryginale (nie tłumaczymy opinii). */
  text: string;
};

export type ReviewsSummary = {
  /** Średnia z Google; 0 = policz z wklejonych opinii. */
  rating: number;
  /** Liczba wszystkich opinii w Google; 0 = użyj liczby wklejonych. */
  count: number;
  /** Link do wizytówki z opiniami w Google (pusty = bez przycisku). */
  profileUrl: string;
  /** Link „Dodaj opinię” (search.google.com/local/writereview?placeid=…; pusty = bez przycisku). */
  writeReviewUrl: string;
};
