"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TECH_OPTIONS } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Step5Props {
  data: IntakeFormData;
  update: UpdateFn;
}

const CAPACITY_QUESTIONS = [
  {
    field: "capacityQ1" as const,
    label: "¿Hay alguien en el equipo que ya trabaje con datos o analítica?",
    placeholder:
      "Ej: un analista, un desarrollador, alguien que sabe Excel bien, nadie por ahora…",
  },
  {
    field: "capacityQ2" as const,
    label: "¿Cómo se toman hoy las decisiones importantes?",
    placeholder:
      "Ej: el dueño decide solo, hay un comité, nos guiamos por el reporte de ventas del mes…",
  },
  {
    field: "capacityQ3" as const,
    label: "¿Qué intentaste antes para resolver esto y no funcionó?",
    placeholder:
      "Ej: contratamos un software que nadie usa, hicimos un Excel que se desactualizó, un consultor hizo un diagnóstico pero nunca implementamos nada…",
  },
];

export function Step5Optional({ data, update }: Step5Props) {
  return (
    <section aria-labelledby="step5-title">
      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#E07B30] uppercase">
          Capa 4 — Capacidad
        </p>
        <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
          100% opcional
        </span>
      </div>
      <h2
        id="step5-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        Afina tu diagnóstico
      </h2>
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        Estas preguntas nos ayudan a entender mejor tu contexto. No hay
        respuestas correctas ni incorrectas — responde solo lo que puedas y
        saltes lo que no aplique.
      </p>

      <div className="space-y-7">
        {/* Tecnología */}
        <div>
          <label
            htmlFor="technology"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            ¿Qué tecnología o herramientas ya usan?
          </label>
          <Select
            value={data.technology}
            onValueChange={(v) => update("technology", v ?? "")}
          >
            <SelectTrigger
              id="technology"
              className="w-full border-white/15 text-white bg-transparent"
            >
              <SelectValue placeholder="Selecciona la que más se acerca" />
            </SelectTrigger>
            <SelectContent>
              {TECH_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Métrica */}
        <div>
          <label
            htmlFor="metric"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            ¿Tienen algún número que ya estén midiendo?
          </label>
          <Textarea
            id="metric"
            value={data.metric}
            onChange={(e) => update("metric", e.target.value)}
            placeholder="Ej: el porcentaje de despachos a tiempo, el costo por lead, el nivel de satisfacción del cliente…"
            rows={2}
            className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#E07B30] resize-none"
          />
        </div>

        {/* 3 preguntas de capacidad */}
        {CAPACITY_QUESTIONS.map(({ field, label, placeholder }) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-white/80 mb-1.5"
            >
              {label}
            </label>
            <Textarea
              id={field}
              value={data[field]}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#E07B30] resize-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
