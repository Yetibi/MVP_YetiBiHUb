"use client";

import { motion, useReducedMotion } from "motion/react";
import { listContainer, fadeUp } from "@/lib/motion";
import { ContactForm } from "@/components/home/ContactForm";

export function CtaFinal() {
  const rm = useReducedMotion();

  return (
    <section
      id="contacto"
      aria-label="Contacto"
      className="relative w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#150D20", paddingTop: "clamp(72px,10vw,140px)", paddingBottom: "clamp(80px,12vw,160px)" }}
    >

      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative flex flex-col items-center"
        style={{ gap: "clamp(40px, 6vw, 56px)", zIndex: 1 }}
      >
        {/* Heading */}
        <motion.h2
          id="contacto-heading"
          variants={rm ? undefined : fadeUp}
          className="text-center"
          style={{ lineHeight: 1.15, maxWidth: 900, margin: 0 }}
        >
          <span
            className="font-bold block"
            style={{ color: "#FFFFFF", fontSize: "clamp(36px, 6vw, 80px)" }}
          >
            Empieza ahora.
          </span>
          <span
            className="italic block"
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#E07B30",
              fontSize: "clamp(36px, 6vw, 80px)",
            }}
          >
            El diagnóstico
          </span>
          <span
            className="italic block"
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "clamp(36px, 6vw, 80px)",
            }}
          >
            no tiene costo.
          </span>
        </motion.h2>

        {/* CTA */}
        <motion.div variants={rm ? undefined : fadeUp}>
          <a
            href="/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center"
            style={{
              fontSize: "clamp(14px, 2vw, 18px)",
              padding: "18px 40px",
              gap: 10,
              boxShadow: "0 0 80px 20px #E07B3026, 0 8px 30px -8px #E07B3099",
            }}
          >
            Diagnóstica tu proceso
            <span aria-hidden>→</span>
            <span className="sr-only"> (abre en nueva pestaña)</span>
          </a>
        </motion.div>

        {/* Divisor + pregunta intro al formulario */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          initial={rm ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "0px" }}
          className="flex flex-col items-center w-full"
          style={{ gap: "clamp(24px, 4vw, 40px)" }}
        >
          <div style={{ width: "100%", maxWidth: 560, height: 1, backgroundColor: "#FFFFFF14" }} />
          <p
            className="text-center italic"
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "clamp(24px, 3vw, 44px)",
              lineHeight: 1.2,
              maxWidth: 560,
              margin: 0,
            }}
          >
            ¿Tienes una pregunta{" "}
            <span style={{ color: "#E07B30" }}>antes de empezar?</span>
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
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
