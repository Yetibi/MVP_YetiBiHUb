import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { detalle } from "@/lib/errores";

// ─── Red de seguridad del webhook (insumo v1.0 §6.5) ─────────────────────────
// El disparo original hacia n8n es fire-and-forget: si n8n no recibió el
// webhook, el intake queda huérfano en "recibido". Este cron (cada 10 min,
// vercel.json) busca intakes en "recibido" con más de 10 minutos y re-dispara
// /api/diagnostico, que es idempotente (si ya existe diagnóstico, no regenera).
// Si un intake supera 3 intentos, alerta a Julián vía N8N_WEBHOOK_ALERT_URL.

export const maxDuration = 120;

const MAX_INTENTOS = 3;
const LOTE = 10;

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  // Vercel Cron manda Authorization: Bearer CRON_SECRET si está configurado
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = supabaseAdmin();
  const hace10min = new Date(Date.now() - 10 * 60_000).toISOString();

  const { data: huerfanos, error } = await db
    .from("intakes")
    .select("id, correo, intentos_procesamiento, created_at")
    .eq("estado", "recibido")
    .lt("created_at", hace10min)
    .order("created_at", { ascending: true })
    .limit(LOTE);

  if (error) {
    return NextResponse.json({ error: "Error listando intakes", detail: detalle(error) }, { status: 500 });
  }
  if (!huerfanos || huerfanos.length === 0) {
    return NextResponse.json({ ok: true, procesados: 0 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yetibi.com";
  const resultados: Array<Record<string, unknown>> = [];

  for (const intake of huerfanos) {
    const intentos = ((intake.intentos_procesamiento as number) ?? 0) + 1;

    if (intentos > MAX_INTENTOS) {
      // Alerta a Julián y marcar para no reintentarlo cada 10 min
      if (process.env.N8N_WEBHOOK_ALERT_URL) {
        fetch(process.env.N8N_WEBHOOK_ALERT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "intake_atascado",
            intakeId: intake.id,
            correo: intake.correo,
            intentos,
            created_at: intake.created_at,
          }),
          signal: AbortSignal.timeout(8000),
        }).catch(() => {});
      }
      await db
        .from("intakes")
        .update({ estado: "atascado", intentos_procesamiento: intentos })
        .eq("id", intake.id);
      resultados.push({ intakeId: intake.id, accion: "alertado_y_marcado_atascado" });
      continue;
    }

    await db
      .from("intakes")
      .update({ intentos_procesamiento: intentos })
      .eq("id", intake.id);

    try {
      const res = await fetch(`${base}/api/diagnostico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeId: intake.id }),
        signal: AbortSignal.timeout(55_000),
      });
      const json = await res.json().catch(() => ({}));
      resultados.push({ intakeId: intake.id, accion: "reintentado", status: res.status, ok: json?.ok });
    } catch (err) {
      resultados.push({ intakeId: intake.id, accion: "reintento_fallido", detail: detalle(err) });
    }
  }

  return NextResponse.json({ ok: true, procesados: resultados.length, resultados });
}
