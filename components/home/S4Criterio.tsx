"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S4 · El criterio aplicado — el flujo que se frena ───────────────────────
// La línea (el proceso automatizado avanzando) recorre y FRENA en seco al
// llegar a la primera tarjeta de factor. El easing con desaceleración fuerte
// al final ES la sensación de frenado — sin fade de salida, sin bucle.
// Lectura, no formulario: cero interactividad de cuestionario.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

const FACTORES = [
  {
    lbl: "FACTOR 01",
    pregunta: "¿Requiere criterio que no se puede escribir en reglas?",
    cuerpo: "Juicios de valor que dependen del contexto, no de un patrón.",
  },
  {
    lbl: "FACTOR 03",
    pregunta: "¿Alguien tiene que responder por el resultado?",
    cuerpo:
      "Pasos con consecuencias éticas, legales o comerciales que exigen un responsable con nombre.",
  },
];

export function S4Criterio() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  const zonaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = zonaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true; // una sola vez — sin repetición al volver
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mostrar = reduced || visible;

  const lineaStyle: CSSProperties = {
    ["--s4-run" as string]: mostrar ? "120px" : "0px",
    ["--s4-run-v" as string]: mostrar ? "130px" : "0px",
    transition: reduced ? "none" : `width .7s ${EASE}, height .7s ${EASE}`,
  };

  const frenoStyle: CSSProperties = {
    opacity: mostrar ? 1 : 0,
    transition: reduced ? "none" : "opacity .2s ease 650ms",
  };

  const veredictoStyle = (i: number): CSSProperties => ({
    opacity: mostrar ? 1 : 0,
    transform: mostrar ? "translateY(0)" : "translateY(6px)",
    transition: reduced
      ? "none"
      : `opacity .4s ${EASE} ${900 + i * 120}ms, transform .4s ${EASE} ${900 + i * 120}ms`,
  });

  return (
    <section id="piloto-automatico" className="hs-section hs-bg-noche s4sec">
      <div className="hs-wrap">
        <p className="hs-kicker">EL 20% IRREEMPLAZABLE</p>
        <h2 className="hs-h2">
          Lo que no se puede automatizar es lo único que la competencia{" "}
          <span className="acc">no te puede copiar.</span>
        </h2>
        <p className="hs-bajada" style={{ maxWidth: 640 }}>
          <span className="s4-desk">
            Tu competidor puede comprar la misma herramienta que tú, mañana, al
            mismo precio. Lo que no puede comprar es el criterio con el que la
            usas. Por eso definir dónde se detiene la máquina no es una
            restricción — es donde queda tu ventaja.
          </span>
          <span className="s4-mov">
            Tu competidor puede comprar la misma herramienta mañana, al mismo
            precio. Lo que no puede comprar es el criterio con el que la usas.
          </span>
        </p>

        <div className="s4-cuerpo">
          <p className="s4-desk">
            La IA absorbe el volumen: consolidar, estructurar, procesar. Eso
            libera al profesional de ser{" "}
            <strong style={{ color: "#8B95A5", fontWeight: 500 }}>
              productor de datos
            </strong>{" "}
            para volverlo{" "}
            <strong style={{ color: "#4FD1E0", fontWeight: 500 }}>
              editor de decisiones.
            </strong>
          </p>
          <p>
            <span className="s4-desk">
              Pero un paso solo opera en piloto automático si pasa el filtro
              completo.{" "}
            </span>
            <span className="s4-mov">
              Un paso solo opera en piloto automático si pasa el filtro
              completo.{" "}
            </span>
            <strong style={{ color: "#F2F6F9", fontWeight: 500 }}>
              Un solo SÍ obliga a mantener a una persona en el flujo.
            </strong>
          </p>
        </div>

        {/* Zona animada: línea de proceso que frena en el primer factor */}
        <div className="s4-zona" ref={zonaRef}>
          <span className="s4-linea" aria-hidden="true" style={lineaStyle} />
          <span className="s4-freno" aria-hidden="true" style={frenoStyle} />

          <ul className="s4-lista hs-grid3">
            {FACTORES.map((f, i) => (
              <li key={f.lbl} className="s4-card">
                <p className="s4-lbl">{f.lbl}</p>
                <p className="s4-preg">{f.pregunta}</p>
                <p className="s4-body">{f.cuerpo}</p>
                <p className="s4-veredicto" style={veredictoStyle(i)}>
                  SÍ · HUMANO EN EL FLUJO
                </p>
              </li>
            ))}
            <li>
              <a className="s4-link" href="/tesis" style={{ height: "100%" }}>
                <span>+ 3 FACTORES</span>
                <span>VER EL MARCO COMPLETO →</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Cierre */}
        <div className="s4-cierre">
          Automatizar de más es fácil. Saber dónde detenerse exige conocer el
          negocio — y eso no viene en ninguna licencia.
        </div>

        <p className="hs-apertura">
          ¿Qué decisiones de tu operación no deberían tomarse sin una persona?
        </p>
      </div>
    </section>
  );
}
