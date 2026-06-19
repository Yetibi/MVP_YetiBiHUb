import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
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

  // 2. Verificar que el diagnóstico existe y leer estado actual
  const { data: existente, error: selectError } = await db
    .from("diagnosticos")
    .select("id, estado_envio")
    .eq("id", diagnosticoId)
    .single();

  if (selectError || !existente) {
    const esNotFound =
      selectError?.code === "PGRST116" ||
      selectError?.message?.includes("0 rows");
    return NextResponse.json(
      {
        error: esNotFound ? "Diagnóstico no encontrado" : "Error al verificar diagnóstico",
        detail: selectError?.message,
      },
      { status: esNotFound ? 404 : 500 }
    );
  }

  // 3. Guardia de idempotencia — evita UPDATE duplicado en reintentos de n8n
  if (existente.estado_envio === "enviado") {
    return NextResponse.json(
      {
        ok: true,
        diagnosticoId,
        estado_envio: "enviado",
        nota: "Ya estaba marcado como enviado, no se modificó nada",
      },
      { status: 200 }
    );
  }

  // 4. Actualizar estado_envio → 'enviado'
  const { error: updateError } = await db
    .from("diagnosticos")
    .update({ estado_envio: "enviado" })
    .eq("id", diagnosticoId);

  if (updateError) {
    return NextResponse.json(
      { error: "Error al actualizar estado_envio", detail: updateError.message },
      { status: 500 }
    );
  }

  // 5. Confirmación
  return NextResponse.json(
    { ok: true, diagnosticoId, estado_envio: "enviado" },
    { status: 200 }
  );
}
