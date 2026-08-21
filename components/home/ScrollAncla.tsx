"use client";

import { useEffect } from "react";

// ─── Corrección de anclas en /evaluacion ─────────────────────────────────────
// El hero tiene un pin de 200vh y secciones animadas: el salto nativo al hash
// ocurre ANTES de que el layout se asiente, y el usuario aterriza en una
// sección equivocada. Reintenta el scroll cuando la página ya estabilizó.

export function ScrollAncla() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    };
    const t1 = setTimeout(scroll, 250);
    const t2 = setTimeout(scroll, 900);
    const t3 = setTimeout(scroll, 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return null;
}
