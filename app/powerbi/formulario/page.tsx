import type { Metadata } from "next";
import { PowerBIIntakeForm } from "@/components/powerbi/PowerBIIntakeForm";

export const metadata: Metadata = {
  title: "Diagnóstico Power BI | Yeti BI",
  description:
    "Agenda tu reunión de diagnóstico de datos y visualización con Yeti BI",
};

export default function PowerBIFormularioPage() {
  return (
    <main style={{ backgroundColor: "#0B1420", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-12">
          <p
            className="font-mono uppercase"
            style={{ color: "#4FD1E0", fontSize: 12, letterSpacing: "0.2em" }}
          >
            SERVICIOS POWER BI
          </p>
          <h1
            className="font-sans font-bold"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(28px, 5vw, 42px)",
              lineHeight: 1.15,
              marginTop: 12,
            }}
          >
            Antes de reunirnos, cuéntanos sobre tu operación
          </h1>
          <p style={{ color: "#5D6B7A", fontSize: 15, marginTop: 16 }}>
            Con esta información llegamos preparados a tu diagnóstico. Toma 3
            minutos.
          </p>
        </div>

        <PowerBIIntakeForm />
      </div>
    </main>
  );
}
