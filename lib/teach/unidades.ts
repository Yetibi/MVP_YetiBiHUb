import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import { createSupabaseServer } from "./supabase-server";

export type Unidad = {
  slug: string;
  titulo: string;
  objetivo: string | null;
  orden: number;
  cuerpo: string;
  publicada: boolean;
  audio: string | null;
};

// URL firmada del audio de la unidad (bucket privado 'teach-audio'). Se genera
// del lado servidor; expira en 1h. Devuelve null si no hay audio o falla.
export async function urlAudioFirmada(path: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from("teach-audio")
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data?.signedUrl ?? null;
}

// URL firmada del video de introducción (bucket privado 'teach-video'). Igual
// que el audio: server-side, expira en 1h, detrás de la lista blanca.
export async function urlVideoFirmada(
  path = "intro.mp4",
): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from("teach-video")
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export type UnidadIndice = Omit<Unidad, "cuerpo"> & {
  visto: boolean;
  minutos: number;
};

type Vecina = { slug: string; titulo: string } | null;

// Lista para el índice. Interno ve borradores; el resto, solo publicadas.
// Los borradores solo se alcanzan por este camino de servicio (service_role),
// nunca por la anon/authenticated key: la RLS de `unidades` filtra publicada.
export async function listarUnidades(
  incluirBorradores: boolean,
): Promise<UnidadIndice[]> {
  let q = supabaseAdmin
    .from("unidades")
    .select("slug, titulo, objetivo, orden, publicada, cuerpo, audio")
    .order("orden", { ascending: true });
  if (!incluirBorradores) q = q.eq("publicada", true);

  const { data: unidades, error } = await q;
  if (error) throw error;

  // Progreso propio: la RLS de `progreso` devuelve solo las filas del usuario.
  const sb = await createSupabaseServer();
  const { data: vistos, error: errP } = await sb
    .from("progreso")
    .select("unidad_slug, visto");
  if (errP) throw errP;

  const vistoSet = new Set(
    (vistos ?? []).filter((v) => v.visto).map((v) => v.unidad_slug),
  );

  return (unidades ?? []).map((u) => {
    const { cuerpo, ...rest } = u as Unidad;
    return {
      ...rest,
      visto: vistoSet.has(u.slug),
      minutos: minutosLectura(cuerpo),
    };
  });
}

// Una unidad + sus vecinas (anterior/siguiente) según el orden visible para
// este usuario. Devuelve null si el slug no existe o no es visible (→ 404).
export async function obtenerUnidadConVecinas(
  slug: string,
  incluirBorradores: boolean,
): Promise<{
  actual: Unidad;
  anterior: Vecina;
  siguiente: Vecina;
  posicion: number;
  total: number;
} | null> {
  let q = supabaseAdmin
    .from("unidades")
    .select("slug, titulo, objetivo, orden, cuerpo, publicada, audio")
    .order("orden", { ascending: true });
  if (!incluirBorradores) q = q.eq("publicada", true);

  const { data, error } = await q;
  if (error) throw error;

  const lista = (data ?? []) as Unidad[];
  const i = lista.findIndex((u) => u.slug === slug);
  if (i === -1) return null;

  return {
    actual: lista[i],
    anterior: i > 0 ? { slug: lista[i - 1].slug, titulo: lista[i - 1].titulo } : null,
    siguiente:
      i < lista.length - 1
        ? { slug: lista[i + 1].slug, titulo: lista[i + 1].titulo }
        : null,
    posicion: i + 1,
    total: lista.length,
  };
}

// Una unidad por slug (con cuerpo). Respeta visibilidad: borrador solo si
// incluirBorradores. null si no existe o no es visible.
export async function obtenerUnidad(
  slug: string,
  incluirBorradores: boolean,
): Promise<Unidad | null> {
  const { data, error } = await supabaseAdmin
    .from("unidades")
    .select("slug, titulo, objetivo, orden, cuerpo, publicada, audio")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const u = data as Unidad;
  if (!u.publicada && !incluirBorradores) return null;
  return u;
}

// Minutos de lectura estimados (~200 palabras/min), mínimo 1.
export function minutosLectura(cuerpo: string): number {
  const palabras = cuerpo.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}
