import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  // 1. Validar body
  let diagnosticoId: string;
  try {
    const body = await req.json();
    if (!body?.diagnosticoId || typeof body.diagnosticoId !== "string") {
      return NextResponse.json(
        { error: "diagnosticoId requerido (string)" },
        { status: 400 }
      );
    }
    diagnosticoId = body.diagnosticoId;
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // 2. Leer el diagnóstico
  const { data: existente, error: selectError } = await db
    .from("diagnosticos")
    .select("id, intake_id, estado_aprobacion, diagnostico_resumido")
    .eq("id", diagnosticoId)
    .single();

  if (selectError || !existente) {
    const esNotFound =
      selectError?.code === "PGRST116" ||
      selectError?.message?.includes("0 rows");
    return NextResponse.json(
      {
        error: esNotFound ? "Diagnóstico no encontrado" : "Error al leer diagnóstico",
        detail: selectError?.message,
      },
      { status: esNotFound ? 404 : 500 }
    );
  }

  // 3. Guardia de idempotencia — no repetir UPDATE si ya está aprobado
  if (existente.estado_aprobacion === "aprobado") {
    return NextResponse.json(
      {
        ok: true,
        diagnosticoId,
        intakeId: existente.intake_id,
        estado_aprobacion: "aprobado",
        diagnostico_resumido: existente.diagnostico_resumido,
        nota: "Ya estaba aprobado, no se modificó nada",
      },
      { status: 200 }
    );
  }

  // 4. Actualizar estado_aprobacion → 'aprobado'
  const { error: updateError } = await db
    .from("diagnosticos")
    .update({ estado_aprobacion: "aprobado" })
    .eq("id", diagnosticoId);

  if (updateError) {
    return NextResponse.json(
      { error: "Error al aprobar diagnóstico", detail: updateError.message },
      { status: 500 }
    );
  }

  // 5. Respuesta con datos que n8n necesita para el correo
  return NextResponse.json(
    {
      ok: true,
      diagnosticoId,
      intakeId: existente.intake_id,
      estado_aprobacion: "aprobado",
      diagnostico_resumido: existente.diagnostico_resumido,
    },
    { status: 200 }
  );
}
