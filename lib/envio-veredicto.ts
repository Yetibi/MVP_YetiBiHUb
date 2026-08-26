// ─── Carril de entrega desacoplado (HITL) ────────────────────────────────────
// Aprobar desde CUALQUIER canal (Telegram, enlace del correo interno, n8n)
// dispara el mismo webhook de envío en n8n (workflow
// n8n/YetiBiHub-Envio-Veredicto.json: Outlook → marcar-enviado → Telegram).
// Este módulo solo notifica: no envía correo, no toca la base. Si la env no
// está configurada, no hace nada y lo declara — el llamador decide qué mostrar.

export interface PayloadEnvioVeredicto {
  diagnosticoId: string;
  intakeId: string;
  correo: string;
  nombre: string | null;
  asunto: string;
  cuerpoHtml: string;
  cuerpoTexto: string;
}

export type ResultadoEnvio =
  | { disparado: true; status: number }
  | { disparado: false; motivo: "sin_env" | "http" | "red"; detalle?: string };

export const ENV_ENVIO = "N8N_WEBHOOK_ENVIO_URL";

export async function dispararEnvioVeredicto(
  payload: PayloadEnvioVeredicto,
  opts: { timeoutMs?: number } = {}
): Promise<ResultadoEnvio> {
  const url = process.env[ENV_ENVIO];
  if (!url) {
    console.warn(`[YetiBI] ${ENV_ENVIO} no configurada: el veredicto quedó aprobado pero NO se disparó el envío.`);
    return { disparado: false, motivo: "sin_env" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 8000),
    });
    if (!res.ok) {
      const detalle = `HTTP ${res.status}`;
      console.error(`[YetiBI] Webhook de envío respondió ${detalle} para ${payload.diagnosticoId}`);
      return { disparado: false, motivo: "http", detalle };
    }
    return { disparado: true, status: res.status };
  } catch (err) {
    const detalle = err instanceof Error ? err.message : String(err);
    console.error(`[YetiBI] No se pudo llamar al webhook de envío para ${payload.diagnosticoId}: ${detalle}`);
    return { disparado: false, motivo: "red", detalle };
  }
}
