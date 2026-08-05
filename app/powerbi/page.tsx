import type { Metadata } from "next";
import { PowerBINavbar } from "@/components/powerbi/PowerBINavbar";
import HeroSection from "@/components/powerbi/HeroSection";
import PainSection from "@/components/powerbi/PainSection";
import DifferentiatorSection from "@/components/powerbi/DifferentiatorSection";
import PreProcessSection from "@/components/powerbi/PreProcessSection";
import ExecutionSection from "@/components/powerbi/ExecutionSection";
import GallerySection from "@/components/powerbi/GallerySection";
import FormSection from "@/components/powerbi/FormSection";
import { Footer } from "@/components/powerbi/Footer";

export const metadata: Metadata = {
  title: "Consultoría Power BI Colombia | Procesos Primero",
  description:
    "Construimos sistemas de decisión que van más allá del dashboard. Diagnóstico operacional sin costo. Medellín, Bogotá, Cali.",
  keywords: [
    "consultoría power bi colombia",
    "procesos power bi",
    "dashboards operacionales",
    "sistemas de decisión",
    "power bi bogotá",
    "power bi medellín",
    "power bi cali",
  ],
  alternates: { canonical: "https://yetibi.com/powerbi" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://yetibi.com/powerbi",
    siteName: "Yeti BI",
    title: "Consultoría Power BI Colombia | Procesos Primero | Yeti BI",
    description:
      "Construimos sistemas de decisión que van más allá del dashboard. Diagnóstico operacional sin costo.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consultoría Power BI Colombia | Procesos Primero | Yeti BI",
    description:
      "Construimos sistemas de decisión que van más allá del dashboard.",
    images: ["/og-image.png"],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Yeti BI - Consultoría Power BI",
  description:
    "Construimos sistemas de decisión que van más allá del dashboard. Procesos antes que herramientas.",
  url: "https://yetibi.com/powerbi",
  email: "data@yetibi.com",
  areaServed: ["Bogotá", "Medellín", "Cali", "Colombia"],
  knowsAbout: [
    "Power BI",
    "Business Intelligence",
    "Análisis de datos",
    "Optimización de procesos",
  ],
};

export default function PowerBIPage() {
  return (
    <main className="relative w-full" style={{ backgroundColor: "#0E0B14" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Grid pattern de fondo */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(circle at 65% 40%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 65% 40%, black 0%, transparent 70%)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 35%, rgba(242,143,107,0.07) 0%, transparent 55%)",
        }}
      />

      <PowerBINavbar />

      <div className="relative w-full">
        <HeroSection />
        <PainSection />
        <DifferentiatorSection />
        <PreProcessSection />
        <ExecutionSection />
        <GallerySection />
        <FormSection />
      </div>

      <Footer />
    </main>
  );
}