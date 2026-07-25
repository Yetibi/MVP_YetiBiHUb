import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const CAL_BOOKING_URL = "https://cal.com/yetibi/diagnostico-powerbi";

const FREE_EMAIL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "live.com"];

const HERRAMIENTAS_ENUM = [
  "No, nunca",
  "Sí, con Power BI",
  "Sí, con otra herramienta",
  "Tenemos licencias sin usar",
] as const;

const powerbiIntakeSchema = z.object({
  nombre: z.string().min(2).max(100).trim(),
  correo: z.string().email().max(200).trim(),
  empresa: z.string().min(2).max(200).trim(),
  sector: z.string().min(2).max(100).trim(),
  sector_otro: z.string().max(100).trim().optional(),
  fuentes_datos: z.array(z.string()).min(1),
  decision_bloqueada: z.string().min(10).max(2000).trim(),
  herramientas_previas: z.enum(HERRAMIENTAS_ENUM),
  herramienta_otra: z.string().max(100).trim().optional(),
  resultado_ideal: z.string().min(10).max(2000).trim(),
  website: z.string().max(200).optional(), // honeypot
});

type PowerBIIntakeData = z.infer<typeof powerbiIntakeSchema>;

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (limit.count >= 3) return false;
  limit.count++;
  return true;
}

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

interface ScoringDetalle {
  correo_corporativo: boolean;
  multiples_fuentes: boolean;
  fuentes_desconectadas: boolean;
  licencias_sin_usar: boolean;
  decision_detallada: boolean;
  resultado_detallado: boolean;
}

