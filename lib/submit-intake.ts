import { supabase } from "@/lib/supabase";
import {
  submitIntakeAction,
  type IntakePayload,
} from "@/app/actions/submit-intake";
import type { IntakeFormData } from "@/types/intake";

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

export async function submitIntake(
  data: IntakeFormData
): Promise<SubmitResult> {
  // Paso 1: validación server-side + inserción en `intakes`
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

  const actionResult = await submitIntakeAction(payload);

  if (!actionResult.success) {
    return { success: false, error: actionResult.error };
  }

  const { intakeId } = actionResult;

  // Pasos 2 y 3: subir archivos + registrar en `intake_documentos`
  const failedFiles: string[] = [];

  for (const uploaded of data.files) {
    // Nombre seguro: timestamp + nombre original sanitizado
    const safeName = `${Date.now()}-${uploaded.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storagePath = `${intakeId}/${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("intake-documentos")
      .upload(storagePath, uploaded.file, {
        contentType: uploaded.file.type,
        upsert: false,
      });

    if (storageError) {
      console.error(
        `[YetiBI] Error al subir archivo "${uploaded.name}":`,
        storageError.message
      );
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
      console.error(
        `[YetiBI] Error al registrar documento "${uploaded.name}":`,
        docError.message
      );
      failedFiles.push(uploaded.name);
    }
  }

  if (failedFiles.length === 0) {
    return { success: true };
  }

  // Error parcial o total en archivos — la fila en `intakes` SÍ se guardó
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
