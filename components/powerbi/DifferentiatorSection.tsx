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
      <circle cx="12" cy="12" r="9" stroke="#A89DC0" strokeWidth={1.5} />
      <path d="M12 7v5l3.5 2" stroke="#A89DC0" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#E07B30" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="4.5" stroke="#E07B30" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="1" fill="#E07B30" />
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
      style={{ flexShrink: 0, position: "relative", zIndex: 1, backgroundColor: "#141020" }}
    >
      <motion.path
        d="M3 3 L13 13"
        stroke="#B85C5C"
        strokeWidth={1.8}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.path
        d="M13 3 L3 13"
        stroke="#B85C5C"
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
      style={{ flexShrink: 0, position: "relative", zIndex: 1, backgroundColor: "#141020" }}
    >
      <motion.path
        d="M3 8.5 L6.5 12"
        stroke="#E07B30"
        strokeWidth={1.8}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.path
        d="M6.5 12 L13 4"
        stroke="#E07B30"
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
        borderLeft: "1.5px solid rgba(224,123,48,0.4)",
        transformOrigin: "top",
        zIndex: 0,
      }}
    />
  );
}

// ─── estilos compartidos ─────────────────────────────────────────────────────

const cardBase: React.CSSProperties = {
  backgroundColor: "#161225",
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
// de competir en paralelo por la atención del usuario.
const LEFT_SEQUENCE_END = 3.4; // show (0.5s) + lista (~0.6s) + dimmed (2.8s inicio + 0.6s)
const RIGHT_CARD_DELAY = LEFT_SEQUENCE_END + 0.2;

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
const LEFT_DIM_DELAY = 2.8;

// ─── DifferentiatorSection ───────────────────────────────────────────────────

export default function DifferentiatorSection() {
  const rm = useReducedMotion();
  const [leftState, setLeftState] = useState<"hidden" | "show" | "dimmed">("hidden");
  const dimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <section
      className="relative mx-auto"
      style={{
        maxWidth: 1200,
        padding: "80px 24px",
        backgroundColor: "#0E0B14",
      }}
    >
      {/* Header de sección */}
      <div style={{ marginBottom: 64 }}>
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
          gap: 24,
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
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          variants={rm ? undefined : leftCardVariants}
          style={{
            ...cardBase,
            outline: "none",
          }}
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
                  color: "#A89DC0",
                  margin: "0 0 4px",
                }}
              >
                Enfoque tradicional
              </h3>
              <p style={{ ...kickerLabelBase, color: "rgba(255,255,255,0.25)" }}>
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
                  <p style={{ ...itemTextBase, color: "#A89DC0" }}>{item}</p>
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
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          variants={rm ? undefined : rightCardVariants}
          style={{
            ...cardBase,
            borderTop: "2px solid #E07B30",
            overflow: "hidden",
          }}
        >
          <motion.span
            aria-hidden
            variants={rm ? undefined : rightGlowVariants}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle at 50% 0%, rgba(224,123,48,0.18) 0%, transparent 65%)",
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
              backgroundColor: "#E07B30",
              transformOrigin: "left",
            }}
          />

          {/* Brackets laterales — los superiores se omiten para no duplicar la barra */}
          <CornerBracket corner="bl" color="rgba(224,123,48,0.4)" />
          <CornerBracket corner="br" color="rgba(224,123,48,0.4)" />

          {/* Banda de header */}
          <motion.div
            variants={rm ? undefined : rightHeaderVariants}
            className="flex items-center card-header-band"
            style={{
              gap: 16,
              padding: "28px 36px",
              backgroundColor: "rgba(224,123,48,0.04)",
              borderBottom: "1px solid rgba(224,123,48,0.15)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                border: "1px solid rgba(224,123,48,0.3)",
                backgroundColor: "rgba(224,123,48,0.06)",
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
              <p style={{ ...kickerLabelBase, color: "#E07B30" }}>
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
                borderTop: "1px solid rgba(224,123,48,0.15)",
                paddingTop: 24,
                marginTop: 28,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#E07B30",
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
          color: "#E07B30",
          textDecoration: "none",
        }}
      >
        Conoce el proceso completo ↓
      </a>

      <style>{`
        .differentiator-card-left:hover,
        .differentiator-card-left:focus-visible {
          opacity: 1 !important;
        }
        .differentiator-card-left {
          transition: opacity 0.3s ease;
        }
        .differentiator-cta:hover {
          color: #C45A2A;
          text-decoration: underline;
        }
        @media (max-width: 960px) {
          .differentiator-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .card-header-band {
            padding: 20px 24px !important;
          }
          .card-body {
            padding: 24px 24px 28px !important;
          }
          .corner-bracket {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
