"use server";

import { headers } from "next/headers";

export type ContactField = "name" | "contact" | "message" | "consent";
export type ContactValues = {
  name: string;
  phone: string;
  email: string;
  who: string;
  message: string;
  consent: boolean;
};
export type ContactState = {
  status: "idle" | "ok" | "error";
  errors: ContactField[];
  /** true = błąd po stronie wysyłki (nie walidacji) — klient pokazuje ogólny komunikat */
  failed: boolean;
  values: ContactValues;
};

const EMPTY: ContactValues = {
  name: "",
  phone: "",
  email: "",
  who: "child",
  message: "",
  consent: false,
};
// Plik "use server" może eksportować tylko funkcje async — stan początkowy ma klient.
const initialContactState: ContactState = {
  status: "idle",
  errors: [],
  failed: false,
  values: EMPTY,
};

const PHONE = /^\+?[\d\s-]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ponytail: limit w pamięci procesu (na serverless per instancja) — przy realnym spamie przenieść do Redis/Upstash.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  hits.set(ip, [...recent, now]);
  if (hits.size > 1000) hits.clear();
  return false;
}

const text = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max);

/** Walidacja po stronie serwera, honeypot, limit żądań; wysyłka przez Resend (fetch, bez SDK). */
export async function sendContact(
  _prev: ContactState,
  data: FormData,
): Promise<ContactState> {
  const values: ContactValues = {
    name: text(data, "name", 100),
    phone: text(data, "phone", 30),
    email: text(data, "email", 120),
    who: data.get("who") === "adult" ? "adult" : "child",
    message: text(data, "message", 1000),
    consent: data.get("consent") === "on",
  };

  // Honeypot: boty wypełniają ukryte pole — udajemy sukces, nic nie wysyłając.
  if (text(data, "website", 200))
    return { ...initialContactState, status: "ok" };

  const errors: ContactField[] = [];
  if (values.name.length < 2) errors.push("name");
  const phoneOk = PHONE.test(values.phone);
  const emailOk = EMAIL.test(values.email);
  if (
    (values.phone && !phoneOk) ||
    (values.email && !emailOk) ||
    (!phoneOk && !emailOk)
  )
    errors.push("contact");
  if (values.message.length < 10) errors.push("message");
  if (!values.consent) errors.push("consent");
  if (errors.length) return { status: "error", errors, failed: false, values };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (rateLimited(ip) || !RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM)
      console.error("contact: brak zmiennych środowiskowych");
    return { status: "error", errors: [], failed: true, values };
  }

  // Nie logujemy treści ani danych — to dane osobowe (RODO).
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: emailOk ? values.email : undefined,
      subject: "Wiadomość z formularza na stronie",
      text: [
        `Imię i nazwisko: ${values.name}`,
        `Telefon: ${values.phone || "—"}`,
        `E-mail: ${values.email || "—"}`,
        `Wizyta dla: ${values.who === "adult" ? "dorosłego" : "dziecka"}`,
        "",
        values.message,
      ].join("\n"),
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error(
      "contact: Resend odpowiedział",
      res?.status ?? "brak połączenia",
    );
    return { status: "error", errors: [], failed: true, values };
  }
  return { ...initialContactState, status: "ok" };
}
