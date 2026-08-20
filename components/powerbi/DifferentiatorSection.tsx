"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

// ─── contenido ───────────────────────────────────────────────────────────────

const TRADICIONAL_ITEMS = [
  "Conectan tus fuentes tal como están",
  "El dashboard hereda la variabilidad del proceso",
  "Sin validar si el dato es confiable en origen",
  "Entregan, capacitan y desaparecen",
  "En 6 meses ya no refleja la operación real",
];

const YETIBI_ITEMS = [
  "Diagnosticamos el proceso antes de conectar nada",
  "Validamos calidad del dato en origen",
  "Si no hay proyecto viable, lo decimos antes de facturar",
  "Gobernanza y seguridad desde el día 1",
  "Checkpoints programados de pertinencia",
];

// ─── íconos de header ────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#5D6B7A" strokeWidth={1.5} />
      <path d="M12 7v5l3.5 2" stroke="#5D6B7A" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#4FD1E0" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="4.5" stroke="#4FD1E0" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="1" fill="#4FD1E0" />
    </svg>
  );
}

// Cada línea es su propio motion.path para que se dibuje con pathLength.
function CrossIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, position: "relative", zIndex: 1, backgroundColor: "#141F2E" }}
    >
      <motion.path
        d="M3 3 L13 13"
        stroke="#F2921D"
        strokeWidth={1.8}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.path
        d="M13 3 L3 13"
        stroke="#F2921D"
        strokeWidth={1.8}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.15 }}
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, position: "relative", zIndex: 1, backgroundColor: "#141F2E" }}
    >
      <motion.path
        d="M3 8.5 L6.5 12"
        stroke="#4FD1E0"
        strokeWidth={1.8}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.path
        d="M6.5 12 L13 4"
        stroke="#4FD1E0"
        strokeWidth={1.8}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.15 }}
      />
    </svg>
  );
}

// ─── corner brackets ─────────────────────────────────────────────────────────

type BracketCorner = "tl" | "tr" | "bl" | "br";

function CornerBracket({
  corner,
  color,
  size = 24,
}: {
  corner: BracketCorner;
  color: string;
  size?: number;
}) {
  const isTop = corner === "tl" || corner === "tr";
  const isLeft = corner === "tl" || corner === "bl";
  return (
    <span
      aria-hidden="true"
      className="corner-bracket"
      style={{
        position: "absolute",
        top: isTop ? -1 : undefined,
        bottom: isTop ? undefined : -1,
        left: isLeft ? -1 : undefined,
        right: isLeft ? undefined : -1,
        width: size,
        height: size,
        borderTop: isTop ? `1.5px solid ${color}` : undefined,
        borderBottom: isTop ? undefined : `1.5px solid ${color}`,
        borderLeft: isLeft ? `1.5px solid ${color}` : undefined,
        borderRight: isLeft ? undefined : `1.5px solid ${color}`,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── líneas conectoras entre íconos ──────────────────────────────────────────
// Viven detrás de la columna de íconos (8px de ancho ≈ centro del ícono de 16px).

function BrokenConnectorLine() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 8,
        bottom: 8,
        left: 7,
        width: 0,
        borderLeft: "1px dashed rgba(184,92,92,0.3)",
        zIndex: 0,
      }}
    />
  );
}

function ContinuousConnectorLine() {
  return (
    <motion.span
      aria-hidden="true"
      variants={rightConnectorVariants}
      style={{
        position: "absolute",
        top: 8,
        bottom: 8,
        left: 7,
        width: 0,
        borderLeft: "1.5px solid rgba(79,209,224,0.4)",
        transformOrigin: "top",
        zIndex: 0,
      }}
    />
  );
}

// ─── estilos compartidos ─────────────────────────────────────────────────────

const cardBase: React.CSSProperties = {
  backgroundColor: "#182534",
  borderRadius: 0,
  boxShadow: "none",
  position: "relative",
  padding: 0,
};

const itemTextBase: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  margin: 0,
};

const kickerLabelBase: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "2px",
  margin: 0,
};

// ─── variants de la secuencia narrativa ──────────────────────────────────────
// La card izquierda usa 3 estados explícitos (hidden → show → dimmed) en vez
// de mezclar whileInView con animate inline — evita conflictos de Motion al
// cambiar de fuente de animación a mitad de la secuencia.

const leftCardVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  dimmed: {
    opacity: 0.55,
    x: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const leftListVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
  // El padre pasa a animate="dimmed" tras la secuencia — sin un estado
  // "dimmed" propio, los hijos controlados por variants perderían el
  // estado propagado y colapsarían a "hidden". Mantiene la posición final.
  dimmed: {},
};

const leftItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
  dimmed: {
    opacity: 1,
    x: 0,
  },
};

