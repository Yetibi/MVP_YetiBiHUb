"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S2 · La ley de amplificación ────────────────────────────────────────────
// Cuatro bloques: kicker, titular, el diagrama de inversión y una frase de
// cierre. El diagrama ya era el argumento; la bajada, las dos columnas
// (músculo transaccional / semilla del criterio) y la pregunta final lo
// repetían en prosa y la sección pedía leer 22 cosas. Ese texto no se
// perdió: vive en /tesis, sección 1, que es donde va quien quiere el
// desarrollo. La animación corre una sola vez, con pausa deliberada entre
// paneles para que la inversión se lea. Sin cifras impresas en las barras:
// son proporciones relativas, no un dato.

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

        {/* Bloque de inversión — el argumento entero, dibujado */}
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
        </div>

        {/* Cierre — una sola frase, la que se recuerda */}
        <p className="s2-cierre">
          Si la semilla es pobre, entrega{" "}
          <strong>basura maravillosamente consolidada.</strong>
        </p>
      </div>
    </section>
  );
}
