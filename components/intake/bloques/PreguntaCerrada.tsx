"use client";

import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

// ─── Pregunta de selección única — tarjetas con punto radio (mockup) ─────────
// Seleccionada: borde coral + tinte coral al 7%. `sub` = subtítulo que evita
// que la persona elija al azar.

export interface Opcion<V extends string> { value: V; label: string; sub?: string }

interface PreguntaCerradaProps<V extends string> {
  id: string;
  pregunta: string;
  options: readonly Opcion<V>[];
  value: V | null;
  onChange: (v: V) => void;
  showErrors?: boolean;
  errorMsg?: string;
}

export function PreguntaCerrada<V extends string>({
  id, pregunta, options, value, onChange, showErrors = false, errorMsg,
}: PreguntaCerradaProps<V>) {
  return (
    <fieldset className="mb-7">
      <legend className="block text-[15.5px] font-semibold leading-snug text-[#F2F6F9] mb-3"
        style={{ fontFamily: "var(--font-space-grotesk)" }}>
        {pregunta}
      </legend>
      <div className="flex flex-col gap-2" role="radiogroup">
        {options.map((opt) => {
          const sel = value === opt.value;
          return (
            <label
              key={opt.value}
              className="flex items-start gap-3 rounded-md border px-3.5 py-3 cursor-pointer transition-all duration-150 active:scale-[.995] focus-within:ring-2 focus-within:ring-(--primary)"
              style={{
                background: sel ? "rgba(242,143,107,.07)" : "#141F2E",
                borderColor: sel ? "#F28F6B" : "rgba(139,149,165,.18)",
              }}
            >
              <input type="radio" name={id} value={opt.value} checked={sel}
                onChange={() => onChange(opt.value)} className="sr-only" />
              <span aria-hidden className="relative mt-0.5 h-[17px] w-[17px] shrink-0 rounded-full border-[1.5px] transition-colors"
                style={{ borderColor: sel ? "#F28F6B" : "#8B95A5" }}>
                {sel && <span className="absolute inset-[3.5px] rounded-full" style={{ background: "#F28F6B" }} />}
              </span>
              <span className="text-[14.5px] leading-snug text-[#F2F6F9]">
                {opt.label}
                {opt.sub && <span className="block text-[12px] leading-snug text-[#8B95A5] mt-0.5">{opt.sub}</span>}
              </span>
            </label>
          );
        })}
      </div>
      <AnimatePresence>
        {showErrors && value === null && errorMsg && (
          <motion.p variants={fadeIn} initial="initial" animate="animate" exit="exit"
            className="text-xs text-[#F28F6B] mt-2" role="alert">{errorMsg}</motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
