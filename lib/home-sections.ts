// ─── Secciones del Home de marca ─────────────────────────────────────────────
// Fuente única para el raíl de conceptos (ConceptRail) y la navegación del
// header (HeroMarca). Antes cada uno tenía su propia lista y el header solo
// cubría 3 de las 8 secciones.
//
// Dos juegos de etiquetas a propósito:
//   railLabel — el raíl es un índice de la doctrina y tiene sitio para el
//               nombre completo del concepto.
//   navLabel  — el header es una fila horizontal; los nombres largos no caben
//               sin apretar el resto.
//
// El orden es el de lectura del Home. `n` numera la doctrina, no el DOM.
// S8Evidencia (#resultados) está desactivada en app/page.tsx: cuando se
// reactive, va entre soi y contacto con n "08" y hay que renumerar Acceso.

export type SeccionHome = {
  n: string;
  id: string;
  railLabel: string;
  navLabel: string;
};

export const SECCIONES_HOME: SeccionHome[] = [
  { n: "01", id: "criterio-escaso",   railLabel: "Criterio escaso",               navLabel: "Criterio" },
  { n: "02", id: "tesis",             railLabel: "Ley de amplificación",          navLabel: "Amplificación" },
  { n: "03", id: "capas",             railLabel: "Sistema de decisión · 3 capas", navLabel: "3 capas" },
  { n: "04", id: "piloto-automatico", railLabel: "Piloto automático",             navLabel: "Piloto automático" },
  { n: "05", id: "asimetria",         railLabel: "Asimetría competitiva",         navLabel: "Asimetría" },
  { n: "06", id: "metodo",            railLabel: "Secuencia · 6 dimensiones",     navLabel: "Método" },
  { n: "07", id: "soi",               railLabel: "SOI",                           navLabel: "SOI" },
  { n: "08", id: "contacto",          railLabel: "Acceso",                        navLabel: "Acceso" },
];
