"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const NAVBAR_BTN_EXTRA: React.CSSProperties = {
  letterSpacing: "0.08em",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  whiteSpace: "nowrap",
  flexShrink: 0,
};

export function PowerBINavbar() {
  return (
    <nav
      aria-label="Navegación principal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 78, // sube de 64: el logo apilado mide ~54px y quedaba al ras
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 clamp(16px,4vw,40px)",
        borderBottom: "1px solid rgba(79,209,224,0.08)",
        background: "#0B1420",
        zIndex: 100,
      }}
    >
      {/* Logo apilado: símbolo encima del wordmark, como en el resto del sitio. */}
      <BrandMark
        className="hm-marca"
        symbolWidth={52}
        symbolWidthMobile={44}
        wordmark={{
          // OJO: --font-geist-sans no está definida en layout.tsx (la variable
          // real es --font-sans), así que hoy esto hereda la tipografía del nav.
          // Se deja igual: el wordmark no entra en este cambio.
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13,
          letterSpacing: "3px",
          color: "#fff",
          biColor: "#F28F6B",
        }}
      />

      <Link
        href="/powerbi/formulario"
        aria-label="Agendar diagnóstico — acceso rápido desde el menú"
        className="btn-primary powerbi-navbar-cta text-[10px] sm:text-[11px] px-3 sm:px-4"
        style={NAVBAR_BTN_EXTRA}
      >
        <span className="hidden sm:inline">Agendar diagnóstico</span>
        <span className="sm:hidden">Agendar</span>
      </Link>

    </nav>
  );
}
