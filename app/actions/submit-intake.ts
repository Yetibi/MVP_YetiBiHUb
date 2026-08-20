"use server";

// ─── Validación server-side del intake de Aptitud v1.0 ───────────────────────
// Replica canProceed() del hook: los cerrados contra sus unions, los libres
// con los mismos límites del insumo §1.

import type { Senal, Dato, Frecuencia, Antiguedad, Falla } from "@/types/aptitud";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SENALES: Senal[] = ["queja", "cabeza", "registro_muerto", "indicadores"];
const DATOS: Dato[] = ["no_existe", "suelta", "dispersa", "unica"];
const FRECUENCIAS: Frecuencia[] = [
  "varias_veces_dia",
  "diario",
  "semanal",
  "mensual_o_menos",
];
const ANTIGUEDADES: Antiguedad[] = ["reciente", "hace_anios", "fosil", "nunca"];
const FALLAS: Falla[] = ["cada_quien", "tarde", "repetido", "controlado"];

export interface IntakePayload {
  proceso: string;
  ejecucion: string;
  senal: Senal | null;
  dato: Dato | null;
  frecuencia: Frecuencia | null;
  antiguedad: Antiguedad | null;
  falla: Falla | null;
  expectativaIa: string;
  email: string;
  sector: string;
}

export type ValidateActionResult =
  | { valid: true }
  | { valid: false; error: string };

export async function validateIntakeAction(
  payload: IntakePayload
): Promise<ValidateActionResult> {
  const proceso = payload.proceso?.trim() ?? "";
  if (proceso.length < 10 || proceso.length > 300) {
    return { valid: false, error: "Describe el proceso (entre 10 y 300 caracteres)." };
  }
  const ejecucion = payload.ejecucion?.trim() ?? "";
  if (!ejecucion || ejecucion.length > 300) {
    return { valid: false, error: "Cuéntanos quién ejecuta el proceso (máx. 300 caracteres)." };
  }
  if (!payload.senal || !SENALES.includes(payload.senal)) {
    return { valid: false, error: "Falta indicar cómo saben si el proceso sale bien." };
  }
  if (!payload.dato || !DATOS.includes(payload.dato)) {
    return { valid: false, error: "Falta indicar dónde vive la información del proceso." };
  }
  if (!payload.frecuencia || !FRECUENCIAS.includes(payload.frecuencia)) {
    return { valid: false, error: "Falta indicar cada cuánto ocurre el proceso." };
  }
  if (!payload.antiguedad || !ANTIGUEDADES.includes(payload.antiguedad)) {
    return { valid: false, error: "Falta indicar cuándo cambió por última vez el proceso." };
  }
  if (!payload.falla || !FALLAS.includes(payload.falla)) {
    return { valid: false, error: "Falta indicar qué pasa cuando algo sale mal." };
  }
  const expectativa = payload.expectativaIa?.trim() ?? "";
  if (!expectativa || expectativa.length > 300) {
    return { valid: false, error: "Cuéntanos qué te gustaría que la IA hiciera (máx. 300 caracteres)." };
  }
  if (!EMAIL_RE.test(payload.email)) {
    return { valid: false, error: "El correo no tiene un formato válido." };
  }
  return { valid: true };
}
