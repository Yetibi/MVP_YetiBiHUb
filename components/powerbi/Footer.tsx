import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full px-5 md:px-10 lg:px-20"
      style={{
        background: "linear-gradient(180deg, rgba(79,209,224,0.10) 0%, rgba(79,209,224,0.05) 100%), #0B1420",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      {/* Main row: 3 columnas */}
      <div
        className="flex w-full flex-col md:flex-row md:items-start"
        style={{ gap: 48, marginBottom: 40 }}
      >
        {/* Izquierda: logo + tagline */}
        <div className="flex flex-col" style={{ gap: 8, minWidth: 180 }}>
          <BrandMark
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
            symbolWidth={44}
            symbolWidthMobile={36}
            wordmark={{
              className: "font-bold",
              fontSize: 16,
              letterSpacing: 3,
              color: "#FFFFFF",
              biColor: "#4FD1E0",
            }}
          />
          <p
            className="uppercase tracking-[0.22em]"
            style={{ color: "#5D6B7A", fontSize: 11, fontWeight: 400 }}
          >
            PROCESS &amp; <span style={{ color: "#4FD1E0" }}>ANALYTICS</span> · MEDELLÍN
          </p>
        </div>

        <span className="hidden md:block flex-1" />

        {/* Centro: columna NAVEGACIÓN */}
        <nav aria-label="Pie de página" className="flex flex-col" style={{ gap: 16 }}>
          <p
            className="uppercase tracking-[0.28em]"
            style={{ color: "#5D6B7A", fontSize: 11, fontWeight: 400 }}
          >
            NAVEGACIÓN
          </p>
          <Link
            href="/"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
            style={{ color: "#8B95A5", fontSize: 14 }}
          >
            Inicio
          </Link>
          <a
            href="/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
            style={{ color: "#8B95A5", fontSize: 14 }}
          >
            Diagnóstico
          </a>
          <Link
            href="/powerbi/formulario"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
            style={{ color: "#8B95A5", fontSize: 14 }}
          >
            Evalúa tu proyecto
          </Link>
        </nav>

        {/* Derecha: columna CONTACTO */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <p
            className="uppercase tracking-[0.28em]"
            style={{ color: "#5D6B7A", fontSize: 11, fontWeight: 400 }}
          >
            CONTACTO
          </p>
          <a
            href="mailto:data@yetibi.com"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary)"
            style={{ color: "#8B95A5", fontSize: 14 }}
          >
            data@yetibi.com
          </a>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          height: 1,
          width: "100%",
          marginBottom: 24,
        }}
      />

      {/* Legal */}
      <p style={{ color: "#5D6B7A", fontSize: 12 }}>
        © Yeti BI 2026 · Medellín, Colombia
      </p>
    </footer>
  );
}
