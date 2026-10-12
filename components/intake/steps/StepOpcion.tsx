"use client";

import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

export interface Opcion<V extends string> {
  value: V;
  label: string;
}

interface StepOpcionProps<V extends string> {
  id: string;
  kicker: string;
  titulo: string;
  subtitulo?: string;
  options: readonly Opcion<V>[];
  value: V | null;
  onChange: (value: V) => void;
  showErrors: boolean;
  errorMsg: string;
}

export function StepOpcion<V extends string>({
  id,
  kicker,
  titulo,
  subtitulo,
  options,
  value,
  onChange,
  showErrors,
  errorMsg,
}: StepOpcionProps<V>) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">
        {kicker}
      </p>
      <h2
        id={`${id}-title`}
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        {titulo}
      </h2>
      {subtitulo && (
        <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
          {subtitulo}
        </p>
      )}
      {!subtitulo && <div className="mb-10" />}

      <fieldset>
        <legend className="sr-only">{titulo}</legend>
        <div className="space-y-3" role="radiogroup">
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`
                  flex items-start gap-4 p-5 rounded-xl border cursor-pointer
                  transition-all duration-200 group
                  focus-within:ring-2 focus-within:ring-(--primary)
                  ${selected
                    ? "border-(--primary) bg-(--primary)/10"
                    : "border-white/10 bg-white/3 hover:border-white/25"}
                `}
              >
                <input
                  type="radio"
                  name={id}
                  value={opt.value}
                  checked={selected}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`
                    mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 transition-colors
                    ${selected
                      ? "border-(--primary) bg-(--primary)"
                      : "border-white/30 group-hover:border-white/50"}
                  `}
                />
                <span
                  className={`text-sm leading-relaxed ${
                    selected ? "text-white" : "text-white/70"
                  }`}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <AnimatePresence>
        {showErrors && value === null && (
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-xs text-red-400 mt-3"
            role="alert"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
