import { notFound } from "next/navigation";

// Nieznane ścieżki pod /pl, /en, /uk → 404 z layoutem (nawigacja, stopka), nie z global-not-found.
export default function CatchAll() {
  notFound();
}
