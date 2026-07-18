"use client";

import { motion, useReducedMotion } from "motion/react";
import { listContainer, fadeUp } from "@/lib/motion";
import { ContactForm } from "@/components/home/ContactForm";

export function CtaFinal() {
  const rm = useReducedMotion();

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-heading"
      className="relative w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#150D20", paddingTop: "clamp(72px,10vw,140px)", paddingBottom: "clamp(80px,12vw,160px)" }}
    >
      {/* Semicírculo invertido — entra desde abajo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(300px, 40vw, 600px)",
          height: "clamp(300px, 40vw, 600px)",
          borderRadius: "50%",
          background: "#E07B30",
          opacity: 0.12,
          filter: "blur(1px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative flex flex-col items-center"
        style={{ gap: 32, zIndex: 1 }}
      >
        {/* Título a pantalla completa centrado */}
        <motion.h2
          id="contacto-heading"
          variants={rm ? undefined : fadeUp}
          className="text-center"
          style={{ lineHeight: 1.1, maxWidth: 900 }}
        >
          {/* "Empieza ahora." — Geist 700 blanco */}
          <span
            className="font-bold block"
            style={{ color: "#FFFFFF", fontSize: "clamp(48px, 6vw, 80px)" }}
          >
            Empieza ahora.
          </span>
          {/* "El diagnóstico" — Playfair italic naranja */}
          <span
            className="italic block"
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#E07B30",
              fontSize: "clamp(48px, 6vw, 80px)",
            }}
          >
            El diagnóstico
          </span>
          {/* "no tiene costo." — Playfair italic blanco */}
          <span
            className="italic block"
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "clamp(48px, 6vw, 80px)",
            }}
          >
            no tiene costo.
          </span>
        </motion.h2>

        {/* Microcopy */}
        <motion.p
          variants={rm ? undefined : fadeUp}
          className="text-center"
          style={{ color: "#C3B9D6", fontSize: 16, maxWidth: 440 }}
        >
          Sin compromisos. Sin llamadas de venta. Tu reporte llega a tu correo.
        </motion.p>

        {/* CTA con glow amplificado */}
        <motion.div variants={rm ? undefined : fadeUp}>
          <a
            href="/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            style={{
              backgroundColor: "#E07B30",
              color: "#1c1426",
              fontSize: 18,
              padding: "18px 40px",
              gap: 10,
              minHeight: 44,
              boxShadow: "0 0 80px 20px #E07B3026, 0 8px 30px -8px #E07B3099",
            }}
          >
            Diagnostica tu proceso
            <span aria-hidden>→</span>
            <span className="sr-only"> (abre en nueva pestaña)</span>
          </a>
        </motion.div>

        {/* Divisor + texto intro */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          className="flex flex-col items-center w-full"
          style={{ gap: 16, marginTop: 32 }}
        >
          <div style={{ width: "100%", maxWidth: 560, height: 1, backgroundColor: "#FFFFFF14" }} />
          <p
            className="text-center"
            style={{ color: "#A89DC0", fontSize: 13, letterSpacing: "0.05em" }}
          >
            ¿Tienes una pregunta antes de empezar?
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          className="w-full flex justify-center"
        >
          <div className="w-full" style={{ maxWidth: 640 }}>
            <h3 className="sr-only">Formulario de contacto</h3>
            <ContactForm />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
