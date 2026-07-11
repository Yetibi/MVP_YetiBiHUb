"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, listContainer } from "@/lib/motion";

const STEPS = [
  {
    id: 1,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(224,123,48,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="12" height="16" rx="2"/>
        <line x1="7" y1="7" x2="13" y2="7"/>
        <line x1="7" y1="10" x2="13" y2="10"/>
        <line x1="7" y1="13" x2="10" y2="13"/>
      </svg>
    ),
    title: "Responde el diagnóstico",
    desc: "10 minutos, en línea. Preguntas sobre tu proceso y operación actual.",
    alert: {
      heading: "TEN UN DOCUMENTO LISTO",
      body: "El formulario pedirá un archivo de tu operación. Entre más contexto real, más preciso es el diagnóstico.",
      formats: "Excel · CSV · PDF · reporte de proceso",
    },
    tag: "10 min · en línea",
  },
  {
    id: 2,
    icon: null, // gear — rendered separately with animation
    title: "YetibiEngine evalúa el gap",
    desc: "Medimos el As-Is vs. To-Be en 5 capas: proceso, dato, caso de uso, capacidad y habilitación tecnológica.",
    alert: null,
    tag: "Automático · metodología + IA",
  },
  {
    id: 3,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(224,123,48,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="14" height="10" rx="2"/>
        <path d="M7 8V6a3 3 0 0 1 6 0v2"/>
        <line x1="10" y1="12" x2="10" y2="14"/>
        <circle cx="10" cy="12" r="1" fill="rgba(224,123,48,0.9)" stroke="none"/>
      </svg>
    ),
    title: "Recibes tu reporte por correo",
    desc: "Tu diagnóstico de madurez operacional con el gap identificado y la ruta recomendada: automatizar o desplegar IA.",
    alert: null,
    tag: "Reporte · tu ruta clara",
  },
] as const;

function GearIcon({ reduced }: { reduced: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="rgba(224,123,48,0.9)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        animation: reduced ? "none" : "gear-spin 6s linear infinite",
        transformOrigin: "center",
      }}
    >
      <style>{`
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; }
        }
      `}</style>
      <circle cx="10" cy="10" r="3"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/>
    </svg>
  );
}

