"use client";

import { CampoTexto } from "./CampoTexto";
import { BLOQUES, CAMPO_CORREO, CAMPO_NOMBRE, CAMPO_SECTOR, SECTORS } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Props { data: IntakeFormData; update: UpdateFn; showErrors: boolean }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONO = "var(--font-geist-mono)";
const SG = "var(--font-space-grotesk)";

export function Bloque1Contacto({ data, update, showErrors }: Props) {
  const b = BLOQUES[1];
  return (
    <section aria-labelledby="b1-title">
      <h1 id="b1-title" className="text-[27px] font-bold leading-[1.18] tracking-[-.02em] text-[#F2F6F9] mb-3.5"
        style={{ fontFamily: SG }}>
        Evalúa un proceso<br />de tu operación.
      </h1>
      <p className="text-[14.5px] leading-relaxed text-[#8B95A5] mb-7">{b.lead}</p>
      <div className="rounded-r-md border-l-2 border-(--primary) bg-[#1C2836] px-4 py-3.5 mb-8">
        <p className="text-[13px] leading-relaxed text-[#8B95A5]">
          Responde pensando en <b className="font-medium text-[#F2F6F9]">un solo proceso concreto</b>. Entre más específico, más útil el diagnóstico.
        </p>
      </div>
      <span className="block text-[10px] uppercase tracking-[.2em] text-[#F28F6B] mb-5" style={{ fontFamily: MONO }}>{b.kicker}</span>

      <CampoTexto id="nombre" label={CAMPO_NOMBRE.label} placeholder={CAMPO_NOMBRE.placeholder}
        value={data.nombre} onChange={(v) => update("nombre", v)} maxLength={CAMPO_NOMBRE.max}
        minLength={CAMPO_NOMBRE.min} autoComplete="name" showErrors={showErrors} errorMsg="Escribe tu nombre para continuar." />
      <CampoTexto id="email" type="email" label={CAMPO_CORREO.label} placeholder={CAMPO_CORREO.placeholder}
        value={data.email} onChange={(v) => update("email", v)} maxLength={120} minLength={5} autoComplete="email"
        showErrors={showErrors && !EMAIL_RE.test(data.email)} errorMsg="Escribe un correo válido para recibir el diagnóstico." />
      <div className="mb-7">
        <label htmlFor="sector" className="block text-[15.5px] font-semibold leading-snug text-[#F2F6F9] mb-1.5" style={{ fontFamily: SG }}>
          {CAMPO_SECTOR.label}
        </label>
        <select id="sector" value={data.sector} onChange={(e) => update("sector", e.target.value)}
          className="w-full appearance-none rounded-md border border-[rgba(139,149,165,.22)] bg-[#141F2E] px-3.5 py-3 pr-10 text-[16px] text-[#F2F6F9] focus:border-(--primary) focus:outline-none [&>option]:bg-[#141F2E]"
          style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238B95A5' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 13px center", backgroundSize: 17 }}>
          <option value="">{CAMPO_SECTOR.placeholder}</option>
          {SECTORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
    </section>
  );
}
