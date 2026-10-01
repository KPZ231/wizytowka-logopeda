import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];
  if (hasLocale(segment)) return;

  const languages = new Negotiator({
    headers: { "accept-language": request.headers.get("accept-language") ?? "" },
  }).languages();
  let locale = defaultLocale;
  try {
    locale = match(languages, locales, defaultLocale) as typeof defaultLocale;
  } catch {
    // nieprawidłowy nagłówek Accept-Language → zostaje język domyślny
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // pomija _next, pliki statyczne (z kropką), API i panel Payload
  // `\\.` — w zwykłym stringu pojedynczy `\.` zamieniał się w `.` i wykluczał każdą ścieżkę
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};
