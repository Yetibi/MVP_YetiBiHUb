"use server";

import { createClient } from "@supabase/supabase-js";
import type { ProfileType } from "@/types/intake";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILE_MAP: Record<ProfileType, string> = {
  business: "negocio",
  leader: "lider_area",
  entrepreneur: "emprendedor",
};

export interface IntakePayload {
  profile: ProfileType | null;
  sector: string;
  scope: string;
  email: string;
  painType: string;
  painDetail: string;
  toBe: string;
  maturityTarget: number | null;
  technology: string;
  metric: string;
  capacityQ1: string;
  capacityQ2: string;
  capacityQ3: string;
  fileCount: number;
}

export type SubmitActionResult =
  | { success: true; intakeId: string }
  | { success: false; error: string };

export async function submitIntakeAction(
  payload: IntakePayload
): Promise<SubmitActionResult> {
  // Validación server-side — no confiar solo en el cliente
  if (!payload.profile) {
    return { success: false, error: "Falta seleccionar un perfil." };
  }
  if (!payload.sector) {
    return { success: false, error: "El sector es obligatorio." };
  }
  if (!payload.scope?.trim()) {
    return {
      success: false,
      error: "El alcance del diagnóstico es obligatorio.",
    };
  }
  if (!EMAIL_RE.test(payload.email)) {
    return {
      success: false,
      error: "El correo no tiene un formato válido.",
    };
  }
  if (!payload.painType) {
    return { success: false, error: "El dolor declarado es obligatorio." };
  }
  if (payload.fileCount < 1) {
    return {
      success: false,
      error: "Debes adjuntar al menos un documento de evidencia.",
    };
  }
  if (!payload.toBe?.trim()) {
    return {
      success: false,
      error: "El objetivo (To-Be) es obligatorio.",
    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const respuestas_capacidad = {
    painDetail: payload.painDetail || null,
    capacityQ1: payload.capacityQ1 || null,
    capacityQ2: payload.capacityQ2 || null,
    capacityQ3: payload.capacityQ3 || null,
  };

  const { data, error } = await supabase
    .from("intakes")
    .insert({
      perfil: PROFILE_MAP[payload.profile],
      sector: payload.sector,
      alcance: payload.scope,
      correo: payload.email,
      dolor_declarado: payload.painType,
      to_be_objetivo: payload.toBe,
      to_be_nivel: payload.maturityTarget ?? null,
      tecnologia_visible: payload.technology || null,
      metrica_declarada: payload.metric || null,
      respuestas_capacidad,
      estado: "recibido",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[YetiBI] Error al guardar en intakes:", error?.message);
    return {
      success: false,
      error:
        "No pudimos guardar tu información en este momento. Por favor intenta de nuevo en unos minutos.",
    };
  }

  return { success: true, intakeId: data.id };
}
