"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S5 · La asimetría competitiva — bloques escalonados ─────────────────────
// Orden deliberado: composición → visibilidad → estructural (la estructural
// va de última: es la que menos aplica a una pyme contra otras pymes).
// Sin cifras (no hay fuente citable) y sin registro acusatorio: la tensión
// viene del hecho, no del reproche. Esta sección NO cierra con pregunta en
// cursiva — la pregunta subió al bloque destacado.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

interface Bloque {
  num: string;
  clase: string;
  titulo: string;
  sub: string;
  cuerpoDesk: React.ReactNode;
  cuerpoMov: React.ReactNode;
}

const BLOQUES: Bloque[] = [
  {
    num: "01",
    clase: "",
    titulo: "Asimetría de composición",
    sub: "La ventaja se acumula",
    cuerpoDesk: (
      <>
        Quien rediseña un proceso no gana solo ese paso: gana el dato limpio y
        el aprendizaje para rediseñar el siguiente.{" "}
        <strong>Cada rediseño abarata el que sigue.</strong> Por eso la
        distancia no crece de forma pareja — se compone.
      </>
    ),
    cuerpoMov: (
      <>
        Quien rediseña un proceso no gana solo ese paso: gana el dato limpio y
        el aprendizaje para rediseñar el siguiente. Por eso la distancia no
        crece de forma pareja — se compone.
      </>
    ),
  },
  {
    num: "02",
    clase: "e2",
    titulo: "Asimetría de visibilidad",
    sub: "El costo que no aparece en ningún reporte",
    cuerpoDesk: (
      <>
        Rediseñar cuesta y se nota: tiempo, esfuerzo, fricción interna.{" "}
        <strong>No rediseñar también cuesta</strong> — pero se paga en silencio,
        un poco cada día, directo de la utilidad.
      </>
    ),
    cuerpoMov: (
      <>
        Rediseñar cuesta y se nota: tiempo, esfuerzo, fricción interna.{" "}
        <strong>No rediseñar también cuesta</strong> — pero se paga en silencio,
        un poco cada día, directo de la utilidad.
      </>
    ),
  },
  {
    num: "03",
    clase: "e3",
    titulo: "Asimetría estructural",
    sub: "El entrante no carga con tu pasado",
    cuerpoDesk: (
      <>
        Un competidor que nació después opera con una fracción de tu nómina. No
        es más inteligente: <strong>nunca construyó los procesos fósiles</strong>{" "}
        que a ti hoy te cuesta desarmar.
      </>
    ),
    cuerpoMov: (
      <>
        Un competidor que nació después opera con una fracción de tu nómina. No
        es más inteligente: <strong>nunca construyó los procesos fósiles</strong>{" "}
        que a ti hoy te cuesta desarmar.
      </>
    ),
  },
];

export function S5Asimetria() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  const listaRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = listaRef.current;
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

  // Entrada horizontal (no vertical): el escalonamiento hecho temporal
  const bloqueStyle = (i: number): CSSProperties => ({
    opacity: mostrar ? 1 : 0,
    transform: mostrar ? "translateX(0)" : "translateX(-16px)",
    transition: reduced
      ? "none"
      : `opacity .6s ${EASE} ${i * 140}ms, transform .6s ${EASE} ${i * 140}ms`,
  });

  const cierreStyle: CSSProperties = {
    opacity: mostrar ? 1 : 0,
    transition: reduced ? "none" : `opacity .6s ${EASE} 480ms`,
  };

  return (
    <section id="asimetria" className="hs-section hs-bg-acero2 s5sec">
      <div className="hs-wrap">
        <p className="hs-kicker">LA ASIMETRÍA COMPETITIVA</p>
        <h2 className="hs-h2" style={{ fontSize: "clamp(24px, 2.4vw, 34px)" }}>
          La distancia con tu competencia no crece.{" "}
          <span className="acc">Se compone.</span>
        </h2>
        <p className="hs-bajada" style={{ maxWidth: 660 }}>
          <span className="s5-desk">
            El riesgo no es que tu competencia tenga mejor tecnología. Es que
            tiene menos capas entre el problema y la decisión — y esa
            diferencia se acumula sola.
          </span>
          <span className="s5-mov">
            El riesgo no es que tu competencia tenga mejor tecnología. Es que
            tiene menos capas entre el problema y la decisión.
          </span>
        </p>

        <ol className="s5-lista" ref={listaRef}>
          {BLOQUES.map((b, i) => (
            <li
              key={b.num}
              className={`s5-bloque ${b.clase}`}
              style={bloqueStyle(i)}
            >
              <span className="s5-num s5-desk" aria-hidden="true">
                {b.num}
              </span>
              <div>
                <h3>
                  <span className="s5-num-in" aria-hidden="true">{b.num}</span>
                  {b.titulo}
                </h3>
                <p className="s5-sub">{b.sub}</p>
                <p className="s5-cuerpo">
                  <span className="s5-desk">{b.cuerpoDesk}</span>
                  <span className="s5-mov">{b.cuerpoMov}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Cierre — la pregunta vive aquí; no hay apertura en cursiva abajo */}
        <div className="s5-cierre" style={cierreStyle}>
          <h3>¿Cuánto llevas pagando la fuga que no aparece en ningún reporte?</h3>
          <p>
            El reporte que llega cuando la decisión ya se tomó. El inventario
            que nadie ha tocado en cuatro años. La gerencia media copiando
            datos entre sistemas que no se hablan.{" "}
            <strong>
              No es inercia — es una fuga activa que tu operación ya normalizó.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}
