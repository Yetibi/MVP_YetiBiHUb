import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/teach/supabase-server";

// Verifica un enlace de acceso por token_hash (patrón recomendado para email
// links: no depende del code_verifier PKCE, así que sirve aunque el link lo
// haya generado la admin API o lo abra otro cliente). Setea la sesión y manda
// a /teach, que re-verifica la lista blanca.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}/teach/login?error=sin_codigo`);
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(`${origin}/teach/login?error=enlace_invalido`);
  }

  return NextResponse.redirect(`${origin}/teach`);
}
