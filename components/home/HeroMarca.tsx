"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── Héroe del Home de marca ─────────────────────────────────────────────────
// Video protagonista (Yeti-constelación), nav mínima, kicker y titular.
// Declarativo: sin CTA. Lógica cromática intencional — cian = lo ya resuelto
// (construir es fácil), salmón = el diferencial (el criterio).
// Estilos en globals.css (bloque "Hero de marca").

const VIDEO = "/video/hero-yeti-red-neuronal.mp4";
const POSTER = "/video/hero-yeti-red-neuronal-poster.jpg";

const NAV_LINKS = [
  { label: "La tesis", href: "#tesis" },
  { label: "Las 3 capas", href: "#capas" },
  { label: "SOI", href: "#soi" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
];

export function HeroMarca() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="criterio-escaso" className="hm-section" aria-label="Yeti BI — Ingeniería de procesos en la era de la IA">
      {/* Fondo: video (o poster estático con movimiento reducido) */}
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hm-video" src={POSTER} alt="" aria-hidden="true" />
      ) : (
        <video
          className="hm-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          aria-hidden="true"
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Gradientes de legibilidad (inferior + viñeta) */}
      <div className="hm-veil" aria-hidden="true" />

      {/* Nav superpuesta, sin fondo ni CTA (deliberado) */}
      <nav className="hm-nav" aria-label="Navegación principal">
        <span
          translate="no"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            fontSize: "clamp(15px, 1.2vw, 17px)",
            letterSpacing: ".14em",
            color: "#F2F6F9",
          }}
        >
          YETI<span style={{ color: "#4FD1E0" }}>·</span>
          <span style={{ color: "var(--salmon)" }}>BI</span>
        </span>

        <div className="hm-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} className="hm-link" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Menú móvil: botón preparado — el desplegable llega después */}
        <button className="hm-burger" type="button" aria-label="Abrir menú">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      {/* Kicker */}
      <p className="hm-kicker">
        PRIMERO EL PROCESO · DESPUÉS LA <span className="hm-ia">IA</span>
      </p>

      {/* Titular */}
      <div className="hm-titular">
        <div className="hm-titular-inner">
          <p className="hm-linea-a">
            Hoy, cuando <strong>construir con IA es cada vez más fácil,</strong>
          </p>
          <h1 className="hm-linea-b">
            lo escaso ya no es la herramienta.
            <br />
            Es <span className="hm-criterio">el criterio</span> para usarla bien.
          </h1>
        </div>
        <span className="hm-scroll" aria-hidden="true">
          DESLIZA ↓
        </span>
      </div>
    </section>
  );
}
