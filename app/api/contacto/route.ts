import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).nombre !== "string" ||
    typeof (body as Record<string, unknown>).correo !== "string" ||
    typeof (body as Record<string, unknown>).mensaje !== "string"
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { nombre, correo, mensaje } = body as {
    nombre: string;
    correo: string;
    mensaje: string;
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!nombre.trim() || !correo.trim() || !mensaje.trim() || !EMAIL_RE.test(correo.trim())) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const { error } = await supabase.from("contactos").insert({
    nombre: nombre.trim(),
    correo: correo.trim(),
    mensaje: mensaje.trim(),
  });

  if (error) {
    console.error("[YetiBI] Error al guardar contacto:", error.message);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
