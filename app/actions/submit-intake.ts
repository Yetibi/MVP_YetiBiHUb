"use server";

// ─── Validación server-side del intake as-is → to-be ─────────────────────────
// Replica canProceed() del hook: cerrados contra sus unions, libres con los
// límites de lib/copy. Las ampliaciones son opcionales (pueden llegar vacías).

import type { Senal, Dato, Frecuencia, Antiguedad, Falla } from "@/types/aptitud";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SENALES: Senal[] = ["queja", "cabeza", "registro_muerto", "indicadores"];
const DATOS: Dato[] = ["no_existe", "suelta", "dispersa", "unica"];
const FRECUENCIAS: Frecuencia[] = ["varias_veces_dia", "diario", "varias_veces_semana", "semanal", "mensual_o_menos"];
const ANTIGUEDADES: Antiguedad[] = ["reciente", "hace_anios", "fosil", "nunca"];
const FALLAS: Falla[] = ["cada_quien", "tarde", "repetido", "controlado"];

export interface IntakePayload {
  nombre: string;
  email: string;
  sector: string;
  proceso: string;
  asIs: string;
  ejecucion: string;
  senal: Senal | null;
  senalDetalle: string;
  dato: Dato | null;
  datoDetalle: string;
  frecuencia: Frecuencia | null;
  antiguedad: Antiguedad | null;
  intentoPrevio: string;
  falla: Falla | null;
  toBe: string;
}

export type ValidateActionResult = { valid: true } | { valid: false; error: string };

const entre = (v: string | undefined, min: number, max: number) => {
  const t = v?.trim() ?? "";
  return t.length >= min && t.length <= max;
};

export async function validateIntakeAction(p: IntakePayload): Promise<ValidateActionResult> {
  if (!entre(p.nombre, 2, 80)) return { valid: false, error: "Escribe tu nombre (entre 2 y 80 caracteres)." };
  if (!EMAIL_RE.test(p.email)) return { valid: false, error: "El correo no tiene un formato válido." };
  if (!entre(p.proceso, 3, 120)) return { valid: false, error: "Escribe el nombre del proceso (máx. 120 caracteres)." };
  if (!entre(p.asIs, 20, 1200)) return { valid: false, error: "Cuéntanos cómo funciona hoy, paso a paso (entre 20 y 1200 caracteres)." };
  if (!entre(p.ejecucion, 5, 800)) return { valid: false, error: "Cuéntanos quién lo ejecuta y con qué (máx. 800 caracteres)." };
  if (!p.senal || !SENALES.includes(p.senal)) return { valid: false, error: "Falta indicar cómo te enteras cuando algo sale mal." };
  if (!p.dato || !DATOS.includes(p.dato)) return { valid: false, error: "Falta indicar dónde queda registrado lo que pasa." };
  if (!p.frecuencia || !FRECUENCIAS.includes(p.frecuencia)) return { valid: false, error: "Falta indicar con qué frecuencia ocurre." };
  if (!p.antiguedad || !ANTIGUEDADES.includes(p.antiguedad)) return { valid: false, error: "Falta indicar hace cuánto se hace así." };
  if (!p.falla || !FALLAS.includes(p.falla)) return { valid: false, error: "Falta indicar qué pasa cuando el proceso falla." };
  if (!entre(p.toBe, 10, 1000)) return { valid: false, error: "Cuéntanos cómo se vería el proceso funcionando como debería (máx. 1000 caracteres)." };
  for (const [k, v] of [["senalDetalle", p.senalDetalle], ["datoDetalle", p.datoDetalle], ["intentoPrevio", p.intentoPrevio]] as const) {
    if ((v ?? "").length > 400) return { valid: false, error: `La ampliación (${k}) supera los 400 caracteres.` };
  }
  return { valid: true };
}
