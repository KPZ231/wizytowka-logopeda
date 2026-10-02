import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const isDev = process.env.NODE_ENV === "development";

// Statyczna CSP (bez nonce), żeby strony zostały SSG. 'unsafe-inline' wymagany przez inline skrypty
// hydratacji Next (dane RSC; SRI ich nie hashuje — CSP bez unsafe-inline blokuje hydratację, sprawdzone buildem); 'unsafe-eval' tylko w dev (React debug). frame-src: mapa Google w map-embed.
// Tidio (components/chat-launcher.tsx): skrypt ładuje się dopiero po zgodzie użytkownika w panelu czatu.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://code.tidio.co${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://code.tidio.co",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.tidio.co https://*.tidiochat.com",
  "font-src 'self' https://code.tidio.co",
  "frame-src https://www.google.com https://*.tidio.co",
  // /_vercel/insights/* jest proxowane przez Vercel pod tą samą domeną co strona.
  "connect-src 'self' https://va.vercel-scripts.com https://*.tidio.co https://*.tidiochat.com wss://*.tidio.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // nie zdradzamy stosu (Next.js, Payload) w nagłówku odpowiedzi
  poweredByHeader: false,
  // Własny 404 dla adresów spoza [lang] (np. /plik.txt); korzeń aplikacji nie ma wspólnego layoutu
  experimental: { globalNotFound: true },
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default withPayload(nextConfig);
