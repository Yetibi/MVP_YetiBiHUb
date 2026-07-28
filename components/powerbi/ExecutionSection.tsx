"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

// ─── contenido ───────────────────────────────────────────────────────────────

const PHASES = [
  {
    tag: "FASE 01",
    title: "Diagnóstico operativo",
    desc: "Mapeamos el proceso real: qué datos genera, dónde pierde calidad, qué decisiones dependen de qué fuente.",
  },
  {
    tag: "FASE 02",
    title: "Arquitectura + modelo",
    desc: "Fuentes, integración, modelo semántico, gobernanza y seguridad definidos desde el día 1.",
  },
  {
    tag: "FASE 03",
    title: "Construcción + validación",
    desc: "Instrumentos de gestión diseñados desde la decisión. Prototipos, feedback e iteración con datos reales.",
  },
  {
    tag: "FASE 04",
    title: "Despliegue + cambio",
    desc: "Puesta en producción con acompañamiento. Si implica cambiar cómo trabaja tu equipo, lo abordamos.",
  },
  {
    tag: "FASE 05",
    title: "Sostenibilidad",
    desc: "Checkpoints periódicos: ¿lo que medimos sigue siendo pertinente? ¿El dato sigue limpio? ¿La adopción se mantiene?",
  },
] as const;

// ─── ícono ───────────────────────────────────────────────────────────────────

function CycleIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M6 10a8 8 0 0 1 14.5-4.5M22 6v4h-4"
        stroke="#7B4F96"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 18a8 8 0 0 1-14.5 4.5M6 22v-4h4"
        stroke="#7B4F96"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── variants del barrido ────────────────────────────────────────────────────
// Cada fase entra, se eleva brevemente (barrido) y se asienta en su estado
// final. El color del nodo/título sigue el mismo timing vía keyframes.

const phasesContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25 },
  },
};

const phaseVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: [12, -6, 0],
    transition: { duration: 0.6, times: [0, 0.6, 1], ease: "easeOut" },
  },
};

const nodeSweepVariants: Variants = {
  hidden: { borderColor: "rgba(224,123,48,0.3)", backgroundColor: "#141020" },
  show: {
    borderColor: ["rgba(224,123,48,0.3)", "#E07B30", "rgba(224,123,48,0.3)"],
    backgroundColor: ["#141020", "rgba(224,123,48,0.12)", "#141020"],
    transition: { duration: 0.6, times: [0, 0.5, 1], ease: "easeOut" },
  },
};

const titleSweepVariants: Variants = {
  hidden: { color: "#FFFFFF" },
  show: {
    color: ["#FFFFFF", "#E07B30", "#FFFFFF"],
    transition: { duration: 0.6, times: [0, 0.5, 1], ease: "easeOut" },
  },
};

const connectorSweepVariants: Variants = {
  hidden: { opacity: 0.6 },
  show: {
    opacity: [0.6, 1, 0.6],
    transition: { duration: 0.6, times: [0, 0.5, 1], ease: "easeOut" },
  },
};

// Los arcos se dibujan tras completarse todo el barrido:
// 4 fases de stagger (0.25s c/u) + 0.6s de duración de la última ≈ 1.6s
const ARCS_DELAY = 4 * 0.25 + 0.6;

// Tras dibujarse (pathLength 0→1), el trazo punteado fluye en loop continuo
// (strokeDashoffset) para transmitir que la retroalimentación es un ciclo
// vivo, no una imagen estática. El flujo arranca justo cuando termina el
// dibujo del arco (ARCS_DELAY + 0.8).
const arcVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0, strokeDashoffset: 0 },
  show: {
    pathLength: 1,
    opacity: 0.5,
    strokeDashoffset: [0, 0, -16],
    transition: {
      pathLength: { duration: 0.8, delay: ARCS_DELAY, ease: "easeInOut" },
      opacity: { duration: 0.8, delay: ARCS_DELAY, ease: "easeInOut" },
      strokeDashoffset: {
        duration: 1.2,
        delay: ARCS_DELAY,
        times: [0, 0.667, 1],
        repeat: Infinity,
        repeatDelay: 0,
        ease: "linear",
      },
    },
  },
};

const noteVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: ARCS_DELAY + 0.4 },
  },
};

// ─── Phase (subcomponente — cada uno con su propio estado de hover/focus) ────

interface PhaseProps {
  phase: (typeof PHASES)[number];
  index: number;
  isLast: boolean;
  rm: boolean | null;
}

function Phase({ phase, index, isLast, rm }: PhaseProps) {
  return (
    <motion.li
      className="execution-phase"
      variants={rm ? undefined : phaseVariants}
      style={{ position: "relative" }}
    >
      {!isLast && (
        <motion.span
          aria-hidden="true"
          className="execution-connector"
          variants={rm ? undefined : connectorSweepVariants}
          style={{
            position: "absolute",
            top: 27,
            left: 54,
            right: -20,
            height: 2,
            background: "linear-gradient(to right, #E07B30, rgba(224,123,48,0.3))",
            zIndex: 0,
          }}
        />
      )}

      <motion.div
        className="execution-node"
        variants={rm ? undefined : nodeSweepVariants}
        style={{
          position: "relative",
          zIndex: 2,
          width: 54,
          height: 54,
          border: "1px solid rgba(224,123,48,0.3)",
          backgroundColor: "#141020",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            fontWeight: 600,
            color: "#E07B30",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -1,
            left: -1,
            width: 7,
            height: 7,
            borderTop: "1.5px solid #E07B30",
            borderLeft: "1.5px solid #E07B30",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 7,
            height: 7,
            borderBottom: "1.5px solid #E07B30",
            borderRight: "1.5px solid #E07B30",
          }}
        />
      </motion.div>

      <div className="execution-content">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "#A89DC0",
            margin: "0 0 8px",
          }}
        >
          {phase.tag}
        </p>
        <motion.h3
          variants={rm ? undefined : titleSweepVariants}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1.25,
            margin: "0 0 10px",
          }}
        >
          {phase.title}
        </motion.h3>
        <p
          style={{
            fontSize: 12.5,
            color: "#B5ACC8",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {phase.desc}
        </p>
      </div>
    </motion.li>
  );
}

// ─── Arcos de retorno (CRISP-DM) ─────────────────────────────────────────────
// Curvas de fase 3→2 y fase 4→2. Coordenadas relativas a un viewBox de
// 1000x70 mapeado sobre el ancho de las 5 columnas (cada columna = 200px).

// El SVG cubre desde el borde superior de .execution-phases-wrap (y=0, donde
// vive el texto "RETROALIMENTACIÓN") hasta el centro vertical real de los
// nodos (medido con Playwright: paddingTop 70 + mitad del nodo de 54px = 97,
// coincide con el "top: 27" del conector horizontal dentro de cada nodo).
// Antes el SVG medía solo 70px de alto y el arco terminaba en y=60, muy por
// encima de donde realmente empiezan los nodos (~95-110px) — quedaba
// flotando sin tocar las cajas. Ahora ARC_LAND_Y = altura real del SVG.
const ARC_LAND_Y = 97;

