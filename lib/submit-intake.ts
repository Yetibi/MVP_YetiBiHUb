import { supabase } from "@/lib/supabase";
import {
  validateIntakeAction,
  type IntakePayload,
} from "@/app/actions/submit-intake";
import type { IntakeFormData } from "@/types/intake";

const PROFILE_MAP: Record<string, string> = {
  business: "negocio",
  leader: "lider_area",
  entrepreneur: "emprendedor",
};

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

export async function submitIntake(
  data: IntakeFormData
): Promise<SubmitResult> {
  const payload: IntakePayload = {
    profile: data.profile,
    sector: data.sector,
    scope: data.scope,
    email: data.email,
    painType: data.painType,
    painDetail: data.painDetail,
    toBe: data.toBe,
    maturityTarget: data.maturityTarget,
    technology: data.technology,
    metric: data.metric,
    capacityQ1: data.capacityQ1,
    capacityQ2: data.capacityQ2,
    capacityQ3: data.capacityQ3,
    fileCount: data.files.length,
  };

  // Paso 1: validación server-side (sin llamadas a Supabase)
  const validation = await validateIntakeAction(payload);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Paso 2: insert en `intakes` desde el cliente (anon key funciona correctamente aquí)
  const respuestas_capacidad = {
    painDetail: data.painDetail || null,
    capacityQ1: data.capacityQ1 || null,
    capacityQ2: data.capacityQ2 || null,
    capacityQ3: data.capacityQ3 || null,
  };

  const { data: intakeRow, error: intakeError } = await supabase
    .from("intakes")
    .insert({
      perfil: data.profile ? PROFILE_MAP[data.profile] : null,
      sector: data.sector,
      alcance: data.scope,
      correo: data.email,
      dolor_declarado: data.painType,
      to_be_objetivo: data.toBe,
      to_be_nivel: data.maturityTarget ?? null,
      tecnologia_visible: data.technology || null,
      metrica_declarada: data.metric || null,
      respuestas_capacidad,
      estado: "recibido",
    })
    .select("id")
    .single();

  if (intakeError || !intakeRow) {
    console.error("[YetiBI] Error al guardar en intakes:", intakeError?.message);
    return {
      success: false,
      error: `No pudimos guardar tu información (${intakeError?.code ?? "error desconocido"}). Por favor intenta de nuevo.`,
    };
  }

  const intakeId = intakeRow.id as string;

  // Paso 3: subir archivos + registrar en `intake_documentos`
  const failedFiles: string[] = [];

  for (const uploaded of data.files) {
    const safeName = `${Date.now()}-${uploaded.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storagePath = `${intakeId}/${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("intake-documentos")
      .upload(storagePath, uploaded.file, {
        contentType: uploaded.file.type,
        upsert: false,
      });

    if (storageError) {
      console.error(`[YetiBI] Error al subir "${uploaded.name}":`, storageError.message);
      failedFiles.push(uploaded.name);
      continue;
    }

    const { error: docError } = await supabase.from("intake_documentos").insert({
      intake_id: intakeId,
      storage_path: storagePath,
      nombre_original: uploaded.name,
      tipo_archivo: uploaded.file.type,
      tamano_bytes: uploaded.size,
    });

    if (docError) {
      console.error(`[YetiBI] Error al registrar doc "${uploaded.name}":`, docError.message);
      failedFiles.push(uploaded.name);
    }
  }

  if (failedFiles.length === 0) {
    return { success: true };
  }

  if (failedFiles.length === data.files.length) {
    return {
      success: false,
      error: `Tu información principal se guardó, pero no pudimos subir los archivos adjuntos (${failedFiles.join(", ")}). Por favor intenta de nuevo o contáctanos.`,
    };
  }

  return {
    success: false,
    error: `Tu información se guardó, pero algunos archivos no se pudieron adjuntar: ${failedFiles.join(", ")}. El diagnóstico puede continuar — avísanos si necesitas reenviarlos.`,
  };
}