// La secuencia izquierda ("Enfoque tradicional") corre completa —
// entrada + lista + atenuación— antes de que arranque la derecha, para
// que "Enfoque Yeti BI" entre después, con protagonismo propio, en vez
// de competir en paralelo por la atención del usuario. La ventana en que
// solo se ve "tradicional" se acortó (de 2.8s a 1.6s de LEFT_DIM_DELAY)
// tras revisión de UX: era demasiado tiempo parado en una sola card para
// el ritmo real de scroll de un usuario.
// La card derecha ya no espera a que termine toda la secuencia izquierda: con
// 2.6s de retraso quedaba invisible hasta que el usuario ya había pasado de
// largo (en móvil, apiladas, obligaba a llegar a la sección siguiente). Entra
// mientras la izquierda aún se atenúa: se conserva el orden narrativo
// —tradicional primero, Yeti BI después— sin dejar un hueco vacío.
const LEFT_SEQUENCE_END = 0.8; // show (0.5s) + primeros ítems de la lista
const RIGHT_CARD_DELAY = LEFT_SEQUENCE_END + 0.1;

const rightBarVariants: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.4, delay: RIGHT_CARD_DELAY },
  },
};

const rightCardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: RIGHT_CARD_DELAY + 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

const rightHeaderVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, delay: RIGHT_CARD_DELAY + 0.3 },
  },
};

// Resplandor de protagonismo: entra fuerte junto con la card y se asienta
// a un valor sutil, marcando que este es el punto de llegada de la narrativa.
const rightGlowVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.9, 0.35],
    transition: { duration: 1.1, delay: RIGHT_CARD_DELAY, times: [0, 0.35, 1], ease: "easeOut" },
  },
};

const RIGHT_ITEMS_START = RIGHT_CARD_DELAY + 0.5;

const rightListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: RIGHT_ITEMS_START,
    },
  },
};

const rightItemVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
};

// La línea continua se dibuja en sincronía con el recorrido del stagger de ítems.
const RIGHT_ITEMS_SPAN = 4 * 0.08 + 0.35; // ≈ 0.67s desde el primer ítem al último
const rightConnectorVariants: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: RIGHT_ITEMS_SPAN, delay: RIGHT_ITEMS_START, ease: "linear" },
  },
};

// Último ítem termina ~ RIGHT_ITEMS_START + 4*0.08 + 0.35 ≈ 2.37s
const RIGHT_LAST_ITEM_END = RIGHT_ITEMS_START + RIGHT_ITEMS_SPAN;
const rightClosingVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: RIGHT_LAST_ITEM_END + 0.2 },
  },
};

// Se completa toda la secuencia derecha ~2.8s desde el inicio.
const LEFT_DIM_DELAY = 1.6;

// ─── DifferentiatorSection ───────────────────────────────────────────────────

