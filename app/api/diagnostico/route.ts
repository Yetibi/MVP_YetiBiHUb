import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarDiagnostico } from "@/lib/diagnostico-engine";
import type { IntakeData } from "@/types/diagnostico";

const MODEL_USADO = "claude-sonnet-4-6";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Mapea la fila cruda de Supabase al tipo IntakeData que espera el engine
function mapRowToIntakeData(row: Record<string, unknown>): IntakeData {
  const cap = (row.respuestas_capacidad ?? {}) as Record<string, string | null>;

  // to_be_nivel llega como text de Supabase; IntakeData lo espera como number | null
  const toBeNivel = row.to_be_nivel
    ? parseInt(row.to_be_nivel as string, 10) || null
    : null;

  return {
    perfil: row.perfil as IntakeData["perfil"],
    sector: (row.sector as string) ?? "",
    alcance: (row.alcance as string) ?? "",
    dolor_declarado: (row.dolor_declarado as string) ?? "",
    to_be_objetivo: (row.to_be_objetivo as string) ?? "",
    to_be_nivel: toBeNivel,
    tecnologia_visible: (row.tecnologia_visible as string | null) ?? null,
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
  // 1. Leer y validar el body
  let intakeId: string;
  try {
    const body = await req.json();
    if (!body?.intakeId || typeof body.intakeId !== "string") {
      return NextResponse.json(
        { error: "intakeId requerido (string)" },
        { status: 400 }
      );
    }
    intakeId = body.intakeId;
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // 2. Leer el intake de Supabase usando service_role (bypasa RLS)
  const { data: intake, error: intakeError } = await db
    .from("intakes")
    .select("*")
    .eq("id", intakeId)
    .single();

  if (intakeError || !intake) {
    const esNotFound =
      intakeError?.code === "PGRST116" || intakeError?.message?.includes("0 rows");
    return NextResponse.json(
      { error: esNotFound ? "Intake no encontrado" : "Error al leer intake", detail: intakeError?.message },
      { status: esNotFound ? 404 : 500 }
    );
  }

  // 3. Mapear fila → IntakeData y llamar al engine
  const intakeData = mapRowToIntakeData(intake);

  let diagnostico;
  try {
    diagnostico = await generarDiagnostico(intakeData);
  } catch (err) {
    return NextResponse.json(
      { error: "Error al generar diagnóstico con Claude", detail: String(err) },
      { status: 500 }
    );
  }

  // 4. Insertar resultado en la tabla diagnosticos
  const { data: inserted, error: insertError } = await db
    .from("diagnosticos")
    .insert({
      intake_id: intakeId,
      evidencia_suficiente: diagnostico.suficiencia.evidencia_suficiente,
      score_sustancialidad: diagnostico.suficiencia.score_sustancialidad,
      nivel_evidencia: diagnostico.suficiencia.nivel,
      razonamiento_suficiencia: diagnostico.suficiencia.razonamiento,
      diagnostico_completo: diagnostico,
      diagnostico_resumido: diagnostico.resumen_ejecutivo,
      modelo_usado: MODEL_USADO,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: "Error al guardar diagnóstico en Supabase", detail: insertError?.message },
      { status: 500 }
    );
  }

  // 5. Respuesta exitosa
  return NextResponse.json(
    { ok: true, diagnosticoId: inserted.id, intakeId },
    { status: 200 }
  );
}
