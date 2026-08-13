"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { heroContainer, heroItem } from "@/lib/motion";
import ParticleDashboard from "@/components/ParticleDashboard";

// ─── shared ──────────────────────────────────────────────────────────────────

const bgFadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

const TEAL = "#4FD1E0";
const ORANGE = "#4FD1E0";
const MUTED = "#7A8BA0";

// ─── Fondo: grid pattern + ambient glow (se conserva del diseño previo) ──────

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
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(79,209,224,0.05) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const rm = useReducedMotion();

  // Ancho real de la franja del tablero móvil. El canvas se dibuja a ese tamaño
  // (cap 430) en vez de escalarse por CSS, que deformaría velas y tipografía.
  const dashRef = useRef<HTMLDivElement>(null);
  const [dashW, setDashW] = useState(0);
  // El tablero es el bloque que cede altura primero: en viewports bajos se
  // encoge para que el CTA siga entrando en pantalla. 175px es el mínimo con
  // el que los KPIs de 17px siguen siendo legibles.
  const [dashH, setDashH] = useState(260);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    // 22px = padding (10+10) + borde (1+1) de la tarjeta: el canvas se dibuja
    // al ancho interior para que la pieza completa no desborde la columna.
    const CARD_CHROME = 22;
    // Proporción de referencia del tablero (610x385 del desktop). Se conserva
    // en todos los tamaños: el ancho se deriva del alto disponible.
    const AR = 610 / 385;
    const measure = () => {
      const avail = Math.round(el.getBoundingClientRect().width) - CARD_CHROME;
      const maxW = Math.max(200, Math.min(430 - CARD_CHROME, avail));
      // El tablero ocupa el espacio que sobra tras el resto del hero, medido en
      // vivo: así el CTA siempre entra en pantalla sin tocar copy ni tipografía.
      const host = el.parentElement;
      let libre = 0;
      if (host) {
        const usado = Array.from(host.children).reduce((acc, child) => {
          if (child === el) return acc;
          const cs = getComputedStyle(child);
          return acc + child.getBoundingClientRect().height +
            parseFloat(cs.marginTop || "0") + parseFloat(cs.marginBottom || "0");
        }, 0);
        const hcs = getComputedStyle(host);
        const chrome = parseFloat(hcs.paddingTop) + parseFloat(hcs.paddingBottom) +
          parseFloat(getComputedStyle(el).marginBottom || "0");
        // 64px = navbar fija; 8px de holgura para redondeos
        libre = window.innerHeight - 64 - chrome - usado - 8;
      }
      const budget = Math.max(150, Math.min(260, Math.round(libre)));
      // El canvas descuenta el cromo de la tarjeta y respeta AR: se toma el
      // menor entre el alto disponible y el que impone el ancho de la columna,
      // de modo que la pieza nunca se achata ni se alarga.
      const hFromBudget = budget - CARD_CHROME;
      const hFromWidth = Math.round(maxW / AR);
      const finalH = Math.max(120, Math.min(hFromBudget, hFromWidth));
      setDashH(finalH);
      setDashW(Math.round(finalH * AR));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden hero-section"
      style={{
        minHeight: "100vh",
        /* el navbar es fixed (64px): se reserva su alto para que el top bar
           técnico y el kicker no queden por debajo de él */
        paddingTop: 64,
        boxSizing: "border-box",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#0B1420",
      }}
    >
      <HeroBackground rm={rm} />

      {/* Tablero operacional desktop (4 paneles) — absolute, a la derecha.
          En móvil se usa la variante compact de 3 paneles (hero-gauss-inline). */}
      {/* 588x363 = 610x385 menos el cromo de la tarjeta (padding 10 + borde 1
          por lado): la pieza completa ocupa el mismo espacio que antes. */}
      <div aria-hidden="true" className="hero-gauss-wrap" style={{ zIndex: 1 }}>
        <ParticleDashboard width={588} height={363} mouseParallax />
      </div>

      {/* Scrim elíptico — solo desktop, donde hay solape que proteger */}
      <div
        aria-hidden="true"
        className="hero-scrim"
        style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
      />

      <motion.div
        variants={heroContainer}
        initial={rm ? false : "hidden"}
        animate="show"
        className="hero-content"
        style={{ position: "relative", zIndex: 3 }}
      >
        {/* Kicker */}
        <motion.div
          variants={heroItem}
          className="flex items-center hero-kicker"
          style={{ gap: 12 }}
        >
          <span aria-hidden style={{ display: "block", width: 24, height: 1, backgroundColor: ORANGE }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: ORANGE,
            }}
          >
            CONSULTORÍA POWER BI
          </span>
        </motion.div>

        {/* Tablero móvil — bloque en el flujo, sin texto encima.
            Se renderiza al ancho real medido para que el canvas salga a tamaño
            intrínseco: sin escalado CSS, sin distorsión de las velas. */}
        <motion.div
          variants={heroItem}
          aria-hidden="true"
          className="hero-gauss-inline"
          ref={dashRef}
        >
          {dashW > 0 && (
            <ParticleDashboard
              width={dashW}
              height={dashH}
              compact
              mouseParallax={false}
            />
          )}
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={heroItem}
          className="hero-headline"
          style={{
            fontFamily: "var(--font-roboto-condensed)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            marginTop: 0,
          }}
        >
          <span className="hero-headline-line">
            No solo<span className="hero-headline-br"> </span>necesitas un
          </span>
          {/* Espacio real entre "un" y "dashboard": sin él los lectores de
              pantalla leían "undashboard". El salto visual lo sigue dando el
              display:block de la línea outline, no la ausencia de espacio. */}{" "}
          <span className="hero-headline-outline-line">
            <span className="headline-outline">dashboard</span>
            <span className="hero-cursor" aria-hidden="true">_</span>
          </span>
        </motion.h1>

        {/* Divisor */}
        <motion.div
          variants={heroItem}
          aria-hidden="true"
          className="flex items-center hero-divider"
          style={{ gap: 10 }}
        >
          <span style={{ display: "block", flex: 1, height: 1, backgroundColor: "rgba(79,209,224,0.3)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: TEAL }}>▼</span>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={heroItem}
          className="hero-subheadline"
          style={{
            fontFamily: "var(--font-roboto-condensed)",
            fontWeight: 700,
            color: TEAL,
            borderLeft: `2px solid ${TEAL}`,
            paddingLeft: 14,
            lineHeight: 1.3,
            marginTop: 0,
          }}
        >
          Sistemas de decisión donde los procesos sostienen cada movimiento
        </motion.p>

        {/* Body */}
        <motion.p
          variants={heroItem}
          className="hero-body"
          style={{
            fontFamily: "var(--font-roboto)",
            fontWeight: 400,
            color: "#5D6B7A",
            lineHeight: 1.7,
            marginTop: 0,
          }}
        >
          Consultoría en{" "}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: TEAL,
              backgroundColor: "rgba(79,209,224,0.08)",
              padding: "1px 6px",
              borderRadius: 2,
            }}
            translate="no"
          >
            Power BI
          </span>{" "}
          que convierte indicadores en decisiones y decisiones en resultados.
          Construimos sistemas operacionales, no simplemente informes. 
        </motion.p>

        {/* Fila CTA */}
        <motion.div
          variants={heroItem}
          className="flex items-center hero-ctarow"
          style={{ gap: 20, flexWrap: "wrap" }}
        >
          <a
            href="/powerbi/formulario"
            aria-label="Evalúa la viabilidad de tu proyecto"
            className="hero-cta flex items-stretch"
            style={{ textDecoration: "none", borderRadius: 0 }}
          >
            <span
              style={{
                flex: 1,
                backgroundColor: TEAL,
                color: "#0B1420",
                fontFamily: "var(--font-roboto-condensed)",
                fontWeight: 800,
                letterSpacing: "0.8px",
                padding: 15,
                textAlign: "center",
              }}
            >
              EVALÚA LA VIABILIDAD
            </span>
            <span
              aria-hidden="true"
              style={{
                backgroundColor: "#1C2836",
                color: "#FFFFFF",
                padding: "15px 16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              →
            </span>
          </a>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "1px",
              color: TEAL,
            }}
          >
          
          </span>
        </motion.div>

        {/* Footer técnico */}
        <motion.p
          variants={heroItem}
          className="hero-footnote"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "1.2px",
            color: MUTED,
            margin: 0,
          }}
        >
          DIAGNÓSTICO.OPERACIONAL — 15 MIN — SIN COSTO
        </motion.p>
      </motion.div>

      <style>{`
        /* ── Campana de Gauss ───────────────────────────────────── */
        /* Móvil: bloque en el flujo, entre kicker y headline, sin solape.
           El kicker actúa de título de la figura; los labels del eje son la
           frontera con el headline. */
        /* Franja del tablero móvil: ancho completo de la columna de texto y
           altura dictada por el canvas. Sin height fijo ni object-fit, para que
           el canvas se muestre a su tamaño intrínseco (medido en JS). */
        .hero-gauss-inline {
          width: 100%;
          max-width: 430px;
          line-height: 0;   /* elimina el hueco del inline-box bajo el canvas */
        }
        .hero-gauss-inline canvas {
          display: block;
          max-width: 100%;
        }
        /* Desktop-only: campana absolute + scrim */
        .hero-gauss-wrap { display: none; }
        .hero-scrim { display: none; }

        /* ── Contenido ──────────────────────────────────────────── */
        /* Todo el hero debe caber en una pantalla: los espaciados escalan con
           la altura real del viewport (vh) en vez de ser px fijos. */
        .hero-content {
          padding: clamp(6px, 1.4vh, 24px) 20px clamp(10px, 2vh, 40px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .hero-kicker      { margin-bottom: clamp(6px, 0.9vh, 10px); }
        .hero-gauss-inline{ margin-bottom: clamp(10px, 1.4vh, 14px); }
        /* viewports bajos (≈640px): el hero recupera los últimos px del
           espaciado del tablero para que el CTA siga entrando en pantalla */
        @media (max-height: 680px) {
          .hero-kicker      { margin-bottom: 4px; }
          .hero-gauss-inline{ margin-bottom: 6px; }
        }
        .hero-headline    { margin-bottom: clamp(4px, 1.2vh, 20px); }
        /* la línea crece hasta un ancho acotado: la ▼ no se va al borde */
        .hero-divider     { margin-bottom: clamp(4px, 1.2vh, 20px); width: min(100%, 260px); }
        .hero-subheadline { margin-bottom: clamp(6px, 1.4vh, 20px); }
        /* separación body → CTA: más aire para que el banner respire */
        .hero-body        { margin-bottom: clamp(18px, 3.4vh, 40px); }
        .hero-ctarow      { margin-bottom: clamp(6px, 1.4vh, 24px); }

        /* ── Headline ───────────────────────────────────────────── */
        .hero-headline-line,
        .hero-headline-outline-line {
          display: block;
          line-height: 0.94;
          max-width: 100%;
        }
        .hero-headline {
          max-width: 100%;
        }
        .hero-headline-line {
          color: #FFFFFF;
          /* escala con el alto del viewport para que el hero quepa en una pantalla */
          font-size: clamp(34px, 6.4vh, 54px);
          /* evita la viuda "un" sola en la segunda línea */
          text-wrap: balance;
        }
        /* JetBrains Mono 800: al ser monoespaciada cada glifo ya trae su propio
           avance fijo, así que el stroke no invade a la vecina y letter-spacing
           puede ser 0 (a diferencia de Roboto Condensed, que sí solapaba). */
        .hero-headline-outline-line {
          font-family: var(--font-jetbrains-mono);
          font-weight: 800;
          font-size: clamp(27px, 5vh, 42px);
          line-height: 1.15;
          letter-spacing: 0;
        }
        .headline-outline {
          color: rgba(79,209,224,0.10);
          -webkit-text-stroke: 1.8px #4FD1E0;
          paint-order: stroke fill;
        }
        @supports not (-webkit-text-stroke: 2px teal) {
          .headline-outline {
            color: #4FD1E0;
            -webkit-text-stroke: 0;
          }
        }
        .hero-cursor {
          color: #4FD1E0;
          -webkit-text-stroke: 0;
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero-cursor {
            animation: heroBlink 1.1s step-end infinite;
          }
        }
        @keyframes heroBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .hero-subheadline { font-size: 17px; }
        .hero-body {
          font-size: 13px;
          text-wrap: pretty;
        }

        /* ── CTA ────────────────────────────────────────────────── */
        .hero-cta { transition: opacity 0.15s ease; }
        .hero-cta:hover { opacity: 0.9; }
        .hero-cta:focus-visible {
          outline: 2px solid #4FD1E0;
          outline-offset: 2px;
        }

        /* ── Desktop ────────────────────────────────────────────── */
        @media (min-width: 1024px) {
          /* En desktop manda el grid de 2 columnas: la campana inline móvil
             desaparece. El scrim ya no aplica — no hay texto sobre la figura. */
          .hero-gauss-inline { display: none; }
          .hero-scrim { display: none; }

          /* Grid real de 2 columnas: el texto vive en la izquierda (52%) y el
             tablero DENTRO de la derecha (48%). Sin absolute, sin solape. */
          .hero-section {
            display: grid;
            grid-template-columns: 52% 48%;
            align-items: center;
          }
          /* el tablero se centra en su columna a su tamaño intrínseco */
          .hero-gauss-wrap {
            display: flex;
            position: static;
            width: auto;
            justify-content: center;
            transform: none;
            pointer-events: none;
            grid-column: 2;
            grid-row: 1;
            padding-right: 32px;
          }
          /* la tarjeta del tablero se centra; el canvas conserva su tamaño
             intrínseco 610x385 dentro de ella */
          .hero-gauss-wrap > div {
            margin: auto;
            flex: none;
          }
          .hero-content {
            grid-column: 1;
            grid-row: 1;
            padding: 48px 32px 48px 64px;
            width: auto;
            max-width: none;
          }

          .hero-kicker span { font-size: 12px !important; }

          /* headline en 2 líneas exactas: "No solo" / "necesitas un" */
          .hero-headline-line {
            font-size: 100px;
            line-height: 0.94;
            white-space: normal;
            text-wrap: initial;
          }
          .hero-headline-br { display: block; height: 0; }
          .hero-headline-outline-line {
            font-size: 82px;
            line-height: 1.1;
          }
          .headline-outline { -webkit-text-stroke-width: 2px; }
          .hero-subheadline { font-size: 26px; max-width: 620px; }
          .hero-body { font-size: 18px; max-width: 620px; }

          /* CTA y metadatos técnicos escalados en la misma proporción */
          .hero-cta span { font-size: 17px !important; padding: 18px !important; }
          .hero-cta span:last-child { padding: 18px 20px !important; }
          .hero-ctarow > span { font-size: 11px !important; }
          .hero-footnote { font-size: 11px !important; }
        }

        @media (min-width: 1440px) {
          .hero-content { padding-left: 88px; }
        }
      `}</style>
    </section>
  );
}
