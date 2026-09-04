import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/teach/supabase-server";
import { estaAutorizado } from "@/lib/teach/authorize";
import { supabaseAdmin } from "@/lib/teach/supabase-admin";

/* ─────────────────────────────────────────────────────────────────────────────
   Descarga del PDF del material — bucket PRIVADO + URL firmada en servidor.

   La URL NO se firma al renderizar la página: si se hiciera, el enlace
   quedaría en el HTML y seguiría vivo aunque el usuario cerrara sesión o se
   le revocara el acceso. Acá cada descarga vuelve a verificar, en el momento:
     1. hay sesión,
     2. su correo está en usuarios_autorizados con activo = true
        (misma función que protege las unidades).
   Recién entonces se firma, y por 10 minutos.

   El bucket es privado: sin firma, Supabase responde 400. Ese es el punto —
   con bucket público, cualquiera con el enlace descargaría sin pasar por el
   login.
   ────────────────────────────────────────────────────────────────────────── */

const BUCKET = "teach-descargables";
const ARCHIVO = "YetiBI-Teach-Material.pdf";
const CADUCIDAD_S = 600; // 10 min

export async function GET(request: NextRequest) {
  // El origen sale de la petición, no de una env: así el redirect funciona
  // igual en local (cualquier puerto), en preview y en producción.
  const { origin } = new URL(request.url);
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${origin}/teach/login`);
  }
  if (!(await estaAutorizado(user.email))) {
    return NextResponse.redirect(`${origin}/teach/login?error=sin_acceso`);
  }

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    // `download` fuerza Content-Disposition: attachment con ese nombre, así el
    // navegador lo guarda en vez de abrirlo en una pestaña.
    .createSignedUrl(ARCHIVO, CADUCIDAD_S, { download: ARCHIVO });

  if (error || !data?.signedUrl) {
    console.error("[teach] no se pudo firmar el PDF:", error);
    return new NextResponse("No pudimos preparar la descarga. Probá de nuevo.", { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
