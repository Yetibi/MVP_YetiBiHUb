"use server";

import type { ProfileType } from "@/types/intake";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IntakePayload {
  profile: ProfileType | null;
  sector: string;
  scope: string;
  email: string;
  painType: string[];
  painDetail: string;
  toBe: string;
  maturityTarget: number | null;
  technology: string[];
  metric: string;
  capacityQ1: string;
  capacityQ2: string;
  capacityQ3: string;
  fileCount: number;
}

export type ValidateActionResult =
  | { valid: true }
  | { valid: false; error: string };

export async function validateIntakeAction(
  payload: IntakePayload
): Promise<ValidateActionResult> {
  if (!payload.profile) {
    return { valid: false, error: "Falta seleccionar un perfil." };
  }
  if (!payload.sector) {
    return { valid: false, error: "El sector es obligatorio." };
  }
  if (!payload.scope?.trim()) {
    return { valid: false, error: "El alcance del diagnóstico es obligatorio." };
  }
  if (!EMAIL_RE.test(payload.email)) {
    return { valid: false, error: "El correo no tiene un formato válido." };
  }
  if (!payload.painType) {
    return { valid: false, error: "El dolor declarado es obligatorio." };
  }
  if (payload.fileCount < 1) {
    return { valid: false, error: "Debes adjuntar al menos un documento de evidencia." };
  }
  if (!payload.toBe?.trim()) {
    return { valid: false, error: "El objetivo (To-Be) es obligatorio." };
  }
  return { valid: true };
}
