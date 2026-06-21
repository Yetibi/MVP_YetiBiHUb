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

  // 2. Confirmar que el diagnóstico existe
  const { data: existente, error: selectError } = await db
    .from("diagnosticos")
    .select("id, estado_aprobacion")
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

  // 3. Actualizar estado_aprobacion → 'revision_manual_pendiente'
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

  return NextResponse.json(
    {
      ok: true,
      diagnosticoId,
      estado_aprobacion: "revision_manual_pendiente",
      estado_anterior: existente.estado_aprobacion,
    },
    { status: 200 }
  );
}
