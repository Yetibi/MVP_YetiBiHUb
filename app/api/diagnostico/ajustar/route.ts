import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarDiagnostico } from "@/lib/diagnostico-engine";
import type { DiagnosticoResult, ContextoAjuste } from "@/types/diagnostico";

export const maxDuration = 120;

const MODEL_USADO = "claude-sonnet-4-6";
const LIMITE_VERSION = 3;

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function mapRowToIntakeData(row: Record<string, unknown>) {
  const cap = (row.respuestas_capacidad ?? {}) as Record<string, string | null>;
  const toBeNivel = row.to_be_nivel ? parseInt(row.to_be_nivel as string, 10) || null : null;
  return {
    perfil: row.perfil as "negocio" | "lider_area" | "emprendedor",
    sector: (row.sector as string) ?? "",
    alcance: (row.alcance as string) ?? "",
    dolor_declarado: (row.dolor_declarado as string[]) ?? [],
    to_be_objetivo: (row.to_be_objetivo as string) ?? "",
    to_be_nivel: toBeNivel,
    tecnologia_visible: (row.tecnologia_visible as string[] | null) ?? null,
    metrica_declarada: (row.metrica_declarada as string | null) ?? null,
    respuestas_capacidad: {
      painDetail: cap.painDetail ?? null,
      capacityQ1: cap.capacityQ1 ?? null,
      capacityQ2: cap.capacityQ2 ?? null,
      capacityQ3: cap.capacityQ3 ?? null,
    },
  };
}

export async function POST(req: NextRequest) {
  // 1. Validar body
  let diagnosticoId: string;
  let indicacionAjuste: string;
  try {
    const body = await req.json();
    if (!body?.diagnosticoId || typeof body.diagnosticoId !== "string") {
      return NextResponse.json({ error: "diagnosticoId requerido (string)" }, { status: 400 });
    }
    if (!body?.indicacionAjuste || typeof body.indicacionAjuste !== "string" || !body.indicacionAjuste.trim()) {
      return NextResponse.json({ error: "indicacionAjuste requerido (string no vacío)" }, { status: 400 });
    }
    diagnosticoId = body.diagnosticoId;
    indicacionAjuste = body.indicacionAjuste.trim();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // 2. Leer el diagnóstico existente
  const { data: diagAnterior, error: diagError } = await db
    .from("diagnosticos")
    .select("id, intake_id, version, diagnostico_completo")
    .eq("id", diagnosticoId)
    .single();

  if (diagError || !diagAnterior) {
    const esNotFound = diagError?.code === "PGRST116" || diagError?.message?.includes("0 rows");
    return NextResponse.json(
      { error: esNotFound ? "Diagnóstico no encontrado" : "Error al leer diagnóstico", detail: diagError?.message },
      { status: esNotFound ? 404 : 500 }
    );
  }

  // 3. Guardia de límite: version >= 3 → marcar revision_manual y salir
  if (diagAnterior.version >= LIMITE_VERSION) {
    const { error: updateError } = await db
      .from("diagnosticos")
      .update({ estado_aprobacion: "revision_manual_pendiente" })
      .eq("id", diagnosticoId);

    if (updateError) {
      return NextResponse.json(
        { error: "Error al marcar revisión manual", detail: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: false,
      limite_alcanzado: true,
      diagnosticoId,
      version: diagAnterior.version,
      mensaje: "Se alcanzó el límite de ajustes automáticos. La fila fue marcada como revision_manual_pendiente.",
    }, { status: 200 });
  }

  // 4. Leer el intake original
  const { data: intakeRow, error: intakeError } = await db
    .from("intakes")
    .select("*")
    .eq("id", diagAnterior.intake_id)
    .single();

  if (intakeError || !intakeRow) {
    return NextResponse.json(
      { error: "No se pudo leer el intake original", detail: intakeError?.message },
      { status: 500 }
    );
  }

  // 5. Armar contextoAjuste y llamar al engine (misma función, tercer parámetro opcional)
  const contextoAjuste: ContextoAjuste = {
    versionAnterior: diagAnterior.version,
    diagnosticoAnterior: diagAnterior.diagnostico_completo as DiagnosticoResult,
    indicacionAjuste,
  };

  let diagnosticoNuevo: DiagnosticoResult;
  try {
    diagnosticoNuevo = await generarDiagnostico(
      mapRowToIntakeData(intakeRow as Record<string, unknown>),
      undefined,
      contextoAjuste
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error al generar diagnóstico ajustado con Claude", detail: String(err) },
      { status: 500 }
    );
  }

  // 6. Insertar fila nueva (no actualizar la existente)
  const { data: inserted, error: insertError } = await db
    .from("diagnosticos")
    .insert({
      intake_id: diagAnterior.intake_id,
      version: diagAnterior.version + 1,
      diagnostico_padre_id: diagnosticoId,
      indicacion_ajuste: indicacionAjuste,
      estado_aprobacion: "pendiente_revision",
      evidencia_suficiente: diagnosticoNuevo.suficiencia.evidencia_suficiente,
      score_sustancialidad: diagnosticoNuevo.suficiencia.score_sustancialidad,
      nivel_evidencia: diagnosticoNuevo.suficiencia.nivel,
      razonamiento_suficiencia: diagnosticoNuevo.suficiencia.razonamiento,
      diagnostico_completo: diagnosticoNuevo,
      diagnostico_resumido: diagnosticoNuevo.resumen_ejecutivo,
      modelo_usado: MODEL_USADO,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: "Error al guardar diagnóstico ajustado", detail: insertError?.message },
      { status: 500 }
    );
  }

  // 7. Respuesta exitosa
  return NextResponse.json({
    ok: true,
    diagnosticoId: inserted.id,
    diagnosticoPadreId: diagnosticoId,
    intakeId: diagAnterior.intake_id,
    version: diagAnterior.version + 1,
  }, { status: 200 });
}
