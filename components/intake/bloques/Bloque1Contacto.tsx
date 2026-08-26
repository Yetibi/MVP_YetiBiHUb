"use client";

import { CampoTexto } from "./CampoTexto";
import { BLOQUES, CAMPO_NOMBRE, SECTORS } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Bloque1Contacto({ data, update, showErrors }: Props) {
  return (
    <section aria-labelledby="b1-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">{BLOQUES[1].kicker}</p>
      <h2 id="b1-title" className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">{BLOQUES[1].titulo}</h2>
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        El resultado no se muestra en pantalla: un ingeniero revisa el diagnóstico de tu proceso y te lo envía por correo.
      </p>
      <div className="space-y-7">
        <CampoTexto id="nombre" label={CAMPO_NOMBRE.label} placeholder={CAMPO_NOMBRE.placeholder}
          value={data.nombre} onChange={(v) => update("nombre", v)} maxLength={CAMPO_NOMBRE.max}
          minLength={CAMPO_NOMBRE.min} autoComplete="name" showErrors={showErrors}
          errorMsg="Escribe tu nombre para continuar." />
        <div>
          <CampoTexto id="email" type="email" label="Correo electrónico" placeholder="tu@empresa.com"
            value={data.email} onChange={(v) => update("email", v)} maxLength={120} minLength={5}
            autoComplete="email" showErrors={showErrors && !EMAIL_RE.test(data.email)}
            errorMsg="Escribe un correo válido para recibir el diagnóstico." />
        </div>
        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-white/80 mb-1.5">
            Sector <span className="text-white/30 font-normal">(opcional)</span>
          </label>
          <select id="sector" value={data.sector} onChange={(e) => update("sector", e.target.value)}
            className="w-full h-10 rounded-md border border-white/15 bg-transparent px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) [&>option]:bg-(--background)">
            <option value="">Selecciona tu sector…</option>
            {SECTORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </section>
  );
}
