"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

// ─── datos ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Responde el diagnóstico",
    desc: "10 minutos, en línea. Preguntas sobre tu proceso y operación actual.",
    tag: "10 min · en línea",
    alert: {
      title: "TEN UN DOCUMENTO LISTO",
      text: "El formulario pedirá un archivo de tu operación.",
      formats: "Excel · CSV · PDF · reporte de proceso",
    },
  },
  {
    num: "02",
    title: "YetibiEngine evalúa el gap",
    desc: "Medimos el As-Is vs. To-Be en 5 capas: proceso, dato, caso de uso, capacidad y habilitación tecnológica.",
    tag: "Automático · metodología + IA",
    alert: undefined,
  },
  {
    num: "03",
    title: "Recibes tu reporte por correo",
    desc: "Tu diagnóstico de madurez operacional con el gap identificado y la ruta recomendada.",
    tag: "Reporte · tu ruta clara",
    alert: undefined,
  },
];

// ─── íconos — como componentes, no JSX pre-instanciado ───────────────────────

function IconClipboard() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#E07B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  );
}

function IconGear({ reduced }: { reduced: boolean }) {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#E07B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{
        animation: reduced ? "none" : "spin 6s linear infinite",
        transformOrigin: "center center",
      }}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}

function IconBox() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#E07B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4V12"/>
      <path d="M22 7H2v5h20V7z"/>
      <path d="M12 22V7"/>
    </svg>
  );
}

// ─── Sección 1: pasos con scroll ──────────────────────────────────────────────

