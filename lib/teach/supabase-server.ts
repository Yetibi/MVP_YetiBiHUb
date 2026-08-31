import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente SSR por cookies: lee/escribe la sesión de Supabase Auth en el
// servidor (server components, server actions, route handlers). Usa la anon
// key — la verificación de lista blanca NUNCA pasa por acá, va por supabaseAdmin.
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un server component: setear cookies no está
            // permitido acá. Lo maneja el callback/route handler.
          }
        },
      },
    },
  );
}
