import { supabase } from "@/lib/supabase";
import {
  validateIntakeAction,
  type IntakePayload,
} from "@/app/actions/submit-intake";
import { notifyWebhookAction } from "@/app/actions/notify-webhook";
import type { IntakeFormData } from "@/types/intake";

// ─── Envío del intake de Aptitud v1.0 ────────────────────────────────────────
// Sin archivos: el instrumento nuevo no adjunta documentos (el pipeline de
// documentos queda en el repo para el diagnóstico profundo pagado).

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

export async function submitIntake(
  data: IntakeFormData
): Promise<SubmitResult> {
  const payload: IntakePayload = {
    proceso: data.proceso,
    ejecucion: data.ejecucion,
    senal: data.senal,
    dato: data.dato,
    frecuencia: data.frecuencia,
    antiguedad: data.antiguedad,
    falla: data.falla,
    expectativaIa: data.expectativaIa,
    email: data.email,
    sector: data.sector,
  };

  // Paso 1: validación server-side (sin llamadas a Supabase)
  const validation = await validateIntakeAction(payload);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Paso 2: insert en `intakes` desde el cliente (anon key funciona aquí).
  // UUID generado en cliente — evita necesitar SELECT policy para el RETURNING.
  const intakeId = crypto.randomUUID();

  const { error: intakeError } = await supabase.from("intakes").insert({
    id: intakeId,
    correo: data.email,
    proceso: data.proceso.trim(),
    ejecucion: data.ejecucion.trim(),
    senal: data.senal,
    dato: data.dato,
    frecuencia: data.frecuencia,
    antiguedad: data.antiguedad,
    falla: data.falla,
    expectativa_ia: data.expectativaIa.trim(),
    sector: data.sector || null,
    estado: "recibido",
  });

  if (intakeError) {
    console.error("[YetiBI] Error al guardar en intakes:", intakeError?.message);
    return {
      success: false,
      error:
        "No pudimos guardar tu información. Por favor intenta de nuevo en unos minutos.",
    };
  }

  // Paso 3: notificar a n8n — fire-and-forget, nunca bloquea ni cambia el
  // resultado (el cron rescata intakes huérfanos en "recibido").
  notifyWebhookAction({
    intakeId,
    correo: data.email,
    proceso: data.proceso.trim(),
    ejecucion: data.ejecucion.trim(),
    senal: data.senal!,
    dato: data.dato!,
    frecuencia: data.frecuencia!,
    antiguedad: data.antiguedad!,
    falla: data.falla!,
    expectativa_ia: data.expectativaIa.trim(),
    sector: data.sector || null,
  }).catch((err) =>
    console.error("[YetiBI] notifyWebhookAction lanzó excepción inesperada:", err)
  );

  return { success: true };
}
