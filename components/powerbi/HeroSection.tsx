"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { heroContainer, heroItem } from "@/lib/motion";
import { SpecularButton } from "@/components/powerbi/SpecularButton";

// ─── shared ──────────────────────────────────────────────────────────────────

const bgFadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

// ─── Gráficas de fondo — solo líneas/curvas, sin texto ni KPIs (no deben
// competir con el headline). Paleta neutra tenue (blancos/grises translúcidos)
// para no chocar con el naranja del subtítulo. Cada una conserva su propia
// animación interna de entrada.

const NEUTRAL_LINE = "rgba(255,255,255,0.55)";
const NEUTRAL_FILL_FROM = "rgba(255,255,255,0.14)";
const NEUTRAL_DOT = "rgba(255,255,255,0.6)";

function Chart01Lollipop({ rm }: { rm: boolean | null }) {
  const rangos = [
    [30, 62], [22, 78], [35, 55], [18, 88], [45, 50], [25, 70], [15, 92],
  ];
  const h = 340;
  const w = 1000;
  const gap = 36;
  const colW = (w - gap * (rangos.length - 1)) / rangos.length;
  const yFor = (v: number) => h - (v / 100) * h;

  return (
    <div style={{ width: "100%", maxWidth: 1000 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} fill="none">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} y1={h * f} x2={w} y2={h * f} stroke="#FFFFFF" strokeOpacity={0.06} strokeDasharray="3 10" />
        ))}
        {rangos.map(([min, max], i) => {
          const cx = i * (colW + gap) + colW / 2;
          const yMin = yFor(min);
          const yMax = yFor(max);
          return (
            <g key={i}>
              <motion.line
                x1={cx} x2={cx} y1={h} y2={h}
                stroke={NEUTRAL_LINE} strokeWidth={3}
                initial={rm ? false : { y1: h, y2: h }}
                animate={{ y1: yMin, y2: yMax }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <motion.circle
                cx={cx} cy={h} r={7} fill={NEUTRAL_DOT}
                initial={rm ? false : { cy: h }}
                animate={{ cy: yMin }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              <motion.circle
                cx={cx} cy={h} r={7} fill={NEUTRAL_DOT}
                initial={rm ? false : { cy: h, opacity: 0 }}
                animate={{ cy: yMax, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Chart02Trend({ rm }: { rm: boolean | null }) {
  const path = "M 10 280 C 170 250, 260 210, 380 190 S 590 110, 740 90 S 890 25, 990 18";
  const area = `${path} L 990 340 L 10 340 Z`;
  const dots = [[10, 280], [230, 225], [380, 190], [610, 130], [820, 55], [990, 18]] as const;

  return (
    <div style={{ width: "100%", maxWidth: 1000 }}>
      <svg viewBox="0 0 1000 340" width="100%" height={340} fill="none">
        {[80, 160, 240].map((y) => (
          <line key={y} x1={0} y1={y} x2={1000} y2={y} stroke="#FFFFFF" strokeOpacity={0.06} strokeDasharray="3 12" />
        ))}
        <defs>
          <linearGradient id="hero-trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={area} fill="url(#hero-trendFill)"
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d={path} stroke={NEUTRAL_LINE} strokeWidth={3} strokeLinecap="round"
          initial={rm ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        {dots.map(([x, y], i) => (
          <motion.circle
            key={i} cx={x} cy={y} r={7} fill={NEUTRAL_DOT}
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
          />
        ))}
      </svg>
    </div>
  );
}

function Chart03Gauss({ rm }: { rm: boolean | null }) {
  const path = "M 0 290 C 150 290, 195 275, 265 220 C 335 75, 395 32, 480 32 C 565 32, 625 75, 695 220 C 765 275, 810 290, 960 290";
  const area = `${path} L 960 330 L 0 330 Z`;
  const tailLeft = "M 0 290 C 150 290, 195 275, 265 220 L 265 330 L 0 330 Z";
  const tailRight = "M 695 220 C 765 275, 810 290, 960 290 L 960 330 L 695 330 Z";

  return (
    <div style={{ width: "100%", maxWidth: 960 }}>
      <svg viewBox="0 0 960 330" width="100%" height={330} fill="none">
        <defs>
          <linearGradient id="hero-gaussFillBig" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={tailLeft} fill="rgba(255,255,255,0.05)" />
        <path d={tailRight} fill="rgba(255,255,255,0.05)" />
        <motion.path
          d={area} fill="url(#hero-gaussFillBig)"
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        />
        <motion.path
          d={path} stroke={NEUTRAL_LINE} strokeWidth={3.5} strokeLinecap="round"
          initial={rm ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeInOut" }}
        />
        <line x1={480} y1={24} x2={480} y2={330} stroke="#FFFFFF" strokeOpacity={0.14} strokeWidth={1.5} strokeDasharray="4 10" />
      </svg>
    </div>
  );
}

const CHARTS = [Chart03Gauss, Chart02Trend, Chart01Lollipop];
const CHART_INTERVAL_MS = 4500;

// ─── Fondo animado — una gráfica grande y tenue a la vez, en ciclo ───────────

function HeroBackground({ rm }: { rm: boolean | null }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden hero-background"
      initial={rm ? undefined : "hidden"}
      whileInView={rm ? undefined : "show"}
      viewport={{ once: true }}
      variants={rm ? undefined : bgFadeVariants}
      style={{ zIndex: 0 }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 hero-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 75%)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(224,123,48,0.05) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

// ─── Ciclo de gráficas — cubre todo el ancho y alto de la sección, detrás
// de todo el contenido de texto, en desktop y mobile. ────────────────────────

function HeroChartCycle({ rm }: { rm: boolean | null }) {
  const [activeChart, setActiveChart] = useState(0);

  useEffect(() => {
    if (rm) return;
    const id = setInterval(() => {
      setActiveChart((prev) => (prev + 1) % CHARTS.length);
    }, CHART_INTERVAL_MS);
    return () => clearInterval(id);
  }, [rm]);

  const ActiveChart = CHARTS[activeChart];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center hero-chart-cycle"
      style={{ zIndex: 1, opacity: 0.16 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={rm ? "static" : activeChart}
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={rm ? undefined : { opacity: 0 }}
          transition={{ duration: 1 }}
          className="hero-chart-slot"
          style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 40px" }}
        >
          <ActiveChart rm={rm} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const rm = useReducedMotion();

  return (
    <section
      className="relative flex flex-col items-center justify-center mx-auto hero-section"
      style={{
        minHeight: "100vh",
        padding: "80px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <HeroBackground rm={rm} />
      <HeroChartCycle rm={rm} />

      <motion.div
        variants={rm ? undefined : heroContainer}
        initial={rm ? false : "hidden"}
        animate="show"
        className="relative flex flex-col items-center"
        style={{ zIndex: 2, gap: 0 }}
      >
        <motion.h1
          variants={rm ? undefined : heroItem}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "clamp(48px, 8vw, 104px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            textAlign: "center",
            maxWidth: 1200,
            margin: "0 0 8px",
          }}
        >
          No solo necesitas un dashboard
        </motion.h1>

        <motion.p
          variants={rm ? undefined : heroItem}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "clamp(28px, 4.5vw, 100px)",
            color: "#E07B30",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: 1100,
            margin: "0 0 32px",
          }}
        >
          Necesitas confiar en el dato que sostiene cada decisión.
        </motion.p>

        <motion.p
          variants={rm ? undefined : heroItem}
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#A89DC0",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: 700,
            margin: "0 0 40px",
          }}
        >
          Diseñamos, construimos y sostenemos proyectos de visualización y
          análisis de datos — pero solo después de diagnosticar si tu proceso
          y tu dato están listos.
        </motion.p>

        <motion.div variants={rm ? undefined : heroItem}>
          <SpecularButton
            size="lg"
            radius={0}
            tint="#E07B30"
            tintOpacity={0.5}
            darkenColor="#C45A2A"
            textColor="#0E0B14"
            href="/powerbi/formulario"
            ariaLabel="Evalúa la viabilidad de tu proyecto"
          >
            Evalúa la viabilidad →
          </SpecularButton>
        </motion.div>
      </motion.div>

      <style>{`
        @media (min-width: 961px) {
          .hero-chart-slot {
            transform: scale(1.7);
          }
        }
        @media (max-width: 960px) {
          .hero-section {
            min-height: 100vh;
            padding: 60px 24px;
          }
          .hero-background {
            min-height: 100vh;
          }
          .hero-chart-cycle {
            opacity: 0.13 !important;
          }
          .hero-chart-slot {
            transform: scale(2.6, 9);
          }
        }
      `}</style>
    </section>
  );
}
