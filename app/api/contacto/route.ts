import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicialización lazy — evita error en build-time cuando las env vars no están disponibles
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).nombre  !== "string" ||
    typeof (body as Record<string, unknown>).correo  !== "string" ||
    typeof (body as Record<string, unknown>).mensaje !== "string"
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { nombre, correo, empresa, mensaje } = body as {
    nombre:   string;
    correo:   string;
    empresa?: string;
    mensaje:  string;
  };

  const n = nombre.trim();
  const c = correo.trim();
  const e = empresa?.trim() ?? null;
  const m = mensaje.trim();

  if (!n || !c || !m || !EMAIL_RE.test(c)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const resend = getResend();
  const supabase = getSupabase();

  // Guardar en Supabase — no bloquea si falla
  const { error: dbError } = await supabase
    .from("contactos")
    .insert({ nombre: n, correo: c, empresa: e, mensaje: m });

  if (dbError) {
    console.error("[YetiBI] Supabase error:", dbError.message);
  }

  // Notificación interna — best-effort, no bloquea si Resend falla
  const { error: notifError } = await resend.emails.send({
    from: "Yeti BI <notificaciones@yetibi.com>",
    to: "data@yetibi.com",
    replyTo: c,
    subject: `Nuevo contacto: ${n}${e ? ` — ${e}` : ""}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;
        background:#2E2640;color:#fff;padding:32px;border-radius:8px">
        <div style="margin-bottom:24px">
          <span style="color:#E07B30;font-size:12px;letter-spacing:3px;
            text-transform:uppercase">NUEVO CONTACTO — YETI BI</span>
        </div>
        <h2 style="color:#fff;margin:0 0 24px;font-size:20px">${n}</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);width:120px">Correo</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">
              <a href="mailto:${c}" style="color:#E07B30">${c}</a>
            </td>
          </tr>
          ${e ? `
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">Empresa</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">${e}</td>
          </tr>` : ""}
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;
              padding:16px 0 8px;vertical-align:top">Mensaje</td>
            <td style="color:#fff;font-size:14px;padding:16px 0 8px;
              line-height:1.6">${m}</td>
          </tr>
        </table>
        <div style="margin-top:32px;padding-top:24px;
          border-top:1px solid rgba(255,255,255,0.1)">
          <a href="mailto:${c}?subject=Re: Tu mensaje a Yeti BI"
            style="display:inline-block;background:#E07B30;color:#2E2640;
            font-weight:700;font-size:14px;padding:12px 24px;
            border-radius:4px;text-decoration:none">
            Responder a ${n} →
          </a>
        </div>
      </div>
    `,
  });

  if (notifError) {
    // Logueamos pero no bloqueamos — el contacto ya quedó en Supabase
    console.error("[YetiBI] Resend notif error:", JSON.stringify(notifError));
  }

  // Confirmación al usuario (best-effort — no bloquea)
  resend.emails.send({
    from: "Yeti BI <notificaciones@yetibi.com>",
    to: c,
    subject: "Recibimos tu mensaje — Yeti BI",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;
        background:#2E2640;color:#fff;padding:32px;border-radius:8px">
        <div style="margin-bottom:24px">
          <span style="color:#E07B30;font-size:12px;letter-spacing:3px;
            text-transform:uppercase">YETI BI</span>
        </div>
        <h2 style="color:#fff;margin:0 0 16px;font-size:20px">
          Hola ${n}, recibimos tu mensaje.
        </h2>
        <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 24px">
          Gracias por escribirnos. Te responderemos a
          <strong style="color:#E07B30">${c}</strong> a la brevedad.
        </p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0">
          Si mientras tanto quieres hacer el diagnóstico de madurez
          operacional de tu empresa, es completamente gratuito y toma 10 minutos.
        </p>
        <div style="margin-top:32px">
          <a href="https://yetibi.com/diagnostico"
            style="display:inline-block;background:#E07B30;color:#2E2640;
            font-weight:700;font-size:14px;padding:12px 24px;
            border-radius:4px;text-decoration:none">
            Hacer el diagnóstico →
          </a>
        </div>
        <div style="margin-top:32px;padding-top:24px;
          border-top:1px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.3);font-size:12px">
          Yeti BI · Medellín, Colombia · data@yetibi.com
        </div>
      </div>
    `,
  }).catch((err) => console.error("[YetiBI] Resend confirm error:", err));

  return NextResponse.json({ ok: true }, { status: 200 });
}
