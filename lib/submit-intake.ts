import { supabase } from "@/lib/supabase";
import { validateIntakeAction, type IntakePayload } from "@/app/actions/submit-intake";
import { notifyWebhookAction } from "@/app/actions/notify-webhook";
import { etiquetasLegibles } from "@/lib/copy";
import type { IntakeFormData } from "@/types/intake";

// ─── Envío del intake as-is → to-be ──────────────────────────────────────────
// Sin archivos. Las ampliaciones opcionales viajan como null cuando van vacías.

export type SubmitResult = { success: true } | { success: false; error: string };

const oNull = (v: string) => (v.trim() ? v.trim() : null);

export async function submitIntake(data: IntakeFormData): Promise<SubmitResult> {
  const payload: IntakePayload = {
    nombre: data.nombre, email: data.email, sector: data.sector,
    proceso: data.proceso, asIs: data.asIs, ejecucion: data.ejecucion,
    senal: data.senal, senalDetalle: data.senalDetalle,
    dato: data.dato, datoDetalle: data.datoDetalle,
    frecuencia: data.frecuencia, antiguedad: data.antiguedad, intentoPrevio: data.intentoPrevio,
    falla: data.falla, toBe: data.toBe,
  };

  const validation = await validateIntakeAction(payload);
  if (!validation.valid) return { success: false, error: validation.error };

  // UUID en cliente — evita necesitar SELECT policy para el RETURNING
  const intakeId = crypto.randomUUID();

  const { error: intakeError } = await supabase.from("intakes").insert({
    id: intakeId,
    nombre: data.nombre.trim(),
    correo: data.email,
    sector: data.sector || null,
    proceso: data.proceso.trim(),
    as_is: data.asIs.trim(),
    ejecucion: data.ejecucion.trim(),
    senal: data.senal,
    senal_detalle: oNull(data.senalDetalle),
    dato: data.dato,
    dato_detalle: oNull(data.datoDetalle),
    frecuencia: data.frecuencia,
    antiguedad: data.antiguedad,
    intento_previo: oNull(data.intentoPrevio),
    falla: data.falla,
    to_be: data.toBe.trim(),
    estado: "recibido",
  });

  if (intakeError) {
    console.error("[YetiBI] Error al guardar en intakes:", intakeError?.message);
    return { success: false, error: "No pudimos guardar tu información. Por favor intenta de nuevo en unos minutos." };
  }

  notifyWebhookAction({
    intakeId,
    nombre: data.nombre.trim(),
    correo: data.email,
    sector: data.sector || null,
    proceso: data.proceso.trim(),
    as_is: data.asIs.trim(),
    ejecucion: data.ejecucion.trim(),
    senal: data.senal!,
    senal_detalle: oNull(data.senalDetalle),
    dato: data.dato!,
    dato_detalle: oNull(data.datoDetalle),
    frecuencia: data.frecuencia!,
    antiguedad: data.antiguedad!,
    intento_previo: oNull(data.intentoPrevio),
    falla: data.falla!,
    to_be: data.toBe.trim(),
    legible: etiquetasLegibles({
      senal: data.senal, dato: data.dato, frecuencia: data.frecuencia,
      antiguedad: data.antiguedad, falla: data.falla, sector: data.sector,
    }),
  }).catch((err) => console.error("[YetiBI] notifyWebhookAction lanzó excepción inesperada:", err));

  return { success: true };
}
