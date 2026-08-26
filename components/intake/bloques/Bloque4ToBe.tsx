"use client";

import { CampoTexto } from "./CampoTexto";
import { BLOQUES, CAMPO_TO_BE } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }

// El TO-BE: el punto B en palabras del cliente. La pregunta NO menciona IA,
// automatización ni tecnología — si la persona la menciona, es decisión suya.
export function Bloque4ToBe({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b4-kicker">
      <span id="b4-kicker" className="block text-[10px] uppercase tracking-[.2em] text-(--primary) mb-1.5" style={{ fontFamily: "var(--font-geist-mono)" }}>{BLOQUES[4].kicker}</span>
      <p className="text-[13px] leading-relaxed text-[#5D6B7A] mb-6">{BLOQUES[4].desc}</p>
      <CampoTexto id="toBe" label={CAMPO_TO_BE.label} ayuda={CAMPO_TO_BE.ayuda} placeholder={CAMPO_TO_BE.placeholder} rows={7} minHeight={150}
        value={data.toBe} onChange={(v) => update("toBe", v)} maxLength={CAMPO_TO_BE.max} minLength={CAMPO_TO_BE.min}
        showErrors={showErrors} errorMsg="Cuéntanos cómo se vería para continuar." />
      <p className="text-[12px] leading-relaxed text-[#5D6B7A] text-center mt-2">
        Sin costo. Te llega por correo en unos minutos.<br />No compartimos tu información con nadie.
      </p>
    </section>
  );
}
