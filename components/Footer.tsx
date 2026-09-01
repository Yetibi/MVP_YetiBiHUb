import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

/* ─────────────────────────────────────────────────────────────────────────────
   Footer único del sitio público — /, /evaluacion, /powerbi, /tesis, /diagnostico.

   Antes había TRES implementaciones del mismo footer (components/home/Footer,
   components/powerbi/Footer y un <footer> inline en S9Acceso), lo que obligaba
   a repetir cada cambio tres veces y dejaba las páginas desincronizadas.

   /teach NO usa este componente: conserva components/teach/FooterTeach porque
   muestra el correo de la sesión y el aviso de acceso restringido, que no
   tienen sentido en el sitio público.

   El logo sale de BrandMark (el componente real, no una copia) y las fuentes
   del sistema de layout.tsx. Estilos: prefijo .sf- en app/globals.css.
   ────────────────────────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="sf" role="contentinfo">
      <div className="sf-wrap sf-cols">
        <div className="sf-marca">
          <BrandMark
            className="sf-logo"
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
          <p className="sf-tagline">
            PROCESS &amp; <span className="an">ANALYTICS</span> · MEDELLÍN
          </p>
        </div>

        <nav className="sf-col" aria-label="Navegación del pie de página">
          <h3>NAVEGACIÓN</h3>
          <Link href="/evaluacion">Evaluación de procesos</Link>
          <Link href="/diagnostico">Diagnóstico</Link>
          <Link href="/powerbi">
            Servicios <span translate="no">Power BI</span>
          </Link>
          {/* Ruta + ancla para que también funcione desde fuera de /evaluacion */}
          <Link href="/evaluacion#contacto-form">Contacto</Link>
        </nav>

        <nav className="sf-col" aria-label="Recursos">
          <h3>RECURSOS</h3>
          <Link href="/tesis">Enfoque</Link>
          <Link href="/teach">Teach</Link>
        </nav>

        <div className="sf-col">
          <h3>CONTACTO</h3>
          <a href="mailto:data@yetibi.com">data@yetibi.com</a>
        </div>
      </div>

      <div className="sf-wrap">
        <div className="sf-linea" />
      </div>

      <div className="sf-wrap sf-barra">
        <p>© Yeti BI 2026 · Medellín, Colombia</p>
        {/* Las páginas legales todavía no existen; se marcan como pendientes en
            vez de dejar enlaces muertos (href="#") que ensucian el SEO y
            confunden al lector. Al publicarlas, reemplazar por <Link>. */}
        <div className="sf-legal">
          <span className="sf-pend">Política de tratamiento de datos · PRÓXIMAMENTE</span>
          <span className="sf-pend">Términos de uso · PRÓXIMAMENTE</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
