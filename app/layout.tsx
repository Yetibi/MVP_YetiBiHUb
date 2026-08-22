import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, DM_Serif_Display, Roboto_Condensed, Roboto, JetBrains_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["700", "900"],
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

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  style: ["normal", "italic"],
  weight: "400",
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSerif.variable} ${robotoCondensed.variable} ${roboto.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
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