function StepsSection({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.33) setActiveStep(0);
    else if (v < 0.66) setActiveStep(1);
    else setActiveStep(2);
  });

  const ICONS = [
    <IconClipboard key={0} />,
    <IconGear key={1} reduced={reduced} />,
    <IconBox key={2} />,
  ];

  return (
    <div ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        background: "#0E0B14",
        display: "flex",
        flexDirection: "column",
        paddingTop: 32,
      }}>

        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: 24, paddingLeft: 48, paddingRight: 48 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <div aria-hidden style={{ width: 24, height: 1, background: "#E07B30" }} />
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
            }}>
              CÓMO FUNCIONA
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(22px,3vw,38px)", lineHeight: 1.1 }}>
            <span style={{ fontWeight: 900, color: "#fff", fontFamily: "var(--font-geist-sans)" }}>
              Tres pasos.{" "}
            </span>
            <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, color: "#E07B30" }}>
              El diagnóstico llega a tu correo.
            </span>
          </h2>
        </div>

        {/* Pasos */}
        <div style={{
          flex: 7,
          display: "flex",
          alignItems: "stretch",
          minHeight: 0,
          gap: 16,
          padding: "0 48px",
        }}>
          {STEPS.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <motion.div
                key={i}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  filter: reduced ? "none" : (isActive ? "blur(0px)" : "blur(1px)"),
                  scale: reduced ? 1 : (isActive ? 1 : 0.92),
                }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: "100%",
                  // Avoid animating flex/width — use fixed width for inactive
                  width: isActive ? undefined : 180,
                  flex: isActive ? 1 : undefined,
                  flexShrink: isActive ? 1 : 0,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  padding: "28px 28px 24px 0",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Número de fondo decorativo */}
                <span aria-hidden style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 900,
                  fontSize: isActive ? "clamp(160px,20vw,240px)" : 80,
                  lineHeight: 0.8,
                  color: "rgba(224,123,48,0.25)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}>
                  {step.num}
                </span>

                {isActive ? (
                  <>
                    {/* Bloque TOP */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%",
                        border: "1px solid rgba(224,123,48,0.3)",
                        background: "rgba(224,123,48,0.07)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 20,
                      }}>
                        {ICONS[i]}
                      </div>
                      <p style={{
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: 28, fontWeight: 700, color: "#ffffff",
                        margin: "0 0 16px", lineHeight: 1.2,
                      }}>
                        {step.title}
                      </p>
                      {/* key única por paso para que AnimatePresence anime el cambio */}
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={step.num}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            fontFamily: "var(--font-geist-sans)",
                            fontSize: 16,
                            color: "rgba(255,255,255,0.65)",
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {step.desc}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Alerta paso 1 */}
                    {step.alert && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`alert-${step.num}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, delay: 0.05 }}
                          style={{
                            borderLeft: "2px solid #E07B30",
                            background: "rgba(224,123,48,0.06)",
                            padding: "12px 14px",
                            position: "relative", zIndex: 1,
                          }}
                        >
                          <p style={{ fontSize: 12, color: "#E07B30", textTransform: "uppercase" as const, letterSpacing: "1px", fontWeight: 700, margin: "0 0 6px" }}>
                            {step.alert.title}
                          </p>
                          {/* contraste mejorado: 0.5 → 0.75 */}
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 4px" }}>
                            {step.alert.text}
                          </p>
                          {/* contraste mejorado: 0.25 → 0.65 */}
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0 }}>
                            {step.alert.formats}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Tag */}
                    <span style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 13, color: "#E07B30",
                      textTransform: "uppercase" as const, letterSpacing: "2px",
                      position: "relative", zIndex: 1,
                    }}>
                      {step.tag}
                    </span>
                  </>
                ) : (
                  <>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: 16, fontWeight: 700,
                        color: "rgba(255,255,255,0.7)",
                        margin: 0, lineHeight: 1.3,
                      }}>
                        {step.title}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 11, color: "#E07B30",
                      textTransform: "uppercase" as const, letterSpacing: "1px",
                      position: "relative", zIndex: 1,
                    }}>
                      {step.tag}
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Banner asesoría */}
        <div style={{
          flex: 3, minHeight: 0,
          padding: "0 48px",
          borderTop: "1px solid rgba(224,123,48,0.18)",
          background: "#150D20",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#E07B30",
              textTransform: "uppercase" as const, letterSpacing: "2px", fontWeight: 700,
              margin: "0 0 8px",
            }}>
              ¿QUIERES IR MÁS LEJOS?
            </p>
            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 26, fontWeight: 700,
              color: "#fff", margin: "0 0 10px", lineHeight: 1.2,
            }}>
              Asesoría personalizada{" "}
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#E07B30" }}>
                para ampliar tu diagnóstico.
              </span>
            </p>
            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 17,
              color: "rgba(255,255,255,0.6)", lineHeight: 1.6,
              margin: 0, maxWidth: 560,
            }}>
              El reporte te da la claridad. La asesoría te da el plan.
              Si tu diagnóstico revela oportunidades concretas,
              podemos acompañarte — sin compromisos previos.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
            <a
              href="#contacto-form"
              style={{
                background: "linear-gradient(110deg,#E07B30 0%,#E07B30 30%,#FFA558 45%,#FFD4A8 50%,#FFA558 55%,#E07B30 70%,#E07B30 100%)",
                backgroundSize: "200% 100%",
                animation: "background-shine 2s linear infinite",
                color: "#0E0B14",
                fontFamily: "var(--font-geist-sans)", fontWeight: 700, fontSize: 12,
                textTransform: "uppercase" as const, letterSpacing: "1px",
                padding: "14px 28px", borderRadius: 2,
                textDecoration: "none", display: "inline-block",
                whiteSpace: "nowrap" as const, minHeight: 44,
              }}
            >
              SOLICITAR ASESORÍA <span aria-hidden>→</span>
            </a>
            <a
              href="/diagnostico"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontFamily: "var(--font-geist-sans)", fontSize: 12,
                textTransform: "uppercase" as const, letterSpacing: "1px",
                padding: "14px 28px", borderRadius: 2,
                textDecoration: "none", display: "inline-block",
                whiteSpace: "nowrap" as const, minHeight: 44,
              }}
            >
              MI DIAGNÓSTICO PRIMERO
              <span className="sr-only"> (abre en nueva pestaña)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileLayout({ reduced }: { reduced: boolean }) {
  return (
    <>
      <section
        id="como-funciona"
        style={{ background: "#0E0B14", padding: "56px 24px 40px" }}
      >
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <div aria-hidden style={{ width: 24, height: 1, background: "#E07B30" }} />
            <span style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 10,
              color: "rgba(255,255,255,0.35)", letterSpacing: "3px",
              textTransform: "uppercase" as const,
            }}>
              CÓMO FUNCIONA
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(22px,5vw,34px)", lineHeight: 1.15 }}>
            <span style={{ fontWeight: 900, color: "#fff", fontFamily: "var(--font-geist-sans)" }}>
              Tres pasos.{" "}
            </span>
            <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, color: "#E07B30" }}>
              El diagnóstico llega a tu correo.
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 20,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "1px solid rgba(224,123,48,0.3)",
                background: "rgba(224,123,48,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i === 0 && <IconClipboard />}
                {i === 1 && <IconGear reduced={reduced} />}
                {i === 2 && <IconBox />}
              </div>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
                {step.title}
              </p>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
              {step.alert && (
                <div style={{ borderLeft: "2px solid #E07B30", background: "rgba(224,123,48,0.06)", padding: "8px 10px" }}>
                  <p style={{ fontSize: 10, color: "#E07B30", textTransform: "uppercase" as const, letterSpacing: 1, fontWeight: 700, margin: "0 0 3px" }}>
                    {step.alert.title}
                  </p>
                  {/* contraste: 0.30 → 0.70 */}
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", lineHeight: 1.4, margin: "0 0 4px" }}>
                    {step.alert.text}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", margin: 0 }}>
                    {step.alert.formats}
                  </p>
                </div>
              )}
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#E07B30", textTransform: "uppercase" as const, letterSpacing: 1.5 }}>
                {step.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="asesoria"
        style={{
          background: "#0E0B14",
          borderTop: "1px solid rgba(224,123,48,0.12)",
          padding: "48px 24px",
          display: "flex", flexDirection: "column", gap: 20,
        }}
      >
        <p style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#E07B30",
          letterSpacing: "2px", textTransform: "uppercase" as const, fontWeight: 600, margin: 0,
        }}>
          ¿QUIERES IR MÁS LEJOS?
        </p>
        <h3 style={{
          fontFamily: "var(--font-geist-sans)", fontWeight: 900,
          fontSize: "clamp(22px,5vw,32px)", color: "#fff", lineHeight: 1.15, margin: 0,
        }}>
          Asesoría personalizada{" "}
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#E07B30" }}>
            para ampliar tu diagnóstico.
          </span>
        </h3>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 14,
          color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0,
        }}>
          El reporte te da la claridad. La asesoría te da el plan.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
          <a
            href="#contacto-form"
            style={{
              background: "linear-gradient(110deg,#E07B30 0%,#E07B30 30%,#FFA558 45%,#FFD4A8 50%,#FFA558 55%,#E07B30 70%,#E07B30 100%)",
              backgroundSize: "200% 100%",
              animation: "background-shine 2s linear infinite",
              color: "#0E0B14",
              fontFamily: "var(--font-geist-sans)", fontWeight: 700, fontSize: 12,
              textTransform: "uppercase" as const, letterSpacing: "1px",
              padding: "14px 24px", borderRadius: 2,
              textDecoration: "none", display: "inline-block",
              minHeight: 44,
            }}
          >
            SOLICITAR ASESORÍA <span aria-hidden>→</span>
          </a>
          <a
            href="/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(255,255,255,0.70)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontFamily: "var(--font-geist-sans)", fontSize: 12,
              textTransform: "uppercase" as const, letterSpacing: "1px",
              padding: "14px 24px", borderRadius: 2,
              textDecoration: "none", display: "inline-block",
              minHeight: 44,
            }}
          >
            PRIMERO QUIERO MI DIAGNÓSTICO
            <span className="sr-only"> (abre en nueva pestaña)</span>
          </a>
        </div>
      </section>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function HowItWorks() {
  // Fix hydration mismatch: detectar mobile/reduced en useEffect, no en render síncrono
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile  = window.matchMedia("(max-width: 767px)");

    setReduced(mqReduced.matches);
    setIsMobile(mqMobile.matches);
    setMounted(true);

    const onReduced = () => setReduced(mqReduced.matches);
    const onMobile  = () => setIsMobile(mqMobile.matches);
    mqReduced.addEventListener("change", onReduced);
    mqMobile.addEventListener("change", onMobile);
    return () => {
      mqReduced.removeEventListener("change", onReduced);
      mqMobile.removeEventListener("change", onMobile);
    };
  }, []);

  // Renderizar la versión desktop hasta que el cliente confirme el breakpoint
  // para evitar hydration mismatch (servidor y primera renderización cliente = mismo resultado)
  if (!mounted || (!isMobile && !reduced)) {
    return (
      <div id="como-funciona">
        <StepsSection reduced={reduced} />
      </div>
    );
  }

  return <MobileLayout reduced={reduced} />;
}
