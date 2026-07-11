"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Settings2, Database, Workflow, Brain, TrendingUp, Compass } from "lucide-react";
import { nodeReveal, pathDraw, pctPop, listContainer, fadeUp } from "@/lib/motion";

// ─── types ───────────────────────────────────────────────────────────────────

type AnimState = "hidden" | "show";

interface NodeProps {
  tag: string;
  title: string;
  desc: string;
  icon: ReactNode;
  pct?: string;
  variant?: "default" | "destination" | "external";
  delay: number;
  anim: AnimState;
  rm: boolean;
  width?: number | string;
}

// ─── DiagramNode ─────────────────────────────────────────────────────────────

function DiagramNode({ tag, title, desc, icon, pct, variant = "default", delay, anim, rm, width }: NodeProps) {
  const state: AnimState = rm ? "show" : anim;

  const bgColor =
    variant === "destination" ? "#E07B30" :
    variant === "external"    ? "transparent" : "#372E4D";

  const borderStyle =
    variant === "destination" ? "none" :
    variant === "external"    ? "1px dashed #E07B3066" : "1px solid #453960";

  const tagColor  = variant === "destination" ? "#1c142699" : "#A89EC0";
  const titleColor = variant === "destination" ? "#1c1426"  : "#FFFFFF";
  const descColor  = variant === "destination" ? "#1c142699" : "#C3B9D6";
  const iconColor  = variant === "destination" ? "#1c1426"  : "#C3B9D6";

  return (
    <motion.div
      variants={nodeReveal}
      initial={rm ? "show" : "hidden"}
      animate={state}
      transition={rm ? { duration: 0 } : { delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col"
      style={{
        backgroundColor: bgColor,
        borderRadius: 6,
        padding: 24,
        gap: 10,
        border: borderStyle,
        width: width ?? "auto",
        flexShrink: 0,
      }}
    >
      <span aria-hidden style={{ color: iconColor, width: 22, height: 22, display: "block" }}>
        {icon}
      </span>
      <p className="font-normal uppercase tracking-[0.22em]" style={{ color: tagColor, fontSize: 10 }}>
        {tag}
      </p>
      <p className="font-semibold" style={{ color: titleColor, fontSize: 17, lineHeight: 1.3 }}>
        {title}
      </p>
      <p style={{ color: descColor, fontSize: 13, lineHeight: 1.5 }}>{desc}</p>

      {pct !== undefined && (
        <motion.p
          variants={pctPop}
          initial={rm ? "show" : "hidden"}
          animate={state}
          transition={rm ? { duration: 0 } : { delay: delay + 0.4, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-bold"
          style={{ color: variant === "destination" ? "#1c1426" : "#E07B30", fontSize: 30 }}
        >
          {pct}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Pipe connector ──────────────────────────────────────────────────────────

function Pipe({ anim, rm }: { anim: AnimState; rm: boolean }) {
  const state: AnimState = rm ? "show" : anim;
  const td = rm ? { duration: 0 } : undefined;

  return (
    <svg aria-hidden width="38" height="16" viewBox="0 0 38 16" fill="none" style={{ flexShrink: 0 }}>
      <motion.circle cx="4" cy="8" r="4" fill="#453960"
        variants={nodeReveal} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 0.3, duration: 0.2 }} />
      <motion.rect x="8" y="7" width="22" height="2" fill="#453960"
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 0.35, duration: 0.3, ease: "easeInOut" }} />
      <motion.circle cx="34" cy="8" r="4" fill="#453960"
        variants={nodeReveal} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 0.55, duration: 0.2 }} />
    </svg>
  );
}

// ─── Fork SVG ────────────────────────────────────────────────────────────────

function Fork({ anim, rm }: { anim: AnimState; rm: boolean }) {
  const state: AnimState = rm ? "show" : anim;
  const td = rm ? { duration: 0 } : undefined;
  const common = { stroke: "#E07B30", strokeWidth: 2, fill: "none" as const, strokeLinecap: "round" as const };

  return (
    <svg aria-hidden width="60" height="320" viewBox="0 0 60 320" style={{ flexShrink: 0 }}>
      <motion.path d="M 0 160 L 22 160" {...common}
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 0.85, duration: 0.25, ease: "easeInOut" }} />
      <motion.path d="M 22 160 C 44 160 60 80 60 80" {...common}
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 1.05, duration: 0.55, ease: "easeInOut" }} />
      <motion.path d="M 22 160 C 44 160 60 240 60 240" {...common}
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 1.05, duration: 0.55, ease: "easeInOut" }} />
    </svg>
  );
}

