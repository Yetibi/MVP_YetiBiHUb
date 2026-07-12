import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["700", "900"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  style: ["normal", "italic"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yetibi.com"),
  title: {
    default: "Diagnóstico de Madurez Operacional | Yeti BI",
    template: "%s | Yeti BI",
  },
  description:
    "Evalúa si tu operación tiene las condiciones para desplegar IA o automatizar procesos. Diagnóstico gratuito en 10 minutos. Medellín, Colombia.",
  keywords: [
    "diagnóstico de madurez operacional",
    "AI readiness pymes Colombia",
    "automatización de procesos",
    "consultoría BI Medellín",
    "Power Bi",
    "madurez analítica empresas",
    "gap análisis procesos IA",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://yetibi.com",
    siteName: "Yeti BI",
    title: "Diagnóstico de Madurez Operacional | Yeti BI",
    description:
      "Evalúa si tu operación está lista para IA o automatización. Gratis. 10 minutos.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnóstico de Madurez Operacional | Yeti BI",
    description: "Evalúa si tu operación está lista para IA. Gratis.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://yetibi.com" },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "icon", url: "/favicon.ico" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2E2640",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSerif.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className={`${playfair.variable} ${dmSerif.variable} min-h-full flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Yeti BI",
              url: "https://yetibi.com",
              logo: "https://yetibi.com/yeti-logo.png",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Diagnóstico de Madurez Operacional",
              description:
                "Evaluamos el gap As-Is → To-Be para automatizar procesos o desplegar IA con éxito.",
              provider: { "@type": "Organization", name: "Yeti BI" },
              areaServed: { "@type": "Country", name: "Colombia" },
              offers: { "@type": "Offer", price: "0", priceCurrency: "COP" },
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#1c1426]"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
