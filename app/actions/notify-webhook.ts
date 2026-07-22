"use server";

const PROFILE_MAP: Record<string, string> = {
  business: "negocio",
  leader: "lider_area",
  entrepreneur: "emprendedor",
};

export interface WebhookPayload {
  intakeId: string;
  perfil: string | null;
  sector: string;
  alcance: string;
  correo: string;
  dolor_declarado: string[];
  to_be_objetivo: string;
  to_be_nivel: number | null;
  tecnologia_visible: string[] | null;
  metrica_declarada: string | null;
  respuestas_capacidad: {
    painDetail: string | null;
    capacityQ1: string | null;
    capacityQ2: string | null;
    capacityQ3: string | null;
  };
  fileCount: number;
  archivos: string[];
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
