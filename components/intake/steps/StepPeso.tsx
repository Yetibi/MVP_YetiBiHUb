"use client";

import { motion, AnimatePresence, fadeIn } from "@/lib/motion";
import { FRECUENCIA_OPTIONS, ANTIGUEDAD_OPTIONS } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";
import type { Frecuencia, Antiguedad } from "@/types/aptitud";

interface StepPesoProps {
  data: IntakeFormData;
  update: UpdateFn;
  showErrors: boolean;
}

function GrupoChips<V extends string>({
  name,
  label,
  options,
  value,
  onChange,
  showErrors,
  errorMsg,
}: {
  name: string;
  label: string;
  options: readonly { value: V; label: string }[];
  value: V | null;
  onChange: (v: V) => void;
  showErrors: boolean;
  errorMsg: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-white/80 mb-3">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`
                px-4 py-2.5 rounded-lg border text-sm cursor-pointer
                transition-all duration-200
                focus-within:ring-2 focus-within:ring-(--primary)
                ${selected
                  ? "border-(--primary) bg-(--primary)/10 text-white"
                  : "border-white/10 bg-white/3 text-white/70 hover:border-white/25"}
              `}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      <AnimatePresence>
        {showErrors && value === null && (
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-xs text-red-400 mt-2"
            role="alert"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  );
}

export function StepPeso({ data, update, showErrors }: StepPesoProps) {
  return (
    <section aria-labelledby="step5-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">
        Paso 5 · El peso del proceso
      </p>
      <h2
        id="step5-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        Frecuencia y antigüedad
      </h2>
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        Dos preguntas cortas: cuánto pesa este proceso en la operación y hace
        cuánto no se rediseña.
      </p>

      <div className="space-y-10">
        <GrupoChips<Frecuencia>
          name="frecuencia"
          label="¿Cada cuánto ocurre este proceso?"
          options={FRECUENCIA_OPTIONS}
          value={data.frecuencia}
          onChange={(v) => update("frecuencia", v)}
          showErrors={showErrors}
          errorMsg="Selecciona la frecuencia para continuar."
        />

        <GrupoChips<Antiguedad>
          name="antiguedad"
          label="¿Cuándo fue la última vez que cambió la forma de hacerlo?"
          options={ANTIGUEDAD_OPTIONS}
          value={data.antiguedad}
          onChange={(v) => update("antiguedad", v)}
          showErrors={showErrors}
          errorMsg="Selecciona la antigüedad para continuar."
        />
      </div>
    </section>
  );
}
