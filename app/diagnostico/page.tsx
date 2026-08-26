import type { Metadata } from "next";
import { IntakeForm } from "@/components/intake/IntakeForm";

// ─── SEO propio: antes heredaba el metadata del layout y canonizaba a la
// home, lo que la sacaba del índice y contaminaba las señales de la raíz. ───
export const metadata: Metadata = {
  title: "Evalúa tu proceso — diagnóstico sin costo",
  description:
    "Cuéntanos un proceso concreto en 8 pasos y recibe por correo su diagnóstico de aptitud para IA, revisado por un ingeniero. Sin costo.",
  alternates: { canonical: "https://yetibi.com/diagnostico" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://yetibi.com/diagnostico",
    siteName: "Yeti BI",
    title: "Evalúa tu proceso — diagnóstico sin costo | Yeti BI",
    description:
      "Cuéntanos un proceso concreto en 8 pasos y recibe su diagnóstico de aptitud para IA, revisado por un ingeniero.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function DiagnosticoPage() {
  return (
    <IntakeForm />
  );
}
