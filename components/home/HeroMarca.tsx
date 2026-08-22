"use client";

import { useEffect, useRef, useState, useId } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BrandMark } from "@/components/BrandMark";

// ─── Héroe del Home de marca ─────────────────────────────────────────────────
// Video protagonista (Yeti-constelación), nav mínima, kicker y titular.
// Declarativo: sin CTA. Lógica cromática intencional — cian = lo ya resuelto
// (construir es fácil), salmón = el diferencial (el criterio).
// Estilos en globals.css (bloque "Hero de marca").

const VIDEO = "/video/hero-yeti-red-neuronal.mp4";
const POSTER = "/video/hero-yeti-red-neuronal-poster.jpg";

const NAV_LINKS = [
  { label: "El marco", href: "/tesis" },
  { label: "Las 3 capas", href: "#capas" },
  { label: "SOI", href: "#soi" },
  // Restaurar "Resultados" (#resultados) en nav al reactivar S8
  { label: "Contacto", href: "#contacto" },
];

export function HeroMarca() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Menú móvil. Los enlaces del nav se ocultan bajo 768px, así que sin esto
  // el botón no llevaba a ningún lado.
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAbierto) return;

    // Escape cierra y devuelve el foco al botón, que es de donde vino.
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuAbierto(false);
        burgerRef.current?.focus();
      }
    };
    // Tocar fuera cierra. pointerdown y no click: en iOS el click sobre un
    // elemento no interactivo puede no propagarse.
    const alApuntar = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !burgerRef.current?.contains(t)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alApuntar);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alApuntar);
    };
  }, [menuAbierto]);

  // iOS puede bloquear el autoplay (Low Power Mode, o si la propiedad muted
  // no está seteada al momento del intento) y muestra el botón de play.
  // Fix: asegurar muted como PROPIEDAD y llamar play() al montar, con
  // reintento en la primera interacción.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reducedMotion) return;
    v.muted = true;
    v.defaultMuted = true;
    const intentar = () => v.play().catch(() => {});
    intentar();
    const alTocar = () => intentar();
    window.addEventListener("touchstart", alTocar, { once: true, passive: true });
    window.addEventListener("click", alTocar, { once: true });
    return () => {
      window.removeEventListener("touchstart", alTocar);
      window.removeEventListener("click", alTocar);
    };
  }, [reducedMotion]);

  return (
    <section id="criterio-escaso" className="hm-section" aria-label="Yeti BI — Ingeniería de procesos en la era de la IA">
      {/* Fondo: video (o poster estático con movimiento reducido) */}
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hm-video" src={POSTER} alt="" aria-hidden="true" />
      ) : (
        <video
          ref={videoRef}
          className="hm-video"
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          aria-hidden="true"
        />
      )}

      {/* Gradientes de legibilidad (inferior + viñeta) */}
      <div className="hm-veil" aria-hidden="true" />

      {/* Nav superpuesta, sin fondo ni CTA (deliberado) */}
      <nav className="hm-nav" aria-label="Navegación principal">
        <BrandMark
          // Wordmark más grande que en los otros headers (15–17px vs 13px),
          // así que el símbolo sube a 38 para no perder peso al lado.
          symbolWidth={38}
          symbolWidthMobile={30}
          wordmark={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(15px, 1.2vw, 17px)",
            letterSpacing: ".14em",
            color: "#F2F6F9",
            dotColor: "#4FD1E0",
            biColor: "var(--salmon)",
          }}
        />

        <div className="hm-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} className="hm-link" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Menú móvil */}
        <button
          ref={burgerRef}
          className={menuAbierto ? "hm-burger abierto" : "hm-burger"}
          type="button"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls={menuId}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div
          id={menuId}
          ref={menuRef}
          className={menuAbierto ? "hm-menu abierto" : "hm-menu"}
          hidden={!menuAbierto}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              className="hm-menu-link"
              href={l.href}
              onClick={() => setMenuAbierto(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
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
