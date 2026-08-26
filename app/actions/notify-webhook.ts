"use server";

// ─── Notificación a n8n del intake (as-is → to-be) ───────────────────────────
// Fire-and-forget: nunca bloquea ni cambia el resultado del envío. Si se
// pierde, el cron /api/cron/reintentar-intakes lo rescata.

import type { Senal, Dato, Frecuencia, Antiguedad, Falla } from "@/types/aptitud";

export interface WebhookPayload {
  intakeId: string;
  nombre: string;
  correo: string;
  sector: string | null;
  proceso: string;
  as_is: string;
  ejecucion: string;
  senal: Senal;
  senal_detalle: string | null;
  dato: Dato;
  dato_detalle: string | null;
  frecuencia: Frecuencia;
  antiguedad: Antiguedad;
  intento_previo: string | null;
  falla: Falla;
  to_be: string;
  /** Etiquetas legibles para el correo interno — la clave cruda sigue en los
      campos principales. */
  legible: { senal: string; dato: string; frecuencia: string; antiguedad: string; falla: string; sector: string };
}

export async function notifyWebhookAction(payload: WebhookPayload): Promise<void> {
  const url = process.env.N8N_WEBHOOK_INTAKE_URL;
  if (!url) {
    console.warn("[YetiBI] N8N_WEBHOOK_INTAKE_URL no configurada — webhook omitido.");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[YetiBI] Webhook respondió ${res.status} — no es crítico.`);
  } catch (err) {
    console.error("[YetiBI] Error disparando webhook a n8n — no es crítico:", err);
  }
}
