"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { listContainer, fadeUp } from "@/lib/motion";

export function CtaFinal() {
  const rm = useReducedMotion();

  return (
    <section
      id="contacto"
      className="w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#2E2640", paddingTop: 120, paddingBottom: 120 }}
    >
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col items-center"
        style={{ gap: 24 }}
      >
        {/* Título */}
        <motion.h2
          variants={rm ? undefined : fadeUp}
          className="font-bold text-center font-[family-name:var(--font-heading)]"
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(24px, 4vw, 40px)",
            lineHeight: 1.2,
            maxWidth: 700,
          }}
        >
          Empieza ahora. El diagnóstico no tiene costo.
        </motion.h2>

        {/* Microcopy */}
        <motion.p
          variants={rm ? undefined : fadeUp}
          className="text-center"
          style={{ color: "#C3B9D6", fontSize: 16 }}
        >
          Sin compromisos. Sin llamadas de venta. Tu reporte llega a tu correo.
        </motion.p>

        {/* CTA */}
        <motion.div variants={rm ? undefined : fadeUp}>
          <Link
            href="/diagnostico"
            className="inline-flex items-center rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            style={{
              backgroundColor: "#E07B30",
              color: "#1c1426",
              fontSize: 18,
              padding: "18px 36px",
              gap: 10,
              boxShadow: "0 8px 30px -8px #E07B3099",
            }}
          >
            Diagnostica tu empresa
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
