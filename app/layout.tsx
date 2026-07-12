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
  title: "Diagnóstico AI Readiness — Yeti BI",
  description:
    "Evalúa la madurez analítica de tu negocio en 5 capas y descubre qué necesitas antes de adoptar IA.",
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
