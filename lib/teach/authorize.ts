import "server-only";
import { supabaseAdmin } from "./supabase-admin";

// Única fuente de verdad del acceso a Teach: el correo existe en
// usuarios_autorizados y tiene activo = true. Los correos se guardan en
// minúsculas (ver migración); Supabase Auth ya normaliza el email a minúsculas.
export async function estaAutorizado(correo: string): Promise<boolean> {
  const email = correo.trim().toLowerCase();
  if (!email) return false;

  const { data, error } = await supabaseAdmin
    .from("usuarios_autorizados")
    .select("activo")
    .eq("correo", email)
    .maybeSingle();

  if (error) throw error;
  return data?.activo === true;
}

// ¿El usuario es del equipo interno de Yeti BI? Los Interno ven las unidades en
// borrador (etiquetadas BORRADOR); el resto solo ve las publicadas.
export async function esInterno(correo: string): Promise<boolean> {
  const email = correo.trim().toLowerCase();
  if (!email) return false;

  const { data, error } = await supabaseAdmin
    .from("usuarios_autorizados")
    .select("cliente")
    .eq("correo", email)
    .maybeSingle();

  if (error) throw error;
  return data?.cliente === "Interno";
}
