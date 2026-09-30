import { ImageResponse } from "next/og";
import { hasLocale } from "@/i18n/config";
import { BUSINESS } from "@/lib/site";
import { getDictionary } from "./dictionaries";

export const alt = BUSINESS.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ponytail: domyślny font ImageResponse; jeśli cyrylica/diakrytyki wyjdą krzakami, wczytaj TTF z public/.
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { home } = await getDictionary(hasLocale(lang) ? lang : "pl");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#4c1d95", // violet-900 = surface-strong
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
          {home.title}
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.4, color: "#ede9fe" }}>
          {home.lead}
        </div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>+48 518 542 193</div>
      </div>
    ),
    size,
  );
}
