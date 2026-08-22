import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Marca Yeti BI — símbolo + wordmark.

   Un solo lugar para las tres páginas (/, /evaluacion, /powerbi) y los dos
   footers. Antes cada header traía su propia copia del logo.

   El símbolo es el de Plano Glaciar (kit-web/svg/simbolo-transparente.svg).
   Va inline y no como <img> por dos razones:
     1. El SVG del kit tiene viewBox cuadrado (0 0 200 200) pero el dibujo
        ocupa sólo la banda horizontal x≈20–182, y≈74–126. Servido como <img>
        a 36px de ancho, la tinta real mediría ~29px y arrastraría ~11px de
        aire arriba y abajo. Acá se recorta el viewBox a la caja real del
        trazo — misma geometría, sin reencuadre a ojo.
     2. Permite conmutar la paleta (dark/light) sin un segundo archivo.

   El wordmark NO se unifica a propósito: hoy las cinco instancias difieren
   entre sí (tipografía, tamaño, color del punto medio y del "BI") y el
   encargo dice que el wordmark queda exactamente como está. Cada llamada
   pasa sus valores actuales. Lo que sí queda centralizado es la estructura
   YETI · BI, que es lo que habría que corregir tres veces.

   NO usar el wordmark de la "E" intervenida que trae kit-web/html/ —
   es una decisión pendiente.
   ────────────────────────────────────────────────────────────────────────── */

type Variant = "dark" | "light";

const PALETA: Record<Variant, {
  onda: string; puntos: string; pila: string; flecha: string; cola: string;
}> = {
  // Sobre fondo noche #0B1420 — símbolo a color.
  dark:  { onda: "#8B95A5", puntos: "#E07B30", pila: "#F2F6F9", flecha: "#4FD1E0", cola: "#E07B30" },
  // Sobre fondo claro — mono, salvo la cola que conserva el naranja.
  light: { onda: "#0B1420", puntos: "#0B1420", pila: "#0B1420", flecha: "#0B1420", cola: "#E07B30" },
};

export function BrandSymbol({
  variant = "dark",
  className = "bm-sym",
}: {
  variant?: Variant;
  className?: string;
}) {
  const c = PALETA[variant];
  return (
    <svg
      // Caja real del trazo, no el lienzo cuadrado del archivo original.
      viewBox="19 73 164 54"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Onda decreciente — el proceso antes de ordenarse */}
      <path d="M24 100 C30 68 40 78 47 100" fill="none" stroke={c.onda} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M47 100 C51 126 60 114 65 100" fill="none" stroke={c.onda} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M65 100 C69 86 75 94 80 100 C83 103 85 98 88 100" fill="none" stroke={c.onda} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="100" r="3.6" fill={c.puntos} />
      <circle cx="47" cy="100" r="3" fill={c.puntos} />
      <circle cx="65" cy="100" r="2.4" fill={c.puntos} />

      {/* Pila central — los datos alineados */}
      <circle cx="98.5" cy="76" r="1.9" fill={c.pila} />
      <circle cx="98.5" cy="88" r="2.65" fill={c.pila} />
      <circle cx="98.5" cy="100" r="3.4" fill={c.pila} />
      <circle cx="98.5" cy="112" r="2.65" fill={c.pila} />
      <circle cx="98.5" cy="124" r="1.9" fill={c.pila} />

      {/* Salida — criterio y dirección */}
      <path d="M112 76 L134 100 L112 124" fill="none" stroke={c.flecha} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="134" y1="100" x2="160" y2="100" stroke={c.flecha} strokeWidth="3" strokeLinecap="round" />
      <line x1="168" y1="100" x2="180" y2="100" stroke={c.cola} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export type WordmarkStyle = {
  fontFamily?: string;
  fontWeight?: CSSProperties["fontWeight"];
  fontSize: CSSProperties["fontSize"];
  letterSpacing: CSSProperties["letterSpacing"];
  /** Color de "YETI" y, si no se pasa dotColor, también del punto medio. */
  color: string;
  /** Punto medio. Omitir para que herede `color` (así está hoy en /powerbi). */
  dotColor?: string;
  /** Acento de cada página: coral en /evaluacion y /powerbi, cian en el footer PBI. */
  biColor: string;
  className?: string;
};

export type BrandMarkProps = {
  wordmark: WordmarkStyle;
  variant?: Variant;
  showSymbol?: boolean;
  href?: string;
  /** Ancho del símbolo en desktop. Alto ≈ ancho / 3. */
  symbolWidth?: number;
  /** Ancho en ≤768px. */
  symbolWidthMobile?: number;
  gap?: number;
  gapMobile?: number;
  className?: string;
  style?: CSSProperties;
  /** Sólo hace falta si el wordmark queda oculto en algún breakpoint. */
  ariaLabel?: string;
  children?: ReactNode;
};

export function BrandMark({
  wordmark,
  variant = "dark",
  showSymbol = true,
  href = "/",
  symbolWidth = 36,
  symbolWidthMobile = 28,
  gap = 12,
  gapMobile = 10,
  className,
  style,
  ariaLabel,
  children,
}: BrandMarkProps) {
  const vars = {
    "--bm-sym-w": `${symbolWidth}px`,
    "--bm-sym-w-m": `${symbolWidthMobile}px`,
    "--bm-gap": `${gap}px`,
    "--bm-gap-m": `${gapMobile}px`,
    ...style,
  } as CSSProperties;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className ? `bm ${className}` : "bm"}
      style={vars}
    >
      {showSymbol && <BrandSymbol variant={variant} />}
      <span
        translate="no"
        className={wordmark.className}
        style={{
          fontFamily: wordmark.fontFamily,
          fontWeight: wordmark.fontWeight ?? 700,
          fontSize: wordmark.fontSize,
          letterSpacing: wordmark.letterSpacing,
          color: wordmark.color,
        }}
      >
        YETI
        <span style={wordmark.dotColor ? { color: wordmark.dotColor } : undefined}>·</span>
        <span style={{ color: wordmark.biColor }}>BI</span>
      </span>
      {children}
    </Link>
  );
}

export default BrandMark;
