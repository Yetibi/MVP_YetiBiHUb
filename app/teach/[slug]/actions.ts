"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/teach/supabase-server";

// Marca una unidad como vista para el usuario de la sesión. Escribe con el
// cliente autenticado: la RLS de `progreso` garantiza que solo puede tocar su
// propia fila (correo = email del JWT).
export async function marcarVista(slug: string) {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return;

  const { error } = await sb.from("progreso").upsert(
    {
      correo: user.email,
      unidad_slug: slug,
      visto: true,
      actualizado: new Date().toISOString(),
    },
    { onConflict: "correo,unidad_slug" },
  );
  if (error) throw error;

  revalidatePath("/teach");
  revalidatePath(`/teach/${slug}`);
}
