"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S2 · La ley de amplificación ────────────────────────────────────────────
// Split asimétrico 62/38 + bloque de inversión animado (una sola vez, con
// pausa deliberada entre paneles para que la inversión se lea). Sin cifras
// impresas en las barras: son proporciones relativas, no un dato.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

// Anchos relativos de las barras (sin porcentajes visibles)
const LARGA = "82%";
const CORTA = "24%";

interface BarraProps {
  ancho: string;
  delay: number;
  visible: boolean;
  reduced: boolean;
  acc?: boolean;
}

function Barra({ ancho, delay, visible, reduced, acc }: BarraProps) {
  return (
    <div
      className="s2-bar"
      aria-hidden="true"
      style={{
        width: reduced || visible ? ancho : "0%",
        background: acc ? "var(--salmon)" : "rgba(139,149,165,.45)",
        boxShadow: acc ? "0 4px 12px rgba(242,143,107,.2)" : "none",
        transition: reduced ? "none" : `width .6s ${EASE} ${delay}ms`,
      }}
    />
  );
}

export function S2Amplificacion() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true; // una sola vez — no en bucle ni al volver
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="tesis" className="hs-section hs-bg-noche s2sec">
      <div className="hs-wrap">
        <p className="hs-kicker">LA LEY DE AMPLIFICACIÓN</p>
        <h2 className="hs-h2">
          La IA no es un filtro. Es un <span className="acc">megáfono.</span>
        </h2>
        <p className="hs-bajada">
          <span className="s2-desk">
            No purifica lo que le entregas. Lo repite más fuerte, más rápido y
            con más convicción. No puede adivinar la intención detrás de un dato
            mal capturado — solo puede propagarlo.
          </span>
          <span className="s2-mov">
            No purifica lo que le entregas. Lo repite más fuerte y más rápido.
          </span>
        </p>

        {/* Columnas asimétricas 62/38 — la asimetría es el argumento */}
        <div className="s2-split">
          {/* Ancha: el músculo */}
          <div>
            <p className="s2-tag">EL MÚSCULO TRANSACCIONAL</p>
            <div className="s2-desk">
              <p className="s2-txt">
                Consolidar, extraer y procesar datos dispersos entre sistemas
                que no se hablan. Ahí la IA es imbatible: escala y velocidad que
                ninguna estructura humana alcanza.
              </p>
              <p className="s2-txt">
                Pero un mal proceso ejecutado por una persona es un problema
                local. <strong>El mismo proceso ejecutado por IA es un desastre
                escalable.</strong>
              </p>
            </div>
            <p className="s2-txt s2-mov">Consolidar y procesar. Ahí es imbatible.</p>
          </div>

          <div className="hs-split-div" aria-hidden="true" />

          {/* Angosta: la semilla — poco espacio, mucha densidad */}
          <div className="s2-caja">
            <p className="s2-tag acc">LA SEMILLA DEL CRITERIO</p>
            <div className="s2-desk">
              <p className="s2-txt">
                El juicio, la visión sistémica y la responsabilidad no se
                delegan.
              </p>
              <p className="s2-txt">
                La IA no genera criterio: <strong>multiplica el que recibe.</strong>
              </p>
            </div>
            <p className="s2-txt s2-mov">
              No genera criterio: <strong>multiplica el que recibe.</strong>
            </p>
          </div>
        </div>

        {/* Bloque de inversión */}
        <div
          role="img"
          aria-label="Hoy: la mayor parte del tiempo se dedica a producir. Después del rediseño: la mayor parte se dedica a pensar."
        >
          <div className="s2-panes">
            {/* HOY */}
            <div>
              <p className="s2-pane-tag">HOY</p>
              <div className="s2-bar-row">
                <span className="s2-bar-label">producir</span>
                <Barra ancho={LARGA} delay={0} visible={visible} reduced={reduced} />
              </div>
              <div className="s2-bar-row">
                <span className="s2-bar-label">pensar</span>
                <Barra ancho={CORTA} delay={120} visible={visible} reduced={reduced} />
              </div>
            </div>

            {/* Flecha */}
            <span
              className="s2-flecha"
              aria-hidden="true"
              style={{
                opacity: reduced || visible ? 1 : 0,
                transitionDelay: reduced ? "0ms" : "480ms",
              }}
            >
              →
            </span>

            {/* DESPUÉS */}
            <div>
              <p className="s2-pane-tag acc">DESPUÉS DEL REDISEÑO</p>
              <div className="s2-bar-row">
                <span className="s2-bar-label">pensar</span>
                <Barra ancho={LARGA} delay={520} visible={visible} reduced={reduced} acc />
              </div>
              <div className="s2-bar-row">
                <span className="s2-bar-label">producir</span>
                <Barra ancho={CORTA} delay={640} visible={visible} reduced={reduced} acc />
              </div>
            </div>
          </div>
          <p className="s2-pie">
            EL REDISEÑO NO LIBERA HORAS — CAMBIA A QUÉ SE DEDICAN
          </p>
        </div>

        {/* Cita de cierre */}
        <div className="s2-cita">
          <span className="s2-desk">
            Si la semilla es pobre, la IA entrega{" "}
            <strong>basura maravillosamente consolidada</strong>: ordenada,
            veloz, convincente y equivocada.
          </span>
          <span className="s2-mov">
            <strong>basura maravillosamente consolidada</strong>: ordenada,
            veloz, convincente y equivocada.
          </span>
        </div>

        <p className="hs-apertura">¿Qué va a encontrar la IA en tu operación?</p>
      </div>
    </section>
  );
}
