"use client";

import { CampoTexto } from "./CampoTexto";
import { BLOQUES, CAMPO_AS_IS, CAMPO_EJECUCION, CAMPO_PROCESO } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }

// El AS-IS: el punto A del cliente en sus propias palabras.
export function Bloque2AsIs({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b2-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">{BLOQUES[2].kicker}</p>
      <h2 id="b2-title" className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
        Describe el proceso <span className="text-(--primary)">como ocurre en la realidad</span>, no como está documentado.
      </h2>
      <p className="text-sm text-white/50 mb-10 max-w-lg leading-relaxed">{BLOQUES[2].ayuda}</p>
      <div className="space-y-8">
        <CampoTexto id="proceso" label={CAMPO_PROCESO.label} ayuda={CAMPO_PROCESO.ayuda}
          placeholder={CAMPO_PROCESO.placeholder} value={data.proceso} onChange={(v) => update("proceso", v)}
          maxLength={CAMPO_PROCESO.max} minLength={CAMPO_PROCESO.min} showErrors={showErrors}
          errorMsg="Ponle un nombre corto al proceso." />
        <CampoTexto id="asIs" label={CAMPO_AS_IS.label} ayuda={CAMPO_AS_IS.ayuda} rows={7}
          placeholder="Ej.: La clienta escribe por WhatsApp, la recepcionista mira la agenda de papel, confirma…"
          value={data.asIs} onChange={(v) => update("asIs", v)} maxLength={CAMPO_AS_IS.max}
          minLength={CAMPO_AS_IS.min} showErrors={showErrors}
          errorMsg={`Cuéntanos cómo funciona hoy (al menos ${CAMPO_AS_IS.min} caracteres).`} />
        <CampoTexto id="ejecucion" label={CAMPO_EJECUCION.label} ayuda={CAMPO_EJECUCION.ayuda} rows={4}
          placeholder="Ej.: La recepcionista, con Excel compartido, WhatsApp Business y una agenda de papel."
          value={data.ejecucion} onChange={(v) => update("ejecucion", v)} maxLength={CAMPO_EJECUCION.max}
          minLength={CAMPO_EJECUCION.min} showErrors={showErrors}
          errorMsg="Cuéntanos quién lo ejecuta y con qué." />
      </div>
    </section>
  );
}
