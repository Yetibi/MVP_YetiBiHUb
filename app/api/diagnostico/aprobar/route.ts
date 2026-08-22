import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verificarToken } from "@/lib/approval-token";
import { detalle } from "@/lib/errores";

// ─── Aprobación del veredicto (insumo v1.0 §7) ───────────────────────────────
// Idempotente (aprobar dos veces = una). Guardas de precedencia:
//  · solo se aprueba la VERSIÓN VIGENTE — si ya existe una versión hija
//    (hubo ajuste), aprobar la anterior es no-op explícito.
//  · el primer clic define; el segundo, sobre un estado cerrado, es no-op.
// GET soporta los enlaces del correo interno: requiere token firmado con
// caducidad (nunca la ruta cruda con el id).

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

interface ResultadoAprobacion {
  status: number;
  body: Record<string, unknown>;
}

async function aprobar(diagnosticoId: string): Promise<ResultadoAprobacion> {
  const db = supabaseAdmin();

  const { data: existente, error: selectError } = await db
    .from("diagnosticos")
    .select("id, intake_id, version, estado_aprobacion, diagnostico_resumido, veredicto_completo")
    .eq("id", diagnosticoId)
    .single();

  if (selectError || !existente) {
    const esNotFound =
      selectError?.code === "PGRST116" || selectError?.message?.includes("0 rows");
    return {
      status: esNotFound ? 404 : 500,
      body: {
        error: esNotFound ? "Diagnóstico no encontrado" : "Error al leer diagnóstico",
        detail: detalle(selectError),
      },
    };
  }

  // Guarda de versión vigente: si esta fila ya tiene una versión hija,
  // aprobar la anterior no hace nada (no-op explícito).
  const { data: hija } = await db
    .from("diagnosticos")
    .select("id, version")
    .eq("diagnostico_padre_id", diagnosticoId)
    .limit(1)
    .maybeSingle();

  if (hija) {
    return {
      status: 200,
      body: {
        ok: false,
        noOp: true,
        mensaje: `Esta versión ya fue reemplazada por un ajuste (versión ${hija.version}). Solo se aprueba la versión vigente.`,
        versionVigenteId: hija.id,
      },
    };
  }

  const { data: intake, error: intakeError } = await db
    .from("intakes")
    .select("correo, nombre")
    .eq("id", existente.intake_id)
    .single();

  if (intakeError || !intake) {
    return {
      status: 500,
      body: { error: "Error al leer el intake asociado", detail: detalle(intakeError) },
    };
  }

  // Idempotencia
  if (existente.estado_aprobacion === "aprobado") {
    return {
      status: 200,
      body: {
        ok: true,
        diagnosticoId,
        intakeId: existente.intake_id,
        estado_aprobacion: "aprobado",
        veredicto: existente.veredicto_completo,
        correo: intake.correo,
        nota: "Ya estaba aprobado, no se modificó nada",
      },
    };
  }

  const { error: updateError } = await db
    .from("diagnosticos")
    .update({ estado_aprobacion: "aprobado" })
    .eq("id", diagnosticoId);

  if (updateError) {
    return {
      status: 500,
      body: { error: "Error al aprobar diagnóstico", detail: detalle(updateError) },
    };
  }

  await db.from("intakes").update({ estado: "aprobado" }).eq("id", existente.intake_id);

  return {
    status: 200,
    body: {
      ok: true,
      diagnosticoId,
      intakeId: existente.intake_id,
      estado_aprobacion: "aprobado",
      veredicto: existente.veredicto_completo,
      diagnostico_resumido: existente.diagnostico_resumido,
      correo: intake.correo,
    },
  };
}

export async function POST(req: NextRequest) {
  let diagnosticoId: string;
  let token: string | undefined;
  try {
    const body = await req.json();
    if (!body?.diagnosticoId || typeof body.diagnosticoId !== "string") {
      return NextResponse.json({ error: "diagnosticoId requerido (string)" }, { status: 400 });
    }
    diagnosticoId = body.diagnosticoId;
    token = typeof body.token === "string" ? body.token : undefined;
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  // Si viaja token, se verifica (destino y acción); su ausencia mantiene
  // compatibilidad con el canal server-to-server de n8n.
  if (token) {
    const ver = verificarToken(token);
    if (!ver.ok || ver.accion !== "aprobar" || ver.diagnosticoId !== diagnosticoId) {
      return NextResponse.json({ error: "Token inválido para esta acción" }, { status: 401 });
    }
  }

  const r = await aprobar(diagnosticoId);
  return NextResponse.json(r.body, { status: r.status });
}

// Enlace del correo interno: GET /api/diagnostico/aprobar?token=…
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Falta el token.", { status: 400 });
  }
  const ver = verificarToken(token);
  if (!ver.ok) {
    return new NextResponse(
      `Enlace ${ver.motivo === "vencido" ? "vencido" : "inválido"}. Re-dispara la aprobación desde la notificación.`,
      { status: 401 }
    );
  }
  if (ver.accion !== "aprobar") {
    return new NextResponse("Este enlace no es de aprobación.", { status: 401 });
  }

  const r = await aprobar(ver.diagnosticoId);
  const okMsg =
    r.body.noOp === true
      ? `Sin efecto: ${r.body.mensaje}`
      : r.status === 200
        ? "Veredicto aprobado. n8n hará el envío al prospecto."
        : `Error: ${r.body.error}`;

  return new NextResponse(
    `<!doctype html><html lang="es"><body style="font-family:monospace;background:#0B1420;color:#F2F6F9;display:flex;align-items:center;justify-content:center;min-height:100vh"><p>${okMsg}</p></body></html>`,
    { status: r.status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
