"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

// ─── datos ────────────────────────────────────────────────────────────────────

const PAINS = [
  {
    num: "01",
    label: "TIEMPO",
    title: "Reportes que tardan días",
    desc: "Tu equipo gasta horas cruzando Excels para armar un informe que debería tomar minutos. El dato existe, pero está disperso y requiere traducción manual entre sistemas.",
  },
  {
    num: "02",
    label: "CONSISTENCIA",
    title: "Números que no cuadran",
    desc: "Cada área reporta cifras distintas para la misma pregunta. Sin una fuente única de verdad, cada reunión empieza con «¿cuál es el número correcto?»",
  },
  {
    num: "03",
    label: "ADOPCIÓN",
    title: "Licencias sin usar",
    desc: "Compraste Power BI pero nadie lo adoptó. El problema no fue la herramienta — fue que se desplegó sin diagnóstico previo del proceso ni plan de adopción.",
  },
  {
    num: "04",
    label: "CONFIANZA",
    title: "Decisiones por intuición",
    desc: "Tienes datos pero no confías en ellos. Entonces decides por experiencia, por costumbre, o por la opinión de quien lleva más años — no por evidencia.",
  },
] as const;

// ─── Sección desktop: pasos con scroll (clon de HowItWorks/StepsSection) ─────

function StepsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(PAINS.length - 1, Math.floor(v * PAINS.length));
    setActiveStep(idx);
  });

  return (
    <div ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        background: "#171225",
        display: "flex",
        flexDirection: "column",
        paddingTop: 80,
      }}>

        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: 96, paddingLeft: 48, paddingRight: 48 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <div aria-hidden style={{ width: 24, height: 1, background: "#E07B30" }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 1.2vw, 13px)",
              color: "#E07B30",
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
            }}>
              EL DIAGNÓSTICO EMPIEZA AQUÍ
            </span>
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "clamp(32px,4.2vw,48px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
          }}>
            CUATRO SEÑALES QUE FRENAN TUS DECISIONES
          </h2>
        </div>

        {/* Pains */}
        <div style={{
          flex: 7,
          display: "flex",
          alignItems: "stretch",
          minHeight: 0,
          gap: 16,
          padding: "0 48px",
        }}>
          {PAINS.map((pain, i) => {
            const isActive = i === activeStep;
            return (
              <motion.div
                key={i}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  filter: isActive ? "blur(0px)" : "blur(1px)",
                  scale: isActive ? 1 : 0.92,
                }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: "100%",
                  width: isActive ? undefined : 140,
                  flex: isActive ? 1 : undefined,
                  flexShrink: isActive ? 1 : 0,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  padding: isActive ? "32px 32px 32px 0" : "28px 28px 24px 0",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Número de fondo decorativo */}
                <span aria-hidden="true" style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 900,
                  fontSize: isActive ? "clamp(120px,15vw,200px)" : "clamp(48px,6vw,72px)",
                  lineHeight: 0.8,
                  color: "rgba(224,123,48,0.25)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}>
                  {pain.num}
                </span>

                {isActive ? (
                  <>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(9px,1vw,11px)",
                        color: "#E07B30",
                        textTransform: "uppercase" as const,
                        letterSpacing: "2px",
                        margin: "0 0 12px",
                      }}>
                        {pain.label}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(18px,2vw,24px)", fontWeight: 700, color: "#ffffff",
                        margin: "0 0 12px", lineHeight: 1.3,
                      }}>
                        {pain.title}
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={pain.num}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(14px,1.6vw,16px)",
                            color: "#A89DC0",
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {pain.desc}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(9px,1vw,11px)", color: "#E07B30",
                      textTransform: "uppercase" as const, letterSpacing: "1.5px",
                      margin: "0 0 8px",
                    }}>
                      {pain.label}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(14px,1.6vw,16px)", fontWeight: 700,
                      color: "rgba(255,255,255,0.7)",
                      margin: 0, lineHeight: 1.3,
                    }}>
                      {pain.title}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Cierre */}
        <div style={{
          flex: 3, minHeight: 0,
          padding: "0 48px",
          borderTop: "1px solid rgba(224,123,48,0.18)",
          display: "flex", alignItems: "center",
        }}>
          <p style={{
            borderLeft: "2px solid #E07B30",
            paddingLeft: 24,
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(15px,1.8vw,18px)",
            fontStyle: "italic",
            color: "#A89DC0",
            lineHeight: 1.6,
            maxWidth: 640,
            margin: 0,
          }}>
            Si identificaste más de uno, no es un problema de herramienta. Es
            un problema de proceso y calidad de dato.
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Mobile layout — spotlight scroll vía IntersectionObserver ──────────────