function calcularScoring(data: PowerBIIntakeData): { score: number; detalle: ScoringDetalle } {
  const domain = data.correo.split("@")[1]?.toLowerCase();
  const detalle: ScoringDetalle = {
    correo_corporativo: !!domain && !FREE_EMAIL_DOMAINS.includes(domain),
    multiples_fuentes: data.fuentes_datos.length >= 2,
    fuentes_desconectadas: data.fuentes_datos.includes("Varias fuentes sin conectar entre sí"),
    licencias_sin_usar: data.herramientas_previas === "Tenemos licencias sin usar",
    decision_detallada: data.decision_bloqueada.trim().split(/\s+/).length > 15,
    resultado_detallado: data.resultado_ideal.trim().split(/\s+/).length > 15,
  };
  const score = Object.values(detalle).filter(Boolean).length;
  return { score, detalle };
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (ip !== "unknown" && !checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = powerbiIntakeSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot — bot llenó el campo oculto
  if (data.website) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Rate limit por correo como segunda capa (cubre mobile con IP unknown)
  if (!checkRateLimit(`email:${data.correo.toLowerCase()}`)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429 }
    );
  }

  const { score, detalle } = calcularScoring(data);

  const supabase = getSupabase();

  const { error: dbError } = await supabase.from("powerbi_leads").insert({
    nombre: data.nombre,
    correo: data.correo,
    empresa: data.empresa,
    sector: data.sector,
    sector_otro: data.sector_otro ?? null,
    fuentes_datos: data.fuentes_datos,
    decision_bloqueada: data.decision_bloqueada,
    herramientas_previas: data.herramientas_previas,
    herramienta_otra: data.herramienta_otra ?? null,
    resultado_ideal: data.resultado_ideal,
    scoring: score,
    scoring_detalle: detalle,
    ip_address: ip !== "unknown" ? ip : null,
    user_agent: req.headers.get("user-agent"),
  });

  if (dbError) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[YetiBI/powerbi-intake] Supabase error:", dbError.message);
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  // Resend — completamente best-effort, nunca bloquea ni causa 500
  try {
    if (!process.env.RESEND_API_KEY) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[YetiBI/powerbi-intake] RESEND_API_KEY no configurada — mail omitido, lead guardado en Supabase");
      }
    } else {
      const resend = getResend();
      const estrellas = "★".repeat(score) + "☆".repeat(6 - score);

      const criteriosTexto = [
        detalle.correo_corporativo && "Correo corporativo",
        detalle.multiples_fuentes && "2+ fuentes de datos",
        detalle.fuentes_desconectadas && "Fuentes desconectadas entre sí",
        detalle.licencias_sin_usar && "Licencias sin usar",
        detalle.decision_detallada && "Decisión bloqueada detallada (>15 palabras)",
        detalle.resultado_detallado && "Resultado ideal detallado (>15 palabras)",
      ]
        .filter(Boolean)
        .join(", ");

      // Notificación interna — awaited para que Vercel no mate la promesa
      await resend.emails
        .send({
          from: "Yeti BI <notificaciones@yetibi.com>",
          to: "data@yetibi.com",
          replyTo: data.correo,
          subject: `[Power BI Lead] ${data.empresa} — ${estrellas}`,
          html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;
        background:#0E0B14;color:#fff;padding:32px;border-radius:8px">
        <div style="margin-bottom:24px">
          <span style="color:#E07B30;font-size:12px;letter-spacing:3px;
            text-transform:uppercase">NUEVO LEAD POWER BI — YETI BI</span>
        </div>
        <h2 style="color:#fff;margin:0 0 4px;font-size:20px">${data.empresa}</h2>
        <p style="color:#E07B30;font-size:16px;margin:0 0 24px;letter-spacing:2px">${estrellas} (${score}/6)</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);width:160px;vertical-align:top">Nombre</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">${data.nombre}</td>
          </tr>
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top">Correo</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">
              <a href="mailto:${data.correo}" style="color:#E07B30">${data.correo}</a>
            </td>
          </tr>
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top">Sector</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">${data.sector}${data.sector_otro ? ` (${data.sector_otro})` : ""}</td>
          </tr>
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top">Fuentes de datos</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">${data.fuentes_datos.join(", ")}</td>
          </tr>
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top">Decisión bloqueada</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;line-height:1.6;
              border-bottom:1px solid rgba(255,255,255,0.1)">${data.decision_bloqueada}</td>
          </tr>
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top">Herramientas previas</td>
            <td style="color:#fff;font-size:14px;padding:8px 0;
              border-bottom:1px solid rgba(255,255,255,0.1)">${data.herramientas_previas}${data.herramienta_otra ? ` (${data.herramienta_otra})` : ""}</td>
          </tr>
          <tr>
            <td style="color:rgba(255,255,255,0.5);font-size:12px;
              padding:16px 0 8px;vertical-align:top">Resultado ideal</td>
            <td style="color:#fff;font-size:14px;padding:16px 0 8px;
              line-height:1.6">${data.resultado_ideal}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1)">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0">Criterios que sumaron puntos:</p>
          <p style="color:#C3B9D6;font-size:13px;margin:4px 0 0">${criteriosTexto || "Ninguno"}</p>
        </div>
        <div style="margin-top:32px;padding-top:24px;
          border-top:1px solid rgba(255,255,255,0.1)">
          <a href="mailto:${data.correo}?subject=Re: Tu solicitud a Yeti BI"
            style="display:inline-block;background:#E07B30;color:#0E0B14;
            font-weight:700;font-size:14px;padding:12px 24px;
            border-radius:4px;text-decoration:none">
            Responder a ${data.nombre} →
          </a>
        </div>
      </div>
    `,
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("[YetiBI/powerbi-intake] Resend notif error:", err);
          }
        });

      // Confirmación al lead — awaited para que Vercel no mate la promesa
      await resend.emails
        .send({
          from: "Yeti BI <notificaciones@yetibi.com>",
          to: data.correo,
          subject: "Recibimos tu solicitud — Yeti BI",
          html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;
        background:#0E0B14;color:#fff;padding:32px;border-radius:8px">
        <div style="margin-bottom:24px">
          <span style="color:#E07B30;font-size:12px;letter-spacing:3px;
            text-transform:uppercase">YETI BI</span>
        </div>
        <h2 style="color:#fff;margin:0 0 16px;font-size:20px">
          Hola ${data.nombre}, recibimos tu información.
        </h2>
        <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 16px">
          Si ya agendaste tu reunión de diagnóstico, nos vemos ahí. Si no, puedes
          agendar aquí:
        </p>
        <div style="margin-top:8px">
          <a href="${CAL_BOOKING_URL}"
            style="display:inline-block;background:#E07B30;color:#0E0B14;
            font-weight:700;font-size:14px;padding:12px 24px;
            border-radius:4px;text-decoration:none">
            Agendar reunión →
          </a>
        </div>
        <div style="margin-top:32px;padding-top:24px;
          border-top:1px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.5);font-size:13px">
          — Julián Atehortúa, Yeti BI
        </div>
        <div style="margin-top:16px;
          color:rgba(255,255,255,0.3);font-size:12px">
          Yeti BI · Medellín, Colombia · data@yetibi.com
        </div>
      </div>
    `,
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("[YetiBI/powerbi-intake] Resend confirm error:", err);
          }
        });
    }
  } catch (err) {
    // Resend falló completamente — logueamos pero el lead ya está en Supabase
    if (process.env.NODE_ENV !== "production") {
      console.error("[YetiBI/powerbi-intake] Resend excepción:", err);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
