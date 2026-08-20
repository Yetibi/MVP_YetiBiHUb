// ─── Formulario del Diagnóstico de Aptitud del Proceso para IA · v1.0 ────────
// 7 pasos + email. Sin archivos. Los campos cerrados alimentan el motor
// determinista (lib/clasificador.ts); los libres solo dan contexto de
// redacción. Ver types/aptitud.ts para el contrato completo del instrumento.

import type {
  Senal,
  Dato,
  Frecuencia,
  Antiguedad,
  Falla,
} from "@/types/aptitud";

export interface IntakeFormData {
  // Paso 1 — contexto (no clasifica)
  proceso: string;

  // Paso 2 — contexto (no clasifica)
  ejecucion: string;

  // Paso 3 — discriminador
  senal: Senal | null;

  // Paso 4 — discriminador principal
  dato: Dato | null;

  // Paso 5 — peso (5a pondera redacción, 5b discrimina)
  frecuencia: Frecuencia | null;
  antiguedad: Antiguedad | null;

  // Paso 6 — discriminador
  falla: Falla | null;

  // Paso 7 — el gancho (insumo central de redacción)
  expectativaIa: string;

  // Paso 8 — captura
  email: string;
  sector: string; // opcional, solo contexto
}

export type UpdateFn = <K extends keyof IntakeFormData>(
  field: K,
  value: IntakeFormData[K]
) => void;

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type StepDirection = "forward" | "backward";
