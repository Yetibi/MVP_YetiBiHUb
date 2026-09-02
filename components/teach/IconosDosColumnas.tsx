/* ─────────────────────────────────────────────────────────────────────────────
   Íconos del bloque :::dos-columnas — SVG inline, copiados literal del mockup
   Contenido-YetiBI-Teach/_ARCHIVO/diseno/dos-columnas-B.html.

   NO se usa lucide-react (está en el proyecto, pero solo en components/ui:
   checkbox y select). Estos trazos son 1.4–1.5 y siguen el lenguaje del frame
   del video; Lucide dibuja distinto y usa 2px por defecto.

   Se asocian al ítem por el nombre en negrita, normalizado (minúsculas, sin
   tildes, guiones). Así el markdown de las unidades no cambia: sigue siendo
   una lista con "**Nombre** — descripción".

   El color lo hereda del contenedor vía currentColor: cian #4FD1E0 en la
   columna oscura, #B9542F en la clara (el coral puro no pasa contraste sobre
   fondo claro). Todos decorativos: aria-hidden, el texto ya dice todo.
   ────────────────────────────────────────────────────────────────────────── */

type Props = { className?: string };

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 22 22",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  "aria-hidden": true as const,
  focusable: "false" as const,
};

/** Normaliza "**Ordenar lo revuelto**" → "ordenar-lo-revuelto". */
export function claveDeItem(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Cabeceras (34px) ──

export function IconoRutaSana({ className }: Props) {
  return (
    <svg
      width={34} height={34} viewBox="0 0 34 34" fill="none"
      stroke="currentColor" strokeWidth={1.5} className={className}
      aria-hidden focusable="false"
    >
      <path d="M2 24c5 0 5-14 9.5-14S21 24 25.5 24 32 17 32 17" />
    </svg>
  );
}

export function IconoFuga({ className }: Props) {
  return (
    <svg
      width={34} height={34} viewBox="0 0 34 34" fill="none"
      stroke="currentColor" strokeWidth={1.5} className={className}
      aria-hidden focusable="false"
    >
      <path d="M2 24c5 0 5-14 9.5-14S21 24 25.5 24" strokeDasharray="3.5 3.5" />
      <path d="M27 14l6 6M33 14l-6 6" />
    </svg>
  );
}

// ── Ítems (22px) ──

const ICONOS: Record<string, React.ReactElement> = {
  // Columna sana
  redactar: (
    <svg {...base}><path d="M4 3h10l4 4v12H4z" /><path d="M7 10h8M7 14h5" /></svg>
  ),
  resumir: (
    <svg {...base}><path d="M3 5h16M3 9h16M3 13h9M3 17h5" /></svg>
  ),
  reformular: (
    <svg {...base}><path d="M4 7h11l-3-3M18 15H7l3 3" /></svg>
  ),
  "ordenar-lo-revuelto": (
    <svg {...base}>
      <rect x="3" y="3" width="7" height="7" /><rect x="12" y="3" width="7" height="7" />
      <rect x="3" y="12" width="7" height="7" /><rect x="12" y="12" width="7" height="7" />
    </svg>
  ),
  explicar: (
    <svg {...base}><circle cx="11" cy="11" r="8" /><path d="M11 15v-4M11 8h.01" /></svg>
  ),
  "primera-opinion": (
    <svg {...base}><path d="M3 5h16v10H9l-5 4V15H3z" /></svg>
  ),

  // Columna de fuga
  "datos-exactos": (
    <svg {...base}>
      <path d="M4 4h14v14H4z" /><path d="M7 11h8" strokeDasharray="2 2" /><path d="M7 7h4" />
    </svg>
  ),
  aritmetica: (
    <svg {...base}>
      <rect x="4" y="3" width="14" height="16" />
      <path d="M7 7h8M7 12h3M7 15h3M14 12v3M12.5 13.5h3" />
    </svg>
  ),
  "informacion-reciente": (
    <svg {...base}><circle cx="11" cy="11" r="8" /><path d="M11 6v5l3 2" /></svg>
  ),
  "tu-contexto": (
    <svg {...base}>
      <path d="M3 18v-2a4 4 0 014-4h3" /><circle cx="8.5" cy="6" r="3" />
      <path d="M14 10l5 5M19 10l-5 5" />
    </svg>
  ),
};

// Punto neutro: un ítem sin ícono en el mapa no rompe la grilla ni la deja coja.
const NEUTRO = (
  <svg {...base}><circle cx="11" cy="11" r="3.5" /></svg>
);

export function IconoItem({ nombre }: { nombre: string }) {
  return ICONOS[claveDeItem(nombre)] ?? NEUTRO;
}
