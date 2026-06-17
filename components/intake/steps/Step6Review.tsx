"use client";

import type { IntakeFormData } from "@/types/intake";
import { PROFILE_LABELS, PAIN_OPTIONS, MATURITY_LEVELS } from "@/lib/copy";

interface Step6Props {
  data: IntakeFormData;
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-white/80 flex-1">{value}</span>
    </div>
  );
}

export function Step6Review({ data }: Step6Props) {
  const painLabel =
    PAIN_OPTIONS.find((o) => o.value === data.painType)?.label ?? data.painType;

  const maturityName = data.maturityTarget
    ? MATURITY_LEVELS.find((m) => m.level === data.maturityTarget)?.name ?? ""
    : "";

  const profileLabel = data.profile ? PROFILE_LABELS[data.profile] : "";

  const toBeTruncated =
    data.toBe.length > 200 ? data.toBe.slice(0, 200) + "…" : data.toBe;

  return (
    <section aria-labelledby="step6-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#E07B30] uppercase mb-3">
        Capa 5 — Revisión
      </p>
      <h2
        id="step6-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        Revisa antes de enviar
      </h2>
      <p className="text-sm text-white/50 mb-8 max-w-md leading-relaxed">
        Al enviar, tu información queda guardada. El diagnóstico{" "}
        <strong className="text-white/70 font-medium">
          no se procesa en este momento
        </strong>{" "}
        — eso ocurre en la siguiente etapa del sistema.
      </p>

      {/* Resumen */}
      <div className="bg-white/3 border border-white/8 rounded-xl px-5 py-2 mb-8">
        <Row label="Perfil" value={profileLabel} />
        <Row label="Sector" value={data.sector} />
        <Row label="Alcance" value={data.scope} />
        <Row label="Correo" value={data.email} />
        <Row label="Dolor principal" value={painLabel} />
        <Row
          label="Archivos"
          value={
            data.files.length > 0
              ? `${data.files.length} archivo${data.files.length > 1 ? "s" : ""}: ${data.files.map((f) => f.name).join(", ")}`
              : ""
          }
        />
        <Row label="Objetivo" value={toBeTruncated} />
        <Row
          label="Meta de madurez"
          value={
            maturityName
              ? `Nivel ${data.maturityTarget} — ${maturityName}`
              : "No especificada"
          }
        />
        {data.technology && (
          <Row label="Tecnología" value={data.technology} />
        )}
        {data.metric && <Row label="Métrica actual" value={data.metric} />}
      </div>

      {/* Aviso de datos en memoria */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-[#E07B30]/20 bg-[#E07B30]/5">
        <span className="text-[#E07B30]/70 text-lg mt-0.5" aria-hidden>
          ℹ
        </span>
        <p className="text-xs text-white/50 leading-relaxed">
          Esta es una versión de prueba. Los datos no se envían a ningún
          servidor — quedan en memoria del navegador y desaparecen al
          cerrar la pestaña.
        </p>
      </div>
    </section>
  );
}
