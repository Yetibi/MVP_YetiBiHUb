"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

// ─── shared ──────────────────────────────────────────────────────────────────

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#A89DC0",
};

function floatVariants(duration: number, distance: number): Variants {
  return {
    float: {
      y: [0, -distance, 0],
      transition: { duration, repeat: Infinity, ease: "easeInOut" },
    },
  };
}

function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span
      aria-hidden
      className={pulse ? "animate-pulse" : undefined}
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        backgroundColor: color,
        marginRight: 8,
      }}
    />
  );
}

const widgetBase: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "#141020",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 0,
  boxShadow: "none",
  padding: 20,
};

// ─── Widget 1 — Histograma ───────────────────────────────────────────────────

const BARRAS = [62, 78, 55, 88, 34, 70, 92];
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL"];

function HistogramaWidget({ rm }: { rm: boolean | null }) {
  return (
    <motion.div
      variants={rm ? undefined : floatVariants(7, 8)}
      animate={rm ? undefined : "float"}
      style={{
        ...widgetBase,
        top: 10,
        right: 20,
        width: 270,
        borderColor: "rgba(224,123,48,0.15)",
      }}
    >
      <p style={monoLabel} className="flex items-center mb-4">
        <Dot color="#E07B30" />
        VARIABILIDAD DEL PROCESO
      </p>
      <div className="flex items-end" style={{ gap: 6, height: 80 }}>
        {BARRAS.map((h, i) => (
          <motion.div
            key={i}
            initial={rm ? undefined : { height: 0 }}
            whileInView={rm ? undefined : { height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              flex: 1,
              height: rm ? `${h}%` : undefined,
              backgroundColor: i === 4 ? "#A89DC0" : "#E07B30",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between" style={{ marginTop: 8 }}>
        {MESES.map((m) => (
          <span
            key={m}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              opacity: 0.15,
              color: "#FFFFFF",
            }}
          >
            {m}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Widget 2 — KPI card ─────────────────────────────────────────────────────

function KpiWidget({ rm }: { rm: boolean | null }) {
  return (
    <motion.div
      variants={rm ? undefined : floatVariants(8, 6)}
      animate={rm ? undefined : "float"}
      style={{
        ...widgetBase,
        top: 0,
        right: 310,
        width: 175,
        borderLeft: "2px solid #E07B30",
      }}
    >
      <p style={monoLabel}>FUGA DETECTADA</p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 800,
          fontSize: 36,
          color: "#E07B30",
          margin: "6px 0 0",
          lineHeight: 1,
        }}
      >
        $4.2M
      </p>
      <p style={{ ...monoLabel, marginTop: 4 }}>COP / MES</p>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          marginTop: 14,
          paddingTop: 10,
        }}
      >
        <span style={{ color: "#4ade80", fontSize: 11 }}>▼ Recuperable</span>
      </div>
    </motion.div>
  );
}

// ─── Widget 3 — Línea de tendencia ───────────────────────────────────────────

const TREND_PATH = "M 4 70 C 40 65, 60 55, 90 48 S 140 30, 180 24 S 240 8, 276 6";
const TREND_AREA = `${TREND_PATH} L 276 90 L 4 90 Z`;

function TendenciaWidget({ rm }: { rm: boolean | null }) {
  return (
    <motion.div
      variants={rm ? undefined : floatVariants(6.5, 9)}
      animate={rm ? undefined : "float"}
      style={{
        ...widgetBase,
        top: 230,
        right: 240,
        width: 290,
      }}
    >
      <p style={monoLabel} className="mb-3">
        THROUGHPUT OPERATIVO
      </p>
      <svg viewBox="0 0 280 90" width="100%" height={90} fill="none">
        {[18, 40, 62].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={280}
            y2={y}
            stroke="#FFFFFF"
            strokeOpacity={0.04}
          />
        ))}
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E07B30" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#E07B30" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={TREND_AREA}
          fill="url(#trendFill)"
          initial={rm ? undefined : { opacity: 0 }}
          whileInView={rm ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d={TREND_PATH}
          stroke="#E07B30"
          strokeWidth={2}
          strokeLinecap="round"
          initial={rm ? undefined : { pathLength: 0 }}
          whileInView={rm ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        <motion.circle
          cx={276}
          cy={6}
          r={3.5}
          fill="#E07B30"
          initial={rm ? undefined : { scale: 0 }}
          whileInView={rm ? undefined : { scale: [1, 1.6, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 1.2, repeat: Infinity }}
        />
      </svg>
      <div className="flex justify-between" style={{ marginTop: 4 }}>
        {["Q1", "Q2", "Q3", "Q4"].map((q) => (
          <span
            key={q}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              opacity: 0.15,
              color: "#FFFFFF",
            }}
          >
            {q}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Widget 4 — Campana de Gauss ─────────────────────────────────────────────

const GAUSS_PATH =
  "M 0 70 C 30 70, 40 68, 55 55 C 70 20, 85 8, 100 8 C 115 8, 130 20, 145 55 C 160 68, 170 70, 200 70";
const GAUSS_AREA = `${GAUSS_PATH} L 200 78 L 0 78 Z`;

function GaussianWidget({ rm }: { rm: boolean | null }) {
  return (
    <motion.div
      variants={rm ? undefined : floatVariants(7.5, 7)}
      animate={rm ? undefined : "float"}
      style={{
        ...widgetBase,
        bottom: 30,
        right: 10,
        width: 245,
        borderColor: "rgba(123,79,150,0.2)",
      }}
    >
      <p style={monoLabel} className="mb-3">
        DISTRIBUCIÓN DE CALIDAD
      </p>
      <svg viewBox="0 0 200 82" width="100%" height={82} fill="none">
        <defs>
          <linearGradient id="gaussFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7B4F96" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#7B4F96" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={GAUSS_AREA}
          fill="url(#gaussFill)"
          initial={rm ? undefined : { opacity: 0 }}
          whileInView={rm ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d={GAUSS_PATH}
          stroke="#7B4F96"
          strokeWidth={2}
          strokeLinecap="round"
          initial={rm ? undefined : { pathLength: 0 }}
          whileInView={rm ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <line
          x1={100}
          y1={4}
          x2={100}
          y2={78}
          stroke="#E07B30"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <text x={96} y={14} fill="#E07B30" fontSize={8} fontFamily="var(--font-mono)">
          μ
        </text>
        <text x={48} y={78} fill="#A89DC0" fontSize={8} fontFamily="var(--font-mono)" opacity={0.5}>
          -1σ
        </text>
        <text x={148} y={78} fill="#A89DC0" fontSize={8} fontFamily="var(--font-mono)" opacity={0.5}>
          +1σ
        </text>
      </svg>
    </motion.div>
  );
}

// ─── Widget 5 — Alerta ───────────────────────────────────────────────────────

function AlertaWidget({ rm }: { rm: boolean | null }) {
  return (
    <motion.div
      initial={rm ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rm ? 0 : 4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        ...widgetBase,
        bottom: 10,
        right: 275,
        width: 210,
        borderLeft: "2px solid #E07B30",
      }}
    >
      <p className="flex items-center" style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
        <Dot color="#E07B30" pulse={!rm} />
        Anomalía detectada
      </p>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#A89DC0",
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        Proceso de facturación / Variabilidad +2.3σ fuera de rango
      </p>
    </motion.div>
  );
}

// ─── AnimatedWidgets ─────────────────────────────────────────────────────────

export default function AnimatedWidgets() {
  const rm = useReducedMotion();

  return (
    <div
      className="relative"
      style={{ height: 540, width: 580, maxWidth: "100%", margin: "0 auto" }}
      aria-hidden="true"
    >
      <KpiWidget rm={rm} />
      <HistogramaWidget rm={rm} />
      <TendenciaWidget rm={rm} />
      <GaussianWidget rm={rm} />
      <AlertaWidget rm={rm} />
    </div>
  );
}
