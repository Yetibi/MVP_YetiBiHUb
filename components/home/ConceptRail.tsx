"use client";

import { useEffect, useState } from "react";

// ─── Raíl de conceptos — la firma del Home ───────────────────────────────────
// Índice de la doctrina, fijo a la izquierda (≥1000px). Quien scrollea el Home
// sale habiendo visto el marco completo aunque no lea todo. No es una barra
// de progreso.

const ITEMS = [
  { n: "01", label: "Criterio escaso", id: "criterio-escaso" },
  { n: "02", label: "Ley de amplificación", id: "tesis" },
  { n: "03", label: "Sistema de decisión · 3 capas", id: "capas" },
  { n: "04", label: "Piloto automático", id: "piloto-automatico" },
  { n: "05", label: "Asimetría competitiva", id: "asimetria" },
  { n: "06", label: "Secuencia · 6 dimensiones", id: "metodo" },
  { n: "07", label: "SOI", id: "soi" },
  { n: "08", label: "Acceso", id: "contacto" },
];

export function ConceptRail() {
  const [activa, setActiva] = useState("criterio-escaso");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiva(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ITEMS.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hs-rail" aria-label="Conceptos del marco">
      {ITEMS.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={activa === i.id ? "activa" : ""}>
          <span className="n">{i.n}</span>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