export default function DifferentiatorSection() {
  const rm = useReducedMotion();
  const [leftState, setLeftState] = useState<"hidden" | "show" | "dimmed">("hidden");
  const dimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <section
      className="relative w-full differentiator-section"
      style={{
        background: "linear-gradient(180deg, rgba(79,209,224,0.10) 0%, rgba(79,209,224,0.05) 100%), #0B1420",
        overflow: "hidden",
      }}
    >
    <div
      className="mx-auto differentiator-inner"
      style={{
        maxWidth: 1200,
        padding: "80px 48px",
      }}
    >
      {/* Header de sección */}
      <div style={{ marginBottom: 80 }}>
        <p
          className="flex items-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#4FD1E0",
            marginBottom: 16,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 24,
              height: 1,
              backgroundColor: "#4FD1E0",
              marginRight: 12,
            }}
          />
          DÓNDE EMPEZAMOS
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
          La diferencia está en dónde empezamos
        </h2>
      </div>

      {/* Comparación */}
      <div
        className="differentiator-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          width: "100%",
        }}
      >
        {/* Card izquierda — Enfoque tradicional */}
        <motion.article
          className="differentiator-card differentiator-card-left"
          tabIndex={0}
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : leftState}
          onViewportEnter={
            rm
              ? undefined
              : () => {
                  setLeftState("show");
                  if (dimTimer.current) return;
                  dimTimer.current = setTimeout(() => {
                    setLeftState("dimmed");
                  }, LEFT_DIM_DELAY * 1000);
                }
          }
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          variants={rm ? undefined : leftCardVariants}
          style={cardBase}
        >
          <CornerBracket corner="tl" color="rgba(255,255,255,0.15)" />
          <CornerBracket corner="tr" color="rgba(255,255,255,0.15)" />
          <CornerBracket corner="bl" color="rgba(255,255,255,0.15)" />
          <CornerBracket corner="br" color="rgba(255,255,255,0.15)" />

          {/* Banda de header */}
          <div
            className="flex items-center card-header-band"
            style={{
              gap: 16,
              padding: "28px 36px",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClockIcon />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#5D6B7A",
                  margin: "0 0 4px",
                }}
              >
                Enfoque tradicional
              </h3>
              <p style={{ ...kickerLabelBase, color: "rgba(255,255,255,0.45)" }}>
                EL ESTÁNDAR DEL MERCADO
              </p>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="card-body" style={{ padding: "32px 36px 40px" }}>
            <motion.ul
              variants={rm ? undefined : leftListVariants}
              style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}
            >
              <BrokenConnectorLine />
              {TRADICIONAL_ITEMS.map((item, i) => (
                <motion.li
                  key={i}
                  variants={rm ? undefined : leftItemVariants}
                  className="flex items-start"
                  style={{
                    gap: 14,
                    marginBottom: i === TRADICIONAL_ITEMS.length - 1 ? 0 : 20,
                    position: "relative",
                  }}
                >
                  <CrossIcon />
                  <p style={{ ...itemTextBase, color: "#5D6B7A" }}>{item}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.article>

        {/* Card derecha — Enfoque Yeti BI */}
        <motion.article
          className="differentiator-card"
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : "show"}
          // Se dispara en cuanto asoma por abajo (antes exigía 80px dentro del
          // viewport, lo que en móvil retrasaba la card hasta la sección siguiente).
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          variants={rm ? undefined : rightCardVariants}
          style={{
            ...cardBase,
            borderTop: "2px solid #4FD1E0",
            overflow: "hidden",
          }}
        >
          <motion.span
            aria-hidden
            variants={rm ? undefined : rightGlowVariants}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle at 50% 0%, rgba(79,209,224,0.10) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <motion.span
            aria-hidden
            variants={rm ? undefined : rightBarVariants}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: "#4FD1E0",
              transformOrigin: "left",
            }}
          />

          {/* Brackets laterales — los superiores se omiten para no duplicar la barra */}
          <CornerBracket corner="bl" color="rgba(79,209,224,0.4)" />
          <CornerBracket corner="br" color="rgba(79,209,224,0.4)" />

          {/* Banda de header */}
          <motion.div
            variants={rm ? undefined : rightHeaderVariants}
            className="flex items-center card-header-band"
            style={{
              gap: 16,
              padding: "28px 36px",
              backgroundColor: "rgba(79,209,224,0.04)",
              borderBottom: "1px solid rgba(79,209,224,0.10)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                border: "1px solid rgba(79,209,224,0.3)",
                backgroundColor: "rgba(79,209,224,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TargetIcon />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#FFFFFF",
                  margin: "0 0 4px",
                }}
              >
                Enfoque Yeti BI
              </h3>
              <p style={{ ...kickerLabelBase, color: "#4FD1E0" }}>
                PROCESO PRIMERO, DATO SEGUNDO
              </p>
            </div>
          </motion.div>

          {/* Cuerpo */}
          <div className="card-body" style={{ padding: "32px 36px 40px" }}>
            <motion.ul
              variants={rm ? undefined : rightListVariants}
              style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}
            >
              <ContinuousConnectorLine />
              {YETIBI_ITEMS.map((item, i) => (
                <motion.li
                  key={i}
                  variants={rm ? undefined : rightItemVariants}
                  className="flex items-start"
                  style={{
                    gap: 14,
                    marginBottom: i === YETIBI_ITEMS.length - 1 ? 0 : 20,
                    position: "relative",
                  }}
                >
                  <CheckIcon />
                  <p style={{ ...itemTextBase, color: "#FFFFFF" }}>{item}</p>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={rm ? undefined : rightClosingVariants}
              style={{
                borderTop: "1px solid rgba(79,209,224,0.10)",
                paddingTop: 24,
                marginTop: 28,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4FD1E0",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Diagnosticamos → construimos con propósito → medimos que siga
                sirviendo.
              </p>
            </motion.div>
          </div>
        </motion.article>
      </div>

      <a
        href="#proceso"
        className="differentiator-cta inline-block"
        style={{
          marginTop: 48,
          fontSize: 14,
          fontWeight: 600,
          color: "#4FD1E0",
          textDecoration: "none",
        }}
      >
        Conoce el proceso completo ↓
      </a>

      <style>{`
        /* las cards son focalizables (tabIndex=0): indicador de foco propio */
        .differentiator-card:focus-visible {
          outline: 2px solid #4FD1E0;
          outline-offset: 2px;
        }
        .differentiator-card-left:hover,
        .differentiator-card-left:focus-visible {
          opacity: 1 !important;
        }
        .differentiator-card-left {
          transition: opacity 0.3s ease;
        }
        .differentiator-cta:hover {
          color: #3BB8C7;
          text-decoration: underline;
        }
        @media (max-width: 960px) {
          .differentiator-inner {
            padding: 40px 20px !important;
          }
          .differentiator-inner > div:first-child {
            margin-bottom: 24px !important;
          }
          .differentiator-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .card-header-band {
            padding: 13px 16px !important;
            gap: 12px !important;
          }
          .card-body {
            padding: 14px 16px 16px !important;
          }
          .card-body li {
            margin-bottom: 11px !important;
            gap: 10px !important;
          }
          .card-body li p {
            font-size: 13.5px !important;
            line-height: 1.5 !important;
          }
          .corner-bracket {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>
    </div>
    </section>
  );
}