function MobileLayout() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [allSeen, setAllSeen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setActiveStep(i);
            if (i === PAINS.length - 1) setAllSeen(true);
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return (
    <section style={{
      background: "#171225",
      padding: "56px 24px 40px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div aria-hidden style={{ width: 24, height: 1, background: "#E07B30" }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(11px, 1.2vw, 13px)",
            color: "#E07B30", letterSpacing: "3px",
            textTransform: "uppercase" as const,
          }}>
            EL DIAGNÓSTICO EMPIEZA AQUÍ
          </span>
        </div>
        <h2 style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontWeight: 800,
          fontSize: "clamp(22px,5vw,34px)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
        }}>
          ¿Esto te está frenando?
        </h2>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(15px, 1.8vw, 18px)",
          color: "#A89DC0",
          lineHeight: 1.8,
          marginTop: 16,
          marginBottom: 0,
        }}>
          Cuatro señales que aparecen antes de que cualquier proyecto de
          datos tenga sentido.
        </p>
      </div>

      {/* Pains — spotlight */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {PAINS.map((pain, i) => {
          const isActive = allSeen || i === activeStep;
          const hasSeen = allSeen || i <= activeStep;

          return (
            <div
              key={pain.num}
              ref={(el) => { stepRefs.current[i] = el; }}
              style={{
                borderTop: `1px solid ${isActive ? "rgba(224,123,48,0.30)" : "rgba(255,255,255,0.06)"}`,
                padding: "24px 0",
                display: "flex", flexDirection: "column", gap: 10,
                opacity: isActive ? 1 : hasSeen ? 0.22 : 0.08,
                transform: hasSeen ? "translateX(0) scale(1)" : "translateX(32px) scale(0.97)",
                filter: hasSeen ? "blur(0px)" : "blur(3px)",
                transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1), filter 0.55s ease, border-color 0.45s ease",
              }}
            >
              {/* Número grande decorativo */}
              <span aria-hidden="true" style={{
                position: "relative",
                display: "block",
                fontFamily: "var(--font-sans)", fontWeight: 900,
                fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1,
                color: isActive ? "rgba(224,123,48,0.18)" : "rgba(255,255,255,0.04)",
                userSelect: "none", pointerEvents: "none",
                transition: "color 0.45s ease",
              }}>
                {pain.num}
              </span>

              {/* Micro-label */}
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "clamp(9px, 1vw, 11px)",
                color: isActive ? "#E07B30" : "rgba(224,123,48,0.30)",
                textTransform: "uppercase" as const, letterSpacing: "1.5px",
                margin: 0,
                transition: "color 0.45s ease",
              }}>
                {pain.label}
              </p>

              {/* Título */}
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700,
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                margin: 0, lineHeight: 1.3,
                transition: "color 0.45s ease",
              }}>
                {pain.title}
              </p>

              {/* Descripción */}
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.6vw, 16px)",
                color: isActive ? "#A89DC0" : "rgba(255,255,255,0.45)",
                lineHeight: 1.7, margin: 0,
                transition: "color 0.45s ease",
              }}>
                {pain.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Cierre */}
      <div style={{
        borderLeft: "2px solid #E07B30",
        paddingLeft: 24,
        marginTop: 32,
      }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(15px, 1.8vw, 18px)",
          fontStyle: "italic",
          color: "#A89DC0",
          lineHeight: 1.6,
          margin: 0,
        }}>
          Si identificaste más de uno, no es un problema de herramienta. Es
          un problema de proceso y calidad de dato.
        </p>
      </div>
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PainSection() {
  // Fix hydration mismatch: detectar mobile/reduced en useEffect, no en render síncrono
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 1023px)");

    setReduced(mqReduced.matches);
    setIsMobile(mqMobile.matches);
    setMounted(true);

    const onReduced = () => setReduced(mqReduced.matches);
    const onMobile = () => setIsMobile(mqMobile.matches);
    mqReduced.addEventListener("change", onReduced);
    mqMobile.addEventListener("change", onMobile);
    return () => {
      mqReduced.removeEventListener("change", onReduced);
      mqMobile.removeEventListener("change", onMobile);
    };
  }, []);

  // Hasta que el cliente confirme el breakpoint, no renderizar nada
  // (evita que StepsSection monte useScroll con ref no hidratado en mobile)
  if (!mounted) return null;

  if (!isMobile && !reduced) {
    return <StepsSection />;
  }

  return <MobileLayout />;
}
