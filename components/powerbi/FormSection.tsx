"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ProjectFrame } from "@/components/powerbi/ProjectFrame";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const previewVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } },
};

export default function FormSection() {
  const rm = useReducedMotion();

  return (
    <section
      id="formulario"
      className="form-section"
      style={{ backgroundColor: "#0E0B14", padding: "80px 24px" }}
    >
      <div
        className="form-section-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <motion.div
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={rm ? undefined : containerVariants}
        >
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
          <p style={{ color: "#A89DC0", fontSize: 16, marginTop: 16, lineHeight: 1.7 }}>
            Con esta información llegamos preparados a tu diagnóstico. Toma 3
            minutos, y todo se responde en una sola pantalla — sin repetir
            nada.
          </p>

          <Link
            href="/powerbi/formulario"
            aria-label="Continuar con la evaluación de viabilidad"
            className="form-section-cta relative inline-flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: "#E07B30",
              color: "#0E0B14",
              padding: "14px 28px",
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 0,
              textDecoration: "none",
              marginTop: 32,
            }}
          >
            <span className="relative z-10">Ir al formulario →</span>
          </Link>

          <p
            style={{
              fontSize: 12,
              color: "#A89DC0",
              marginTop: 16,
            }}
          >
            El formulario completo toma 3 minutos. Todas tus respuestas van
            directamente a nuestro equipo.
          </p>
        </motion.div>

        <motion.div
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={rm ? undefined : previewVariants}
          className="form-section-preview"
        >
          <ProjectFrame
            src="/form-preview/formulario-preview.png"
            alt="Vista previa de las primeras preguntas del formulario de evaluación"
            borderColor="rgba(180,150,210,0.5)"
            borderWidth={6}
            maxWidth="620px"
            rotateX={-3}
            rotateY={-2}
            onHoverRotateX={-4}
            onHoverRotateY={-3}
          />
        </motion.div>
      </div>

      <style>{`
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
        @media (max-width: 960px) {
          .form-section {
            padding: 60px 24px !important;
          }
          .form-section-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
