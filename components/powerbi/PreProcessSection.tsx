"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";

// ─── estilos compartidos ─────────────────────────────────────────────────────

const metaLabelBase: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "clamp(9px, 1vw, 11px)",
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: "#F28F6B",
  margin: "0 0 12px",
};

const stepTitleBase: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fontSize: "clamp(18px, 2vw, 24px)",
  lineHeight: 1.3,
  color: "#FFFFFF",
  margin: "0 0 8px",
};

const stepDescBase: React.CSSProperties = {
  fontSize: "clamp(13px, 1.4vw, 15px)",
  color: "#A89DC0",
  lineHeight: 1.6,
  margin: 0,
};

const cardBase: React.CSSProperties = {
  backgroundColor: "#141020",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 0,
  boxShadow: "none",
  padding: "32px",
};

// ─── variants ────────────────────────────────────────────────────────────────

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Nodo ────────────────────────────────────────────────────────────────────

function StepNode({
  number,
  variant = "default",
}: {
  number: string;
  variant?: "default" | "highlight";
}) {
  const isHighlight = variant === "highlight";
  return (
    <div
      className="step-node"
      style={{
        position: "relative",
        zIndex: 2,
        width: 56,
        height: 56,
        backgroundColor: isHighlight ? "#F28F6B" : "#141020",
        border: `1px solid ${isHighlight ? "#F28F6B" : "rgba(255,255,255,0.08)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(14px, 1.8vw, 18px)",
          fontWeight: 700,
          color: isHighlight ? "#0E0B14" : "#A89DC0",
        }}
      >
        {number}
      </span>
      {isHighlight && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -3,
              left: -3,
              width: 8,
              height: 8,
              borderTop: "1.5px solid #00D4C6",
              borderLeft: "1.5px solid #00D4C6",
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -3,
              right: -3,
              width: 8,
              height: 8,
              borderBottom: "1.5px solid #00D4C6",
              borderRight: "1.5px solid #00D4C6",
            }}
          />
        </>
      )}
    </div>
  );
}

// ─── Diamante de decisión (paso 4) ───────────────────────────────────────────

function DecisionNode() {
  return (
    <div
      className="step-node decision-node"
      style={{
        position: "relative",
        zIndex: 2,
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#141020",
          border: "1.5px solid #00D4C6",
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            transform: "rotate(-45deg)",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 700,
            color: "#F28F6B",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          GO/NOGO
        </span>
      </div>
    </div>
  );
}

// ─── Step genérico (nodo + card) ─────────────────────────────────────────────

interface StepProps {
  number: string;
  meta: string;
  title: string;
  desc: string;
  highlight?: boolean;
  isLast?: boolean;
  rm: boolean | null;
}

function Step({ number, meta, title, desc, highlight, isLast, rm }: StepProps) {
  return (
    <motion.li
      className="pre-process-step"
      initial={rm ? undefined : "hidden"}
      whileInView={rm ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      variants={rm ? undefined : stepVariants}
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        gap: 28,
        paddingBottom: isLast ? 0 : 80,
      }}
    >
      <StepNode number={number} variant={highlight ? "highlight" : "default"} />
      <div
        style={{
          ...cardBase,
          borderColor: highlight ? "rgba(0,212,198,0.3)" : "rgba(255,255,255,0.08)",
          borderLeft: highlight ? "2px solid #00D4C6" : cardBase.border,
        }}
      >
        <p style={metaLabelBase}>{meta}</p>
        <h3 style={stepTitleBase}>{title}</h3>
        <p style={stepDescBase}>{desc}</p>
      </div>
    </motion.li>
  );
}

// ─── Step de decisión (paso 4 — bifurcación Go/No Go) ────────────────────────

function DecisionStep({ rm }: { rm: boolean | null }) {
  return (
    <motion.li
      className="pre-process-step"
      initial={rm ? undefined : "hidden"}
      whileInView={rm ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      variants={rm ? undefined : stepVariants}
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        gap: 28,
        paddingBottom: 100,
      }}
    >
      <DecisionNode />
      <div className="decision-branch" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            ...cardBase,
            padding: 28,
            borderColor: "rgba(0,212,198,0.3)",
            borderTop: "2px solid #00D4C6",
          }}
        >
          <p style={{ ...metaLabelBase, color: "#F28F6B", fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 600, textTransform: "none", letterSpacing: "normal" }}>→ GO</p>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "#FFFFFF", margin: "0 0 6px" }}>
            Hay proyecto viable
          </h3>
          <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "#A89DC0", lineHeight: 1.6, margin: 0 }}>
            Definimos alcance, timeline y precio. Arrancamos con reglas claras
            para ambos.
          </p>
        </div>

        <div
          tabIndex={0}
          className="decision-nogo-card"
          style={{
            ...cardBase,
            padding: 28,
          }}
        >
          <p style={{ ...metaLabelBase, color: "#A89DC0", fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 600, textTransform: "none", letterSpacing: "normal" }}>→ NO GO</p>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "#FFFFFF", margin: "0 0 6px" }}>
            Cerramos con claridad
          </h3>
          <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "#A89DC0", lineHeight: 1.6, margin: 0 }}>
            Si no hay proyecto viable hoy, te lo decimos. Sin costo, sin
            compromiso, sin seguimiento comercial.
          </p>
        </div>
      </div>
    </motion.li>
  );
}

// ─── PreProcessSection ───────────────────────────────────────────────────────

export default function PreProcessSection() {
  const rm = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ["start 70%", "end 60%"],
  });
  const fillScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      className="relative w-full pre-process-section"
      style={{
        background: "#171225",
      }}
    >
    <div
      className="mx-auto pre-process-inner"
      style={{
        maxWidth: 1100,
        padding: "80px 48px",
      }}
    >
      {/* Header de sección */}
      <div
        className="pre-process-header"
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 48,
          marginBottom: 96,
        }}
      >
        <div>
          <p
            className="flex items-center"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 1.2vw, 13px)",
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#F28F6B",
              marginBottom: 16,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                backgroundColor: "#00D4C6",
                marginRight: 12,
              }}
            />
            PROCESO
          </p>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(32px, 4.2vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Del formulario al proyecto en 5 pasos
          </h2>
        </div>

        <div style={{ alignSelf: "end" }}>
          <p
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "#A89DC0",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Un camino claro y sin sorpresas. Cada paso tiene un propósito, y
            la evaluación de viabilidad es el punto donde ambas partes deciden
            con información — no con promesas.
          </p>
        </div>
      </div>

      {/* Flujo */}
      <div ref={flowRef} className="pre-process-flow" style={{ position: "relative" }}>
        <span
          aria-hidden="true"
          className="pre-process-track"
          style={{
            position: "absolute",
            left: 27,
            top: 28,
            bottom: 28,
            width: 2,
            backgroundColor: "rgba(255,255,255,0.08)",
            zIndex: 1,
          }}
        >
          <motion.span
            aria-hidden="true"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to bottom, #00D4C6 0%, #00D4C6 65%, #7B4F96 100%)",
              transformOrigin: "top",
              scaleY: rm ? 1 : fillScaleY,
            }}
          />
        </span>

        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <Step
            number="01"
            meta="3 MINUTOS"
            title="Formulario"
            desc="Cuéntanos sobre tu operación: qué datos manejas, qué decisiones necesitas tomar y qué herramientas usas. Con eso llegamos preparados."
            rm={rm}
          />
          <Step
            number="02"
            meta="ELIGE TU HORARIO"
            title="Agenda tu cita"
            desc="Reserva 30 minutos para la evaluación de viabilidad. Eliges el horario que mejor te funcione, sin correos de ida y vuelta."
            rm={rm}
          />
          <Step
            number="03"
            meta="30 MIN · VIRTUAL · SIN COSTO"
            title="Evaluación conjunta"
            desc="Revisamos tus requerimientos, la complejidad de tus fuentes de datos y el alcance real del proyecto. Tú evalúas si somos el equipo correcto; nosotros evaluamos si podemos generar impacto medible. No es un pitch de ventas."
            highlight
            rm={rm}
          />
          <DecisionStep rm={rm} />
          <Step
            number="05"
            meta="GO · ARRANCAMOS"
            title="Proyecto"
            desc="Alcance definido, timeline claro y entregables medibles. Del diagnóstico a la entrega, con checkpoints de por medio."
            isLast
            rm={rm}
          />
        </ol>
      </div>

      {/* Cierre */}
      <p
        style={{
          borderLeft: "2px solid #00D4C6",
          paddingLeft: 20,
          marginTop: 48,
          fontSize: 16,
          fontStyle: "italic",
          color: "#A89DC0",
          lineHeight: 1.6,
          maxWidth: 680,
        }}
      >
        La evaluación de 30 minutos no tiene costo, pero no es gratis para
        nadie: es una sesión técnica donde ambas partes evalúan viabilidad. Es
        el paso que evita proyectos que no deberían existir.
      </p>

      <a
        href="/powerbi/formulario"
        className="pre-process-cta relative inline-flex items-center overflow-hidden"
        style={{
          marginTop: 36,
          backgroundColor: "#00D4C6",
          color: "#0E0B14",
          padding: "14px 28px",
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 0,
          textDecoration: "none",
        }}
      >
        <span className="relative z-10">Empezar por el paso 1 →</span>
      </a>

      <style>{`
        .pre-process-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 0%;
          background-color: #C45A2A;
          transition: width 0.3s ease;
          z-index: 0;
        }
        .pre-process-cta:hover::before {
          width: 100%;
        }
        .decision-nogo-card {
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .decision-nogo-card:hover,
        .decision-nogo-card:focus-visible {
          opacity: 1;
        }
        /* la card es focalizable (tabIndex=0): necesita indicador propio */
        .decision-nogo-card:focus-visible {
          outline: 2px solid #00D4C6;
          outline-offset: 2px;
        }
        @media (max-width: 768px) {
          .pre-process-inner {
            padding: 56px 24px !important;
          }
          .pre-process-header {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .pre-process-track {
            left: 21px !important;
          }
          .pre-process-step {
            grid-template-columns: 44px 1fr !important;
            gap: 20px !important;
          }
          .step-node {
            width: 44px !important;
            height: 44px !important;
          }
          .step-node span {
            font-size: 14px !important;
          }
          .decision-node > div {
            width: 28px !important;
            height: 28px !important;
          }
          .decision-node > div span {
            font-size: 6px !important;
          }
          .decision-branch {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pre-process-step {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
    </section>
  );
}
