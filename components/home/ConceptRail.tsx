"use client";

import { useEffect, useState } from "react";
import { SECCIONES_HOME } from "@/lib/home-sections";

// ─── Raíl de conceptos — la firma del Home ───────────────────────────────────
// Índice de la doctrina, fijo a la izquierda (≥1000px). Quien scrollea el Home
// sale habiendo visto el marco completo aunque no lea todo. No es una barra
// de progreso.
// La lista vive en lib/home-sections.ts, compartida con el header.

const ITEMS = SECCIONES_HOME;

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
          {i.railLabel}
        </a>
      ))}
    </nav>
  );
}
