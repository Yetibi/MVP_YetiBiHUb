"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

// ─── shared ──────────────────────────────────────────────────────────────────

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#5D6B7A",
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
  backgroundColor: "#141F2E",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 0,
  boxShadow: "none",
  padding: 20,
};

// ─── Widget 1 — Lollipop chart ───────────────────────────────────────────────

// Por mes: rango [mínimo, máximo] observado — el mes 5 (MAY) es la anomalía.
const RANGOS = [
  [30, 62],
  [22, 78],
  [35, 55],
  [18, 88],
  [45, 50],
  [25, 70],
  [15, 92],
];
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL"];
const CHART_H = 80;
const CHART_W = 230;
const COL_GAP = 6;
const COL_W = (CHART_W - COL_GAP * (RANGOS.length - 1)) / RANGOS.length;

function yFor(v: number) {
  return CHART_H - (v / 100) * CHART_H;
}

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
        borderColor: "rgba(79,209,224,0.10)",
      }}
    >
      <p style={monoLabel} className="flex items-center mb-4">
        <Dot color="#4FD1E0" />
        VARIABILIDAD DEL PROCESO
      </p>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        width="100%"
        height={CHART_H}
        fill="none"
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            y1={CHART_H * f}
            x2={CHART_W}
            y2={CHART_H * f}
            stroke="#FFFFFF"
            strokeOpacity={0.06}
            strokeDasharray="2 6"
          />
        ))}

        {RANGOS.map(([min, max], i) => {
          const cx = i * (COL_W + COL_GAP) + COL_W / 2;
          const yMin = yFor(min);
          const yMax = yFor(max);
          const isAnomaly = i === 4;
          const color = isAnomaly ? "#5D6B7A" : "#4FD1E0";
          return (
            <g key={i}>
              <motion.line
                x1={cx}
                x2={cx}
                y1={CHART_H}
                y2={CHART_H}
                stroke={color}
                strokeOpacity={0.5}
                strokeWidth={2}
                initial={rm ? false : { y1: CHART_H, y2: CHART_H }}
                animate={{ y1: yMin, y2: yMax }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <motion.circle
                cx={cx}
                cy={CHART_H}
                r={3}
                fill={color}
                fillOpacity={0.5}
                initial={rm ? false : { cy: CHART_H }}
                animate={{ cy: yMin }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <motion.circle
                cx={cx}
                cy={CHART_H}
                r={3}
                fill={color}
                initial={rm ? false : { cy: CHART_H, opacity: 0 }}
                animate={{ cy: yMax, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between" style={{ marginTop: 10 }}>
        {MESES.map((m) => (
          <span
            key={m}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "1.5px",
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

const SPARK_POINTS = [
  [0, 4],
  [16, 7],
  [32, 6],
  [48, 12],
  [64, 11],
  [80, 18],
] as const;
const SPARK_PATH = SPARK_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

function WarningIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2 L14.5 13.5 L1.5 13.5 Z"
        stroke="#4FD1E0"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <line x1={8} y1={6.5} x2={8} y2={9.5} stroke="#4FD1E0" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={8} cy={11.5} r={0.75} fill="#4FD1E0" />
    </svg>
  );
}

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
        borderLeft: "2px solid #4FD1E0",
      }}
    >
      <p style={monoLabel} className="flex items-center" >
        <span style={{ marginRight: 6, display: "inline-flex" }}>
          <WarningIcon />
        </span>
        FUGA DETECTADA
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 800,
          fontSize: 36,
          color: "#4FD1E0",
          margin: "6px 0 0",
          lineHeight: 1,
        }}
      >
        $4.2M
      </p>
      <p style={{ ...monoLabel, marginTop: 4 }}>COP / MES</p>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(255,255,255,0.25)",
          marginTop: 6,
        }}
      >
        vs $3.8M mes anterior
      </p>
      <div
        style={{
          borderTop: "1px dashed rgba(255,255,255,0.08)",
          marginTop: 14,
          paddingTop: 10,
        }}
      >
        <span style={{ color: "#4FD1E0", fontSize: 11 }}>▼ Recuperable</span>
        <svg
          width={80}
          height={20}
          viewBox="0 0 80 20"
          fill="none"
          style={{ display: "block", marginTop: 6 }}
        >
          <motion.path
            d={SPARK_PATH}
            stroke="#4FD1E0"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={rm ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          {SPARK_POINTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} fill="#4FD1E0" />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Widget 3 — Línea de tendencia ───────────────────────────────────────────

const TREND_PATH = "M 4 70 C 40 65, 60 55, 90 48 S 140 30, 180 24 S 240 8, 276 6";
const TREND_AREA = `${TREND_PATH} L 276 90 L 4 90 Z`;
const TREND_DOTS = [
  [4, 70],
  [56, 58],
  [90, 48],
  [150, 27],
  [212, 15],
  [276, 6],
] as const;
const TREND_X = [4, 94, 184, 276];

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
      <svg viewBox="-24 0 304 90" width="100%" height={90} fill="none">
        {["0", "50K", "100K"].map((label, i) => (
          <text
            key={label}
            x={-22}
            y={[68, 40, 12][i]}
            fill="#FFFFFF"
            fillOpacity={0.15}
            fontSize={7}
            fontFamily="var(--font-mono)"
          >
            {label}
          </text>
        ))}
        {[18, 40, 62].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={280}
            y2={y}
            stroke="#FFFFFF"
            strokeOpacity={0.05}
            strokeDasharray="2 8"
          />
        ))}
        {TREND_X.map((x) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={90}
            stroke="#FFFFFF"
            strokeOpacity={0.05}
            strokeDasharray="2 8"
          />
        ))}
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FD1E0" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#4FD1E0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={TREND_AREA}
          fill="url(#trendFill)"
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d={TREND_PATH}
          stroke="#4FD1E0"
          strokeWidth={1.2}
          strokeLinecap="round"
          initial={rm ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        {TREND_DOTS.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={2.5}
            fill="#4FD1E0"
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
          />
        ))}
        <circle cx={276} cy={6} r={3} fill="#4FD1E0" />
        <motion.circle
          cx={276}
          cy={6}
          r={3}
          fill="none"
          stroke="#4FD1E0"
          strokeWidth={1}
          initial={rm ? undefined : { scale: 1, opacity: 0.6 }}
          animate={rm ? undefined : { scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: "276px 6px" }}
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
// Colas fuera de ±1σ (x=55 y x=145), recortadas al eje base y=78
const GAUSS_TAIL_LEFT = "M 0 70 C 30 70, 40 68, 55 55 L 55 78 L 0 78 Z";
const GAUSS_TAIL_RIGHT = "M 145 55 C 160 68, 170 70, 200 70 L 200 78 L 145 78 Z";
const GAUSS_TICKS = [
  { x: 10, label: "-2σ" },
  { x: 55, label: "-1σ" },
  { x: 100, label: "μ" },
  { x: 145, label: "+1σ" },
  { x: 190, label: "+2σ" },
];

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
        borderColor: "rgba(79,209,224,0.10)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p style={monoLabel} className="mb-0">
          DISTRIBUCIÓN DE CALIDAD
        </p>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          n=1,247
        </span>
      </div>
      <svg viewBox="0 0 200 82" width="100%" height={82} fill="none">
        <defs>
          <linearGradient id="gaussFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A78A0" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#4A78A0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={GAUSS_TAIL_LEFT} fill="rgba(255,176,32,0.10)" />
        <path d={GAUSS_TAIL_RIGHT} fill="rgba(255,176,32,0.10)" />
        <motion.path
          d={GAUSS_AREA}
          fill="url(#gaussFill)"
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d={GAUSS_PATH}
          stroke="#4A78A0"
          strokeWidth={1.2}
          strokeLinecap="round"
          initial={rm ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <line
          x1={100}
          y1={4}
          x2={100}
          y2={78}
          stroke="#4FD1E0"
          strokeWidth={0.8}
          strokeDasharray="2 4"
        />
        {GAUSS_TICKS.map(({ x }) => (
          <line
            key={x}
            x1={x}
            y1={74}
            x2={x}
            y2={78}
            stroke="#FFFFFF"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}
        <text x={96} y={14} fill="#4FD1E0" fontSize={8} fontFamily="var(--font-mono)">
          μ
        </text>
        <text x={48} y={78} fill="#5D6B7A" fontSize={8} fontFamily="var(--font-mono)" opacity={0.5}>
          -1σ
        </text>
        <text x={148} y={78} fill="#5D6B7A" fontSize={8} fontFamily="var(--font-mono)" opacity={0.5}>
          +1σ
        </text>
      </svg>
    </motion.div>
  );
}

// ─── Widget 5 — Alerta ───────────────────────────────────────────────────────

function RadarDot({ rm }: { rm: boolean | null }) {
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-block",
        width: 8,
        height: 8,
        marginRight: 8,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: "#4FD1E0",
        }}
      />
      {!rm && (
        <motion.span
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid #4FD1E0",
          }}
        />
      )}
    </span>
  );
}

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
        borderLeft: "2px solid #4FD1E0",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center" style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
          <RadarDot rm={rm} />
          Anomalía detectada
        </p>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "rgba(255,255,255,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          Hace 12 min
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#5D6B7A",
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        Proceso de facturación / Variabilidad +2.3σ fuera de rango
      </p>
      <div
        style={{
          width: "100%",
          height: 3,
          backgroundColor: "rgba(255,255,255,0.06)",
          marginTop: 12,
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #4FD1E0, #3BB8C7)",
          }}
          initial={rm ? false : { width: "0%" }}
          animate={{ width: "75%" }}
          transition={{ duration: 0.8, delay: rm ? 0 : 4.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
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
