import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Statyczna CSP (bez nonce), żeby strony zostały SSG. 'unsafe-inline' wymagany przez inline skrypty
// hydratacji Next; 'unsafe-eval' tylko w dev (React debug). frame-src: mapa Google w map-embed.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "frame-src https://www.google.com",
  "connect-src 'self'",
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
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
};

export default nextConfig;