function ReturnArcs({ rm }: { rm: boolean | null }) {
  // Centro X real de cada nodo (medido: los nodos de 54px con gap 20px sobre
  // 5 columnas 1fr no caen en múltiplos exactos de 200 — offset por el ancho
  // del propio nodo). Valores en escala 0-1000 del viewBox.
  const colCenters = [25, 228, 432, 635, 839];
  const y = ARC_LAND_Y;
  const arc3to2 = `M ${colCenters[2]} ${y} C ${colCenters[2] - 60} ${y - 50}, ${colCenters[1] + 60} ${y - 50}, ${colCenters[1]} ${y}`;
  const arc4to2 = `M ${colCenters[3]} ${y} C ${colCenters[3] - 40} ${y - 70}, ${colCenters[1] + 40} ${y - 70}, ${colCenters[1]} ${y}`;

  return (
    <svg
      aria-hidden="true"
      className="execution-arcs hidden md:block"
      viewBox={`0 0 1000 ${ARC_LAND_Y + 10}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: ARC_LAND_Y + 10,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <motion.path
        d={arc3to2}
        stroke="#7B4F96"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        fill="none"
        initial={rm ? "show" : "hidden"}
        animate="show"
        variants={arcVariants}
      />
      <motion.path
        d={arc4to2}
        stroke="#7B4F96"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        fill="none"
        initial={rm ? "show" : "hidden"}
        animate="show"
        variants={arcVariants}
      />
      <text
        x={colCenters[1] + (colCenters[2] - colCenters[1]) / 2}
        y={12}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill="#7B4F96"
        letterSpacing="1"
        opacity={0.8}
      >
        RETROALIMENTACIÓN
      </text>
    </svg>
  );
}

// ─── ExecutionSection ────────────────────────────────────────────────────────

export default function ExecutionSection() {
  const rm = useReducedMotion();

  return (
    <section
      id="ejecucion"
      className="relative mx-auto execution-section"
      style={{
        maxWidth: 1200,
        padding: "80px 48px",
        backgroundColor: "#0E0B14",
      }}
    >
      {/* Header de sección */}
      <div
        className="execution-header"
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 48,
          marginBottom: 72,
        }}
      >
        <div>
          <p
            className="flex items-center"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#E07B30",
              marginBottom: 16,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                backgroundColor: "#E07B30",
                marginRight: 12,
              }}
            />
            EJECUCIÓN
          </p>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Si hay proyecto viable, así lo ejecutamos
          </h2>
        </div>

        <div style={{ alignSelf: "end" }}>
          <p
            style={{
              fontSize: 16,
              color: "#A89DC0",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Cinco fases con un método probado. No es una línea recta: si en
            el camino descubrimos que algo no sostiene la decisión, volvemos
            atrás antes de avanzar.
          </p>
        </div>
      </div>

      {/* Fases */}
      <div
        className="execution-phases-wrap"
        style={{ position: "relative", paddingTop: 70 }}
      >
        <ReturnArcs rm={rm} />

        <motion.ol
          className="execution-phases"
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : "show"}
          viewport={{ once: true, margin: "-100px" }}
          variants={rm ? undefined : phasesContainerVariants}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {PHASES.map((phase, i) => (
            <Phase
              key={phase.tag}
              phase={phase}
              index={i}
              isLast={i === PHASES.length - 1}
              rm={rm}
            />
          ))}
        </motion.ol>
      </div>

      {/* Nota CRISP-DM */}
      <motion.div
        initial={rm ? undefined : "hidden"}
        whileInView={rm ? undefined : "show"}
        viewport={{ once: true, margin: "-100px" }}
        variants={rm ? undefined : noteVariants}
        className="flex items-start"
        style={{
          gap: 16,
          marginTop: 56,
          padding: "20px 24px",
          backgroundColor: "rgba(123,79,150,0.06)",
          borderLeft: "2px solid #7B4F96",
        }}
      >
        <span style={{ flexShrink: 0 }}>
          <CycleIcon />
        </span>
        <p style={{ fontSize: 14, color: "#A89DC0", lineHeight: 1.6, margin: 0 }}>
          Metodología basada en{" "}
          <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>CRISP-DM</strong>
          , el estándar de la industria para proyectos de datos. Las flechas
          van hacia adelante y hacia atrás — si en la fase de modelado
          descubrimos que el dato no sostiene la pregunta, volvemos a la fase
          anterior antes de seguir.
        </p>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .execution-section {
            padding: 56px 24px !important;
          }
          .execution-header {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .execution-arcs {
            display: none !important;
          }
          .execution-phases-wrap {
            padding-top: 0 !important;
          }
          .execution-phases {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .execution-phase {
            display: grid !important;
            grid-template-columns: 54px 1fr !important;
            gap: 20px !important;
          }
          .execution-node {
            margin-bottom: 0 !important;
          }
          .execution-connector {
            top: 54px !important;
            left: 26px !important;
            right: auto !important;
            width: 2px !important;
            height: calc(100% + 8px) !important;
            background: linear-gradient(to bottom, #E07B30, rgba(224,123,48,0.3)) !important;
          }
        }
      `}</style>
    </section>
  );
}
