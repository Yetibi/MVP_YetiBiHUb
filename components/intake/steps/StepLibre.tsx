"use client";

import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

interface StepLibreProps {
  id: string;
  kicker: string;
  titulo: string;
  ayuda: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  minLength?: number;
  rows?: number;
  placeholder?: string;
  showErrors: boolean;
  errorMsg: string;
}

export function StepLibre({
  id,
  kicker,
  titulo,
  ayuda,
  value,
  onChange,
  maxLength,
  minLength = 1,
  rows = 4,
  placeholder,
  showErrors,
  errorMsg,
}: StepLibreProps) {
  const invalid = value.trim().length < minLength;

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
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        {ayuda}
      </p>

      <div>
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-(--primary) resize-none"
          aria-required="true"
          aria-invalid={showErrors && invalid}
        />
        <div className="flex items-center justify-between mt-1.5">
          <AnimatePresence>
            {showErrors && invalid && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400"
                role="alert"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
          <span
            className="text-xs tabular-nums ml-auto"
            style={{
              color:
                value.length >= maxLength * 0.9
                  ? "#F28F6B"
                  : "rgba(255,255,255,0.25)",
            }}
          >
            {value.length} / {maxLength}
          </span>
        </div>
      </div>
    </section>
  );
}
