"use client";

import { motion, useReducedMotion } from "motion/react";
import { listContainer, listItem } from "@/lib/motion";

const PROBLEMS = [
  {
    num: "01",
    text: "Compraste dashboards que nadie usa para decidir.",
  },
  {
    num: "02",
    text: "Tus datos viven en Excel y en la cabeza de dos personas.",
  },
  {
    num: "03",
    text: "Todos te ofrecen IA, pero nadie te dice si tu operación está lista para usarla.",
  },
] as const;

export function Problem() {
  const rm = useReducedMotion();

  return (
    <section
      id="el-problema"
      className="w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#221B31", paddingTop: "clamp(56px,8vw,100px)", paddingBottom: "clamp(56px,8vw,100px)" }}
    >
      {/* Header */}
      <div className="flex w-full flex-col" style={{ gap: 16, marginBottom: 60 }}>
        {/* Label con línea naranja */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <div aria-hidden style={{ width: 32, height: 2, background: "#E07B30", flexShrink: 0 }} />
          <span
            className="font-normal uppercase tracking-[0.3em]"
            style={{ color: "#A89DC0", fontSize: 12 }}
          >
            EL PROBLEMA
          </span>
        </div>
        <h2
          className="font-bold"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "#FFFFFF",
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.15,
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          ¿Te identificas con esto?
        </h2>
      </div>

      {/* Numbered list — semantic ul/li */}
      <motion.ul
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex w-full flex-col"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {PROBLEMS.map(({ num, text }) => (
          <li key={num}>
            {/* Divider */}
            <div style={{ backgroundColor: "#453960", height: 1, width: "100%" }} />

            <motion.div
              variants={rm ? undefined : listItem}
              className="flex items-center"
              style={{ gap: 24, padding: "clamp(20px,4vw,40px) 0" }}
            >
              {/* Número en Playfair Display bold naranja */}
              <span
                aria-hidden
                className="hidden shrink-0 leading-none tabular-nums md:block"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontWeight: 700,
                  color: "#E07B30",
                  fontSize: 96,
                }}
              >
                {num}
              </span>

              {/* Texto en Playfair Display italic blanco */}
              <p
                className="italic"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#FFFFFF",
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  lineHeight: 1.4,
                  maxWidth: 640,
                }}
              >
                {text}
              </p>
            </motion.div>
          </li>
        ))}

        {/* Final divider */}
        <div style={{ backgroundColor: "#453960", height: 1, width: "100%" }} />
      </motion.ul>
    </section>
  );
}
