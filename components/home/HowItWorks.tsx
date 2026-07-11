"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { listContainer, fadeUp } from "@/lib/motion";

const STEPS = [
  {
    num: "1",
    title: "Responde el diagnóstico",
    desc: "10 minutos, en línea.",
    topOffset: 0,
  },
  {
    num: "2",
    title: "YetibiEngine analiza tu madurez",
    desc: "En 5 capas: proceso, dato, caso de uso, capacidad y ROI.",
    topOffset: 60,
  },
  {
    num: "3",
    title: "Recibes tu reporte por correo",
    desc: "Y decides los próximos pasos.",
    topOffset: 120,
  },
] as const;

export function HowItWorks() {
  const rm = useReducedMotion();

  return (
    <section
      className="w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#2E2640", paddingTop: 100, paddingBottom: 100 }}
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
        <motion.p
          variants={rm ? undefined : fadeUp}
          className="font-normal uppercase tracking-[0.3em]"
          style={{ color: "#8E83A6", fontSize: 12 }}
        >
          CÓMO FUNCIONA
        </motion.p>

        <motion.h2 variants={rm ? undefined : fadeUp} className="flex flex-wrap items-baseline font-[family-name:var(--font-heading)]" style={{ gap: 14 }}>
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

      {/* Steps — 3 columnas con escalonado vertical (solo md+) */}
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex w-full flex-col md:flex-row md:items-start"
        style={{ gap: 32, marginBottom: 70 }}
      >
        {STEPS.map(({ num, title, desc, topOffset }) => (
          <motion.div
            key={num}
            variants={rm ? undefined : fadeUp}
            className="flex flex-1 flex-col"
            style={{ paddingTop: rm ? 0 : topOffset, gap: 20 }}
          >
            {/* Numeral como pieza gráfica dominante */}
            <span
              aria-hidden
              className="font-light leading-none tabular-nums select-none"
              style={{ color: "#8E83A6", fontSize: 120, opacity: 0.45 }}
            >
              {num}
            </span>

            {/* Línea decorativa */}
            <div style={{ backgroundColor: "#453960", height: 2, width: 48 }} />

            {/* h3 for step title — correct heading hierarchy under h2 */}
            <h3
              className="font-semibold"
              style={{ color: "#FFFFFF", fontSize: 20, lineHeight: 1.3 }}
            >
              {title}
            </h3>

            {/* Descripción */}
            <p style={{ color: "#C3B9D6", fontSize: 15, lineHeight: 1.6 }}>
              {desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={rm ? undefined : fadeUp}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <Link
          href="/diagnostico"
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
          Diagnostica tu empresa
          <span aria-hidden>→</span>
        </Link>
      </motion.div>
    </section>
  );
}
