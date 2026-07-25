"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { heroContainer, heroItem } from "@/lib/motion";
import AnimatedWidgets from "@/components/powerbi/AnimatedWidgets";

const kickerStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "3px",
  color: "#E07B30",
};

function CornerBracket({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");
  const color = isTop ? "#E07B30" : "rgba(255,255,255,0.1)";

  return (
    <span
      aria-hidden
      className="hidden md:block"
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        top: isTop ? 0 : undefined,
        bottom: isTop ? undefined : 0,
        left: isLeft ? 0 : undefined,
        right: isLeft ? undefined : 0,
        borderTop: isTop ? `1.5px solid ${color}` : undefined,
        borderBottom: isTop ? undefined : `1.5px solid ${color}`,
        borderLeft: isLeft ? `1.5px solid ${color}` : undefined,
        borderRight: isLeft ? undefined : `1.5px solid ${color}`,
      }}
    />
  );
}

export default function HeroSection() {
  const rm = useReducedMotion();

  return (
    <section
      className="relative grid grid-cols-1 md:[grid-template-columns:1fr_1fr] items-center mx-auto"
      style={{
        maxWidth: 1280,
        minHeight: "auto",
        padding: "112px 24px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <style>{`
        @media (min-width: 960px) {
          #powerbi-hero { min-height: 100vh; padding-left: 48px; padding-right: 48px; }
        }
      `}</style>
      <div id="powerbi-hero" className="contents">
        <CornerBracket position="top-left" />
        <CornerBracket position="top-right" />
        <CornerBracket position="bottom-left" />
        <CornerBracket position="bottom-right" />

        {/* Copy */}
        <motion.div
          variants={rm ? undefined : heroContainer}
          initial={rm ? false : "hidden"}
          animate="show"
          className="flex flex-col items-start"
          style={{ gap: 24 }}
        >
          <motion.p
            variants={rm ? undefined : heroItem}
            className="flex items-center"
            style={kickerStyle}
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
            SERVICIOS POWER BI · MEDELLÍN, COLOMBIA
          </motion.p>

          <motion.h1
            variants={rm ? undefined : heroItem}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.8vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            No Solo necesitas un dashboard.
            <br />
            <span style={{ color: "#E07B30" }}>Necesitas confiar en el dato</span>{" "}
            que sostiene cada decisión.
          </motion.h1>

          <motion.p
            variants={rm ? undefined : heroItem}
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#A89DC0",
              lineHeight: 1.7,
              maxWidth: 460,
              margin: 0,
            }}
          >
            Diseñamos, construimos y sostenemos proyectos de visualización y
            análisis de datos — pero solo después de diagnosticar si tu
            proceso y tu dato están listos.
          </motion.p>

          <motion.div
            variants={rm ? undefined : heroItem}
            className="flex flex-row flex-wrap"
            style={{ gap: 12 }}
          >
            <Link
              href="/powerbi/formulario"
              className="powerbi-cta-primary relative inline-flex items-center overflow-hidden"
              style={{
                backgroundColor: "#E07B30",
                color: "#0E0B14",
                padding: "13px 28px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span className="relative z-10">
                Evalúa la viabilidad de tu proyecto →
              </span>
            </Link>

            <a
              href="#como-funciona"
              className="powerbi-cta-secondary inline-flex items-center"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#A89DC0",
                padding: "13px 24px",
                fontSize: 13,
                fontWeight: 400,
              }}
            >
              Cómo funciona ↓
            </a>
          </motion.div>
        </motion.div>

        {/* Widgets */}
        <div className="mt-12 md:mt-0 w-full overflow-hidden">
          <div className="hidden md:block">
            <AnimatedWidgets />
          </div>
          <div
            className="flex md:hidden justify-center"
            style={{ transform: "scale(0.65)", opacity: 0.5, transformOrigin: "top center" }}
          >
            <AnimatedWidgets />
          </div>
        </div>
      </div>

      <style>{`
        .powerbi-cta-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 0%;
          background-color: #C45A2A;
          transition: width 0.3s ease;
          z-index: 0;
        }
        .powerbi-cta-primary:hover::before {
          width: 100%;
        }
        .powerbi-cta-secondary:hover {
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>
    </section>
  );
}
