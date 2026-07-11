"use client";

import { motion, useReducedMotion } from "motion/react";
import { listContainer, listItem, fadeUp } from "@/lib/motion";

const STEPS = [
  {
    num: "01",
    title: "Responde el diagnóstico",
    desc: "10 minutos, en línea.",
  },
  {
    num: "02",
    title: "YetibiEngine analiza tu madurez",
    desc: "En 5 capas: proceso, dato, caso de uso, capacidad y ROI.",
  },
  {
    num: "03",
    title: "Recibes tu reporte por correo",
    desc: "Y decides los próximos pasos.",
  },
] as const;

export function HowItWorks() {
  const rm = useReducedMotion();

  return (
    <section
      className="w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#2E2640", paddingTop: "clamp(56px,8vw,100px)", paddingBottom: "clamp(56px,8vw,100px)" }}
    >
      {/* Header */}
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col"
        style={{ gap: 16, marginBottom: 70 }}
      >
        {/* Label con línea naranja */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          className="flex items-center"
          style={{ gap: 12 }}
        >
          <div aria-hidden style={{ width: 32, height: 2, background: "#E07B30", flexShrink: 0 }} />
          <span
            className="font-normal uppercase tracking-[0.3em]"
            style={{ color: "#8E83A6", fontSize: 12 }}
          >
            CÓMO FUNCIONA
          </span>
        </motion.div>

        <motion.h2
          variants={rm ? undefined : fadeUp}
          className="flex flex-wrap items-baseline"
          style={{ gap: 14, fontFamily: "var(--font-playfair)" }}
        >
          <span
            className="font-bold"
            style={{ color: "#FFFFFF", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.15 }}
          >
            Tres pasos.
          </span>
          <span
            className="font-bold italic"
            style={{ color: "#FFFFFF", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.15 }}
          >
            Cero reuniones de venta.
          </span>
        </motion.h2>
      </motion.div>

      {/* Steps — lista vertical estilo S2 */}
      <motion.ul
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex w-full flex-col"
        style={{ listStyle: "none", margin: 0, padding: 0, marginBottom: 70 }}
      >
        {STEPS.map(({ num, title, desc }) => (
          <li key={num}>
            <div style={{ backgroundColor: "#453960", height: 1, width: "100%" }} />

            <motion.div
              variants={rm ? undefined : listItem}
              className="flex items-center"
              style={{ gap: 24, padding: "clamp(20px,4vw,40px) 0" }}
            >
              {/* Número en Playfair Display bold — gris oscuro para diferenciar de S2 */}
              <span
                aria-hidden
                className="hidden shrink-0 leading-none tabular-nums md:block"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontWeight: 700,
                  color: "#4A4560",
                  fontSize: 96,
                }}
              >
                {num}
              </span>

              <div className="flex flex-col" style={{ gap: 8 }}>
                {/* Título en Geist 700 blanco */}
                <h3
                  className="font-bold"
                  style={{ color: "#FFFFFF", fontSize: 20, lineHeight: 1.3 }}
                >
                  {title}
                </h3>
                {/* Descripción en Geist 400 gris */}
                <p style={{ color: "#8E83A6", fontSize: 15, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          </li>
        ))}
        <div style={{ backgroundColor: "#453960", height: 1, width: "100%" }} />
      </motion.ul>

      {/* CTA */}
      <motion.div
        variants={rm ? undefined : fadeUp}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <a
          href="/diagnostico"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          style={{
            backgroundColor: "#E07B30",
            color: "#1c1426",
            fontSize: 16,
            padding: "16px 28px",
            gap: 10,
            boxShadow: "0 8px 30px -8px #E07B3099",
          }}
        >
          Diagnostica tu proceso
          <span aria-hidden>→</span>
        </a>
      </motion.div>
    </section>
  );
}
