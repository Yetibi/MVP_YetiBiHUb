"use server";

import { createSupabaseServer } from "@/lib/teach/supabase-server";
import { estaAutorizado } from "@/lib/teach/authorize";

// `correo` solo se usa para mostrarlo en el estado "enviado" ("Enviamos un
// enlace a …"). No cambia ninguna verificación.
export type LoginState = { ok: boolean; mensaje: string; correo?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function solicitarAcceso(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const correo = String(formData.get("correo") ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(correo)) {
    return { ok: false, mensaje: "Ingresá un correo válido." };
  }

  // Verificación de acceso: sin fila o activo = false → rechazo. No se envía
  // ningún enlace. No hay registro abierto.
  if (!(await estaAutorizado(correo))) {
    return {
      ok: false,
      mensaje:
        "Este correo no tiene acceso a YetiBI Teach. Si creés que es un error, escribinos.",
    };
  }

  const supabase = await createSupabaseServer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Destino /teach/auth/verify (token_hash), NO /callback (PKCE): el flujo
  // PKCE guarda un code_verifier en cookie al pedir el enlace y lo compara al
  // volver. Safari, con Intelligent Tracking Prevention, descarta esa cookie
  // cuando la vuelta llega desde el cliente de correo, así que /verify daba
  // 303 (el enlace SÍ era válido) y /token fallaba con "code challenge does
  // not match previously saved code verifier" — y el usuario veía un mensaje
  // de "enlace expirado" que no correspondía. verifyOtp por token_hash no
  // depende de esa cookie y funciona igual en todos los navegadores.
  const { error } = await supabase.auth.signInWithOtp({
    email: correo,
    options: { emailRedirectTo: `${siteUrl}/teach/auth/verify` },
  });

  if (error) {
    const limite =
      error.status === 429 || error.code === "over_email_send_rate_limit";
    return {
      ok: false,
      mensaje: limite
        ? "Demasiados envíos en poco tiempo. Esperá unos minutos y volvé a intentar."
        : "No pudimos enviar el enlace. Probá de nuevo en un momento.",
    };
  }

  return {
    ok: true,
    mensaje: "Te enviamos un enlace de acceso. Revisá tu correo.",
    correo,
  };
}
