// ─── Formulario de intake · as-is → to-be (4 bloques) ────────────────────────
// Quién eres → cómo es hoy → cómo se comporta → a dónde quieres llegar.
// Los cerrados alimentan el motor determinista (lib/clasificador.ts); los
// libres dan el punto A y el punto B del cliente en sus propias palabras.

import type {
  Senal,
  Dato,
  Frecuencia,
  Antiguedad,
  Falla,
} from "@/types/aptitud";

export interface IntakeFormData {
  // Bloque 1 — para escribirte
  nombre: string;
  email: string;
  sector: string; // clave snake_case, opcional

  // Bloque 2 — cómo es hoy (AS-IS)
  proceso: string;   // nombre corto
  asIs: string;      // cómo funciona hoy, paso a paso (1200)
  ejecucion: string; // quién lo ejecuta y con qué (800)

  // Bloque 3 — cómo se comporta
  senal: Senal | null;
  senalDetalle: string;
  dato: Dato | null;
  datoDetalle: string;
  frecuencia: Frecuencia | null;
  antiguedad: Antiguedad | null;
  intentoPrevio: string;
  falla: Falla | null;

  // Bloque 4 — a dónde quieres llegar (TO-BE)
  toBe: string; // 1000
}

export type UpdateFn = <K extends keyof IntakeFormData>(
  field: K,
  value: IntakeFormData[K]
) => void;

export type FormStep = 1 | 2 | 3 | 4;
export type StepDirection = "forward" | "backward";
