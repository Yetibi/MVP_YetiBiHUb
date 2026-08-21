"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ─── S3 · El sistema de decisión — las 3 capas como estratos ─────────────────
// Frase madre + puente + lista ordenada de capas (visible → sumergido).
// Movimiento discreto: tarjetas con fade+12px escalonado, eje que se dibuja.
// SOI no se menciona aquí: se revela en S7.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const CIAN = "#4FD1E0";

interface Capa {
  lbl: string;
  color: string;
  fondo: string;
  titulo: string;
  pregunta: string;
  conse: string;
  cuerpoDesk: string;
  cuerpoMov: string;
  nota?: string;
}

const CAPAS: Capa[] = [
  {
    lbl: "CAPA 3 · FLUJO",
    color: CIAN,
    fondo: "#141F2E",
    titulo: "Flujo",
    pregunta: "¿En qué orden ocurre?",
    conse: "LA DECISIÓN LLEGA TARDE",
    cuerpoDesk:
      "El evento ya pasó. La información recorre el proceso más lento de lo que avanza el problema, y para cuando llega a quien decide, la ventana de corrección se cerró.",
    cuerpoMov: "El evento ya pasó. Cuando el dato llega, la ventana se cerró.",
    nota: "Es la capa visible — y por eso casi siempre la única que se interviene.",
  },
  {
    lbl: "CAPA 2 · PERSONAS",
    color: "var(--salmon)",
    fondo: "#1C2836",
    titulo: "Personas",
    pregunta: "¿Quién decide, y con qué autoridad?",
    conse: "LA DECISIÓN SUBE SIN NECESIDAD",
    cuerpoDesk:
      "Todo escala a gerencia porque abajo nadie tiene mandato para resolver. El trabajo no se cae en las tareas: se cae en los bordes, donde nadie es dueño y todos asumen que alguien más lo tiene.",
    cuerpoMov: "Todo escala a gerencia porque abajo nadie tiene mandato.",
  },
  {
    lbl: "CAPA 1 · PROPÓSITO",
    color: "var(--salmon)",
    fondo: "#1C2836",
    titulo: "Propósito",
    pregunta: "¿Esta decisión necesita tomarse?",
    conse: "LA DECISIÓN NO DEBERÍA EXISTIR",
    cuerpoDesk:
      "Aprobaciones que nunca se niegan. Reportes que nadie abre. Formatos que se llenan y se archivan. Automatizar una decisión inútil no la arregla — la vuelve una decisión inútil que ocurre más rápido y más veces.",
    cuerpoMov: "Aprobaciones que nunca se niegan. Reportes que nadie abre.",
  },
];

export function S3Reencuadre() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);
  const estratosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = estratosRef.current;
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

  return (
    <section id="capas" className="hs-section hs-bg-acero2 s3sec">
      <div className="hs-wrap">
        <p className="hs-kicker">EL SISTEMA DE DECISIÓN</p>

        {/* Frase madre — centrada */}
        <div className="s3-madre">
          <h2
            className="hs-h2"
            style={{ fontSize: 38, maxWidth: "none", margin: "0 0 16px" }}
          >
            La IA no automatiza tareas. Automatiza{" "}
            <span className="acc">decisiones.</span>
          </h2>
          <p
            className="sub"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 400,
              fontSize: 22,
              lineHeight: 1.4,
              color: "#8B95A5",
              margin: 0,
            }}
          >
            Por eso no evaluamos eventos — evaluamos{" "}
            <strong style={{ color: CIAN, fontWeight: 600 }}>
              el sistema con el que se toman las decisiones.
            </strong>
          </p>
        </div>

        {/* Cuerpo puente */}
        <div className="s3-puente">
          <p className="s3-desk">
            La automatización clásica repite pasos que alguien definió antes. La
            IA agéntica lee el contexto y elige el paso siguiente. Eso cambia la
            pregunta: ya no es qué tareas puedes delegar, es{" "}
            <strong>qué decisiones estás dispuesto a que se tomen sin ti</strong>{" "}
            — y con qué información llegan.
          </p>
          <p className="s3-desk">
            Un sistema de decisión sano tiene tres capas. Todas las herramientas
            del mercado optimizan la tercera.
          </p>
          <p className="s3-mov">
            La automatización clásica repite pasos definidos. La IA agéntica lee
            el contexto y elige el siguiente. La pregunta ya no es qué tareas
            delegar, es{" "}
            <strong>qué decisiones estás dispuesto a que se tomen sin ti.</strong>
          </p>
        </div>

        {/* Estratos: eje + lista ordenada de capas (visible → sumergido) */}
        <div className="s3-estratos" ref={estratosRef}>
          <div className="s3-eje" aria-hidden="true">
            <span data-rol="etiqueta">VISIBLE</span>
            <span
              className="s3-eje-linea"
              style={{
                transform: mostrar ? "scaleY(1)" : "scaleY(0)",
                transition: reduced ? "none" : `transform .7s ${EASE}`,
              }}
            />
            <span data-rol="etiqueta">SUMERGIDO</span>
          </div>

          <ol className="s3-lista">
            {CAPAS.map((c, i) => (
              <li
                key={c.titulo}
                className="s3-card"
                style={{
                  borderLeftColor: c.color,
                  background: c.fondo,
                  opacity: mostrar ? 1 : 0,
                  transform: mostrar ? "translateY(0)" : "translateY(12px)",
                  transition: reduced
                    ? "none"
                    : `opacity .6s ${EASE} ${i * 90}ms, transform .6s ${EASE} ${i * 90}ms`,
                }}
              >
                <p className="lbl" style={{ color: c.color }}>
                  {c.lbl}
                </p>
                <h3>{c.titulo}</h3>
                <p className="preg" style={{ color: c.color }}>
                  {c.pregunta}
                </p>
                <p className="conse">{c.conse}</p>
                <p className="cuerpo">
                  <span className="s3-desk">{c.cuerpoDesk}</span>
                  <span className="s3-mov">{c.cuerpoMov}</span>
                </p>
                {c.nota && (
                  <p className="cuerpo s3-desk" style={{ marginTop: 10, color: "#F2F6F9" }}>
                    {c.nota}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Cierre */}
        <div className="s3-cierre">
          <span className="s3-desk">
            Ningún software puede ver el propósito ni la autoridad. Solo puede
            ver el flujo. Por eso la tecnología, sola, únicamente alcanza a
            acelerar <strong>la capa menos determinante.</strong>
          </span>
          <span className="s3-mov">
            Ningún software puede ver el propósito ni la autoridad. Solo el
            flujo — <strong>la capa menos determinante.</strong>
          </span>
          <p className="s3-cierre-pie">POR ESO EVALUAMOS LAS TRES</p>
        </div>

        {/* Apertura + salida */}
        <div className="s3-salida">
          <p className="hs-apertura" style={{ marginTop: 48 }}>
            ¿Cuántas decisiones de tu operación llegan tarde, suben de más, o no
            deberían existir?
          </p>
          <a className="hs-link" href="/evaluacion" style={{ whiteSpace: "nowrap" }}>
            → EVALUAR UN PROCESO
          </a>
        </div>
      </div>
    </section>
  );
}
