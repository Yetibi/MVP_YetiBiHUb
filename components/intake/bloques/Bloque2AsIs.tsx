"use client";

import { CampoTexto } from "./CampoTexto";
import { BLOQUES, CAMPO_AS_IS, CAMPO_EJECUCION, CAMPO_PROCESO } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }

// El AS-IS: el punto A del cliente en sus propias palabras.
export function Bloque2AsIs({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b2-kicker">
      <span id="b2-kicker" className="block text-[10px] uppercase tracking-[.2em] text-[#F28F6B] mb-1.5" style={{ fontFamily: "var(--font-geist-mono)" }}>{BLOQUES[2].kicker}</span>
      <p className="text-[13px] leading-relaxed text-[#5D6B7A] mb-6">
        Describe el proceso <strong className="font-medium text-[#8B95A5]">como ocurre en la realidad</strong>, no como está documentado. Si hay atajos, grupos de WhatsApp o archivos paralelos, eso es justo lo que necesitamos saber.
      </p>
      <CampoTexto id="proceso" label={CAMPO_PROCESO.label} ayuda={CAMPO_PROCESO.ayuda} placeholder={CAMPO_PROCESO.placeholder}
        value={data.proceso} onChange={(v) => update("proceso", v)} maxLength={CAMPO_PROCESO.max} minLength={CAMPO_PROCESO.min}
        showErrors={showErrors} errorMsg="Ponle un nombre corto al proceso." />
      <CampoTexto id="asIs" label={CAMPO_AS_IS.label} ayuda={CAMPO_AS_IS.ayuda} placeholder={CAMPO_AS_IS.placeholder} rows={6}
        value={data.asIs} onChange={(v) => update("asIs", v)} maxLength={CAMPO_AS_IS.max} minLength={CAMPO_AS_IS.min}
        showErrors={showErrors} errorMsg={`Cuéntanos cómo funciona hoy (al menos ${CAMPO_AS_IS.min} caracteres).`} />
      <CampoTexto id="ejecucion" label={CAMPO_EJECUCION.label} ayuda={CAMPO_EJECUCION.ayuda} placeholder={CAMPO_EJECUCION.placeholder} rows={4}
        value={data.ejecucion} onChange={(v) => update("ejecucion", v)} maxLength={CAMPO_EJECUCION.max} minLength={CAMPO_EJECUCION.min}
        showErrors={showErrors} errorMsg="Cuéntanos quién lo ejecuta y con qué." />
    </section>
  );
}