function StepCard({ step, reduced }: { step: typeof STEPS[number]; reduced: boolean }) {
  return (
    <div style={{
      position: "relative",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      paddingTop: 24,
      paddingBottom: 8,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}>
      {/* Número decorativo fondo */}
      <span aria-hidden style={{
        position: "absolute",
        top: 12,
        right: 0,
        fontFamily: "var(--font-playfair)",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 96,
        lineHeight: 1,
        color: "rgba(255,255,255,0.10)",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {step.id}
      </span>

      {/* Ícono circular */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid rgba(224,123,48,0.3)",
        background: "rgba(224,123,48,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {step.id === 2 ? <GearIcon reduced={reduced} /> : step.icon}
      </div>

      {/* Título */}
      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>
        {step.title}
      </p>

      {/* Descripción */}
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
        {step.desc}
      </p>

      {/* Bloque alerta (solo paso 1) */}
      {"alert" in step && step.alert && (
        <div style={{
          borderLeft: "2px solid #E07B30",
          background: "rgba(224,123,48,0.06)",
          borderRadius: "0 4px 4px 0",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}>
          <p style={{ fontSize: 10, color: "#E07B30", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, margin: 0 }}>
            {step.alert.heading}
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5, margin: 0 }}>
            {step.alert.body}
          </p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", margin: 0 }}>
            {step.alert.formats}
          </p>
        </div>
      )}

      {/* Tag */}
      <span style={{
        display: "inline-block",
        fontSize: 10,
        color: "#E07B30",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        fontWeight: 600,
      }}>
        {step.tag}
      </span>
    </div>
  );
}

function HorizontalConnector() {
  return (
    <div className="hidden sm:flex" style={{ paddingTop: 32, alignItems: "center", flexShrink: 0 }}>
      <div style={{
        width: 40,
        height: 1,
        background: "linear-gradient(90deg, rgba(224,123,48,0.6), rgba(224,123,48,0.2))",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          right: -5,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: "5px solid rgba(224,123,48,0.5)",
        }} />
      </div>
    </div>
  );
}

function VerticalConnector() {
  return (
    <div className="flex sm:hidden" style={{ flexDirection: "column", alignItems: "flex-start", padding: "8px 0", marginLeft: 12 }}>
      <div style={{ width: 1, height: 24, background: "linear-gradient(180deg, rgba(224,123,48,0.5), rgba(224,123,48,0.1))" }} />
    </div>
  );
}

export function HowItWorks() {
  const rm = useReducedMotion() ?? false;

  return (
    <section
      id="como-funciona"
      className="w-full"
      style={{
        backgroundColor: "#2E2640",
        padding: "clamp(56px,8vw,100px) clamp(20px,5vw,80px)",
      }}
    >
      {/* Header */}
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        style={{ marginBottom: 56, display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* Label */}
        <motion.div variants={rm ? undefined : fadeUp} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div aria-hidden style={{ width: 32, height: 2, background: "#E07B30", flexShrink: 0 }} />
          <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
            CÓMO FUNCIONA
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2 variants={rm ? undefined : fadeUp} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, margin: 0 }}>
          <span style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
            Tres pasos.
          </span>
          <span style={{
            fontSize: "clamp(28px,4vw,44px)",
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 700,
            color: "#E07B30",
            lineHeight: 1.15,
          }}>
            Cero reuniones de venta.
          </span>
        </motion.h2>
      </motion.div>

      {/* Grid pasos */}
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Desktop: grid 1fr auto 1fr auto 1fr */}
        <div
          className="hidden sm:grid"
          style={{
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: "0 24px",
            marginBottom: 48,
          }}
        >
          {STEPS.map((step, i) => (
            <>
              <motion.div key={step.id} variants={rm ? undefined : fadeUp}>
                <StepCard step={step} reduced={rm} />
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div key={`conn-${step.id}`} variants={rm ? undefined : fadeUp}>
                  <HorizontalConnector />
                </motion.div>
              )}
            </>
          ))}
        </div>

        {/* Mobile: columna única */}
        <div className="flex flex-col sm:hidden" style={{ marginBottom: 48 }}>
          {STEPS.map((step, i) => (
            <div key={step.id}>
              <motion.div variants={rm ? undefined : fadeUp}>
                <StepCard step={step} reduced={rm} />
              </motion.div>
              {i < STEPS.length - 1 && <VerticalConnector />}
            </div>
          ))}
        </div>

        {/* Conector vertical hacia bloque de continuación */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 12, marginBottom: 0 }}>
          <div style={{ width: 1, height: 32, background: "linear-gradient(180deg, rgba(224,123,48,0.5), rgba(224,123,48,0.15))" }} />
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            border: "1px solid #E07B30",
            background: "rgba(224,123,48,0.4)",
            marginLeft: -3.5,
          }} />
        </div>

        {/* Bloque de continuación */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          style={{
            border: "1px solid rgba(224,123,48,0.2)",
            borderRadius: 8,
            padding: "28px 32px",
            background: "rgba(224,123,48,0.04)",
            marginTop: 0,
          }}
        >
          <div
            className="flex-col sm:flex-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 32,
            }}
          >
            {/* Izquierda */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 10, color: "#E07B30", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700 }}>
                ¿QUIERES IR MÁS LEJOS?
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
                Asesoría personalizada{" "}
                <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#E07B30" }}>
                  para ampliar tu diagnóstico.
                </span>
              </h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
                El reporte te da la claridad. La asesoría te da el plan. Si tu diagnóstico revela oportunidades
                concretas de automatización o despliegue de IA, podemos acompañarte en el diseño de la ruta de
                implementación — sin compromisos previos.
              </p>
            </div>

            {/* Derecha — botones */}
            <div
              className="w-full sm:w-auto"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <a
                href="/contacto"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#E07B30",
                  color: "#2E2640",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 24px",
                  borderRadius: 4,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Solicitar asesoría →
              </a>
              <a
                href="https://mvp-yeti-bi-h-ub.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontSize: 13,
                  padding: "10px 24px",
                  borderRadius: 4,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Primero quiero mi diagnóstico
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