// ─── Converge SVG ────────────────────────────────────────────────────────────

function Converge({ anim, rm }: { anim: AnimState; rm: boolean }) {
  const state: AnimState = rm ? "show" : anim;
  const td = rm ? { duration: 0 } : undefined;
  const common = { stroke: "#E07B30", strokeWidth: 2, fill: "none" as const, strokeLinecap: "round" as const };

  return (
    <svg aria-hidden width="60" height="320" viewBox="0 0 60 320" style={{ flexShrink: 0 }}>
      <motion.path d="M 0 80 C 0 80 16 160 38 160" {...common}
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 1.85, duration: 0.55, ease: "easeInOut" }} />
      <motion.path d="M 0 240 C 0 240 16 160 38 160" {...common}
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 1.85, duration: 0.55, ease: "easeInOut" }} />
      <motion.path d="M 38 160 L 60 160" {...common}
        variants={pathDraw} initial={rm ? "show" : "hidden"} animate={state}
        transition={td ?? { delay: 2.35, duration: 0.25, ease: "easeInOut" }} />
    </svg>
  );
}

// ─── ColumnLabel ─────────────────────────────────────────────────────────────

function ColumnLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-normal uppercase tracking-[0.28em]" style={{ color: "#8E83A6", fontSize: 10, marginBottom: 16 }}>
      {children}
    </p>
  );
}

// ─── ValueFlow ───────────────────────────────────────────────────────────────

