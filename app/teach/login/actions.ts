"use server";

import { createSupabaseServer } from "@/lib/teach/supabase-server";
import { estaAutorizado } from "@/lib/teach/authorize";

export type LoginState = { ok: boolean; mensaje: string };

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

  const { error } = await supabase.auth.signInWithOtp({
    email: correo,
    options: { emailRedirectTo: `${siteUrl}/teach/auth/callback` },
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
  };
}
