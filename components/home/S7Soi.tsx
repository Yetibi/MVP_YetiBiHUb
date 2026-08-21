"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S7 · SOI — Sistema Operacional Inteligente ──────────────────────────────
// Esta sección DEFINE el SOI, no lo vende: cero primera persona de servicio,
// sin CTA — solo un enlace sobrio. Cuatro capas acumulativas (no seis: dos
// del material interno son consecuencias de estas). El cierre es una
// ADVERTENCIA y no se suaviza: decirla construye la autoridad de la sección.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

const NEGACIONES = [
  "un dashboard",
  "un ERP",
  "automatización suelta",
  "un módulo más",
  "un proyecto que termina",
];

const CAPAS = [
  {
    num: "01",
    nombre: "PROCESOS",
    sub: "DISEÑADOS, NO HEREDADOS",
    cuerpo:
      "La capa que todo lo demás asume. Sin ella, las tres siguientes amplifican el desorden.",
  },
  {
    num: "02",
    nombre: "DATOS",
    sub: "UNA SOLA FUENTE DE VERDAD",
    cuerpo:
      "Capturados donde ocurre el hecho, validados en origen. Sin duplicados ni versiones en conflicto.",
  },
  {
    num: "03",
    nombre: "DECISIONES",
    sub: "AUTOMÁTICAS DONDE DEBEN SERLO",
    cuerpo:
      "Reglas que se ejecutan, alertas que escalan, prioridades que se ordenan solas — dentro de los límites que el criterio definió.",
  },
  {
    num: "04",
    nombre: "EVOLUCIÓN",
    sub: "EL SISTEMA APRENDE DEL CICLO",
    cuerpo:
      "Un sistema que no evoluciona se vuelve el próximo proceso fósil. Por eso no termina.",
  },
];

export function S7Soi() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = secRef.current;
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
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mostrar = reduced || visible;

  const negStyle = (i: number): CSSProperties => ({
    opacity: mostrar ? 1 : 0,
    transition: reduced ? "none" : `opacity .5s ${EASE} ${i * 70}ms`,
  });

  // 01 → 04: el orden es el argumento
  const capaStyle = (i: number): CSSProperties => ({
    opacity: mostrar ? 1 : 0,
    transform: mostrar ? "translateY(0)" : "translateY(10px)",
    transition: reduced
      ? "none"
      : `opacity .6s ${EASE} ${i * 100}ms, transform .6s ${EASE} ${i * 100}ms`,
  });

  const cierreStyle: CSSProperties = {
    opacity: mostrar ? 1 : 0,
    transition: reduced ? "none" : `opacity .6s ${EASE} 550ms`,
  };

  return (
    <section ref={secRef} id="soi" className="hs-section hs-bg-acero s7sec">
      <div className="hs-wrap">
        <p className="hs-kicker cian">SOI · SISTEMA OPERACIONAL INTELIGENTE</p>
        <h2 className="hs-h2" style={{ fontSize: "clamp(26px, 2.9vw, 42px)" }}>
          El destino no es un tablero. Es una operación que{" "}
          <span className="cian">decide.</span>
        </h2>
        <p className="hs-bajada">
          Un tablero muestra lo que ya pasó. Un sistema operacional inteligente
          es el sistema nervioso de la operación: captura donde ocurren los
          hechos, los vuelve una sola verdad, decide lo que puede decidirse
          solo, y aprende de cada ciclo.
        </p>

        {/* Negaciones — el tachado es visual; el sr-only aclara la negación */}
        <ul className="s7-negaciones">
          {NEGACIONES.map((n, i) => (
            <li key={n} className="s7-neg" style={negStyle(i)}>
              <span className="sr-only">No es </span>
              {n}
            </li>
          ))}
        </ul>
        <p className="s7-neg-remate">
          Ninguna de esas cosas cambia cómo opera un negocio. Las cuatro
          primeras se instalan.{" "}
          <strong>
            La quinta es la razón por la que la mayoría no sobrevive.
          </strong>
        </p>

        {/* Las cuatro capas — acumulativas, en orden */}
        <ol className="s7-capas">
          {CAPAS.map((c, i) => (
            <li key={c.num} className="s7-capa" style={capaStyle(i)}>
              <p className="num" aria-hidden="true">
                {c.num}
              </p>
              <h3>{c.nombre}</h3>
              <p className="sub">{c.sub}</p>
              <p className="cuerpo">{c.cuerpo}</p>
            </li>
          ))}
        </ol>

        {/* Cierre — advertencia, no promesa. No se suaviza. */}
        <div className="s7-cierre" style={cierreStyle}>
          <p className="adv">
            Un sistema nuevo sobre hábitos viejos no sobrevive el primer
            trimestre. Rediseñar el proceso obliga a rediseñar cómo se trabaja:
            quién decide qué, dónde queda registrado, qué deja de hacerse.
          </p>
          <p className="remate">
            Eso no es un efecto secundario de la implementación. Es la
            implementación.
          </p>
        </div>

        {/* Salida sobria — sin CTA */}
        <a className="s7-salida" href="/evaluacion#contacto-form">
          Hablemos de tu operación →
        </a>
      </div>
    </section>
  );
}
