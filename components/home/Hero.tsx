"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { heroContainer, heroItem } from "@/lib/motion";

const CHAIN = [
  "Proceso sano",
  "Dato confiable",
  "La ruta correcta",
  "Impacto financiero medible",
] as const;

export function Hero() {
  const rm = useReducedMotion();

  return (
    <>
      {/* Nav */}
      <nav
        aria-label="Navegación principal"
        className="relative z-10 flex w-full items-center"
        style={{ backgroundColor: "#2E2640", padding: "20px 20px" }}
      >
        <Link
          href="/"
          className="font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E2640] rounded"
          style={{ fontSize: 18, letterSpacing: 3 }}
        >
          YETI BI
        </Link>

        <span className="flex-1" />

        <div className="flex items-center" style={{ gap: 32 }}>
          <Link
            href="#diagnostico"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ color: "#C3B9D6", fontSize: 14 }}
          >
            Diagnóstico
          </Link>
          <Link
            href="#contacto"
            className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            style={{ color: "#C3B9D6", fontSize: 14 }}
          >
            Contacto
          </Link>
        </div>

        <span className="flex-1" />

        <Link
          href="/diagnostico"
          className="rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          style={{
            backgroundColor: "#E07B30",
            color: "#1c1426",
            fontSize: 13,
            padding: "10px 20px",
            boxShadow: "0 4px 16px -4px #E07B3066",
          }}
        >
          Haz tu diagnóstico
        </Link>
      </nav>

      <section
        id="diagnostico"
        aria-labelledby="hero-heading"
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "#2E2640", minHeight: "100vh" }}
      >
        {/* Semicírculo de firma — fondo naranja difuso */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-10%",
            right: "-15%",
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

        {/* Body */}
        <motion.div
          variants={rm ? undefined : heroContainer}
          initial={rm ? false : "hidden"}
          animate={rm ? false : "show"}
          className="relative flex w-full flex-col justify-center px-5 md:px-10 lg:px-20"
          style={{ paddingTop: 80, paddingBottom: 80, minHeight: "100vh", gap: 32, zIndex: 1 }}
        >
          {/* Kicker con línea naranja */}
          <motion.div
            variants={rm ? undefined : heroItem}
            className="flex items-center"
            style={{ gap: 12 }}
          >
            <div aria-hidden style={{ width: 32, height: 2, background: "#E07B30", flexShrink: 0 }} />
            <span
              className="font-normal tracking-[0.28em] uppercase"
              style={{ color: "#8E83A6", fontSize: 12 }}
            >
              DIAGNÓSTICO DE MADUREZ IA
            </span>
          </motion.div>

          {/* Headline — Playfair Display italic bold */}
          <motion.div variants={rm ? undefined : heroItem} className="flex w-full flex-col" style={{ gap: 0 }}>
            <h1
              id="hero-heading"
              className="w-full font-bold italic leading-[1.08]"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(56px, 8vw, 96px)",
                color: "#FFFFFF",
              }}
            >
              La mayoría de tus problemas{" "}
              <span style={{ color: "#FFFFFF" }}>
                {/* "no" en naranja, resto blanco */}
                <span style={{ color: "#E07B30" }}>no</span>
                {" "}necesitan IA.
              </span>
              <br />
              Necesitan claridad.
            </h1>
          </motion.div>

          {/* Value chain */}
          <motion.div
            variants={rm ? undefined : heroItem}
            className="flex flex-wrap items-center"
            style={{ gap: 12 }}
          >
            {CHAIN.map((label, i) => (
              <span key={label} className="flex items-center" style={{ gap: 12 }}>
                <span className="font-medium" style={{ color: "#C3B9D6", fontSize: 15 }}>
                  {label}
                </span>
                {i < CHAIN.length - 1 && (
                  <span aria-hidden style={{ color: "#8E83A6", fontSize: 15 }}>→</span>
                )}
              </span>
            ))}
          </motion.div>

          {/* Support copy */}
          <motion.p
            variants={rm ? undefined : heroItem}
            style={{ color: "#C3B9D6", fontSize: 16, lineHeight: 1.6, maxWidth: 520 }}
          >
            El diagnóstico Yeti BI te dice cuál es tu ruta antes de que inviertas
            un peso en tecnología.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={rm ? undefined : heroItem}
            className="flex items-center flex-wrap"
            style={{ gap: 16 }}
          >
            <Link
              href="/diagnostico"
              className="flex items-center rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              style={{
                backgroundColor: "#E07B30",
                color: "#1c1426",
                fontSize: 16,
                padding: "16px 28px",
                gap: 10,
                boxShadow: "0 8px 30px -8px #E07B3099",
              }}
            >
              Haz tu diagnóstico — gratis
              <span aria-hidden>→</span>
            </Link>

            <Link
              href="/roi"
              className="rounded-md font-medium transition-colors hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                padding: "16px 28px",
                border: "1px solid #FFFFFF2E",
              }}
            >
              Calcula tu ROI
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
