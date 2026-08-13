import { supabase } from "@/lib/supabase";
import {
  validateIntakeAction,
  type IntakePayload,
} from "@/app/actions/submit-intake";
import { notifyWebhookAction } from "@/app/actions/notify-webhook";
import { PAIN_OPTIONS } from "@/lib/copy";
import type { IntakeFormData } from "@/types/intake";

const PROFILE_MAP: Record<string, string> = {
  business: "negocio",
  leader: "lider_area",
  entrepreneur: "emprendedor",
};

const PAIN_LABEL = Object.fromEntries(PAIN_OPTIONS.map((o) => [o.value, o.label]));

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

  // UUID generado en cliente — evita necesitar SELECT policy para el RETURNING
  const intakeId = crypto.randomUUID();

  const dolorDeclarado = data.painType.map((v) => PAIN_LABEL[v] ?? v);

  const { error: intakeError } = await supabase
    .from("intakes")
    .insert({
      id: intakeId,
      perfil: data.profile ? PROFILE_MAP[data.profile] : null,
      sector: data.sector,
      alcance: data.scope,
      correo: data.email,
      dolor_declarado: dolorDeclarado,
      to_be_objetivo: data.toBe,
      to_be_nivel: data.maturityTarget ?? null,
      tecnologia_visible: data.technology.length > 0 ? data.technology : null,
      metrica_declarada: data.metric || null,
      respuestas_capacidad,
      estado: "recibido",
    });

  if (intakeError) {
    console.error("[YetiBI] Error al guardar en intakes:", intakeError?.message);
    return {
      success: false,
      error: "No pudimos guardar tu información. Por favor intenta de nuevo en unos minutos.",
    };
  }

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

  // Paso 4: notificar a n8n — fire-and-forget, nunca bloquea ni cambia el resultado
  notifyWebhookAction({
    intakeId,
    perfil: data.profile ? PROFILE_MAP[data.profile] : null,
    sector: data.sector,
    alcance: data.scope,
    correo: data.email,
    dolor_declarado: dolorDeclarado,
    to_be_objetivo: data.toBe,
    to_be_nivel: data.maturityTarget,
    tecnologia_visible: data.technology.length > 0 ? data.technology : null,
    metrica_declarada: data.metric || null,
    respuestas_capacidad: {
      painDetail: data.painDetail || null,
      capacityQ1: data.capacityQ1 || null,
      capacityQ2: data.capacityQ2 || null,
      capacityQ3: data.capacityQ3 || null,
    },
    fileCount: data.files.length,
    archivos: data.files.map((f) => f.name),
  }).catch((err) =>
    console.error("[YetiBI] notifyWebhookAction lanzó excepción inesperada:", err)
  );

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
