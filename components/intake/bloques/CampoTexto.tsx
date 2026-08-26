"use client";

import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

// ─── Campo de texto con contador (estilo del mockup) ─────────────────────────
// Superficie acero-2, borde hairline, radio 6, 16px (evita el zoom de iOS).
// El contador es mono y pasa a coral desde el 90%: truncar en silencio es
// peor que limitar.

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
  minHeight?: number;
}

const CAMPO =
  "w-full rounded-md border border-[rgba(139,149,165,.22)] bg-[#141F2E] px-3.5 py-3 text-[16px] leading-relaxed text-[#F2F6F9] placeholder:text-[#5D6B7A] transition-colors focus:border-(--primary) focus:outline-none";

export function CampoTexto({
  id, label, ayuda, placeholder, value, onChange, maxLength, minLength = 1,
  rows, opcional = false, showErrors = false, errorMsg, autoComplete, type = "text", minHeight,
}: CampoTextoProps) {
  const invalid = !opcional && value.trim().length < minLength;
  const cerca = value.length > maxLength * 0.9;

  return (
    <div className="mb-7">
      <label
        htmlFor={id}
        className={opcional ? "block text-[13px] text-[#8B95A5] mb-2" : "block text-[15.5px] font-semibold leading-snug text-[#F2F6F9] mb-1.5"}
        style={{ fontFamily: opcional ? undefined : "var(--font-space-grotesk)" }}
      >
        {label}{opcional && <span className="text-[#8B95A5]"> (opcional)</span>}
      </label>
      {ayuda && <p className="text-[12.5px] leading-relaxed text-[#8B95A5] mb-3">{ayuda}</p>}
      {rows ? (
        <textarea
          id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          rows={rows} maxLength={maxLength} className={`${CAMPO} resize-y ${opcional ? "bg-[#0B1420]" : ""}`}
          style={{ minHeight: minHeight ?? (opcional ? 70 : 120) }}
          aria-required={!opcional} aria-invalid={showErrors && invalid}
        />
      ) : (
        <input
          id={id} type={type} inputMode={type === "email" ? "email" : undefined} autoComplete={autoComplete}
          value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          maxLength={maxLength} className={CAMPO} aria-required={!opcional} aria-invalid={showErrors && invalid}
        />
      )}
      <div className="flex items-start justify-between gap-3 mt-1.5">
        <AnimatePresence>
          {showErrors && invalid && errorMsg && (
            <motion.p variants={fadeIn} initial="initial" animate="animate" exit="exit"
              className="text-xs text-[#F28F6B]" role="alert">{errorMsg}</motion.p>
          )}
        </AnimatePresence>
        {rows && (
          <span className="ml-auto text-[10.5px] tabular-nums" aria-live={cerca ? "polite" : "off"}
            style={{ fontFamily: "var(--font-geist-mono)", color: cerca ? "#F28F6B" : "#5D6B7A" }}>
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
