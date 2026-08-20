import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { clasificar } from "@/lib/clasificador";
import { redactarVeredicto, MODEL } from "@/lib/redactor-engine";
import { emitirToken } from "@/lib/approval-token";
import type { IntakeAptitud } from "@/types/aptitud";

// ─── Diagnóstico de Aptitud del Proceso para IA (insumo v1.0 §6.1) ───────────
// Nuevo orden: leer intake → clasificar() (determinista, en código) →
// redactor (solo redacción, tool use + validación) → insert → responder a n8n.
// prepararDocumentos ya NO se llama (el módulo queda en el repo para el
// diagnóstico profundo pagado).

export const maxDuration = 60;

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (limit.count >= 5) return false;
  limit.count++;
  return true;
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function mapRowToIntake(row: Record<string, unknown>): IntakeAptitud | null {
  const requeridos = [
    "proceso",
    "ejecucion",
    "senal",
    "dato",
    "frecuencia",
    "antiguedad",
    "falla",
    "expectativa_ia",
    "correo",
  ];
  for (const campo of requeridos) {
    if (!row[campo]) return null;
  }
  return {
    proceso: row.proceso as string,
    ejecucion: row.ejecucion as string,
    senal: row.senal as IntakeAptitud["senal"],
    dato: row.dato as IntakeAptitud["dato"],
    frecuencia: row.frecuencia as IntakeAptitud["frecuencia"],
    antiguedad: row.antiguedad as IntakeAptitud["antiguedad"],
    falla: row.falla as IntakeAptitud["falla"],
    expectativa_ia: row.expectativa_ia as string,
    email: row.correo as string,
    sector: (row.sector as string | null) ?? null,
  };
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429 }
    );
  }

  // 1. Body
  let intakeId: string;
  try {
    const body = await req.json();
    if (!body?.intakeId || typeof body.intakeId !== "string") {
      return NextResponse.json({ error: "intakeId requerido (string)" }, { status: 400 });
    }
    intakeId = body.intakeId;
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // 2. Leer intake
  const { data: intakeRow, error: intakeError } = await db
    .from("intakes")
    .select("*")
    .eq("id", intakeId)
    .single();

  if (intakeError || !intakeRow) {
    const esNotFound =
      intakeError?.code === "PGRST116" || intakeError?.message?.includes("0 rows");
    return NextResponse.json(
      { error: esNotFound ? "Intake no encontrado" : "Error al leer intake", detail: intakeError?.message },
      { status: esNotFound ? 404 : 500 }
    );
  }

  // 2b. Idempotencia (red de seguridad del cron): si ya hay diagnóstico
  // para este intake, no regenerar.
  const { data: existente } = await db
    .from("diagnosticos")
    .select("id, patologia")
    .eq("intake_id", intakeId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existente) {
    return NextResponse.json({
      ok: true,
      yaExistia: true,
      diagnosticoId: existente.id,
      patologia: existente.patologia,
      correo: intakeRow.correo,
    });
  }

  const intake = mapRowToIntake(intakeRow as Record<string, unknown>);
  if (!intake) {
    return NextResponse.json(
      { error: "El intake no tiene los campos del instrumento de aptitud (¿fila del flujo viejo?)" },
      { status: 422 }
    );
  }

  // 3. Clasificar — determinista, en código. El modelo no decide.
  const clasif = clasificar(intake);
  await db.from("intakes").update({ estado: "clasificado" }).eq("id", intakeId);

  // 4. Redactar (tool use forzado + validación Zod/lista negra + 1 reintento)
  let resultado;
  try {
    resultado = await redactarVeredicto(intake, clasif);
  } catch (err) {
    return NextResponse.json(
      { error: "Error al redactar veredicto con Claude", detail: String(err) },
      { status: 500 }
    );
  }

  // 5. Insertar en diagnosticos
  const base = {
    intake_id: intakeId,
    patologia: clasif.patologia,
    severidad: clasif.severidad,
    cmmi_estimado: clasif.cmmiEstimado,
    senales_secundarias: clasif.senalesSecundarias,
    modelo_usado: MODEL,
  };

  if (!resultado.ok) {
    // Redacción rechazada dos veces por el validador → HITL absorbe el caso.
    const { data: inserted, error: insertError } = await db
      .from("diagnosticos")
      .insert({
        ...base,
        estado_aprobacion: "revision_manual_pendiente",
        veredicto_completo: { errores_validacion: resultado.errores },
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return NextResponse.json(
        { error: "Redacción fallida y no se pudo registrar", detail: insertError?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: false,
      revisionManual: true,
      diagnosticoId: inserted.id,
      patologia: clasif.patologia,
      severidad: clasif.severidad,
      errores: resultado.errores,
      correo: intakeRow.correo,
    });
  }

  const { data: inserted, error: insertError } = await db
    .from("diagnosticos")
    .insert({
      ...base,
      estado_aprobacion: "pendiente_revision",
      veredicto_completo: resultado.veredicto,
      diagnostico_resumido: resultado.veredicto.cuerpo_texto,
    })
    .select("id, version")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: "Error al guardar veredicto en Supabase", detail: insertError?.message },
      { status: 500 }
    );
  }

  await db.from("intakes").update({ estado: "redactado" }).eq("id", intakeId);

  // 6. Respuesta a n8n — incluye tokens firmados para las superficies de
  // aprobación (los enlaces del correo interno nunca llevan la ruta cruda).
  const version = (inserted.version as number) ?? 1;
  return NextResponse.json({
    ok: true,
    diagnosticoId: inserted.id,
    intakeId,
    patologia: clasif.patologia,
    severidad: clasif.severidad,
    cmmiEstimado: clasif.cmmiEstimado,
    senalesSecundarias: clasif.senalesSecundarias,
    asunto: resultado.veredicto.asunto,
    cuerpoTexto: resultado.veredicto.cuerpo_texto,
    cuerpoHtml: resultado.veredicto.cuerpo_html,
    correo: intakeRow.correo,
    respuestasLibres: {
      proceso: intake.proceso,
      ejecucion: intake.ejecucion,
      expectativa_ia: intake.expectativa_ia,
    },
    tokens: {
      aprobar: emitirToken(inserted.id, "aprobar", version),
      ajustar: emitirToken(inserted.id, "ajustar", version),
    },
  });
}
