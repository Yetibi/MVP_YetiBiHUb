"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";

const FREE_EMAIL_DOMAINS = ["gmail.com", "hotmail.com"];

function esCorreoGratuito(correo: string): boolean {
  const domain = correo.trim().split("@")[1]?.toLowerCase();
  return !!domain && FREE_EMAIL_DOMAINS.includes(domain);
}

const inputStyle: React.CSSProperties = {
  height: 44,
  padding: "12px 16px",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 0,
  color: "#FFFFFF",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: 14,
  color: "#FFFFFF",
  display: "block",
  marginBottom: 8,
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FormSection() {
  const rm = useReducedMotion();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  return (
    <section
      id="formulario"
      style={{ backgroundColor: "#0E0B14", padding: "80px 24px" }}
    >
      <div className="max-w-3xl mx-auto">
        <div style={{ marginBottom: 56 }}>
          <p
            className="font-mono uppercase"
            style={{ color: "#E07B30", fontSize: 11, letterSpacing: "0.2em" }}
          >
            EVALÚA LA VIABILIDAD
          </p>
          <h2
            className="font-sans font-bold"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.15,
              marginTop: 12,
            }}
          >
            Antes de reunirnos, cuéntanos lo básico
          </h2>
          <p style={{ color: "#A89DC0", fontSize: 16, marginTop: 16 }}>
            Con esta información llegamos preparados a tu diagnóstico. Toma 1
            minuto.
          </p>
        </div>

        <motion.div
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={rm ? undefined : containerVariants}
          style={{
            maxWidth: 520,
            margin: "0 auto",
            backgroundColor: "#141020",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 0,
            padding: 40,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="form-section-nombre" style={labelStyle}>
              Nombre
            </label>
            <input
              id="form-section-nombre"
              type="text"
              aria-label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={inputStyle}
              className="form-section-input"
              onFocus={(e) => (e.target.style.borderColor = "#E07B30")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label htmlFor="form-section-correo" style={labelStyle}>
              Correo
            </label>
            <input
              id="form-section-correo"
              type="email"
              aria-label="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@empresa.co"
              style={inputStyle}
              className="form-section-input"
              onFocus={(e) => (e.target.style.borderColor = "#E07B30")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            {correo && esCorreoGratuito(correo) && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#E07B30",
                  marginTop: 8,
                }}
              >
                Sugerencia: usa tu correo de empresa
              </p>
            )}
          </div>

          <Link
            href="/powerbi/formulario"
            aria-label="Continuar con la evaluación de viabilidad"
            className="form-section-cta relative inline-flex items-center justify-center overflow-hidden w-full"
            style={{
              backgroundColor: "#E07B30",
              color: "#0E0B14",
              padding: "14px 28px",
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 0,
              textDecoration: "none",
            }}
          >
            <span className="relative z-10">Continuar con la evaluación →</span>
          </Link>

          <p
            style={{
              fontSize: 12,
              color: "#A89DC0",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            El formulario completo toma 3 minutos. Todas tus respuestas van
            directamente a nuestro equipo.
          </p>
        </motion.div>
      </div>

      <style>{`
        .form-section-input:focus-visible {
          outline: 2px solid #E07B30;
          outline-offset: 2px;
        }
        .form-section-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 0%;
          background-color: #C45A2A;
          transition: width 0.3s ease;
          z-index: 0;
        }
        .form-section-cta:hover::before {
          width: 100%;
        }
        .form-section-cta:focus-visible {
          outline: 2px solid #E07B30;
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
}
