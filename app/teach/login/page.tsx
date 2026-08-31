"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { solicitarAcceso, type LoginState } from "./actions";

const estadoInicial: LoginState = { ok: false, mensaje: "" };

// Mensajes de los redirects del gate (/teach) y del callback del magic link.
const ERRORES: Record<string, string> = {
  sin_acceso:
    "Tu acceso a YetiBI Teach no está activo. Si creés que es un error, escribinos.",
  enlace_invalido:
    "Ese enlace ya no sirve: expiró o pediste otro más nuevo. Solo funciona el último enlace enviado — pedí uno acá abajo y usalo enseguida.",
  sin_codigo: "El enlace está incompleto o no es válido. Pedí uno nuevo acá abajo.",
};

function LoginForm() {
  const [estado, action, pending] = useActionState(
    solicitarAcceso,
    estadoInicial,
  );
  const errorParam = useSearchParams().get("error");
  const mensajeRedirect = errorParam ? ERRORES[errorParam] : undefined;

  // Prioridad: lo que devuelve el submit; si no, el error del redirect.
  const mensaje = estado.mensaje || mensajeRedirect;
  const esOk = estado.ok;

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">YetiBI Teach</h1>
        <p className="text-sm text-neutral-400">
          Acceso restringido. Ingresá tu correo autorizado y te enviamos un
          enlace de acceso.
        </p>
      </div>

      <form action={action} className="space-y-3">
        <input
          type="email"
          name="correo"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Enviar enlace de acceso"}
        </button>
      </form>

      {mensaje ? (
        <p className={`text-sm ${esOk ? "text-emerald-400" : "text-red-400"}`}>
          {mensaje}
        </p>
      ) : null}
    </div>
  );
}

export default function TeachLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
