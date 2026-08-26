"use client";

import { CampoTexto } from "./CampoTexto";
import { PreguntaCerrada } from "./PreguntaCerrada";
import {
  AMPLIACION, ANTIGUEDAD_OPTIONS, BLOQUES, DATO_OPTIONS, FALLA_OPTIONS,
  FRECUENCIA_OPTIONS, PREGUNTAS_B3, SENAL_OPTIONS,
} from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }

// Cinco preguntas de selección; tres ganan ampliación opcional.
export function Bloque3Comportamiento({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b3-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">{BLOQUES[3].kicker}</p>
      <h2 id="b3-title" className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-10">{BLOQUES[3].titulo}</h2>

      <div className="space-y-12">
        <div className="space-y-4">
          <PreguntaCerrada id="senal" pregunta={`3.1 · ${PREGUNTAS_B3.senal}`} options={SENAL_OPTIONS}
            value={data.senal} onChange={(v) => update("senal", v)} showErrors={showErrors}
            errorMsg="Selecciona una opción para continuar." />
          <CampoTexto id="senalDetalle" label={AMPLIACION.senal.label} placeholder={AMPLIACION.senal.placeholder}
            rows={2} opcional value={data.senalDetalle} onChange={(v) => update("senalDetalle", v)}
            maxLength={AMPLIACION.senal.max} />
        </div>

        <div className="space-y-4">
          <PreguntaCerrada id="dato" pregunta={`3.2 · ${PREGUNTAS_B3.dato}`} options={DATO_OPTIONS}
            value={data.dato} onChange={(v) => update("dato", v)} showErrors={showErrors}
            errorMsg="Selecciona una opción para continuar." />
          <CampoTexto id="datoDetalle" label={AMPLIACION.dato.label} placeholder={AMPLIACION.dato.placeholder}
            rows={2} opcional value={data.datoDetalle} onChange={(v) => update("datoDetalle", v)}
            maxLength={AMPLIACION.dato.max} />
        </div>

        <PreguntaCerrada id="frecuencia" pregunta={`3.3 · ${PREGUNTAS_B3.frecuencia}`} options={FRECUENCIA_OPTIONS}
          value={data.frecuencia} onChange={(v) => update("frecuencia", v)} showErrors={showErrors}
          errorMsg="Selecciona la frecuencia para continuar." compacta />

        <div className="space-y-4">
          <PreguntaCerrada id="antiguedad" pregunta={`3.4 · ${PREGUNTAS_B3.antiguedad}`} options={ANTIGUEDAD_OPTIONS}
            value={data.antiguedad} onChange={(v) => update("antiguedad", v)} showErrors={showErrors}
            errorMsg="Selecciona una opción para continuar." compacta />
          <CampoTexto id="intentoPrevio" label={AMPLIACION.intento.label} ayuda={AMPLIACION.intento.ayuda}
            placeholder={AMPLIACION.intento.placeholder} rows={2} opcional value={data.intentoPrevio}
            onChange={(v) => update("intentoPrevio", v)} maxLength={AMPLIACION.intento.max} />
        </div>

        <PreguntaCerrada id="falla" pregunta={`3.5 · ${PREGUNTAS_B3.falla}`} options={FALLA_OPTIONS}
          value={data.falla} onChange={(v) => update("falla", v)} showErrors={showErrors}
          errorMsg="Selecciona una opción para continuar." />
      </div>
    </section>
  );
}
