import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/teach/supabase-server";

// Destino del magic link. Intercambia el code por una sesión (setea la cookie)
// y manda a /teach, que re-verifica la lista blanca antes de mostrar nada.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/teach/login?error=sin_codigo`);
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/teach/login?error=enlace_invalido`);
  }

  return NextResponse.redirect(`${origin}/teach`);
}
