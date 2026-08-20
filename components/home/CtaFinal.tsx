"use client";

import { motion, useReducedMotion } from "motion/react";
import { listContainer, fadeUp } from "@/lib/motion";
import { ContactForm } from "@/components/home/ContactForm";

// ─── Sección Contacto: mensaje + formulario en dos columnas ──────────────────
// Desktop: 2 columnas centradas verticalmente en ~1 viewport.
// Móvil: apilado compacto (mensaje esencial + formulario completo).

const PUNTOS = [
  "Un proceso concreto, no tu empresa entera",
  "Sin costo · sin compromiso",
  "Respuesta con metodología, no con opinión",
] as const;

export function CtaFinal() {
  const rm = useReducedMotion();

  return (
    <section
      id="contacto"
      aria-label="Contacto"
      className="relative w-full overflow-hidden px-5 md:px-10 lg:px-16"
      style={{
        background: "#0B1420",
        paddingTop: "clamp(36px, 6vw, 88px)",
        paddingBottom: "clamp(40px, 7vw, 96px)",
      }}
    >
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto"
        style={{ maxWidth: 1152, zIndex: 1 }}
      >
        {/* Card de acero elevada que separa la sección como plano */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 items-center"
          style={{
            gap: "clamp(18px, 4vw, 48px)",
            background: "#0B1420",
            border: "1px solid #1C2836",
            borderRadius: 18,
            padding: "clamp(16px, 3.5vw, 44px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
          }}
        >
          {/* ── Columna izquierda · mensaje ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span aria-hidden style={{ width: 22, height: 1, background: "#F28F6B", flexShrink: 0 }} />
              <span style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 500,
                color: "#F28F6B", letterSpacing: "2.5px", textTransform: "uppercase",
              }}>
                EMPIEZA AHORA
              </span>
            </div>

            <h2
              id="contacto-heading"
              style={{
                fontFamily: "var(--font-space-grotesk)", fontWeight: 700,
                fontSize: "clamp(26px, 3vw, 40px)", color: "#F2F6F9",
                lineHeight: 1.15, margin: "0 0 10px",
              }}
            >
              Trae un proceso.<br />
              <span style={{ fontWeight: 300, color: "#4FD1E0" }}>La evaluación no tiene costo.</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: "clamp(13.5px, 1.1vw, 15.5px)",
              color: "#8B95A5", lineHeight: 1.6, margin: "0 0 14px", maxWidth: 460,
            }}>
              Elige el proceso que más pesa en tu operación. Evaluamos si debe existir,
              dónde está su fuga de valor, y si puede sostener IA —{" "}
              <span style={{ color: "#F2F6F9", fontWeight: 500 }}>antes de que amplifique el problema</span>.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
              {PUNTOS.map((p) => (
                <li key={p} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  fontFamily: "var(--font-geist-mono)", fontSize: "clamp(10.5px, 0.85vw, 12px)",
                  color: "#8B95A5",
                }}>
                  <span aria-hidden style={{ color: "#4FD1E0", fontSize: 8, flexShrink: 0 }}>●</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Columna derecha · formulario ── */}
          <motion.div
            variants={rm ? undefined : fadeUp}
            style={{
              background: "#141F2E",
              border: "1px solid #1C2836",
              borderRadius: 14,
              padding: "clamp(16px, 2.2vw, 26px)",
            }}
          >
            <h3 className="sr-only">Formulario de contacto</h3>
            <ContactForm />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
