"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

// ─── Campo de texto con contador visible ─────────────────────────────────────
// El contador cambia a coral desde el 90% del límite: truncar en silencio es
// peor que limitar — el usuario debe saber cuánto le queda.

interface CampoTextoProps {
  id: string;
  label: string;
  ayuda?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  minLength?: number;
  rows?: number;            // si se define → textarea; si no → input
  opcional?: boolean;
  showErrors?: boolean;
  errorMsg?: string;
  autoComplete?: string;
  type?: "text" | "email";
}

export function CampoTexto({
  id, label, ayuda, placeholder, value, onChange, maxLength, minLength = 1,
  rows, opcional = false, showErrors = false, errorMsg, autoComplete, type = "text",
}: CampoTextoProps) {
  const invalid = !opcional && value.trim().length < minLength;
  const cerca = value.length >= maxLength * 0.9;
  const cls = "border-white/15 text-white placeholder:text-white/25 focus-visible:ring-(--primary)";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/80 mb-1">
        {label}{" "}
        {opcional ? (
          <span className="text-white/30 font-normal">(opcional)</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      {ayuda && <p className="text-xs text-white/45 mb-2 leading-relaxed">{ayuda}</p>}
      {rows ? (
        <Textarea
          id={id} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={rows} maxLength={maxLength}
          className={`${cls} resize-none`} aria-required={!opcional}
          aria-invalid={showErrors && invalid}
        />
      ) : (
        <Input
          id={id} type={type} inputMode={type === "email" ? "email" : undefined}
          autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} maxLength={maxLength} className={cls}
          aria-required={!opcional} aria-invalid={showErrors && invalid}
        />
      )}
      <div className="flex items-center justify-between mt-1.5 gap-3">
        <AnimatePresence>
          {showErrors && invalid && errorMsg && (
            <motion.p variants={fadeIn} initial="initial" animate="animate" exit="exit"
              className="text-xs text-red-400" role="alert">
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>
        {maxLength >= 100 && (
          <span
            className="text-xs tabular-nums ml-auto"
            style={{ color: cerca ? "#F28F6B" : "rgba(255,255,255,0.25)" }}
            aria-live={cerca ? "polite" : "off"}
          >
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