export function ValueFlow() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(diagramRef, { once: true, margin: "-100px" });
  const rm = useReducedMotion() === true;
  const anim: AnimState = isInView ? "show" : "hidden";

  return (
    <section
      className="w-full overflow-hidden px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#221B31", paddingTop: 100, paddingBottom: 100 }}
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
          style={{ color: "#A89EC0", fontSize: 12 }}
        >
          EL FLUJO DE VALOR
        </motion.p>
        <motion.h2
          variants={rm ? undefined : fadeUp}
          className="flex flex-wrap items-baseline font-[family-name:var(--font-heading)]"
          style={{ gap: 14 }}
        >
          <span className="font-bold" style={{ color: "#FFFFFF", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.15 }}>
            No todo es IA.
          </span>
          <span className="font-bold italic" style={{ color: "#E07B30", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.15 }}>
            La claridad es la condición para el éxito.
          </span>
        </motion.h2>
      </motion.div>

      {/* Diagram */}
      <div
        ref={diagramRef}
        role="img"
        aria-label="Diagrama del flujo de valor: Proceso claro y sano → Dato confiable → dos caminos: Optimización/automatización simple (70–80%) o IA que decide (15–20%) → Impacto financiero medible. Factor externo: problemas de modelo de negocio (5–10%)."
        className="w-full overflow-x-auto"
        style={{ marginBottom: 8 }}
      >
        <p className="text-right text-xs pb-2 md:hidden" style={{ color: "#8E83A6" }} aria-hidden>
          ← desliza para ver el diagrama →
        </p>

        {/* Column labels row */}
        <div className="flex items-end" style={{ minWidth: 1150, gap: 0, paddingBottom: 0 }}>
          {/* Label: LOS CIMIENTOS */}
          <div style={{ width: 235 + 38 + 235, flexShrink: 0 }}>
            <ColumnLabel>LOS CIMIENTOS OBLIGATORIOS</ColumnLabel>
          </div>
          {/* spacer: fork */}
          <div style={{ width: 60, flexShrink: 0 }} />
          {/* Label: LA BIFURCACIÓN */}
          <div style={{ width: 330, flexShrink: 0 }}>
            <ColumnLabel>LA BIFURCACIÓN ESTRATÉGICA</ColumnLabel>
          </div>
          {/* spacer: converge */}
          <div style={{ width: 60, flexShrink: 0 }} />
          {/* Label: EL DESTINO */}
          <div style={{ flex: 1 }}>
            <ColumnLabel>EL DESTINO INEVITABLE</ColumnLabel>
          </div>
        </div>

        {/* Diagram nodes row */}
        <div className="flex items-center" style={{ gap: 0, minWidth: 1150 }}>

          {/* Node 1 */}
          <DiagramNode
            tag="PASO 1"
            title="Proceso claro y sano"
            desc="Se elimina la variabilidad y los cuellos de botella antes de cualquier cosa."
            icon={<Settings2 size={22} />}
            delay={0}
            anim={anim}
            rm={rm}
            width={235}
          />

          <Pipe anim={anim} rm={rm} />

          {/* Node 2 */}
          <DiagramNode
            tag="PASO 2"
            title="Dato confiable"
            desc="No se fabrica: es el subproducto natural de un proceso estandarizado."
            icon={<Database size={22} />}
            delay={0.6}
            anim={anim}
            rm={rm}
            width={235}
          />

          <Fork anim={anim} rm={rm} />

          {/* Two branch paths */}
          <div className="flex flex-col" style={{ gap: 36, width: 330, flexShrink: 0 }}>
            <DiagramNode
              tag="CAMINO 1"
              title="Optimización y automatización simple"
              desc="RPA, SOPs, automatización de flujos. La ruta más rápida y económica hacia el ROI."
              icon={<Workflow size={22} />}
              pct="70–80%"
              delay={1.3}
              anim={anim}
              rm={rm}
            />
            <DiagramNode
              tag="CAMINO 2"
              title="IA que decide"
              desc="Modelos de decisión, aplicados solo cuando el diagnóstico lo justifica."
              icon={<Brain size={22} />}
              pct="15–20%"
              delay={1.3}
              anim={anim}
              rm={rm}
            />
          </div>

          <Converge anim={anim} rm={rm} />

          {/* Destination + External stacked */}
          <div className="flex flex-col" style={{ gap: 16, flex: 1, minWidth: 230 }}>
            <DiagramNode
              tag="ETAPA 3"
              title="Impacto financiero medible"
              desc="El único resultado aceptable."
              icon={<TrendingUp size={22} />}
              variant="destination"
              delay={2.55}
              anim={anim}
              rm={rm}
            />
            <DiagramNode
              tag="FACTOR EXTERNO · 5–10%"
              title="Modelo de negocio"
              desc="Problemas de modelo de negocio, no tecnológicos. El diagnóstico también te lo dice."
              icon={<Compass size={22} />}
              variant="external"
              delay={2.8}
              anim={anim}
              rm={rm}
            />
          </div>
        </div>
      </div>

      {/* Bottom copy */}
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="flex w-full flex-col md:flex-row md:items-start"
        style={{ gap: 80, marginTop: 70 }}
      >
        {/* Margin note */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          style={{ borderLeft: "2px solid #453960", paddingLeft: 20, width: 360, flexShrink: 0 }}
        >
          <p style={{ color: "#A89EC0", fontSize: 13, lineHeight: 1.6 }}>
            Un 5–10% de los problemas son de modelo de negocio, no tecnológicos.
            El diagnóstico también te lo dice.
          </p>
        </motion.div>

        {/* Closing copy */}
        <motion.div
          variants={rm ? undefined : fadeUp}
          className="flex flex-col font-[family-name:var(--font-heading)]"
          style={{ gap: 8, flex: 1 }}
        >
          <p className="italic" style={{ color: "#C3B9D6", fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.5 }}>
            El enfoque tradicional compra la tecnología y luego busca el problema.
          </p>
          <p className="font-bold italic" style={{ color: "#E07B30", fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.5 }}>
            El nuestro encuentra la fuga de valor y te dice cuál camino la cierra — a veces ni siquiera es IA.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
