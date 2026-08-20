import { createHmac, timingSafeEqual } from "node:crypto";

// ─── Tokens firmados para las superficies de aprobación (insumo v1.0 §7) ─────
// Los enlaces de correo/notificación NUNCA llevan la ruta cruda con el id:
// llevan un token HMAC con caducidad, ligado al diagnóstico, la acción y la
// versión vigente. El "un solo uso" del ajuste se garantiza por versión: al
// crearse la versión N+1, cualquier token de ajuste de la versión N muere
// (la verificación exige que la versión del token sea la vigente).

const DEFAULT_TTL_HORAS = 72;

export type AccionAprobacion = "aprobar" | "ajustar";

interface PayloadToken {
  d: string; // diagnosticoId
  a: AccionAprobacion;
  v: number; // versión vigente al emitir
  e: number; // expiración (epoch segundos)
}

function secret(): string {
  const s = process.env.APPROVAL_TOKEN_SECRET;
  if (!s) throw new Error("APPROVAL_TOKEN_SECRET no configurada");
  return s;
}

function firmar(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function emitirToken(
  diagnosticoId: string,
  accion: AccionAprobacion,
  version: number,
  ttlHoras: number = DEFAULT_TTL_HORAS
): string {
  const payload: PayloadToken = {
    d: diagnosticoId,
    a: accion,
    v: version,
    e: Math.floor(Date.now() / 1000) + ttlHoras * 3600,
  };
  const cuerpo = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${cuerpo}.${firmar(cuerpo)}`;
}

export type VerificacionToken =
  | { ok: true; diagnosticoId: string; accion: AccionAprobacion; version: number }
  | { ok: false; motivo: "malformado" | "firma_invalida" | "vencido" };

export function verificarToken(token: string): VerificacionToken {
  const partes = token.split(".");
  if (partes.length !== 2) return { ok: false, motivo: "malformado" };
  const [cuerpo, firma] = partes;

  const esperada = firmar(cuerpo);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, motivo: "firma_invalida" };
  }

  let payload: PayloadToken;
  try {
    payload = JSON.parse(Buffer.from(cuerpo, "base64url").toString("utf-8"));
  } catch {
    return { ok: false, motivo: "malformado" };
  }

  if (payload.e < Math.floor(Date.now() / 1000)) {
    return { ok: false, motivo: "vencido" };
  }

  return {
    ok: true,
    diagnosticoId: payload.d,
    accion: payload.a,
    version: payload.v,
  };
}
