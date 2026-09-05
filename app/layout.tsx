import type { Metadata, Viewport } from "next";
import Script from "next/script";
// Playfair_Display, DM_Serif_Display, Roboto_Condensed y Roboto se cargaban
// aquí, pero ninguna hoja de estilo las referenciaba: cero usos de sus
// variables en todo el repositorio. Se retiraron. Si vuelve a hacer falta una
// serif de display, hay que reintroducirla junto con la regla que la use.
import { Geist, Geist_Mono, JetBrains_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "500", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

// Metadatos de MARCA: los de la evaluación viven en app/evaluacion/page.tsx.
export const metadata: Metadata = {
  metadataBase: new URL("https://yetibi.com"),
  title: {
    default: "Yeti BI — Primero el proceso, después la IA",
    template: "%s | Yeti BI",
  },
  description:
    "Ingeniería de procesos y datos que termina en impacto financiero, no en horas ahorradas. Medellín, Colombia.",
  keywords: [
    "ingeniería de procesos",
    "IA para pymes Colombia",
    "consultoría BI Medellín",
    "rediseño de procesos",
    "sistemas inteligentes",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://yetibi.com",
    siteName: "Yeti BI",
    title: "Yeti BI — Primero el proceso, después la IA",
    description:
      "Ingeniería de procesos y datos que termina en impacto financiero, no en horas ahorradas.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeti BI — Primero el proceso, después la IA",
    description:
      "Ingeniería de procesos y datos que termina en impacto financiero, no en horas ahorradas. Medellín, Colombia.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://yetibi.com" },
  // ?v=2: rompe la caché de favicons del navegador (rebrand 2026-08-22)
  icons: {
    icon: [
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
    other: [{ rel: "icon", url: "/favicon.ico?v=2" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B1420",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        {/* Google Tag Manager — contenedor GTM-5Q74QF6L.
            Va como <Script> y no como <script> crudo: en el App Router una
            etiqueta <script> dentro del árbol de React no garantiza el orden
            de carga, y next/script sí. Estrategia afterInteractive = se
            inyecta apenas la página es interactiva, que es lo que el snippet
            original hace desde el head. */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5Q74QF6L');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) — primer elemento del body, como pide
            el snippet. Solo actúa si el visitante tiene JS desactivado. */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5Q74QF6L"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* Google tag (gtag.js) — Google Ads / GA4, todas las páginas */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SKYKSHS0LZ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SKYKSHS0LZ');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Yeti BI",
              url: "https://yetibi.com",
              logo: "https://yetibi.com/icon-512x512.png",
              description:
                "Consultoría de optimización de procesos y BI en Medellín, Colombia.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Medellín",
                addressRegion: "Antioquia",
                addressCountry: "CO",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "data@yetibi.com",
                contactType: "customer service",
                availableLanguage: "Spanish",
              },
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-(--warning) focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-(--primary-foreground)"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
