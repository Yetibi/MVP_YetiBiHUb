// ─── Detalle de error hacia el cliente ───────────────────────────────────────
// Las rutas de API devolvían `detail: error.message` tal cual, así que un
// cliente cualquiera recibía texto interno de PostgREST — por ejemplo
// "Cannot coerce the result to a single JSON object", que delata el motor, la
// forma de la consulta y el uso de .single().
//
// El detalle sigue siendo útil para depurar, así que no se pierde: se escribe
// en el log del servidor y solo viaja al cliente fuera de producción. Cuando
// devuelve undefined, JSON.stringify elimina la clave del cuerpo.

export function detalle(e: unknown, contexto?: string): string | undefined {
  const mensaje =
    e instanceof Error ? e.message
    : typeof e === "string" ? e
    : e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message)
    : String(e);

  console.error(contexto ? `[api] ${contexto}: ${mensaje}` : `[api] ${mensaje}`);

  return process.env.NODE_ENV === "production" ? undefined : mensaje;
}
