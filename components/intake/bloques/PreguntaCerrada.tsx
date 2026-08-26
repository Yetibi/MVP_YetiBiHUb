"use client";

import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

// ─── Pregunta de selección única (tarjetas radio) ────────────────────────────
// `sub` = subtítulo explicativo de la opción (viene del mockup; hoy opcional).

export interface Opcion<V extends string> { value: V; label: string; sub?: string }

interface PreguntaCerradaProps<V extends string> {
  id: string;
  pregunta: string;
  options: readonly Opcion<V>[];
  value: V | null;
  onChange: (v: V) => void;
  showErrors?: boolean;
  errorMsg?: string;
  compacta?: boolean; // chips en fila (frecuencia/antigüedad)
}

export function PreguntaCerrada<V extends string>({
  id, pregunta, options, value, onChange, showErrors = false, errorMsg, compacta = false,
}: PreguntaCerradaProps<V>) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-white/80 mb-3">
        {pregunta} <span aria-hidden="true">*</span>
      </legend>
      <div className={compacta ? "flex flex-wrap gap-2" : "space-y-2.5"} role="radiogroup">
        {options.map((opt) => {
          const sel = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`
                cursor-pointer border transition-all duration-200 group
                focus-within:ring-2 focus-within:ring-(--primary)
                ${compacta ? "px-4 py-2.5 rounded-lg text-sm" : "flex items-start gap-3.5 p-4 rounded-xl"}
                ${sel ? "border-(--primary) bg-(--primary)/10" : "border-white/10 bg-white/3 hover:border-white/25"}
              `}
            >
              <input type="radio" name={id} value={opt.value} checked={sel}
                onChange={() => onChange(opt.value)} className="sr-only" />
              {!compacta && (
                <span aria-hidden className={`mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 transition-colors ${
                  sel ? "border-(--primary) bg-(--primary)" : "border-white/30 group-hover:border-white/50"}`} />
              )}
              <span className={compacta ? (sel ? "text-white" : "text-white/70") : "flex flex-col gap-0.5"}>
                <span className={`text-sm leading-relaxed ${sel ? "text-white" : "text-white/70"}`}>{opt.label}</span>
                {!compacta && opt.sub && (
                  <span className="text-xs text-white/40 leading-relaxed">{opt.sub}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <AnimatePresence>
        {showErrors && value === null && errorMsg && (
          <motion.p variants={fadeIn} initial="initial" animate="animate" exit="exit"
            className="text-xs text-red-400 mt-2" role="alert">{errorMsg}</motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
