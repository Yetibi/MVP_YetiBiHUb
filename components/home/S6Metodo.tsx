"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S6 · El idioma del resultado ────────────────────────────────────────────
// Registro declarativo: las dimensiones describen QUÉ se mueve, nunca quién
// lo mueve — cero primera persona de servicio. La secuencia va comprimida
// (el diagrama animado vive en /evaluacion). El 55% vs 20% es el único dato
// duro de la página: cifra y redacción exactas de la fuente, no se alteran.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

const SECUENCIA = ["ELIMINAR", "SIMPLIFICAR", "OPTIMIZAR", "AUTOMATIZAR", "MEDIR"];

const DIMENSIONES = [
  {
    nombre: "CALIDAD",
    kpi: "ERROR QUE LLEGA AL CLIENTE",
    linea: "El error que detecta el cliente es el más caro de la cadena.",
  },
  {
    nombre: "VOLUMEN",
    kpi: "CAPACIDAD SIN COSTO FIJO NUEVO",
    linea: "Absorber más demanda sin ampliar la estructura.",
  },
  {
    nombre: "COSTO",
    kpi: "COSTO POR TRANSACCIÓN",
    linea: "Lo que cuesta cada vez que el proceso corre.",
  },
  {
    nombre: "EXPERIENCIA",
    kpi: "FRICCIÓN PARA CLIENTE Y EQUIPO",
    linea: "La agilidad del proceso se siente en ambos lados del mostrador.",
  },
  {
    nombre: "EXPECTATIVAS",
    kpi: "CONFIABILIDAD DEL ESTÁNDAR",
    linea: "Cumplir sin margen de error cambia lo que el mercado exige de la categoría.",
  },
];

// Aproximación temporal del bezier del proyecto (desaceleración fuerte)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

export function S6Metodo() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [cifra, setCifra] = useState(0);
  const [vsListo, setVsListo] = useState(false);
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Contador 0 → 55 en 900ms
  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setCifra(55);
      setVsListo(true);
      return;
    }
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 900, 1);
      setCifra(Math.round(easeOut(p) * 55));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVsListo(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced]);

  const mostrar = reduced || visible;

  const cajaStyle = (i: number): CSSProperties => ({
    opacity: mostrar ? 1 : 0,
    transition: reduced ? "none" : `opacity .5s ${EASE} ${i * 80}ms`,
  });

  return (
    <section ref={secRef} id="metodo" className="hs-section hs-bg-noche s6sec">
      <div className="hs-wrap">
        <p className="hs-kicker">EL IDIOMA DEL RESULTADO</p>
        <h2 className="hs-h2" style={{ fontSize: "clamp(26px, 2.9vw, 42px)" }}>
          Las horas ahorradas no son un resultado.{" "}
          <span className="acc">La utilidad sí.</span>
        </h2>
        <p className="hs-bajada">
          <span className="s6-desk">
            Prometer &ldquo;200 horas ahorradas&rdquo; es vender un espejismo:
            una hora liberada que nadie reasigna cuesta lo mismo que antes. Un
            rediseño solo vale si mueve estas seis dimensiones — y todas
            terminan en el estado de resultados.
          </span>
          <span className="s6-mov">
            Una hora liberada que nadie reasigna cuesta lo mismo que antes. Un
            rediseño solo vale si mueve estas seis dimensiones.
          </span>
        </p>

        {/* Secuencia comprimida — cita del método, no diagrama */}
        <ol className="hs-seq" style={{ margin: "40px 0 0", padding: 0, listStyle: "none" }}>
          {SECUENCIA.map((s, i) => (
            <li key={s} style={{ display: "contents" }}>
              {i > 0 && (
                <span className="fl" aria-hidden="true" style={cajaStyle(i)}>
                  →
                </span>
              )}
              <span className={`sq${s === "MEDIR" ? " acc" : ""}`} style={cajaStyle(i)}>
                {s}
              </span>
            </li>
          ))}
        </ol>
        <p className="s6-secuencia-nota">
          El orden no es negociable. Automatizar es el cuarto paso, nunca el
          primero.
        </p>

        {/* Seis dimensiones — Acceso destacada, cinco en grid */}
        <ul className="s6-dims">
          <li className="s6-acceso">
            <h3>ACCESO</h3>
            <span className="s6-kpi">LATENCIA DE DECISIÓN</span>
            <p className="cuerpo">
              El tiempo entre que ocurre un hecho y que llega a quien decide.
              Decidir antes evita pérdidas que ningún ahorro de nómina
              compensa.
            </p>
          </li>
          {DIMENSIONES.map((d) => (
            <li key={d.nombre} className="s6-dim">
              <h3>{d.nombre}</h3>
              <span className="s6-kpi">{d.kpi}</span>
              <p className="linea s6-desk">{d.linea}</p>
            </li>
          ))}
        </ul>

        {/* Bloque de prueba — el único dato duro de la página */}
        <div className="s6-prueba">
          <div className="s6-cifras" aria-live="off">
            <div>
              <p className="s6-cifra" aria-hidden="true" style={{ margin: 0 }}>
                {cifra}%
              </p>
              <span className="sr-only">55%</span>
              <p className="s6-cifra-lbl">CON IMPACTO REAL</p>
            </div>
            <span
              className="s6-div"
              aria-hidden="true"
              style={{
                opacity: vsListo ? 1 : 0,
                transition: reduced ? "none" : `opacity .4s ${EASE}`,
              }}
            />
            <div
              style={{
                opacity: vsListo ? 1 : 0,
                transition: reduced ? "none" : `opacity .4s ${EASE}`,
              }}
            >
              <p className="s6-veinte" style={{ margin: 0 }}>
                20%
              </p>
              <p className="s6-cifra-lbl">EL RESTO</p>
            </div>
          </div>
          <p className="s6-prueba-texto">
            De las empresas que logran impacto real con IA, la mayoría rediseñó
            sus procesos de fondo. Entre las demás, solo una de cada cinco.
          </p>
          <p className="s6-fuente">
            MCKINSEY · THE STATE OF AI 2025: AGENTS, INNOVATION, AND
            TRANSFORMATION · N=1.993
          </p>
        </div>

        {/* Salida + apertura */}
        <p style={{ margin: "16px 0 0" }}>
          <a className="hs-link" href="/evaluacion">
            → EVALUAR UN PROCESO
          </a>
        </p>
        <p className="hs-apertura" style={{ marginTop: 10 }}>
          ¿Cuál de estas seis dimensiones movió tu último proyecto de
          tecnología?
        </p>
      </div>
    </section>
  );
}
