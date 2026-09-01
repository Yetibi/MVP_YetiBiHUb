import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

// Footer propio de /teach — mismo lenguaje visual que el footer del sitio
// (mismo BrandMark, fondo noche + degradado radial, kickers espaciados), con
// contenido distinto. El correo de la sesión va en la barra inferior.
export function FooterTeach({ email }: { email: string }) {
  return (
    <footer className="teach-footer" role="contentinfo">
      <div className="teach-footer-cols">
        <div className="teach-footer-marca">
          <BrandMark
            className="teach-footer-logo"
            href="/teach"
            ariaLabel="YetiBI Teach — índice"
            symbolWidth={44}
            symbolWidthMobile={36}
            wordmark={{
              className: "font-bold",
              fontSize: 16,
              letterSpacing: 3,
              color: "#F2F6F9",
              dotColor: "#4FD1E0",
              biColor: "#F28F6B",
            }}
          />
          <p className="teach-footer-tagline">
            PROCESS &amp; <span className="an">ANALYTICS</span> · MEDELLÍN
          </p>
          <p className="teach-footer-lema">
            La herramienta predice; el criterio lo pones tú.
          </p>
          <p className="teach-footer-desc">
            Material de capacitación en uso de IA, preparado para los equipos de
            los proyectos que acompañamos.
          </p>
        </div>

        <div className="teach-footer-col">
          <h3>ESTE MATERIAL</h3>
          <Link href="/teach">El recorrido</Link>
          <Link href="/teach">
            Video introductorio<span className="meta">5 MIN</span>
          </Link>
          <span className="teach-footer-soon">
            Guía en PDF<span className="meta">PRÓXIMAMENTE</span>
          </span>
        </div>

        <div className="teach-footer-col">
          <h3>YETI BI</h3>
          <a
            className="externo"
            href="https://yetibi.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir al sitio
          </a>
          <a
            className="externo"
            href="https://yetibi.com/evaluacion"
            target="_blank"
            rel="noopener noreferrer"
          >
            Evaluación de procesos
          </a>
          <a
            className="externo"
            href="https://yetibi.com/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
          >
            Diagnóstico
          </a>
          <a
            className="externo"
            href="https://yetibi.com/powerbi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Servicios <span translate="no">Power BI</span>
          </a>
        </div>

        <div className="teach-footer-col">
          <h3>CONTACTO</h3>
          <a href="mailto:data@yetibi.com">data@yetibi.com</a>
          <span className="teach-footer-info">Medellín, Colombia</span>
        </div>
      </div>

      <div className="teach-footer-lineawrap">
        <div className="teach-footer-linea" />
      </div>

      <div className="teach-footer-barra">
        <p>© Yeti BI 2026 · Medellín, Colombia</p>
        <span className="teach-footer-acceso">
          <span className="punto" aria-hidden="true" /> ACCESO RESTRINGIDO ·{" "}
          {email}
        </span>
      </div>
    </footer>
  );
}
