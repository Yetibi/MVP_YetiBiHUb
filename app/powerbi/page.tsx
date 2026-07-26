import type { Metadata } from "next";
import { PowerBINavbar } from "@/components/powerbi/PowerBINavbar";
import HeroSection from "@/components/powerbi/HeroSection";
import PainSection from "@/components/powerbi/PainSection";

export const metadata: Metadata = {
  title: "Servicios Power BI | Yeti BI",
  description:
    "Diagnóstico, diseño y construcción de proyectos de visualización y análisis de datos. Evaluación de viabilidad sin costo.",
};

export default function PowerBIPage() {
  return (
    <main className="relative w-full" style={{ backgroundColor: "#0E0B14" }}>
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
            "radial-gradient(circle at 70% 35%, rgba(224,123,48,0.07) 0%, transparent 55%)",
        }}
      />

      <PowerBINavbar />

      <div className="relative w-full">
        <HeroSection />
        <PainSection />
      </div>
    </main>
  );
}
