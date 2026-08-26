"use client";

import { CampoTexto } from "./CampoTexto";
import { PreguntaCerrada } from "./PreguntaCerrada";
import { AMPLIACION, ANTIGUEDAD_OPTIONS, BLOQUES, DATO_OPTIONS, FALLA_OPTIONS, FRECUENCIA_OPTIONS, PREGUNTAS_B3, SENAL_OPTIONS } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }
const ERR = "Selecciona una opción para continuar.";

// Cinco preguntas de selección; tres ganan ampliación opcional (mockup).
export function Bloque3Comportamiento({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b3-kicker">
      <span id="b3-kicker" className="block text-[10px] uppercase tracking-[.2em] text-[#F28F6B] mb-1.5" style={{ fontFamily: "var(--font-geist-mono)" }}>{BLOQUES[3].kicker}</span>
      <p className="text-[13px] leading-relaxed text-[#5D6B7A] mb-6">{BLOQUES[3].desc}</p>

      <div>
        <PreguntaCerrada id="senal" pregunta={PREGUNTAS_B3.senal} options={SENAL_OPTIONS} value={data.senal}
          onChange={(v) => update("senal", v)} showErrors={showErrors} errorMsg={ERR} />
        <div className="-mt-3">
          <CampoTexto id="senalDetalle" label={AMPLIACION.senal.label} placeholder={AMPLIACION.senal.placeholder} rows={2} opcional
            value={data.senalDetalle} onChange={(v) => update("senalDetalle", v)} maxLength={AMPLIACION.senal.max} />
        </div>
      </div>
      <div>
        <PreguntaCerrada id="dato" pregunta={PREGUNTAS_B3.dato} options={DATO_OPTIONS} value={data.dato}
          onChange={(v) => update("dato", v)} showErrors={showErrors} errorMsg={ERR} />
        <div className="-mt-3">
          <CampoTexto id="datoDetalle" label={AMPLIACION.dato.label} placeholder={AMPLIACION.dato.placeholder} rows={2} opcional
            value={data.datoDetalle} onChange={(v) => update("datoDetalle", v)} maxLength={AMPLIACION.dato.max} />
        </div>
      </div>
      <PreguntaCerrada id="frecuencia" pregunta={PREGUNTAS_B3.frecuencia} options={FRECUENCIA_OPTIONS} value={data.frecuencia}
        onChange={(v) => update("frecuencia", v)} showErrors={showErrors} errorMsg={ERR} />
      <div>
        <PreguntaCerrada id="antiguedad" pregunta={PREGUNTAS_B3.antiguedad} options={ANTIGUEDAD_OPTIONS} value={data.antiguedad}
          onChange={(v) => update("antiguedad", v)} showErrors={showErrors} errorMsg={ERR} />
        <div className="-mt-3">
          <CampoTexto id="intentoPrevio" label={AMPLIACION.intento.label} placeholder={AMPLIACION.intento.placeholder} rows={2} opcional
            value={data.intentoPrevio} onChange={(v) => update("intentoPrevio", v)} maxLength={AMPLIACION.intento.max} />
        </div>
      </div>
      <PreguntaCerrada id="falla" pregunta={PREGUNTAS_B3.falla} options={FALLA_OPTIONS} value={data.falla}
        onChange={(v) => update("falla", v)} showErrors={showErrors} errorMsg={ERR} />
    </section>
  );
}
