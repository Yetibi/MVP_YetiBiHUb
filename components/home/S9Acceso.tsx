"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S9 · Acceso — origen + tres puertas + footer ────────────────────────────
// Sin foto ni biografía (registro de cuerpo doctrinal, no de consultor):
// el origen se afirma en tres líneas y el enlace al marco responde mejor
// que un currículum. Solo la puerta 1 lleva botón sólido — es la única
// ruta sin cuello de botella. Última sección: sin pregunta de apertura.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

const PUERTAS = [
  {
    lbl: "AUTOSERVICIO",
    titulo: "Evaluar un proceso",
    cuerpo:
      "Una evaluación estructurada de las tres capas de un proceso concreto, con la fuga cuantificada en pesos.",
    cta: "EMPEZAR →",
    href: "/evaluacion",
    primaria: true,
  },
  {
    lbl: "SERVICIO",
    titulo: "Inteligencia de negocio",
    cuerpo:
      "Modelos de datos y tableros construidos sobre procesos que ya funcionan.",
    cta: "VER POWER BI →",
    href: "/powerbi",
    primaria: false,
  },
  {
    lbl: "CONVERSACIÓN",
    titulo: "Diseñar un SOI",
    cuerpo:
      "Para operaciones completas, no procesos sueltos. Empieza con una conversación, no con una propuesta.",
    cta: "HABLEMOS →",
    href: "/evaluacion#contacto-form",
    primaria: false,
  },
];

export function S9Acceso() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  const puertasRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = puertasRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true; // una sola vez
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

  const puertaStyle = (i: number): CSSProperties => ({
    opacity: mostrar ? 1 : 0,
    transform: mostrar ? "translateY(0)" : "translateY(10px)",
    transition: reduced
      ? "none"
      : `opacity .6s ${EASE} ${i * 90}ms, transform .6s ${EASE} ${i * 90}ms`,
  });

  return (
    <>
      <section id="contacto" className="hs-section hs-bg-acero2 s9sec" style={{ borderBottom: "none" }}>
        <div className="hs-wrap">
          {/* Origen — sin kicker, sin foto, sin biografía */}
          <p className="s9-origen">
            Yeti BI nace de la <strong>ingeniería de producción</strong>, no del
            marketing de tecnología. El marco de esta página es el que
            aplicamos: mismos criterios, mismo orden, misma vara de medición.
          </p>
          <span className="s9-origen-link">
            <a className="hs-link cian" href="/tesis">
              EL MARCO COMPLETO →
            </a>
          </span>

          {/* Tres puertas — la primera pesa más, deliberadamente */}
          <ul className="s9-puertas" ref={puertasRef}>
            {PUERTAS.map((p, i) => (
              <li
                key={p.lbl}
                className={`s9-puerta${p.primaria ? " primaria" : ""}`}
                style={puertaStyle(i)}
              >
                <p className="lbl">{p.lbl}</p>
                <h3>{p.titulo}</h3>
                <p className="cuerpo">{p.cuerpo}</p>
                <p style={{ margin: 0 }}>
                  <a
                    className={`hs-btn${p.primaria ? "" : " hs-btn-ghost"}`}
                    href={p.href}
                  >
                    {p.cta}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer — hermano de la sección, no hijo */}
      <footer role="contentinfo" className="s9-footer">
        <div className="hs-wrap s9-footer-fila">
          <span className="s9-footer-marca" translate="no">
            YETI<span style={{ color: "#4FD1E0" }}>·</span>
            <span style={{ color: "var(--salmon)" }}>BI</span>
          </span>
          <span style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <a
              className="s9-footer-ubica"
              href="mailto:data@yetibi.com"
              style={{ textDecoration: "none" }}
            >
              DATA@YETIBI.COM
            </a>
            <span className="s9-footer-ubica">MEDELLÍN · BOGOTÁ — COLOMBIA</span>
          </span>
        </div>
      </footer>
    </>
  );
}
