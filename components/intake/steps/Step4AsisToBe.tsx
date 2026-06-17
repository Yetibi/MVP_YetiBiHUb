"use client";

import { Textarea } from "@/components/ui/textarea";
import { MaturityScale } from "@/components/intake/MaturityScale";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";
import type { IntakeFormData, MaturityLevel, UpdateFn } from "@/types/intake";

interface Step4Props {
  data: IntakeFormData;
  update: UpdateFn;
  showErrors: boolean;
}

export function Step4AsisToBe({ data, update, showErrors }: Step4Props) {
  return (
    <section aria-labelledby="step4-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#E07B30] uppercase mb-3">
        Capa 3 — As-Is / To-Be
      </p>
      <h2
        id="step4-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        ¿Hacia dónde quieres llegar?
      </h2>
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        Describe en tus propias palabras el estado al que quieres llegar. No
        tiene que ser técnico — puede ser un resultado de negocio, una
        capacidad que quieres tener, o una decisión que hoy no puedes tomar.
      </p>

      <div className="space-y-8">
        {/* To-Be libre */}
        <div>
          <label
            htmlFor="toBe"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Objetivo (To-Be) *
          </label>
          <Textarea
            id="toBe"
            value={data.toBe}
            onChange={(e) => update("toBe", e.target.value)}
            placeholder="Ej: Quiero saber en tiempo real cuánto cuesta cada orden de producción y poder compararlo contra lo presupuestado…"
            rows={4}
            className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#E07B30] resize-none"
            aria-required="true"
          />
          <AnimatePresence>
            {showErrors && !data.toBe.trim() && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400 mt-1.5"
                role="alert"
              >
                Describe el objetivo para continuar.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Escala de madurez */}
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">
            Nivel de madurez que quieres alcanzar{" "}
            <span className="text-white/30 font-normal">(opcional)</span>
          </p>
          <p className="text-xs text-white/40 mb-4">
            Selecciona el nivel que mejor representa tu meta. Si no lo tienes
            claro, no pasa nada — te recomendamos un punto de partida.
          </p>
          <MaturityScale
            value={data.maturityTarget}
            onChange={(level) => update("maturityTarget", level as MaturityLevel | null)}
          />
        </div>
      </div>
    </section>
  );
}
