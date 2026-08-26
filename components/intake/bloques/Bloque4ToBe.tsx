"use client";

import { CampoTexto } from "./CampoTexto";
import { BLOQUES, CAMPO_TO_BE } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }

// El TO-BE: el punto B en palabras del cliente. La pregunta NO menciona IA,
// automatización ni tecnología — si la persona la menciona, es decisión suya.
export function Bloque4ToBe({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b4-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">{BLOQUES[4].kicker}</p>
      <h2 id="b4-title" className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">{CAMPO_TO_BE.label}</h2>
      <p className="text-sm text-white/50 mb-10 max-w-lg leading-relaxed">{CAMPO_TO_BE.ayuda}</p>
      <CampoTexto id="toBe" label="Cómo se vería" rows={7}
        placeholder="Ej.: Que ninguna silla se quede vacía, que nadie tenga que llamar para confirmar, y que la recepcionista pueda…"
        value={data.toBe} onChange={(v) => update("toBe", v)} maxLength={CAMPO_TO_BE.max}
        minLength={CAMPO_TO_BE.min} showErrors={showErrors}
        errorMsg="Cuéntanos cómo se vería para continuar." />
    </section>
  );
}
