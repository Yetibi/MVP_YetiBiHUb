import type { Metadata } from "next";
import type { ReactNode } from "react";

// Herramienta interna, no contenido: fuera de buscadores y del sitemap.
// El metadata vive acá porque page.tsx es un componente de cliente.
export const metadata: Metadata = {
  title: "Excluir este navegador de la analítica",
  robots: { index: false, follow: false },
};

export default function NoMedirLayout({ children }: { children: ReactNode }) {
  return children;
}
