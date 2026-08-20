"use server";

// ─── Notificación a n8n del intake de Aptitud v1.0 ───────────────────────────
// Fire-and-forget: nunca bloquea ni cambia el resultado del envío. Si se
// pierde, el cron /api/cron/reintentar-intakes lo rescata (intakes en
// "recibido" con más de 10 minutos).

import type { Senal, Dato, Frecuencia, Antiguedad, Falla } from "@/types/aptitud";

export interface WebhookPayload {
  intakeId: string;
  correo: string;
  proceso: string;
  ejecucion: string;
  senal: Senal;
  dato: Dato;
  frecuencia: Frecuencia;
  antiguedad: Antiguedad;
  falla: Falla;
  expectativa_ia: string;
  sector: string | null;
}

export async function notifyWebhookAction(
  payload: WebhookPayload
): Promise<void> {
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
    if (!res.ok) {
      console.error(`[YetiBI] Webhook respondió ${res.status} — no es crítico.`);
    }
  } catch (err) {
    console.error("[YetiBI] Error disparando webhook a n8n — no es crítico:", err);
  }
}
