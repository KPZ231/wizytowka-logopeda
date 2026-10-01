"use client";

import { useSyncExternalStore } from "react";

export type Consent = "accepted" | "rejected" | null;

const KEY = "consent-v1";
const EVENT = "consent-change";

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    // tryb prywatny / zablokowane dane strony → traktujemy jak brak decyzji
    return null;
  }
}

function write(value: Consent) {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    // zgoda nie zostanie zapamiętana, ale zdarzenie poniżej i tak odświeży UI w tej karcie
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Zgoda na zewnętrzne cookies (mapa Google). Po stronie serwera i w pierwszym renderze
 * zwraca `undefined` — dzięki temu baner nie mignie osobom, które już zdecydowały.
 */
export function useConsent(): Consent | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export const setConsent = (value: "accepted" | "rejected") => write(value);
export const resetConsent = () => write(null);
