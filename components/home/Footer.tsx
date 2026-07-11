import Link from "next/link";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#221B31", paddingTop: 40, paddingBottom: 40 }}
    >
      <div className="flex flex-col" style={{ gap: 24 }}>
        {/* Main row: logo · spacer · links */}
        <div className="flex w-full items-center flex-wrap gap-6">
          <Link
            href="/"
            className="font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ color: "#FFFFFF", fontSize: 16, letterSpacing: 3 }}
          >
            YETI BI
          </Link>

          <span className="flex-1" />

          <nav aria-label="Pie de página" className="flex items-center flex-wrap" style={{ gap: 24 }}>
            <Link
              href="/diagnostico"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              style={{ color: "#C3B9D6", fontSize: 14 }}
            >
              Diagnóstico
            </Link>
            <Link
              href="/contacto"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              style={{ color: "#C3B9D6", fontSize: 14 }}
            >
              Contacto
            </Link>
            <a
              href="mailto:data@yetibi.co"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              style={{ color: "#A89EC0", fontSize: 14 }}
            >
              data@yetibi.co
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div style={{ backgroundColor: "#453960", height: 1, width: "100%" }} />

        {/* Legal */}
        <p style={{ color: "#A89EC0", fontSize: 12 }}>
          © Yeti BI 2026 · Medellín, Colombia
        </p>
      </div>
    </footer>
  );
}
