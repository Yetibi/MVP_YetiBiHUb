import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#221B31", paddingTop: 60, paddingBottom: 60 }}
    >
      {/* Main row: 3 columnas */}
      <div className="flex w-full flex-col md:flex-row md:items-start" style={{ gap: 48, marginBottom: 40 }}>

        {/* Izquierda: logo + tagline */}
        <div className="flex flex-col" style={{ gap: 8, minWidth: 180 }}>
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ textDecoration: "none" }}
          >
            <Image
              src="/yeti-logo.png"
              alt="Yeti BI"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
            <span className="font-bold" style={{ color: "#FFFFFF", fontSize: 16, letterSpacing: 3 }}>
              YETI·<span style={{ color: "#E07B30" }}>BI</span>
            </span>
          </Link>
          <p
            className="uppercase tracking-[0.22em]"
            style={{ color: "#A89DC0", fontSize: 11, fontWeight: 400 }}
          >
            PROCESS &amp; <span style={{ color: "#E07B30" }}>ANALYTICS</span> · MEDELLÍN
          </p>
        </div>

        <span className="hidden md:block flex-1" />

        {/* Centro: columna NAVEGACIÓN */}
        <nav aria-label="Pie de página" className="flex flex-col" style={{ gap: 16 }}>
          <p
            className="uppercase tracking-[0.28em]"
            style={{ color: "#A89DC0", fontSize: 11, fontWeight: 400 }}
          >
            NAVEGACIÓN
          </p>
          <a
            href="/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ color: "#C3B9D6", fontSize: 14 }}
          >
            Diagnóstico
          </a>
          <Link
            href="#contacto-form"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ color: "#C3B9D6", fontSize: 14 }}
          >
            Contacto
          </Link>
        </nav>

        {/* Derecha: columna CONTACTO */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <p
            className="uppercase tracking-[0.28em]"
            style={{ color: "#A89DC0", fontSize: 11, fontWeight: 400 }}
          >
            CONTACTO
          </p>
          <a
            href="mailto:data@yetibi.co"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ color: "#C3B9D6", fontSize: 14 }}
          >
            data@yetibi.co
          </a>
        </div>
      </div>

      {/* Divider */}
      <div style={{ backgroundColor: "#453960", height: 1, width: "100%", marginBottom: 24 }} />

      {/* Legal */}
      <p style={{ color: "#A89DC0", fontSize: 12 }}>
        © Yeti BI 2026 · Medellín, Colombia
      </p>
    </footer>
  );
}
