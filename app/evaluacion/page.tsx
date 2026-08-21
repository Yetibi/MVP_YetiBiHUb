import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import DifferentiatorSection from "@/components/home/DifferentiatorSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ValueFlow } from "@/components/home/ValueFlow";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Footer } from "@/components/home/Footer";

// ─── SEO de la página de producto (evaluación y rediseño de procesos) ────────
// Estos metadatos describen la evaluación, no la marca — antes vivían en la
// raíz y se movieron aquí junto con la página.
export const metadata: Metadata = {
  title: "Evaluación y rediseño de procesos",
  description:
    "Evalúa un proceso concreto en sus tres capas — propósito, personas y flujo — y conoce su fuga de valor antes de automatizar. Sin costo. Medellín, Colombia.",
  keywords: [
    "diagnóstico de madurez operacional",
    "AI readiness pymes Colombia",
    "automatización de procesos",
    "consultoría BI Medellín",
    "Power Bi",
    "madurez analítica empresas",
    "gap análisis procesos IA",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://yetibi.com/evaluacion",
    siteName: "Yeti BI",
    title: "Evaluación y rediseño de procesos | Yeti BI",
    description:
      "Evalúa un proceso concreto en sus tres capas — propósito, personas y flujo — y conoce su fuga de valor antes de automatizar. Sin costo.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evaluación y rediseño de procesos | Yeti BI",
    description:
      "Evalúa un proceso concreto en sus tres capas antes de automatizar. Sin costo.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://yetibi.com/evaluacion" },
};

export default function Evaluacion() {
  return (
    <>
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
      <Hero />
      <main id="main-content">
        <HowItWorks />
        <ValueFlow />
        <DifferentiatorSection />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
