"use client";

import { MATURITY_LEVELS } from "@/lib/copy";
import type { MaturityLevel } from "@/types/intake";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

interface MaturityScaleProps {
  value: MaturityLevel | null;
  onChange: (level: MaturityLevel | null) => void;
}

export function MaturityScale({ value, onChange }: MaturityScaleProps) {
  function toggle(level: MaturityLevel) {
    onChange(value === level ? null : level);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Nivel de madurez analítica objetivo</legend>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {MATURITY_LEVELS.map(({ level, name, question, description }) => {
          const selected = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => toggle(level)}
              aria-pressed={selected}
              className={`
                relative text-left p-3 rounded-lg border transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B30]
                ${selected
                  ? "border-[#E07B30] bg-[#E07B30]/12"
                  : "border-white/10 bg-white/3 hover:border-white/25"
                }
              `}
            >
              {/* Número del nivel */}
              <span
                className={`
                  block text-2xl font-black tracking-tight leading-none mb-2
                  ${selected ? "text-[#E07B30]" : "text-white/20"}
                `}
              >
                {level}
              </span>

              {/* Nombre */}
              <span
                className={`
                  block text-xs font-bold uppercase tracking-wider mb-1
                  ${selected ? "text-white" : "text-white/60"}
                `}
              >
                {name}
              </span>

              {/* Pregunta */}
              <span
                className={`
                  block text-xs mb-1
                  ${selected ? "text-white/80" : "text-white/40"}
                `}
              >
                {question}
              </span>

              {/* Descripción */}
              <span
                className={`
                  block text-xs
                  ${selected ? "text-white/50" : "text-white/25"}
                `}
              >
                {description}
              </span>

              {/* Indicador de selección */}
              {selected && (
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07B30]"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje cuando no hay nivel seleccionado */}
      <AnimatePresence>
        {value === null && (
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-xs text-white/40 flex items-start gap-1.5 pt-1"
            role="note"
          >
            <span aria-hidden className="mt-0.5 text-[#E07B30]/60">→</span>
            Si no tienes claro a dónde quieres llegar, el piso mínimo
            recomendado antes de pensar en IA es el nivel{" "}
            <strong className="text-white/60">2 — Diagnóstico</strong>: datos
            estructurados y la capacidad de entender por qué algo pasó.
          </motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
