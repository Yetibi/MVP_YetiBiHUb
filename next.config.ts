import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Aísla el contexto de navegación: una ventana abierta desde aquí no
    // conserva referencia al documento, ni al revés.
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // googletagmanager sirve gtag.js (GA4 / Google Ads, cargado en el layout
      // raíz para todas las páginas). Sin él la CSP lo bloqueaba y no se medía
      // nada: "Refused to load .../gtag/js?id=G-…".
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      // GA manda los hits por fetch/beacon a google-analytics.com (y a los
      // dominios regionales region1..N.google-analytics.com).
      "connect-src 'self' https://*.supabase.co https://api.resend.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
      // El video de intro y los audios de /teach viven en buckets privados de
      // Supabase y se sirven por URL firmada. Sin media-src caían en
      // default-src 'self' y el navegador los bloqueaba ("Refused to load…"),
      // dejando el <video> con error code 4 (fuente no soportada) — se veía
      // como si el archivo estuviera roto.
      "media-src 'self' blob: https://*.supabase.co",
      // El <noscript> de GTM carga un <iframe> de googletagmanager; sin
      // frame-src cae en default-src 'self' y el navegador lo bloquea.
      "frame-src 'self' https://www.googletagmanager.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
