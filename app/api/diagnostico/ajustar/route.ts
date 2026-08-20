import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { redactarVeredicto, MODEL } from "@/lib/redactor-engine";
import { emitirToken, verificarToken } from "@/lib/approval-token";
import { clasificar } from "@/lib/clasificador";
import type { IntakeAptitud, Veredicto } from "@/types/aptitud";

// ─── Ajuste de REDACCIÓN (insumo v1.0 §6.2 y §7) ─────────────────────────────
// La indicación de ajuste opera SOLO sobre la redacción — la patología asignada
// es inmutable (viaja fija en el contexto). Guardas:
//  · token firmado de un solo uso por versión (obligatorio)
//  · si el estado ya es "aprobado" → el ajuste se rechaza (el gate se cerró)
//  · límite de 3 versiones → revision_manual_pendiente

export const maxDuration = 60;

const LIMITE_VERSION = 3;

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function mapRowToIntake(row: Record<string, unknown>): IntakeAptitud | null {
  const req = ["proceso", "ejecucion", "senal", "dato", "frecuencia", "antiguedad", "falla", "expectativa_ia", "correo"];
  for (const c of req) if (!row[c]) return null;
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
  // 1. Body
  let diagnosticoId: string;
  let indicacionAjuste: string;
  let token: string;
  try {
    const body = await req.json();
    if (!body?.diagnosticoId || typeof body.diagnosticoId !== "string") {
      return NextResponse.json({ error: "diagnosticoId requerido (string)" }, { status: 400 });
    }
    if (!body?.indicacionAjuste || typeof body.indicacionAjuste !== "string" || !body.indicacionAjuste.trim()) {
      return NextResponse.json({ error: "indicacionAjuste requerido (string no vacío)" }, { status: 400 });
    }
    if (!body?.token || typeof body.token !== "string") {
      return NextResponse.json({ error: "token de ajuste requerido" }, { status: 401 });
    }
    diagnosticoId = body.diagnosticoId;
    indicacionAjuste = body.indicacionAjuste.trim();
    token = body.token;
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  // 2. Verificar token firmado (acción + destino)
  const ver = verificarToken(token);
  if (!ver.ok) {
    return NextResponse.json(
      { error: `Token inválido (${ver.motivo}). Re-dispara desde la notificación.` },
      { status: 401 }
    );
  }
  if (ver.accion !== "ajustar" || ver.diagnosticoId !== diagnosticoId) {
    return NextResponse.json({ error: "El token no corresponde a esta acción/diagnóstico" }, { status: 401 });
  }

  const db = supabaseAdmin();

  // 3. Leer el diagnóstico vigente
  const { data: diagAnterior, error: diagError } = await db
    .from("diagnosticos")
    .select("id, intake_id, version, estado_aprobacion, patologia, severidad, cmmi_estimado, senales_secundarias, veredicto_completo")
    .eq("id", diagnosticoId)
    .single();

  if (diagError || !diagAnterior) {
    const esNotFound = diagError?.code === "PGRST116" || diagError?.message?.includes("0 rows");
    return NextResponse.json(
      { error: esNotFound ? "Diagnóstico no encontrado" : "Error al leer diagnóstico", detail: diagError?.message },
      { status: esNotFound ? 404 : 500 }
    );
  }

  // 4. Guardas de precedencia (§7)
  if (diagAnterior.estado_aprobacion === "aprobado") {
    return NextResponse.json(
      { ok: false, error: "Ya aprobado, no admite ajuste (el gate se cerró)." },
      { status: 409 }
    );
  }

  // Un solo uso por versión: el token debe ser de la versión vigente…
  if (ver.version !== (diagAnterior.version ?? 1)) {
    return NextResponse.json(
      { ok: false, error: "Token de una versión anterior — ya se consumió un ajuste de esa versión." },
      { status: 409 }
    );
  }
  // …y sobre esta fila no debe existir ya una versión hija (segundo canal).
  const { data: hija } = await db
    .from("diagnosticos")
    .select("id")
    .eq("diagnostico_padre_id", diagnosticoId)
    .limit(1)
    .maybeSingle();
  if (hija) {
    return NextResponse.json(
      { ok: false, error: "Esta versión ya fue ajustada desde otro canal (no-op explícito)." },
      { status: 409 }
    );
  }

  // 5. Límite de versiones
  if ((diagAnterior.version ?? 1) >= LIMITE_VERSION) {
    await db
      .from("diagnosticos")
      .update({ estado_aprobacion: "revision_manual_pendiente" })
      .eq("id", diagnosticoId);
    return NextResponse.json({
      ok: false,
      limite_alcanzado: true,
      diagnosticoId,
      version: diagAnterior.version,
      mensaje: "Se alcanzó el límite de ajustes. La fila fue marcada como revision_manual_pendiente.",
    });
  }

  // 6. Leer intake y reconstruir la clasificación INMUTABLE
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

  const intake = mapRowToIntake(intakeRow as Record<string, unknown>);
  if (!intake) {
    return NextResponse.json({ error: "Intake sin campos del instrumento" }, { status: 422 });
  }

  // La patología es la que quedó grabada — no se reclasifica salvo que la fila
  // vieja no la tenga (defensa); en ese caso se deriva del intake (mismo motor).
  const clasif = diagAnterior.patologia
    ? {
        patologia: diagAnterior.patologia,
        severidad: diagAnterior.severidad,
        cmmiEstimado: diagAnterior.cmmi_estimado,
        senalesSecundarias: (diagAnterior.senales_secundarias as string[]) ?? [],
      }
    : clasificar(intake);

  const veredictoAnterior = diagAnterior.veredicto_completo as Veredicto | null;
  if (!veredictoAnterior?.cuerpo_texto) {
    return NextResponse.json(
      { error: "La versión anterior no tiene veredicto redactado — caso de revisión manual." },
      { status: 422 }
    );
  }

  // 7. Redactar el ajuste (solo redacción; validación + 1 reintento)
  let resultado;
  try {
    resultado = await redactarVeredicto(intake, clasif as never, {
      indicacionAjuste,
      veredictoAnterior,
      versionAnterior: diagAnterior.version ?? 1,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error al redactar el ajuste con Claude", detail: String(err) },
      { status: 500 }
    );
  }

  const nuevaVersion = (diagAnterior.version ?? 1) + 1;
  const base = {
    intake_id: diagAnterior.intake_id,
    version: nuevaVersion,
    diagnostico_padre_id: diagnosticoId,
    indicacion_ajuste: indicacionAjuste,
    patologia: clasif.patologia,
    severidad: clasif.severidad,
    cmmi_estimado: clasif.cmmiEstimado,
    senales_secundarias: clasif.senalesSecundarias,
    modelo_usado: MODEL,
  };

  if (!resultado.ok) {
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
        { error: "Ajuste fallido y no se pudo registrar", detail: insertError?.message },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: false,
      revisionManual: true,
      diagnosticoId: inserted.id,
      version: nuevaVersion,
      errores: resultado.errores,
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
    .select("id")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: "Error al guardar el veredicto ajustado", detail: insertError?.message },
      { status: 500 }
    );
  }

  // 8. Respuesta con tokens NUEVOS de la versión nueva (los viejos mueren solos)
  return NextResponse.json({
    ok: true,
    diagnosticoId: inserted.id,
    diagnosticoPadreId: diagnosticoId,
    intakeId: diagAnterior.intake_id,
    version: nuevaVersion,
    patologia: clasif.patologia,
    asunto: resultado.veredicto.asunto,
    cuerpoTexto: resultado.veredicto.cuerpo_texto,
    cuerpoHtml: resultado.veredicto.cuerpo_html,
    interpretacionAjuste: resultado.veredicto.interpretacion_ajuste ?? null,
    tokens: {
      aprobar: emitirToken(inserted.id, "aprobar", nuevaVersion),
      ajustar: emitirToken(inserted.id, "ajustar", nuevaVersion),
    },
  });
}
